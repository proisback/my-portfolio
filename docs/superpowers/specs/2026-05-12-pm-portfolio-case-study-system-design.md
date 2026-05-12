# PM Portfolio Case-Study System — Design

**Date:** 2026-05-12
**Status:** Design locked, ready for implementation planning
**Author:** Prateek Mehta (with brainstorming pair)

---

## Context

The portfolio currently links to 5 PRDs as raw cohort-week artifacts (`PRDs/01_storeops_prd.html` through `05_galpals_prd.html`) plus 1 product with no PRD (Bhojan). These PRDs were authored at different times during the Rethink Cohort 7 sprint and read as inconsistent in structure, depth, and voice. A mentor critique and parallel review surfaced that the current case studies under-deliver on the four dimensions PM hiring managers screen for: decision rigor, narrative arc, visual presentation, and outcome data — and that the structure itself is 2022-era PM-portfolio framing in a market that has shifted toward AI-native Builder PM evaluation (judgment under ambiguity, AI orchestration, restraint, operational maturity).

This design defines the case-study system that replaces the current PRD links with a cohesive, editorial, recruiter-and-interviewer-ready set of 6 case studies on the portfolio, plus a derivative Substack distribution layer for strategic interpretation.

**The intended outcome:** every visitor — recruiter skimming, hiring manager drilling, interviewer deep-inspecting — leaves with the impression that this person *thinks clearly, ships under ambiguity, and orchestrates AI as leverage*, not just that they made a polished portfolio.

---

## Goals

1. **Consistent template across all 6 case studies** — same structural spine, same level of polish, same visual treatment. Bhojan gets a new case study; the existing PRDs get reshaped to fit.
2. **Lift all 4 weak dimensions** — decision rigor, narrative arc, visual presentation, outcome data — via dedicated structural slots, not by adding prose.
3. **Editorial credibility, not designer aesthetic** — case studies read like Stripe engineering posts / Linear changelogs / Substack long-form, not like Framer templates / Behance portfolios.
4. **Support layered reading** — 60-second recruiter skim, selective hiring-manager drilling, and deep interviewer inspection, all from the same page via progressive disclosure.
5. **Dual-surface distribution** — same canonical case studies feed both the portfolio (operational truth) and Substack (strategic interpretation, manually re-authored).

---

## Non-Goals (explicitly out of scope for v1)

- CMS or templating engine
- Build pipeline / static-site generator
- Automated HTML → markdown export to Substack
- Real-time syncing with live product changes
- Per-role-tailored case-study variants (resume already does role tailoring)
- Analytics / heatmaps on case-study pages
- "Thinking Index" thematic archive page (captured as future-phase consideration)

These constraints prevent premature abstraction. At 6 case studies, manual control > scalability.

---

## Architecture

**File structure:**

```
case-studies/
  case-study.css           # Shared stylesheet
  plan-karo-chalo.html     # Pilot
  bhojan.html              # Clean-slate test
  galpal.html              # Flagship + Second-Order Effects
  pmpathfinder.html
  signal.html              # Compressed depth (cohort/group)
  storeops.html            # Compressed depth (cohort/group)

images/case-studies/
  plan-karo-chalo/         # Mockups, diagrams, screenshots
  bhojan/
  galpal/
  pmpathfinder/
  signal/
  storeops/

PRDs/                       # UNTOUCHED — existing raw cohort artifacts stay as historical record
  01_storeops_prd.html
  02_signal_crm_prd.html
  03_pmpathfinder_prd.html
  04_plankarochalo_prd.html
  05_galpals_prd.html

index.html                  # Project cards updated: primary CTA → case study, secondary → original PRD
```

**Key decisions:**

- Existing PRDs **remain in place untouched**. They're historical record; case studies are the polished derivative artifact at a different URL slot.
- Each case study is a **self-contained HTML file**, consistent with portfolio's no-build-tools constraint per project `CLAUDE.md`.
- Shared `case-study.css` carries template styling; per-product images live in product-named subfolders under `images/case-studies/`.

---

## Section 1: The Case-Study Template

