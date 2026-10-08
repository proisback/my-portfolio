# Prateek Mehta: the flight portfolio

A scroll-driven 3D flight over the cities that shaped a career (Mumbai → Jamshedpur → Chennai → Mumbai), drawn in blueprint ink that fills with color as it reaches 2026, then a split-flap departures board of seven AI products.

Built with Vite, Three.js and GSAP. No model files: every building, the plane and the marigold AI sidekick are generated in code, so the whole 3D experience is about 200 KB gzipped.

## Run it

```
npm install
npm run dev       # http://localhost:5173/my-portfolio/
npm run build     # static site in dist/
npm run preview   # http://localhost:4173/my-portfolio/
npm test          # Playwright end-to-end suite
```

Force a device tier with `?tier=full`, `?tier=mobile`, `?tier=lite` (2D route map) or `?tier=static` (reduced motion).

## How it's put together

| Piece | Where |
|---|---|
| Every word, link and product | `src/content.js` |
| HTML for the home page (built, not client-rendered) | `index.html` markers + `src/render/*.js` |
| Case study, read and comic pages | `scripts/generate-pages.mjs` + `src/render/pages.js` |
| The 3D world | `src/flight/` (`choreography.js` maps scroll to the flight) |
| Scroll HUD, card hand-offs, nav | `src/journey.js` |
| Departures board and boarding pass | `src/board.js`, `src/pass.js` |
| Notify form (Supabase REST, fails open) | `src/form.js`, `src/config.js` |
| Device tiers and the 2D fallback | `src/tier.js`, `src/fallback2d.js` |

To adapt it for someone else: copy goes in `src/content.js`, city positions and coastlines in `src/flight/places.js`, the waypoints in `src/flight/path.js`, and each city's landmarks in `src/flight/cities.js`.

Designed and built by Prateek with Claude Code.
