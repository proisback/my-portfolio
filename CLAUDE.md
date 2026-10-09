# My Portfolio

## What this is

A personal portfolio website for Prateek Mehta: a scroll-driven 3D "flight" over his real career cities (Mumbai → Jamshedpur → Chennai → Mumbai) that turns from blueprint ink into full color as it reaches 2026, followed by a split-flap departures board of his 7 AI products. Two audiences: PM hiring managers first, prospective site-build clients second (a small "I build sites like this" section, no price anywhere).

The live site lives in **`site/`** (Vite + Three.js + GSAP, vanilla ES modules, no React). The old hand-written site at the repo root (`index.html`, `styles-v3.css`, `script.js`) is kept as **legacy** and is no longer deployed. Design spec and plan: `docs/superpowers/specs/2026-10-09-flight-portfolio-design.md`, `docs/superpowers/plans/2026-10-09-flight-portfolio.md`.

## Design guidelines

* "Blueprint to color": cream paper and blueprint-ink linework for the ops years; color, light and marigold arrive in 2026. At night the drawing inverts into a literal blueprint (pale lines on navy).
* Aviation vocabulary throughout: boarding passes, flight codes, departures board, safety card, arrivals.
* Sora for headings and body, IBM Plex Mono for flight metadata. Tokens in `site/src/styles/tokens.css` (`--paper`, `--ink`, `--blue`, `--marigold`, night palette).
* Motion serves the story: scroll is the timeline, text never waits for 3D, one hero moment per stop, reduced motion gets fades only.
* Fully responsive; phones get a lighter 3D scene, weak devices and reduced motion get a 2D SVG route map.
* No em-dashes in any copy.

## Tech constraints

* Stack: Vite, Three.js, GSAP (ScrollTrigger), vanilla JS modules, Fontsource fonts. No frameworks. Free tools only.
* **No 3D model files.** Every object (cities, plane, sidekick) is procedural geometry, so the 3D chunk stays around 200 KB gzipped.
* All copy lives in **`site/src/content.js`**. Renderers in `site/src/render/` turn it into HTML at build time (every word is in the HTML before JS runs); `site/scripts/generate-pages.mjs` writes `work/<slug>/`, `read/` and `comic/` pages from it.
* Budgets: entry JS under 30 KB gz, 3D chunk under 250 KB gz loaded after first paint, total under 3 MB desktop / 1.5 MB phone.
* Supabase is reached with a plain `fetch` to its REST API (no SDK).

## File structure (site/)

* **`index.html`** — page template with `<!--@block-->` markers filled from `src/render/`.
* **`src/content.js`** — single source of truth for copy, products, segments, testimonials.
* **`src/render/`** — build-time HTML renderers (`hero.js`, `segments.js`, `board.js`, `sections.js`, `pages.js`).
* **`src/main.js`** — entry: tier detection, journey, board, form, lazy-loads `src/flight/` on idle.
* **`src/flight/`** — the 3D world: `uniforms.js`, `glsl.js` (reveal mask, hatching), `materials.js` (blueprint-to-color shader, geometry baker), `ground.js`, `sky.js`, `cities.js`, `plane.js` (incl. cockpit), `sidekick.js`, `clouds.js`, `path.js` (waypoints, banking, camera rig), `choreography.js` (GSAP scroll timeline), `index.js` (renderer, loop, guards).
* **`src/journey.js`** — card hand-offs, HUD odometer, nav state. **`src/tier.js`**, **`src/fallback2d.js`** — device tiers and the 2D route map.
* **`src/board.js`, `src/pass.js`** — split-flap board and boarding-pass transition. **`src/form.js`, `src/config.js`** — notify form.
* **`src/page.js`**, **`src/styles/`** — generated-page entry and all CSS.
* **`public/`** — favicon, `og.jpg`. **`tests/`** — Playwright end-to-end suite.

Legacy files at the repo root (`PRDs/`, `field-guides/`, `products/`, `images/comic-story/`, `rethink-buildathon-2nd-place.pdf`) are copied into the build by the `legacy-assets` plugin in `site/vite.config.js`, so their URLs keep working.

**One resume only:** `Prateek-Mehta-AI-PM-Resume.pdf`, rendered from `resume/resume-ai-pm.html` + `resume/resume-premium.css` (Editorial Gold) via Chrome headless with `--virtual-time-budget=20000`. Keep it to two A4 pages. The old resume URLs (`Prateek-Mehta-PM-Resume.pdf`, `Prateek-Mehta-Product-Resume.pdf`, `Resume.pdf`) are served a copy of that same file at build time, and the `resume/` sources are not published.

## Notify-me signup

Part of the Contact ("Arrivals") section. Not a gate. Same copy and behaviour as before:

* Copy lives in `NOTIFY` in `content.js` (`Stay in the Loop`, `Get a heads-up when I ship something new`, `Notify me` / `Adding you…`, success and returning-subscriber messages).
* **Config**: `site/src/config.js` (public anon key, protected by RLS). Placeholder values (`YOUR_...`) switch to local-only mode.
* **Supabase table**: `subscribers` with a text column `email`. Requires RLS enabled, an INSERT policy for `anon`, and the table exposed via Project Settings → Data API → Exposed tables (if inserts return 401 despite correct policies, check this first).
* **Three-layer validation**: format regex, 18 blocked placeholder/disposable domains, 31-entry typo map with a clickable suggestion built from DOM nodes (never `innerHTML`). A deliberate resubmit of the same typo goes through.
* **Fails open**: network errors, timeouts (3.5 s, aborted), duplicates (409 / 23505) and placeholder config all still show success; reasons go to `console.debug`.
* **Storage flag**: `localStorage.portfolio_notify_subscribed = '1'`. To re-show the form: `localStorage.removeItem('portfolio_notify_subscribed')`.
* **Tests never write to Supabase**: they stub `**/rest/v1/**`.

## Deployment

GitHub Pages via GitHub Actions ([.github/workflows/pages.yml](.github/workflows/pages.yml)) on every push to `main`: `npm ci && npm run build` in `site/`, then `site/dist` is published. Live at `https://proisback.github.io/my-portfolio/`. Pages source must stay **GitHub Actions** (Settings → Pages). `.nojekyll` is copied into the build.

Deploy check: `gh run list --workflow=pages.yml`; the live site updates in ~1–2 min. Hard-refresh (Ctrl+Shift+R) to bypass the 10-minute asset cache.

## Local development

```
cd site
npm install
npm run dev        # http://localhost:5173/my-portfolio/
npm run build      # production build in site/dist
npm run preview    # serve the build at http://localhost:4173/my-portfolio/
npm test           # Playwright end-to-end suite (builds + previews automatically)
```

* Force a device tier with `?tier=full|mobile|lite|static`.
* `window.__flight.S` holds the live 3D state (handy for debugging camera beats).

## About Prateek

Business Analysis and Transformation professional with 8+ years of experience across financial services, now stepping into Product Management with a clear conviction — the next generation of products will be shaped by AI, and the PMs who win will be the ones who deeply understand both user problems and how AI can solve them at scale. Led multi-country workflow redesigns, translated complex user pain points into product and tech requirements, and delivered process improvements that cut turnaround times and strengthened controls. What sets him apart is how he works today — actively builds with AI tools, uses them to prototype solutions, automate workflows, and pressure-test ideas before they ever reach a roadmap. Doesn't just talk about AI integration; ships with it. Thinks in systems, communicates in clarity, and operates at the intersection of business, technology, and users — with AI as a core lever, not an afterthought. Looking for a team building AI-native products where he can lead strategy, shape roadmaps, and turn intelligent automation into real user value.