**10 vertical sections per case study. 8 mandatory across every case study. 2 conditional. Per-section items have their own optional/required tiering.**

| # | Section | Status |
|---|---|---|
| 1 | TL;DR Snapshot | Mandatory |
| 2 | Problem & Stakes | Mandatory (includes "Why This Was Hard" sub-block) |
| 3 | Key Decisions | Mandatory (includes "What I Refused to Build" + per-decision "Simplification Decision" callouts) |
| 4 | Discovery & Validation | *Conditional* — include only when research materially changed direction |
| 5 | Execution System | Mandatory (workflow table, Speed of Iteration, What Stayed Manual, AI Contribution Disclosure) |
| 6 | Solution Architecture | Mandatory |
| 7 | Outcomes | Mandatory |
| 8 | Evidence of Realness ("Field Notes") | Mandatory (items inside are optional) |
| 9 | Reflection | Mandatory (3-rule format) |
| 10 | Decision Appendix | Mandatory (collapsible) |
| — | Second-Order Effects | *Flagship-only* — galpal + Plan Karo Chalo |

### Section-by-section content

**1. TL;DR Snapshot.** Operating-constraints tag row · project title · role · timeline · 5-bullet recruiter scan as a labeled definition list: **Problem · Decision · Build · Result · Learned**. CTA row: Visit live site · Original PRD · Loom · Back to portfolio.

**2. Problem & Stakes.** User pain + business tension + new sub-block **"Why This Was Hard"** (small-caps eyebrow, 3-5 tension-verb-led bullets: *competed / conflicted / required / ran counter to*). Surface ambiguity, not feature complexity.

**3. Key Decisions.** 3-5 decisions, each presented as a narrative paragraph naming options + tradeoff. Inline **"The Simplification Decision"** callouts where a call was about removing complexity (signals PM taste). Section closes with **"What I Refused to Build"** — 2-4 bullets, each rejected feature with a one-line reason. Anti-feature signal.

**4. Discovery & Validation** *(conditional depth).* Default: 1 Insight→Change table + 1 Assumption Reversal. Full depth only when research truly drove a pivot. Optional sub-blocks: Before vs After Thinking, Pivot Moments.

**5. Execution System.** Three-column workflow table (Task / Workflow / Why this acceleration mattered). Tools appear as inline tags, never logo clouds. Followed by **Speed of Iteration** cadence row, **What Stayed Intentionally Manual** sub-block (anti-overengineering signal), and **AI Contribution Disclosure** as understated italic footer.

**6. Solution Architecture.** Mockup-heavy, prose-light. Annotated screenshots, flow diagrams, system maps.

**7. Outcomes.** Metrics dominate visually; screenshots subordinate. Each metric paired with one-line context. Behavior + numbers + honest failures.

**8. Evidence of Realness ("Field Notes").** Forensic treatment: timestamps, cropped analytics, monospace changelog blocks, raw user quotes with attribution + date. Lower polish = higher trust. Loom link + GitHub link optional.

**9. Reflection.** 3-rule format, all required:
- *What I'd redesign* — specific strategic mistake
- *What changed in how I think about PM* — belief-level shift
- *What this taught me to do next time* — forward-looking operational learning

**10. Decision Appendix.** Collapsible (`<details>`) stacked table: **Decision · Options · Chose · Why · Rejected Because · AI-assisted (Y/N)**.

**Optional: Second-Order Effects** — flagship only. Unintended consequences, downstream learning. Signals systems thinking.

---

## Section 2: Visual System

### Baseline

- **Single-column layout**, 720px max content width. Reflection narrows to 580px to slow reading.
- **Typography:** Inter for headings/structure, **Charter** for body (fallbacks: Georgia, Source Serif, Spectral), IBM Plex Mono / system mono for code blocks. Serif body deliberately editorial.
- **Type scale:** H1 28px / H2 19px / H3 16px / body 16px (Reflection 17px) / small 13px / eyebrow 10.5px caps tracking.
- **Color:** Extends portfolio tokens — cream paper bg, charcoal ink, soft-gray secondary, marigold accent at ≤5% screen coverage (Decision Block left border, section underline, metric emphasis, link underline, status badges only). No gradients, no shadows beyond 1px borders, no decorative chrome.
- **Motion:** Only `<details>` expand/collapse, subtle link underline hover, optional image-zoom-on-click. No scroll animation, no parallax, no transitions beyond functional.

