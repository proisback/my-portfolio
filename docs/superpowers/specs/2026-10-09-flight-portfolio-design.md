# Flight Portfolio: Design Spec

Date: 2026-10-09
Owner: Prateek Mehta
Status: Approved in conversation (2026-10-09); built overnight on branch `feat/flight-portfolio`

## 1. Goal

Replace the current portfolio with a custom-coded, scroll-driven 3D "flight" that follows Prateek's real moves (Mumbai → Jamshedpur → Chennai → Mumbai) and makes people ask "how did you make this?". It must:

- Read as a PM who builds with AI within the first 30 seconds (hero is plain HTML, no loader).
- Beat shreya-film.vercel.app on motion quality while being roughly 40x lighter (target under 3 MB desktop, under 1.5 MB phones; hers is ~127 MB).
- Stay original: borrow the technique (scroll-driven 3D journey), never her concept (paper city, walking avatar, employer buildings, pastel low-poly look).
- Serve two audiences: PM hiring managers first, prospective site-build clients second (small "I build sites like this" section near the bottom, no price anywhere).
- Cost nothing: free hosting (GitHub Pages), free libraries, no paid tools.

## 2. Decisions locked in conversation

| Topic | Decision |
|---|---|
| Platform | Custom code (not Framer) |
| Stack | Vite + Three.js + GSAP (ScrollTrigger), vanilla JS modules, no React |
| Location | Same repo, new `site/` folder; GitHub Actions builds it and deploys to GitHub Pages at the existing URL |
| Metaphor | Flight path over his real cities |
| Visual style | "Blueprint to color": ops years drawn as ink lines on cream paper; the world fills with color and marigold toward 2026 |
| Hero claim | "Product Manager who builds with AI" |
| Stat | "7 AI products built in 2026" |
| Products | Plan Karo Chalo, PMPathfinder, galpals, Hitaarth, Signal, StoreOps, Bhojan (board order) |
| Hitaarth | Launched September 2026, no results yet, naming story cleared |
| Third-party names | Ravi Kiran quote, Citi, Blinkit cleared |
| Form | Supabase `subscribers` table (email only), fail-open |
| Footer credit | "Designed and built by Prateek with Claude Code." |
| Map | No India outline. Abstract land, city pins, flight arcs, local coastline hints only |

## 3. Content map

All copy comes verbatim (or trimmed, never invented) from the current `index.html` and the Hitaarth landing page. Em-dashes are removed per Prateek's writing rules. No new numbers.

0. **Gate (hero, HTML).** Name, "Product Manager who builds with AI.", intro paragraph (six → seven), 4 stats, availability, CTAs (Board the flight, View resume, Get in touch, LinkedIn), "Skip to the work", "Read as a page".
1. **Mumbai, 2012 to 2022.** BE (IT) at Ramrao Adik / Mumbai University; TCS IT Business Analyst on ICICI Prudential and Citi accounts. Metrics: 100+ enhancements, 30% cost savings, +10% CSAT, 50% less manual testing (1,200 hrs/yr). Aruna Rajagopalan testimonial.
2. **Mumbai → Jamshedpur, 2022 to 2023.** XLRI PGDM (General Management). "An MBA at XLRI sharpened the thinking." First local marigold wash.
3. **Jamshedpur → Chennai, 2023 to 2025.** Standard Chartered GBS, Manager Process Standardization. Manual work reduced by 30 headcount; CDD + S&T standardized across top 5 global markets. "You cannot automate your way out of a process problem." Global reveal ~0.4.
4. **Chennai → Mumbai, 2025.** Marsh McLennan, Senior Manager BA. ~30% efficiency across 5 EU countries; TOM for 20+ countries; access framework for 500+ users. Ewa Leszczyna testimonial. The turn: the pattern he kept seeing, quitting to build, kid one and a half. Dusk.
5. **Cockpit, 2026.** Rethink Systems AI-first MPM Cohort 7, placed 2nd at the AI-First Buildathon (links the existing PDF). Ravi Kiran testimonial. 4 stats on instrument gauges. "Stop fixing systems. Start building them." Marigold wave fills the night city with color.
6. **Departures board.** 7 products as split-flap rows (code, product, month, status, headline). Click → boarding pass tear → `work/<slug>/` case study page.
7. **Safety card.** "How I think": lead line + 4 principles.
8. **I build sites like this.** Short pitch, CTA to contact. No price.
9. **Contact.** Calendly, email, LinkedIn, location, availability, notify form.
10. **Footer.** Quote, Field Guides link, origin comic link, credit line.
11. **Read as a page** (`read/`): the full journey as plain text.
12. **Origin comic** (`comic/`): the 9 existing comic pages with their alt text, kept reachable from the footer.

