# Flight Portfolio Implementation Plan

> **For agentic workers:** Executed inline overnight by the main session, with independent tasks dispatched to subagents in parallel (file ownership below). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the custom-coded, scroll-driven 3D flight portfolio described in `docs/superpowers/specs/2026-10-09-flight-portfolio-design.md` in `site/`, fully tested, ready to launch on Prateek's go.

**Architecture:** Vite multi-page static site. HTML/CSS render all content first; a lazily loaded Three.js + GSAP chunk adds the 3D flight behind the cards. All copy lives in `site/src/content.js`; a prebuild script generates `work/`, `read/` and `comic/` pages from it. Device tiers decide between full 3D, light 3D, and an SVG route fallback.

**Tech Stack:** Vite, Three.js, GSAP (ScrollTrigger), vanilla ES modules, Fontsource (Sora, IBM Plex Mono), Playwright, Lighthouse, GitHub Actions + Pages.

---

## File ownership (for parallel work)

| Owner | Files |
|---|---|
| Main session | `site/package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/tier.js`, `src/content.js`, `src/flight/**`, `src/fallback2d.js`, `src/styles/{tokens,base,hero,flight}.css` |
| Agent A (pages) | `site/scripts/generate-pages.mjs`, `src/styles/{work,read}.css`, `src/page.js` |
| Agent B (board) | `src/board.js`, `src/pass.js`, `src/styles/board.css` |
| Agent C (sections + form) | `src/form.js`, `src/styles/sections.css`, the safety card / sites / contact / footer markup inside `index.html` (between marked comments only) |
| Agent D (tests) | `site/tests/**`, `site/playwright.config.js` |

Agents never commit; the main session reviews and commits each logical change.

---

### Task 1: Scaffold `site/`

**Files:** Create `site/package.json`, `site/vite.config.js`, `site/index.html`, `site/src/main.js`, `site/src/styles/{tokens,base}.css`, `site/public/favicon.svg`, `site/.gitignore`

- [ ] Install `vite three gsap @fontsource/sora @fontsource/ibm-plex-mono` and dev `@playwright/test`.
- [ ] `vite.config.js`: `base: '/my-portfolio/'`, multi-page inputs discovered from `index.html`, `read/`, `comic/`, `work/*/index.html`; manual chunk for `three` + `gsap`.
- [ ] Tokens: carry over cream/charcoal/marigold/pastel tokens from `styles-v3.css`, add `--ink-blue`, `--paper`, mono font, motion easings.
- [ ] Verify: `npm run build` exits 0; `npm run preview` serves `/my-portfolio/`.
- [ ] Commit `feat(site): scaffold Vite site`.

### Task 2: Content source of truth

**Files:** Create `site/src/content.js`

- [ ] Profile, stats (8+, 180+, 30%, 7), hero copy, 5 flight stops, testimonials, 7 products (fields: slug, code, name, month, status, headline, tagline, summary, tags, links, sections[]), principles, sites pitch, contact, footer, comic alt texts.
- [ ] Copy verbatim from current `index.html` and the Hitaarth landing page; strip em-dashes.
- [ ] Verify: a node check asserts 7 products with unique slugs, no `—` anywhere, every link is https or a known relative asset.
- [ ] Commit `feat(site): add content source of truth`.

### Task 3: Hero gate + page shell (main session)

**Files:** `site/index.html`, `src/styles/hero.css`, `src/main.js`

- [ ] Nav (logo, links to stops/board/contact, Read as a page), hero text, stats, CTAs, blueprint grid draw-in (CSS/SVG only).
- [ ] Verify: hero fully visible with JS disabled; Playwright screenshot at 1440 and 390.
- [ ] Commit.

### Task 4: Sections + form (Agent C)

**Files:** `src/form.js`, `src/styles/sections.css`, `index.html` (marked regions)

