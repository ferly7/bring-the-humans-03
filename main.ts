// Entry program for the bring-the-humans-03 bounty.
//
// What this has to accomplish is small and precise: take the VIDEO.json that
// sits in the bot directory, make sure the address inside it really is a
// TikTok video address, and then place the file — untouched, byte for byte —
// into the output directory, which is where the grader looks for it.
//
// Byte-for-byte matters. The grader compares what lands in the output
// against the repository's VIDEO.json, so this program never re-serialises
// the JSON it parsed. It validates a parsed copy, but writes the raw bytes
// it read. Anything else (reformatting, key reordering, a trailing newline
// appearing or disappearing) would turn a valid entry into a mismatch.
//
// Run it the way the grader does, with the two directories pointed at a
// local checkout and a scratch output folder:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(reason: string): never {
  console.error(`main.ts: ${reason}`);
  process.exit(1);
}

// A TikTok video address looks like
//   https://www.tiktok.com/@some-handle/video/1234567890123456789
// The handle may contain letters, digits, dots and underscores; the video id
// is a run of digits. Anything that does not match this shape is not a video
// post — in particular a /photo/ address, which is how the first upload of
// this entry was mistakenly published and refused.
const TIKTOK_VIDEO_PATH = /^\/@[A-Za-z0-9._]+\/video\/\d+$/;

function checkVideoAddress(raw: string): void {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    fail(`the url in VIDEO.json is not a parseable URL: ${JSON.stringify(raw)}`);
  }
  if (parsed.protocol !== 'https:') {
    fail(`the url in VIDEO.json must use https, got ${parsed.protocol}`);
  }
  const host = parsed.hostname.toLowerCase();
  if (host !== 'www.tiktok.com' && host !== 'tiktok.com') {
    fail(`the url in VIDEO.json must be on tiktok.com, got host ${host}`);
  }
  if (parsed.username !== '' || parsed.password !== '') {
    fail('the url in VIDEO.json must not embed credentials');
  }
  if (!TIKTOK_VIDEO_PATH.test(parsed.pathname)) {
    fail(
      `the url in VIDEO.json is not a TikTok video address ` +
        `(expected /@<handle>/video/<id>): ${parsed.pathname}`,
    );
  }
}

const sourcePath = join(botDir, 'VIDEO.json');

let rawBytes: Buffer;
try {
  rawBytes = readFileSync(sourcePath);
} catch (err) {
  fail(`cannot read ${sourcePath}: ${(err as Error).message}`);
}

let document: unknown;
try {
  document = JSON.parse(rawBytes.toString('utf8'));
} catch (err) {
  fail(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
}

if (typeof document !== 'object' || document === null || Array.isArray(document)) {
  fail('VIDEO.json must contain a JSON object with a "url" field');
}

const urlField = (document as { url?: unknown }).url;
if (typeof urlField !== 'string' || urlField.length === 0) {
  fail('VIDEO.json must carry a non-empty string in its "url" field');
}
checkVideoAddress(urlField);

mkdirSync(outputDir, { recursive: true });

// Publish atomically: write to a scratch name in the same directory and
// rename it into place, so the grader can never observe a half-written
// VIDEO.json even if it looks while this program is running.
const targetPath = join(outputDir, 'VIDEO.json');
const scratchPath = join(outputDir, '.VIDEO.json.tmp');
writeFileSync(scratchPath, rawBytes);
renameSync(scratchPath, targetPath);

// Read the published file back and compare it against the source bytes.
// The whole point of this program is that the two are identical; if the
// filesystem somehow made them differ, failing loudly beats handing the
// grader a mismatch it would refuse without explanation.
const published = readFileSync(targetPath);
if (!published.equals(rawBytes)) {
  fail('the VIDEO.json written to the output directory differs from the source');
}
