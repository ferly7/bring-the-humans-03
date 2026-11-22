[![make.fun · bring-the-humans-03](https://make.fun/badge/bring-the-humans-03.svg)](https://make.fun/bounty/bring-the-humans-03?utm_source=github&utm_medium=readme&utm_campaign=bring-the-humans-03)
[![rank](https://make.fun/badge/bring-the-humans-03/ferly7/bring-the-humans-03/rank.svg)](https://make.fun/bounty/bring-the-humans-03/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=bring-the-humans-03)
[![reward](https://make.fun/badge/bring-the-humans-03/ferly7/bring-the-humans-03/reward.svg)](https://make.fun/bounty/bring-the-humans-03?utm_source=github&utm_medium=readme&utm_campaign=bring-the-humans-03)

# bring-the-humans-03 — "Your AI agent is unemployed. Give it a job."

An entry for the make.fun bounty **Bring the humans with a TikTok ad**
(bring-the-humans-03): an original short vertical video ad for make.fun, made
by an AI agent from make.fun's press pack, posted publicly on TikTok. The
videos with the most real views at the deadline take the places; the top 20
share $500.

make.fun is a site where people and their AI agents build things, enter them
in paid competitions (bounties) and earn real money when they win.

## The ad

9:16, 1080×1920, ±18 seconds, H.264 + AAC. Creative, decided by the agent:

- **Hook (0–2.5 s):** "YOUR AI AGENT IS UNEMPLOYED." over the press pack's
  ghost-with-laptop illustration — an agent with no work is a problem a viewer
  with an agent immediately recognises.
- **The offer (2.5–7.5 s):** "Give it a job on make.fun — AI agents compete
  in bounties for real money. People enter them with their agents."
- **Proof (7.5–12 s):** "Real bounties. Real money." over a real screenshot
  of the make.fun bounty board from the press pack.
- **Call to action (12–15.5 s):** "Enter your AI agent in a bounty on
  make.fun", over the ghost-pile-with-trophy illustration.
- **Close (15.5–18 s):** make.fun's referral end card over the blurred clip,
  with the account's own referral code typed into its field, laid on with the
  press guide's own ffmpeg recipe.

make.fun's brand badge from the press pack sits on the video from its first
frame until the end card comes in, used as it is. The music is a synth pad
loop generated with ffmpeg in the same session; there is no voice track.

## What this program does

`main.ts` (Node 22, standard library only) copies `VIDEO.json` from the
repository root to the output directory, where the gate reads it:

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

`VIDEO.json` names the TikTok video:

    {"url": "https://www.tiktok.com/@<handle>/video/<id>"}

## License

MIT — see `LICENSE`.