### Editorial reading rhythm

Each section subtly shifts reading mode:

| Section | Reading feel |
|---|---|
| TL;DR | Dense + structured |
| Problem | Narrative |
| Decisions | Analytical |
| Discovery | Evidence-driven |
| Execution System | Operational |
| Solution Architecture | Visual |
| Outcomes | Metric-forward |
| Field Notes | Raw + forensic |
| Reflection | Essay-like |

### Key components

**TL;DR Card** — bordered cream-tinted card, definition-list 5-bullet structure, marigold-tinted small-caps labels.

**Decision Block** — the strongest UI component. White surface against cream, 4px marigold left border, no icons, no chrome beyond the border. Internal slots: OPTIONS CONSIDERED, CHOSE, WHY, REJECTED. Above or below: muted metadata row giving context (*"After 12 interviews + 3 failed onboarding tests"*) to prevent hindsight bias.

**Why This Was Hard** — no card chrome, just typographic structure. Small-caps eyebrow, tension-verb bullets.

**Execution System** — 3-column table with tools as inline tags. **What Stayed Manual** as bordered callout. **AI Contribution Disclosure** as italic gray footer. Tools subordinate to reasoning.

**Outcomes** — numbers at 32-36px marigold; context label below in small caps. Screenshots always below the numbers, never above.

**Field Notes** — no card chrome. Cropped artifacts on raw cream. Eyebrow reads `FIELD NOTES`, not "Evidence" — signals lower polish, higher trust.

**Reflection** — 580px width, 16-17px body, line-height 1.75. Three labeled paragraph sub-blocks (not bulleted). Feels like an essay closer.

**Decision Appendix** — collapsible `<details>`, hairline-bordered table, AI-assisted column as small badge.

### Anti-patterns explicitly avoided

| Risk | Safeguard |
|---|---|
| Startup landing page syndrome | 720px width, 28px H1, no hero parallax |
| Decorative gradients/shadows | Only 1px borders |
| Tool porn in Execution System | 3rd column "Why this acceleration mattered" + tools as inline tags |
| Mockups overpowering decisions | Decision Block visually heavier than Solution Architecture |
| Evidence reads as marketing | Forensic Field Notes treatment |
| Designer-portfolio typography | Inter + Charter, 28px H1, dense table rows |
| Excessive motion | Only `<details>` + link hover |
| AI-slop suspicion | AI Contribution Disclosure + Field Notes + AI-assisted column in Decision Appendix |
| Cognitive overload | Conditional Section 4, optional Pivot Moments / Loom / GitHub |
| Over-templating | Allow project-specific asymmetry |

---

## Section 3: Build Sequence & Validation Loop

### Sequence

| # | Case Study | Position rationale |
|---|---|---|
| 1 | **Plan Karo Chalo** | Pilot. Best metrics in the portfolio (91.7% / 85.2%). Solo work → clean ownership. Stable, complete product. Existing PRD has rich material. |
| 2 | **Bhojan** | Clean-slate test. No existing PRD — forces template-driven greenfield authoring. |
| 3 | **galpal** | Flagship. Co-founder role, deepest material, founder-mode positioning. Includes Second-Order Effects. |
| 4 | **PMPathfinder** | AI-coded solo. Adaptive scoring as AI orchestration signal. |
| 5 | **Signal** | Cohort/group, compressed depth. Discovery minimal; Decision Log shorter (3 decisions). |
| 6 | **StoreOps** | Cohort/group, compressed depth. "Surfaced opportunity" framing maintained. |

### Validation loop (after Case Study #1)

Stop and validate before continuing. 4 layers:

1. **Self-eyeball test** — read end-to-end on mobile + desktop. Editorial Reading Rhythm: does each section feel different?
2. **15-second Cold Recruiter Scroll Test** — non-PM reader, 15s scroll, must answer: what was this project, does the work feel real, does this person seem senior/junior/student/founder?
3. **5-second & 1-minute PM-friend tests** — what does this person do; would you screen-call them?
4. **Hiring-manager grunt test** (optional) — 5-min feedback from senior PM/HM if available.

