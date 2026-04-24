# My Portfolio

## What this is

A personal portfolio website for Prateek Mehta. Built with plain HTML, CSS, and vanilla JavaScript only. No frameworks, no React, no Tailwind, no build tools. The site works by opening `index.html` in a browser and is deployed via GitHub Pages.

## Design guidelines

* Clean, minimal, modern aesthetic — cream paper theme with marigold accents
* Professional but warm and personal
* Generous whitespace — nothing should feel cramped
* Fully responsive — must look great on both mobile and desktop
* Cohesive color palette — tokens defined in `styles-v3.css` (`--cream`, `--charcoal`, `--marigold`, `--ivory`, pastel stitch colors)
* Sora typeface, single family, weight + italic do hierarchy work
* Subtle animations and transitions — paper-grain texture, polaroid tilts, washi tapes, reveal-on-scroll

## Tech constraints

* Plain HTML + CSS + vanilla JavaScript ONLY
* No frameworks, no libraries (except Supabase JS client, loaded from CDN)
* No npm, no build steps, no bundlers
* The site must work by simply opening `index.html` in a browser

## File structure

* **`index.html`** — the main portfolio page (served by GitHub Pages). Includes the email gate + the full portfolio below it.
* **`styles-v3.css`** — the portfolio stylesheet (warm paper theme with design tokens, polaroid/washi system, email-gate styles).
* **`script.js`** — vanilla JS for nav scroll state, mobile hamburger, expandable cards, "show more builds" toggle, scroll-reveal, and active nav link tracking.
* **`config.js`** — Supabase credentials for the email gate. Committed to the repo (anon key is public by design).
* **`config.example.js`** — placeholder template for anyone cloning the repo to wire up their own Supabase project.
* **`images/`** — `hero-comic.png` (career comic), `philosophy-illustration.png` (cross-legged with AI sidekick), `contact-illustration.png` (park bench wave), `gate-avatar.png` (Prateek + marigold AI sidekick for the gate).
* **`products/`** — screenshots for the project cards (`galpal.jpg`, `plan-karo-chalo.jpg`).
* **`PRDs/`** — rendered HTML PRDs for five shipped projects, linked from project cards.
* **`Prateek-Mehta-Product-Resume.pdf`, `Resume.pdf`** — linked from the hero "View Resume" button.
* **`CLAUDE.md`** — this file.
* **`brand-guide.md`, `updated_copy.md`, `resume-enrichment.md`, `brand-visualizer-galpal.html`** — working notes and references.

Old v1/v2 portfolio files (`index-v2.html`, `styles.css`, `styles-v2.css`, `copy.md`) are gitignored but kept locally for reference.

## Email gate

First-time visitors see a full-screen overlay with a polaroid-framed illustration, name, tagline, email input, and submit button. Returning visitors skip it automatically. The gate lives inside `index.html`.

**Copy:**
* Eyebrow: `Welcome`
* Name: `Prateek Mehta`
* Tagline: `Built with soul. Powered by intelligence.`
* Polaroid caption: `the PM & his AI sidekick.`
* Button: `View My Portfolio`
* Note: `Your email is safe. No spam, ever.`

**Tech:**
* **SDK**: Supabase JS client loaded from `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` (deferred).
* **Config**: credentials live in `config.js` (committed — public anon key). The inline gate script reads them via `window.__GATE_CONFIG__`. If `config.js` is missing or has placeholders, the gate runs in local-only mode — validation still runs and the portfolio unlocks, but nothing is written. This is intentional and safe.
* **Supabase table**: `subscribers` with a text column `email`. Requires RLS enabled, an INSERT policy for the `anon` role, and the table must be exposed via Project Settings → Data API → Exposed tables. (Being exposed via the Data API is a separate, newer setting from RLS — if client inserts return 401 despite correct policies, check this first.)
* **Anti-flash first paint**: an inline `<style>` + pre-paint `<script>` in `<head>` checks `localStorage.portfolio_gate_passed` and adds `.gate-skip` to `<html>` before first paint, so returning visitors never see the gate flicker. State classes on `<html>`: none (gate visible, portfolio hidden) → `.gate-skip` (returning visitor) or `.gate-done` (just unlocked).
* **Three-layer email validation**:
  1. Format regex — `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (local@domain.tld, no spaces).
  2. Blocklist of 17 placeholder/disposable domains — `test.com`, `example.{com,org,net}`, `mailinator.com`, `tempmail.com`, `10minutemail.com`, `guerrillamail.com`, `yopmail.com`, `maildrop.cc`, etc. Rejected with a friendly inline error.
  3. Typo map covering 31 common variants of Gmail, Yahoo, Hotmail, Outlook, iCloud, Protonmail, and Live (`gmial.com` → suggests `gmail.com`). Shows an inline clickable suggestion with a marigold underline — clicking auto-fills the input. If the user deliberately resubmits the same typo, we respect their choice and let them through.
* **Fails open by design**: if Supabase is unreachable, the SDK fails to load, credentials are placeholders, or the insert errors out (including duplicate-email unique-constraint violations with Postgres code 23505), the visitor is still let through. The gate must never block the portfolio.
* **Timeout**: Supabase save races against a 3.5s timeout so slow networks don't stall unlock.
* **Storage flag**: `localStorage.portfolio_gate_passed = '1'` is set after any attempt (success, duplicate, or error). To see the gate again, clear it: `localStorage.removeItem('portfolio_gate_passed')`.
* **Unlock transition**: on successful submit, a "Welcome!" check card shows for 650ms, then the gate fades out over 560ms, is removed from the DOM, and fires a `portfolio:unlocked` custom event on `document` (hook here for post-unlock effects).
* **XSS-safe typo suggestion**: the clickable typo correction is built via DOM nodes (`createElement` + `textContent`), not `innerHTML`, so malicious user input can't inject HTML.
* **Accessibility**: gate has `role="dialog"` + `aria-modal="true"`, visually-hidden label on the email input, `aria-invalid` toggled on error, `aria-live` error element, and the success card uses `aria-hidden` while invisible.

## Deployment

Deployed via **GitHub Pages** from the `main` branch, root directory. Live at `https://proisback.github.io/my-portfolio/`. Enable under repo Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.

No Vercel, Netlify, or other platform needed — the site is fully static and GitHub Pages is free for public repos.

## Local development

1. Open `index.html` directly in a browser (file://). Everything works — no server required.
2. To see the email gate after you've already passed it: open devtools Console and run `localStorage.removeItem('portfolio_gate_passed')`, then reload.
3. To test local-only mode (no Supabase writes): replace the values in `config.js` with `YOUR_...` placeholders.

## About Prateek

Business Analysis and Transformation professional with 8+ years of experience across financial services, now stepping into Product Management with a clear conviction — the next generation of products will be shaped by AI, and the PMs who win will be the ones who deeply understand both user problems and how AI can solve them at scale. Led multi-country workflow redesigns, translated complex user pain points into product and tech requirements, and delivered process improvements that cut turnaround times and strengthened controls. What sets him apart is how he works today — actively builds with AI tools, uses them to prototype solutions, automate workflows, and pressure-test ideas before they ever reach a roadmap. Doesn't just talk about AI integration; ships with it. Thinks in systems, communicates in clarity, and operates at the intersection of business, technology, and users — with AI as a core lever, not an afterthought. Looking for a team building AI-native products where he can lead strategy, shape roadmaps, and turn intelligent automation into real user value.
