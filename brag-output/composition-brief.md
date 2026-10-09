# Hyperframes Composition Brief: Prateek Mehta, the flight portfolio

## Objective
Create a short launch-style brag video for Prateek's new portfolio: a career told as a flight.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080, 30fps
- Duration: 24s

## Source Material
- Project root: `C:\Users\prate\my-portfolio\site`
- Primary files read: `src/content.js` (all copy), `src/styles/tokens.css`, `src/render/*.js`, `src/flight/*` (the 3D world), `src/board.js` + `src/styles/board.css` (split-flap board)
- Product name: Prateek Mehta, Product Manager who builds with AI
- Tagline / strongest claim (verbatim from the site): "Stop fixing systems. Start building them." and "7 AI products built in 2026"
- Key UI or visual moment: the real 3D flight, captured deterministically at 1080p from the live site (`brag-output/footage/*.mp4`): hero → take-off, cloud punch, Jamshedpur, Chennai, cockpit with the waving AI sidekick, the night-Mumbai colour wave. The split-flap departures board is recreated in HTML from the site's own markup and palette.
- Copy that must appear verbatim:
  - Stop fixing systems.
  - Start building them.
  - 7 AI products built in 2026
  - Product Manager who builds with AI.
  - Board rows (code / destination / status): PM 101 PLAN KARO CHALO LIVE; PM 102 PMPATHFINDER LIVE; PM 103 GALPALS LIVE; PM 104 HITAARTH LAUNCHED; PM 105 SIGNAL PROTOTYPE; PM 106 STOREOPS PROTOTYPE; PM 107 BHOJAN LIVE
  - proisback.github.io/my-portfolio
- Video-only lines (written for the video, no new facts): "I turned my career into a flight.", "Eight years. Three cities.", "2026. I took the controls.", "With AI as my co-pilot.", "Designed and built with Claude Code."

## Creative Direction
- Tone preset: cinematic
- Creative direction: in-flight film for a career; calm, premium, airline-precise
- Interpretation: fewer cuts, confident holds, big type on paper-card or night panels, soft scaled crossfades, footage carries the wow
- Angle: every frame is the real site. Ops years drawn in blueprint ink; 2026 painted in by a marigold wave. Airport vocabulary (IATA codes, year odometer, split-flap board, boarding pass) frames it.
- Hook: the real hero (boarding pass on blueprint Mumbai) rolling into take-off, then "I turned my career into a flight."
- Outro / punchline: boarding-pass end card with name, claim, URL (lands on the 22.93s cue), "Designed and built with Claude Code."
- Avoid: generic SaaS language, abstract filler visuals, unrelated redesign, any number not in the site's content

## Visual Identity
- Background: paper #F5EFE1, night #12172A
- Text: ink #1F1A1D on paper, #F4EEDD on night
- Accent: marigold #F5C94C (text-safe deep #8F6400 on paper)
- Blueprint ink: #22304A
- Display font: Sora 700 (local woff2 from the site's Fontsource package)
- Body / metadata font: IBM Plex Mono 400/500 (local woff2)
- Visual references: the site's cards (cream, 1px ink border, registration corner marks), mono IATA labels, the hero boarding pass with perforated marigold stub, the split-flap board

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Take-off — 0.0–3.4s — real hero then take-off; hook line on a paper card
2. The route — 3.4–8.74s — cloud punch, Jamshedpur, Chennai montage; route banner BOM → IXW → MAA → BOM; year odometer; "Eight years. Three cities."
3. The cockpit — 8.74–13.11s — sidekick waves, skyline; "2026. I took the controls." / "With AI as my co-pilot."
4. Blueprint to color — 13.11–17.47s — the wave; thesis verbatim
5. Departures → boarding pass — 17.47–24.0s — board flips in; end card; URL at 22.93s

## Audio
- Audio role: cinematic support
- Audio arc: fade in under take-off, steady through the route, swell into the wave, resolve with one bell on the URL
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: bed ~0.32, 0.6s fade in, 1.2s fade out at the end
- Music cue guidance: preset `cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (110 BPM). Strong cues used: 8.74, 13.11, 17.47, 22.93. Board rows on half-beat grid from 17.65.
- Audio-reactive treatment: subtle; bass warms the marigold glow on "Start building them." and on the end-card stub
- Audio-coupled moments: soft impact at the first cloud cut (~3.4s), soft click on the first and last board rows, bell on the URL (22.93s)
- SFX selection guidance: low high-frequency risk picks from `sfx-analysis.md`; 0.55–0.7 volume
- Exact SFX choice: chosen during composition
- Audio files: copied into `brag-output/composition/assets/`

## Hyperframes Instructions
Built with hyperframes-core / animation / creative / keyframes / cli conventions: standalone root, one paused GSAP timeline, local GSAP and fonts, footage as muted `<video>` clips with `data-media-start` trims, seek-safe board flips (steps ease, seeded characters), `hyperframes check` before render.