### Exit criteria (must satisfy 2 of 3)

- PM-experienced reader says they'd interview/screen-call you
- Recruiter-style reader summarizes your role accurately after a skim
- **Someone *spontaneously* names decision quality / reflection depth / clarity** without being prompted

### Template Freeze Point

After Case Study #2 ships, **only structural bugs trigger framework changes**. No aesthetic micro-optimization unless it materially improves comprehension. This rule exists to prevent infinite refinement.

### Per-case time budget

| Phase | Hours |
|---|---|
| Material extraction | 0.5 |
| Author / reshape | 2-4 |
| Visual assets | 1-2 |
| Polish + portfolio cross-link | 0.5 |
| **Per case (avg)** | **4-7 hours** |

galpal sits high at **8-12 hours** due to founder-tone calibration. Cohort cases (Signal, StoreOps) sit low at 3-4 hours.

**Total project budget:** ~45 hours, spread across 2-3 weeks of evening/weekend work.

---

## Section 4: Migration · Cross-linking · Versioning · Distribution

### A. PRD migration

- Existing 5 PRDs stay at their current URLs as historical artifacts. No edits.
- Portfolio project cards on `index.html` update: primary "Read more" CTA → new case study; small secondary link "Original PRD ↗" beneath.
- Bhojan card gets a new "Read the case study" CTA; no original-PRD link (none exists).
- No URL breakage for anyone with bookmarks.

### B. Cross-linking — `RELATED THINKING` footer

Every case study ends with an optional `RELATED THINKING` block.

**Rules:**
- Minimum 1, maximum 5 cross-links per case study
- Mix of internal (other case studies, sections) + external (Substack posts, LinkedIn threads, live products)
- Optional per case — empty is fine until cross-references exist
- **Every cross-link must introduce new context** — adjacent insight, related tension, downstream implication, or contrasting lesson. Never a duplicate idea or recursive self-link.
- Visually: small-caps `RELATED THINKING` eyebrow, no card chrome, arrow-prefixed list, secondary text color.

### C. Versioning

Each case study carries a subtle version line at the very bottom, below the Decision Appendix:

```
Version 1.2 · Updated 14 May 2026
```

Conventions:
- `1.0` on first publish
- Minor bump (`1.1`, `1.2`) for content additions / evidence updates
- Major bump (`2.0`) only if template structure changes (post-Freeze-Point structural bug fix)
- 13px gray, intentionally subtle. Signals living thinking, not performance.

### D. Canonical URL Discipline

Every idea has one primary home. This prevents content drift across platforms.

| Artifact type | Canonical home |
|---|---|
| Metrics, evidence, decisions | Portfolio case study |
| Strategic interpretation, frameworks | Substack |
| Short-form distribution, hot takes | LinkedIn / X |
| Raw execution artifact | GitHub / Figma / live product URL |
| Reflection (long-form) | Portfolio case study |
| Reflection (one-line, hot) | Social |

### E. Substack distribution pipeline

**Core principle:** HTML portfolio = canonical operational truth. Substack = interpretation and distribution. The two surfaces serve different cognitive modes and must NOT share content structure.

**Substack post architecture:**
- Each post revolves around **one core tension** from the case study, not the structure
- 800-1,500 words
- Hook → tension → 2-3 scenes that develop it → resolution + open question
- **Must stand alone** — Substack reader does not need the portfolio to understand the insight. Portfolio link = supporting proof, optional depth.
- Links back to canonical case study at the end

**Per-case-study tension working hypotheses:**

| Case Study | Substack Tension |
|---|---|
| Plan Karo Chalo | "High activation is meaningless without behavioral completion" |
| Bhojan | "When one data point should outweigh six" |
| galpal | "Why trust systems fail when optimized for scale" |
| PMPathfinder | "The hardest PM decisions were the ones the adaptive engine couldn't make" |
| Signal | "Users said they wanted visibility. Their behavior said otherwise." |
| StoreOps | "Surfacing vs solving" |

