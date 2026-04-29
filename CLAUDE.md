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

* **`index.html`** — the main portfolio page (served by GitHub Pages). Includes the optional notify-me signup section.
* **`styles-v3.css`** — the portfolio stylesheet (warm paper theme with design tokens, polaroid/washi system, notify-me styles).
* **`script.js`** — vanilla JS for nav scroll state, mobile hamburger, expandable cards, "show more case studies" toggle, scroll-reveal, and active nav link tracking.
* **`config.js`** — Supabase credentials for the notify-me signup. Committed to the repo (anon key is public by design).
* **`config.example.js`** — placeholder template for anyone cloning the repo to wire up their own Supabase project.
* **`images/`** — `hero-comic.png` (career comic), `philosophy-illustration.png` (cross-legged with AI sidekick), `contact-illustration.png` (park bench wave), `gate-avatar.png` (Prateek + marigold AI sidekick — used by the notify-me section).
* **`products/`** — screenshots for the project cards (`galpal.jpg`, `plan-karo-chalo.jpg`).
* **`PRDs/`** — rendered HTML PRDs for five shipped projects, linked from project cards.
* **`Prateek-Mehta-Product-Resume.pdf`, `Resume.pdf`** — linked from the hero "View Resume" button.
* **`CLAUDE.md`** — this file.
* **`brand-guide.md`, `updated_copy.md`, `resume-enrichment.md`, `brand-visualizer-galpal.html`** — working notes and references.

Old v1/v2 portfolio files (`index-v2.html`, `styles.css`, `styles-v2.css`, `copy.md`) are gitignored but kept locally for reference.

## Notify-me signup

A small, optional email-capture section (`#notify`) sits between `#story` ("Why I'm Doing This") and `#contact`. It is **not** a gate — the portfolio loads immediately and the section is just one more way for an interested reader to stay in touch. Framed as a notify-me list, not a fixed-cadence newsletter, so it doesn't lock me into a delivery commitment.

**Copy:**
* Section label: `Stay in the Loop`
* Title: `Get a heads-up when I ship something new`
* Body: `I send a short note when I ship a new product, finish a case study, or write something worth reading. No fixed cadence — usually once every few weeks at most.`
* Polaroid caption: `the AI sidekick & I will say hi.`
* Placeholder: `your@email.com`
* Button: `Notify me` (changes to `Adding you…` while submitting)
* Note: `Your email stays with me. No spam, ever.`
* Success state: `You're on the list.` / `I'll be in touch when there's something worth sharing.`
* Returning subscriber state: `You're already on the list. Thanks for being early.`

**Tech:**
* **SDK**: Supabase JS client loaded from `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` (deferred).
* **Config**: credentials live in `config.js` (committed — public anon key). The notify controller reads them via `window.__NEWSLETTER_CONFIG__`. If `config.js` is missing or has placeholders, the form runs in local-only mode — validation still runs and the success state still shows, but nothing is written. This is intentional and safe.
* **Supabase table**: `subscribers` with a text column `email` (unchanged from the previous gate — pre-existing emails carry over). Requires RLS enabled, an INSERT policy for the `anon` role, and the table must be exposed via Project Settings → Data API → Exposed tables. (Being exposed via the Data API is a separate, newer setting from RLS — if client inserts return 401 despite correct policies, check this first.)
* **Three-layer email validation** (identical to the previous gate):
  1. Format regex — `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (local@domain.tld, no spaces).
  2. Blocklist of 17 placeholder/disposable domains — `test.com`, `example.{com,org,net}`, `mailinator.com`, `tempmail.com`, `10minutemail.com`, `guerrillamail.com`, `yopmail.com`, `maildrop.cc`, etc.
  3. Typo map covering 31 common variants of Gmail, Yahoo, Hotmail, Outlook, iCloud, Protonmail, and Live (`gmial.com` → suggests `gmail.com`). Inline clickable suggestion with a marigold underline auto-fills the input. A deliberate resubmit of the same typo is respected and lets the email through.
* **Fails open by design**: if Supabase is unreachable, the SDK fails to load, credentials are placeholders, or the insert errors out (including duplicate-email unique-constraint violations, Postgres code 23505), the form still shows the success state. The signup never blocks anything; failure reasons are logged to `console.debug` for the owner.
* **Timeout**: Supabase save races against a 3.5s timeout so slow networks don't stall the success state.
* **Storage flag**: `localStorage.portfolio_notify_subscribed = '1'` is set after any attempt (success, duplicate, or error). On next visit, the form is replaced with a "You're already on the list" message. To re-show the form for testing: `localStorage.removeItem('portfolio_notify_subscribed')`.
* **XSS-safe typo suggestion**: the clickable typo correction is built via DOM nodes (`createElement` + `textContent`), not `innerHTML`, so a malicious local part can't inject HTML.
* **Accessibility**: visually-hidden label on the email input, `aria-invalid` toggled on error, `role="alert"` on the inline error element, and the success card uses `aria-hidden` while invisible.

## Deployment

Deployed via **GitHub Pages** from the `main` branch, root directory. Live at `https://proisback.github.io/my-portfolio/`. Enable under repo Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.

No Vercel, Netlify, or other platform needed — the site is fully static and GitHub Pages is free for public repos.

## Local development

1. Open `index.html` directly in a browser (file://). Everything works — no server required.
2. To re-show the notify-me form after you've already submitted: open devtools Console and run `localStorage.removeItem('portfolio_notify_subscribed')`, then reload.
3. To test local-only mode (no Supabase writes): replace the values in `config.js` with `YOUR_...` placeholders.

## About Prateek

Business Analysis and Transformation professional with 8+ years of experience across financial services, now stepping into Product Management with a clear conviction — the next generation of products will be shaped by AI, and the PMs who win will be the ones who deeply understand both user problems and how AI can solve them at scale. Led multi-country workflow redesigns, translated complex user pain points into product and tech requirements, and delivered process improvements that cut turnaround times and strengthened controls. What sets him apart is how he works today — actively builds with AI tools, uses them to prototype solutions, automate workflows, and pressure-test ideas before they ever reach a roadmap. Doesn't just talk about AI integration; ships with it. Thinks in systems, communicates in clarity, and operates at the intersection of business, technology, and users — with AI as a core lever, not an afterthought. Looking for a team building AI-native products where he can lead strategy, shape roadmaps, and turn intelligent automation into real user value.
