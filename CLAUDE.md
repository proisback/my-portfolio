# My Portfolio

## What this is

A personal portfolio website. Built with plain HTML, CSS, and vanilla JavaScript only. No frameworks, no React, no Tailwind, no build tools.

## Design guidelines

* Clean, minimal, modern aesthetic
* Professional but warm and personal
* Generous whitespace -- nothing should feel cramped
* Fully responsive -- must look great on both mobile and desktop
* Cohesive color palette -- no random colors
* Sans-serif typography
* Subtle animations and transitions to add polish

## Tech constraints

* Plain HTML + CSS + vanilla JavaScript ONLY
* No frameworks, no libraries (except Supabase JS client, loaded from CDN)
* No npm, no build steps, no bundlers
* The site must work by simply opening the HTML file in a browser

## File structure

* index.html -- the main portfolio page (served by GitHub Pages). Previously named index-v3.html locally.
* styles-v3.css -- stylesheet for the portfolio
* script.js -- vanilla JS (nav toggle, reveal animations, expandable cards)
* config.js -- Supabase credentials for the email gate (gitignored; template in config.example.js)
* images/ -- hero comic, philosophy illustration, contact illustration, gate avatar

Old v1 and v2 portfolio files (index-v2.html, styles.css, styles-v2.css) are gitignored but kept locally for reference.

## Email gate (index.html)

First-time visitors see a full-screen overlay with a circular photo, tagline, and email input before the portfolio. Returning visitors skip it.

* **SDK**: Supabase JS client loaded from `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2` (deferred).
* **Config**: credentials live in `config.js` (gitignored). The inline gate script in `index.html` reads them via `window.__GATE_CONFIG__`. Table needs a text column called `email`, RLS enabled, an INSERT policy for the `anon` role, and the table must be exposed via Project Settings → Data API → Exposed tables. If `config.js` is missing or has placeholders, the gate runs in local-only mode — validation still runs and the portfolio unlocks, but nothing is written. This is intentional and safe.
* **Anti-flash**: an inline `<style>` + pre-paint `<script>` in `<head>` checks `localStorage.portfolio_gate_passed` and adds `.gate-skip` to `<html>` before first paint, so returning visitors never see the gate flicker.
* **State classes on `<html>`**: none (gate visible, portfolio hidden) → `.gate-skip` (returning visitor) or `.gate-done` (just unlocked). Both hide the gate and show nav/main/footer.
* **Fails open by design**: if Supabase is unreachable, the SDK fails to load, credentials are placeholders, or the insert errors out (including duplicate-email unique-constraint violations with Postgres code 23505), the visitor is still let through. The gate must never block the portfolio.
* **Timeout**: Supabase save races against a 3.5s timeout so slow networks don't stall unlock.
* **Storage flag**: `localStorage.portfolio_gate_passed = '1'` is set after any attempt (success, duplicate, or error). To see the gate again, clear it: `localStorage.removeItem('portfolio_gate_passed')`.
* **Custom event**: fires `document` event `portfolio:unlocked` when the gate closes — hook here if you later add post-unlock effects (confetti, scroll to a section, etc.).
* **Gate only on v3**. `index.html` and `index-v2.html` don't have it.

## About me

* Name: Prateek Mehta
* Introduction: Business Analysis and Transformation professional with 8+ years of experience across financial services, now stepping into Product Management with a clear conviction — the next generation of products will be shaped by AI, and the PMs who win will be the ones who deeply understand both user problems and how AI can solve them at scale. I've led multi-country workflow redesigns, translated complex user pain points into product and tech requirements, and delivered process improvements that cut turnaround times and strengthened controls. But what sets me apart is how I work today — I actively build with AI tools, use them to prototype solutions, automate workflows, and pressure-test ideas before they ever reach a roadmap. I don't just talk about AI integration; I ship with it. I think in systems, communicate in clarity, and operate at the intersection of business, technology, and users — with AI as a core lever, not an afterthought. I'm looking for a team building AI-native products where I can lead strategy, shape roadmaps, and turn intelligent automation into real user value.