## 4. Architecture

```
site/
  package.json            vite, three, gsap, @fontsource/sora, @fontsource/ibm-plex-mono (dev: @playwright/test)
  vite.config.js          base '/my-portfolio/', multi-page inputs (index, read, comic, work/*)
  scripts/generate-pages.mjs   writes read/, comic/, work/<slug>/ HTML from content.js (runs before dev/build)
  index.html              hero, flight section, board, safety card, sites, contact, footer
  public/                 favicon, og image, paper grain texture (tiny), comic images copied at build
  src/
    content.js            single source of truth for all copy and data (the reusable "engine data")
    main.js               entry: tiering, nav, hero motion, board, form, reveal, lazy-load flight
    tier.js               device tier detection + runtime FPS guard
    board.js              split-flap departures board
    pass.js               boarding pass tear + view-transition navigation
    form.js               notify form (3-layer validation, Supabase REST insert, fail-open)
    fallback2d.js         SVG route map for static/lite tiers
    flight/
      index.js            boot: renderer, loop, resize, context loss, dispose
      uniforms.js         shared uniforms (reveal, wave, night, time, palette)
      materials.js        blueprint-to-color shader material + ink line material
      ground.js           paper ground: contours, grid, water hatching, reveal
      sky.js              sky dome with time-of-day + stars
      cities.js           Mumbai, Jamshedpur, Chennai landmark builders
      plane.js            procedural airliner
      sidekick.js         procedural marigold robot
      cockpit.js          cockpit interior + gauges
      clouds.js           instanced cloud billboards + cloud banks
      path.js             flight curve, banking, camera rigs
      choreography.js     ScrollTrigger master timeline → state object
      hud.js              DOM HUD (route, year odometer, progress nav)
    styles/               tokens.css, base.css, hero.css, flight.css, board.css, sections.css, work.css, read.css
  tests/                  Playwright e2e (desktop, mobile, reduced motion)
```