These are one-line angles, not titles. Final titles authored when each post is written.

**Pipeline mechanics (deliberately not automated):**

1. Case study ships on portfolio → validation loop passes
2. After 2-3 day lag (portfolio is primary source), Substack post drafted
3. **Manual draft, not HTML→markdown auto-export.** Auto-export would reproduce structure; we want re-interpretation. The manual rewrite is itself the PM-thinking work — abstraction signal.
4. Substack post links back to canonical case study
5. After Substack publishes, case study's `RELATED THINKING` footer updates with the Substack link (closes the loop)

### F. Cross-channel distribution beyond Substack

Out of scope for v1. LinkedIn / X threads are downstream of Substack, not of portfolio. Preserves the source-of-truth hierarchy: **portfolio → Substack → social**.

---

## Open Questions & Risks

1. **galpal narrative drift risk** — galpal is an actively-iterating product. Case study captures point-in-time; live product evolves. Mitigation: clear "as of <date>" notation on galpal case study. Re-version (1.x) when material updates accumulate.

2. **Substack as new content channel** — Prateek does not currently publish on Substack. Setting up the account, voice, and cadence is itself a workstream. Mitigation: don't start Substack until portfolio Case Study #1 + validation are done. Substack is downstream.

3. **Evidence of Realness availability** — some case studies lack production screenshots, analytics, user quotes. Field Notes section may be sparse for cohort projects (Signal, StoreOps). Mitigation: only include receipts that exist. Empty Field Notes is honest; fake ones break trust.

4. **Visual asset creation** — mockups, diagrams, flow charts. None of the existing PRDs have these consistently. Net-new work. Mitigation: use what exists; expand iteratively after initial publish. Not a v1 blocker.

5. **Reflection authenticity** — the 3-rule Reflection format demands intellectually expensive answers. Prateek must avoid performative humility ("I learned communication") and write specific mistakes ("I over-optimized automation before validating users wanted autonomy"). Risk: defaulting to generic on weak case studies. Mitigation: if a case study can't produce honest Reflection content, that's a signal to compress the case study, not fake the section.

---

## Success Criteria

The system succeeds if, after publishing all 6 case studies:

1. **A non-PM recruiter** scrolling a single case study for 15 seconds can correctly identify the project, the role, and whether the work feels real.
2. **A PM-experienced reader** spontaneously notes the decision rigor or reflection depth without prompting.
3. **At least one hiring-manager-level reader** says they'd take a screen call after reading 1-2 case studies cold.
4. **Substack publishing** generates at least 1 inbound contact (recruiter, founder, peer PM) by month 2 after publishing the first 3 essays.
5. **Prateek's confidence** in linking the portfolio in cold applications is materially higher than with the current PRDs. (Subjective but real.)

These are leading indicators of the harder outcome — **conversion to PM interviews** — which the system is built to optimize.

---

## Future Phases (out of v1 scope, captured for memory)

- **Thinking Index** — thematic archive page grouping case studies + Substack posts by topic (trust systems, onboarding, AI orchestration, behavioral design, etc.). Intellectual discoverability layer. Build only if/when ≥3 Substack pieces exist.
- **Cross-channel distribution** — LinkedIn / X threads derivative of Substack, not portfolio.
- **Analytics layer** — heatmap or scroll-depth on case studies to validate Editorial Reading Rhythm assumptions. Optional; not part of v1.
- **Print-friendly case study CSS** — for sharing as PDF leave-behind in interviews. Low priority.

---

## Implementation handoff

After this design is approved by the user, the next step is the `writing-plans` skill, which generates a detailed multi-step implementation plan covering:

- Authoring `case-study.css` (the shared stylesheet)
- Authoring Plan Karo Chalo case study (Case Study #1, pilot)
- Validation loop execution
- Template Freeze Point
- Authoring remaining 5 case studies in sequence
- Portfolio integration (project card updates)
- Substack onboarding + first 3 essay drafts

Implementation is **not** part of this design. This design defines the *what* and the *why*; the plan defines the *how* and the *when*.