- [ ] Safety card (principles), "I build sites like this", contact (Calendly, email, LinkedIn, location, availability), footer (quote, field guides, comic, credit).
- [ ] Port the notify form: same 3-layer validation, typo suggestion via DOM nodes, REST insert to Supabase (`POST /rest/v1/subscribers`, `Prefer: return=minimal`), 3.5 s timeout race, fail-open, `localStorage.portfolio_notify_subscribed`.
- [ ] Verify: invalid / blocked / typo / success states in Playwright with network insert stubbed.

### Task 5: Departures board + boarding pass (Agent B)

**Files:** `src/board.js`, `src/pass.js`, `src/styles/board.css`

- [ ] Split-flap cells (CSS 3D flip), rows flip in on enter-viewport with stagger, hover reflip, screen-reader text, reduced-motion shows final text.
- [ ] Click a row → boarding pass tear animation → navigate to `work/<slug>/` (cross-document view transition where supported).
- [ ] Verify: 7 rows show correct final text; clicking each navigates to the right page.

### Task 6: Generated pages (Agent A)

**Files:** `scripts/generate-pages.mjs`, `src/page.js`, `src/styles/{work,read}.css`

- [ ] `work/<slug>/index.html` x7: boarding pass header (from/to, role, date, status), case study sections, links (live, PRD, survey), next/previous flight.
- [ ] `read/index.html`: whole journey as text. `comic/index.html`: 9 comic pages with alt text.
- [ ] Verify: pages build, links resolve, no em-dashes.

### Task 7: Flight foundation (main session)

**Files:** `src/tier.js`, `src/flight/{index,uniforms,materials,ground,sky}.js`, `src/styles/flight.css`

- [ ] Tier detection + lazy import on idle after first paint; renderer with DPR caps; resize; context loss → lite.
- [ ] Blueprint material + ink lines + ground shader (contours, grid, water hatch, reveal, wave) + sky.
- [ ] Verify: screenshot shows paper ground with contours; toggling `uReveal` shows color.

### Task 8: World objects (main session)

**Files:** `src/flight/{cities,plane,sidekick,cockpit,clouds}.js`

- [ ] Mumbai (runway, Sea Link, Gateway, skyline, local train), Jamshedpur (steel plant + smoke, Jubilee Park, XLRI), Chennai (Central clock tower, lighthouse, beach), plane, sidekick, cockpit + gauges, clouds.
- [ ] Verify: debug camera screenshots of each city.

### Task 9: Path, choreography, HUD, cards (main session)

**Files:** `src/flight/{path,choreography,hud}.js`, `index.html` flight section

- [ ] Curve through cities, banking, camera rigs, GSAP master timeline (scrub) → state; damped camera; reveal/night/wave keyframes; card enter/exit; HUD odometer + route nav (click to jump).
- [ ] Verify: screenshots at each stop at 1440 and 390; no frame drops in the trace on desktop.

### Task 10: 2D fallback (main session)

**Files:** `src/fallback2d.js`

- [ ] SVG route map sticky behind cards; active leg follows scroll (static under reduced motion).
- [ ] Verify: emulate reduced motion and `?tier=lite`.

### Task 11: Tests + performance (Agent D, then main session)

**Files:** `site/tests/*.spec.js`, `site/playwright.config.js`

- [ ] E2E per spec section 8 on desktop, mobile, reduced motion; console-error guard.
- [ ] Bundle size check script; Lighthouse mobile on `npm run preview`.
- [ ] Fix until green; record results for the morning summary.

### Task 12: Deploy + docs

**Files:** `.github/workflows/pages.yml`, `CLAUDE.md`, `site/README.md`

- [ ] Workflow: build `site/`, assemble `_site/` with legacy assets, upload, deploy (runs only on `main`).
- [ ] Update CLAUDE.md for the new stack; keep the old file list as "legacy".
- [ ] Verify the artifact locally (assemble script) and that PRD/field-guide/PDF paths resolve under preview.

### Task 13: Review + handoff

- [ ] Code review subagent over the branch diff; fix real findings.
- [ ] Record a scroll-through video and stop screenshots for Prateek.
- [ ] Morning summary: what's built, how to preview, test + Lighthouse results, copy to review, launch steps.