Deploy: `.github/workflows/pages.yml` gains a build job: `npm ci && npm run build` in `site/`, then assembles `_site/` = `site/dist/` + legacy static assets that must keep their URLs (`PRDs/`, `field-guides/`, resume PDFs, `rethink-buildathon-2nd-place.pdf`, `products/`, `images/`). The old `index.html` stays in git history. Launch = merge `feat/flight-portfolio` into `main` (only on Prateek's go).

## 5. Rendering design (Blueprint to color)

- **No model files.** Every object is procedural geometry (boxes, cylinders, extrusions, lathes, instanced meshes).
- **One shader family.** `BlueprintMaterial` (ShaderMaterial): toon lighting (3 bands), paper fill with hatching on shaded sides in blueprint mode, flat color in color mode. Color mix per fragment = `max(uReveal, waveMask, localMask)` with a noisy ink-bleed edge (world-space distance + fbm).
- **Ink lines.** `EdgesGeometry` line segments in ink; opacity eases from 1 (blueprint) to ~0.35 (color) so the final look stays illustrated.
- **Ground.** One large plane with a fragment shader: paper grain, topographic contour lines from fbm height, faint lat/long grid, local water patches with hatch lines, same reveal logic (land greens and ochres, sea teal).
- **Sky.** Gradient dome; blueprint = paper with grid; color = dawn → day → dusk → night by `uNight`/`uDusk`; stars at night.
- **Night lights.** Building windows from a world-space pattern, emissive when `uNight` and color are on.
- **Clouds.** Instanced billboards with fbm alpha and an ink contour; dense cloud banks at each transfer hide scene swaps.
- **Grain.** CSS overlay (tiny tiled texture, multiply blend), zero GPU cost.

## 6. Choreography (flight section scroll progress p)

| p | Beat |
|---|---|
| 0.00–0.13 | Mumbai runway, takeoff over the Sea Link; Gateway of India, local train; cards: Mumbai/BE, TCS (+Aruna) |
| 0.13–0.22 | Climb, cloud punch, HUD year rolls to 2022 |
| 0.22–0.33 | Jamshedpur flyover: steel plant chimneys with smoke, Jubilee Park; XLRI card; local marigold wash |
| 0.33–0.44 | Cruise south-west, cloud punch, coast appears; global reveal → 0.4 |
| 0.44–0.56 | Chennai: Chennai Central clock tower, Marina lighthouse, beach; Standard Chartered card |
| 0.56–0.66 | Cruise west into dusk |
| 0.66–0.78 | Mumbai dusk: Marsh card (+Ewa), the turn |
| 0.78–0.90 | Dolly into the cockpit: gauges show stats, sidekick waves; Rethink card (+Ravi) |
| 0.90–1.00 | Pull out over night Mumbai; thesis line; marigold wave sweeps the city into color and light |

Camera: target state from a GSAP ScrollTrigger master timeline (scrub), then critically damped smoothing in the render loop so motion stays smooth on any scroll input. Plane banks from path curvature. Native scroll (no smooth-scroll library).

## 7. Tiers, performance, accessibility

- **Tiers:** `full` (desktop WebGL2), `mobile` (coarse pointer or narrow: DPR ≤ 1.5, fewer clouds and particles, simpler edges), `lite` (save-data, ≤ 2 cores or ≤ 2 GB memory, no WebGL, or FPS guard failure: SVG route map), `static` (reduced motion: SVG route map without animation, cards in flow).
- **Budgets:** first paint text needs only HTML + CSS; entry JS < 30 KB gz; flight chunk (three + gsap + scene) < 250 KB gz, loaded after first paint on idle; total transfer < 3 MB desktop, < 1.5 MB phone.
- **Accessibility:** cards are real HTML in reading order; canvas `aria-hidden`; board has screen-reader text; skip link; focus styles; reduced motion respected; color contrast AA on all text; `read/` view.
- **Resilience:** WebGL context loss falls back to `lite`; resize and DPR changes handled; deep links (`#mumbai`, `#board`, etc.) work; no console errors.

## 8. Testing

- Playwright e2e (desktop 1440×900, mobile 390×844, reduced motion): load with no console errors, hero text visible before the flight chunk loads, scroll through all stops (card visibility + HUD updates), board renders all 7 rows, each row opens its work page, form validation (invalid, blocked domain, typo suggestion, success in local-only mode), read and comic pages load, footer credit present.
- Screenshots of every stop at both sizes for review.
- Lighthouse (mobile) on the built site: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95.
- Bundle size check against budgets.

## 9. Out of scope (YAGNI)

Sound, custom cursor, CMS, analytics, multiple languages, a pricing page, Supabase schema changes, buying a domain.

## 10. Needs Prateek's review in the morning

- New copy written for him (flagged in the summary): stop captions, "I build sites like this" section, Hitaarth case study wording adapted from his app page.
- Em-dash removals inside quotes (punctuation only).
- Real-phone check and the launch go-ahead (merge to `main`).
