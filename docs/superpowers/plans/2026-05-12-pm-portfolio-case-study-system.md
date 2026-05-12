# PM Portfolio Case-Study System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 6 polished portfolio case studies (or 4 polished + 2 lightweight if Kill Criteria triggers) from a shared editorial template, validated via reader-feedback loop, with Plan Karo Chalo as the pilot. HTML-canonical, no build tools.

**Architecture:** New `case-studies/` directory with one HTML file per product + shared `case-study.css`. Existing `PRDs/*.html` untouched as historical artifacts. Portfolio project cards on `index.html` repointed to new case studies, secondary link to original PRD. Per-case images in `images/case-studies/<slug>/`.

**Tech Stack:** Plain HTML5, CSS3 (Inter + Charter via Google Fonts), zero JS dependencies beyond what already exists. No build pipeline. Git for version control + tagging (template freeze).

**Source spec:** `docs/superpowers/specs/2026-05-12-pm-portfolio-case-study-system-design.md` (v1.2, commit `c4a72fa`)

**Conventions:**
- TDD doesn't naturally apply to content authoring. We use **structural verification** instead: each section/component is checked via grep or visual inspection (browser open) rather than unit tests.
- Each case-study HTML file is self-contained. The CSS is the only shared artifact.
- "Run" commands assume Git Bash on Windows with the project at `c:\Users\prate\my-portfolio`.
- Browser open via `start "" "file:///C:/Users/prate/my-portfolio/<path>"` on Windows.

**Deliberate brand divergence (called out per spec Section 2):**
The case-study system uses **Inter (display) + Charter (body) + IBM Plex Mono (code)** instead of the portfolio's Sora typeface. This is intentional — the spec explicitly chose editorial typography for case studies (analytical clarity, Stripe-docs-style reading) over Sora's warmer brand-identity tone. Color tokens (`--cream`, `--charcoal`, `--marigold`) are redefined in `case-study.css` to match `styles-v3.css` values *exactly* so the cream/marigold visual identity carries across; only the typography forks. If a future revision wants to harmonize back, file a Freeze Override.

**Total time budget reality check:**
Spec budgets ~45 hours for portfolio v1. This plan's task list sums to ~44–69 hours depending on Kill Criteria triggers and validation iterations. **If the budget bites, cut in this order**: (1) compress galpal to 6h instead of 12h by limiting Second-Order Effects to 2 bullets, (2) downgrade Signal AND StoreOps to lightweight pages per Kill Criteria, (3) skip Phase 11.1 cross-linking and batch later. Don't cut Phase 3 validation, Phase 4 VOICE.md, or Phase 6 Template Freeze — those are the discipline mechanisms.

---

## Flagship Energy Budget

Not every case study deserves equal narrative gravity. Treating all 6 with identical effort will *weaken* the strongest work — disproportionate energy is the point. Per-tier ceilings below; treat them as hard caps, not aspirational targets.

| Project | Tier | Time ceiling | Revision passes | Visual polish | Reflection depth |
|---|---|---|---|---|---|
| galpal | **Flagship** | 12 h | 3 | High — 3-5 mockups, diagrams, Second-Order Effects | Full 3-rule, expanded |
| Plan Karo Chalo | **Flagship** | 12 h (incl. validation) | 3 | High — full mockup set + analytics screenshot | Full 3-rule, expanded |
| Bhojan | **High** | 7 h | 2 | Standard — 1-2 mockups, optional diagram | Full 3-rule |
| PMPathfinder | **Medium** | 5 h | 1 | Minimum — screenshots only | 3-rule, tight |
| Signal | **Low** | 4 h (full) / 1 h (downgrade) | 1 | Minimum or none | 3-rule (full) / omitted with rationale (downgrade) |
| StoreOps | **Low** | 4 h (full) / 1 h (downgrade) | 1 | Minimum or none | 3-rule (full) / omitted with rationale (downgrade) |

**Hard rules:**

1. **Do not parallelize flagship work.** galpal and Plan Karo Chalo each get focused, single-threaded attention. No dispatching parallel subagents for these. Bhojan onward can be parallelized if executing aggressively.
2. **If a tier's time ceiling is hit, stop authoring and either commit-as-is or downgrade.** Don't blow past it. The ceiling exists to enforce asymmetric energy allocation.
3. **Revision pass = one cycle of (re-read against VOICE.md + edit + re-render).** If a flagship hits its 3 passes and isn't great, surface to user before pass 4. If a Low-tier hits its 1 pass and isn't great, downgrade per Kill Criteria.
4. **Visual polish ceiling for Low-tier = "screenshot of live product, no annotations."** Don't author flow diagrams or system maps for Signal/StoreOps. The energy goes to flagships.

This tiering is the single most important discipline mechanism for preventing portfolio-wide flattening to the weakest case study's depth.

---

## File Structure (locked)

```
case-studies/
  case-study.css                # Shared stylesheet — the template
  plan-karo-chalo.html          # Pilot (Phase 2)
  bhojan.html                   # CS#2 (Phase 5)
  galpal.html                   # CS#3 flagship + Second-Order Effects (Phase 7)
  pmpathfinder.html             # CS#4 (Phase 8)
  signal.html                   # CS#5 — may downgrade per Kill Criteria (Phase 9)
  storeops.html                 # CS#6 — may downgrade per Kill Criteria (Phase 10)

images/case-studies/
  plan-karo-chalo/              # Mockups, screenshots, diagrams per case
  bhojan/
  galpal/
  pmpathfinder/
  signal/
  storeops/

docs/superpowers/specs/
  VOICE.md                      # Voice style sheet (Phase 4)
  FREEZE-OVERRIDES.md            # Override log (Phase 6, empty until first override)

PRDs/                           # UNTOUCHED
  01_storeops_prd.html
  02_signal_crm_prd.html
  03_pmpathfinder_prd.html
  04_plankarochalo_prd.html
  05_galpals_prd.html

index.html                      # Modified: project card CTAs repointed (Phase 11)
```

---

## Phase 0: Pre-Build Setup

### Task 0.1: Create directory structure

**Files:**
- Create: `case-studies/`, `images/case-studies/<6 subfolders>/`

- [ ] **Step 1: Create directories**

```bash
mkdir -p case-studies
mkdir -p images/case-studies/{plan-karo-chalo,bhojan,galpal,pmpathfinder,signal,storeops}
```

- [ ] **Step 2: Verify structure**

```bash
ls -la case-studies/ images/case-studies/
```

Expected: `case-studies/` exists; `images/case-studies/` contains 6 subdirectories. Empty directories don't commit on their own — commit will land with the first real file in Task 1.1.

### Task 0.2: Recruit validation readers (BEFORE Phase 3 starts)

The validation loop in Phase 3 depends on humans who must already have agreed to read. Don't wait until Phase 3 to ask — start the recruit-and-confirm process in parallel with Phase 1 so they're available the moment Phase 2 ships.

- [ ] **Step 1: Identify candidate readers**

- 2-3 non-PM friends (cold-recruiter test, N≥2)
- 1-2 PM-experienced friends or mentors (PM-friend test)
- Optional: 1 senior PM / hiring manager from network (grunt test)

- [ ] **Step 2: Send a pre-warn message to each**

Template message: "I'm shipping a new case study on my portfolio in [X] days. When it's live, can I send you the link for 5 min of feedback? You'll get one specific question — won't take long."

- [ ] **Step 3: Confirm availability of N≥2 cold readers + ≥1 PM friend**

If fewer than that confirm within 5 days, surface to the user — the 7-day validation time-box can't start without readers.

---

## Phase 1: Author `case-study.css` (the shared template)

**Target:** ~6-8 hours total. Granular task list; each step is 5-15 minutes.

Reference for visual rules: spec Section 2 "Visual System".

### Task 1.1: CSS skeleton + design tokens

**Files:**
- Create: `case-studies/case-study.css`

**Token-sync prerequisite:** Before writing the token block below, `grep -n "marigold\|cream\|charcoal" styles-v3.css` and copy the hex values verbatim. If the portfolio's token hex changes in future, the case-study tokens must be re-synced manually (no shared variables). This is acknowledged tradeoff of the deliberate brand divergence.

- [ ] **Step 1: Create file with header comment + token block**

```css
/* ============================================================================
   PM Portfolio Case Study — Shared Stylesheet
   Spec: docs/superpowers/specs/2026-05-12-pm-portfolio-case-study-system-design.md (v1.2)
   Visual principle: calmly confident editorial infrastructure.
   ============================================================================ */

:root {
  --cream: #FAF6EC;
  --cream-soft: #F5EEDC;
  --charcoal: #1F1A1D;
  --ink-secondary: #5A4F53;
  --ink-tertiary: #8B8086;
  --marigold: #C9A332;
  --marigold-soft: #E5D49C;
  --border-hair: #E8DCC0;
  --white: #FFFFFF;

  --font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-body: 'Charter', 'Georgia', 'Source Serif Pro', 'Spectral', serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace;

  --page-width: 720px;
  --reflection-width: 580px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

- [ ] **Step 2: Verify file is valid CSS**

Open in browser; no console errors.

- [ ] **Step 3: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: design tokens + skeleton"
```

### Task 1.2: Font imports + reset + typography baseline

**Deliberate divergence from portfolio:** This file uses Inter + Charter (NOT the portfolio's Sora). See plan header "Deliberate brand divergence" — spec Section 2 calls for editorial typography on case studies for analytical clarity.

- [ ] **Step 1: Append to case-study.css**

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

html { background: var(--cream); }
body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.75;
  color: var(--charcoal);
  background: var(--cream);
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: var(--space-7) var(--space-4);
}

h1, h2, h3, h4, .eyebrow, .small-meta {
  font-family: var(--font-display);
  letter-spacing: -0.005em;
  line-height: 1.25;
  color: var(--charcoal);
}

h1 { font-size: 28px; font-weight: 700; }
h2 { font-size: 19px; font-weight: 700; }
h3 { font-size: 16px; font-weight: 600; }
.eyebrow { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: var(--ink-secondary); }
.small-meta { font-size: 13px; font-weight: 500; color: var(--ink-tertiary); }

a { color: var(--charcoal); text-decoration: none; border-bottom: 1px solid var(--marigold); }
a:hover { opacity: 0.7; }
```

- [ ] **Step 2: Add Google Fonts import at top of file**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
/* Charter is a system font on macOS/iOS; Georgia is the consistent web fallback. No web-font needed. */
```

- [ ] **Step 3: Visual sanity check via test HTML**

Create a throwaway `case-studies/_test.html` with `<h1>`, `<h2>`, `<h3>`, paragraph, and link. Open in browser. Confirm cream background, Charter (or Georgia fallback) body, Inter headings, marigold link underline.

- [ ] **Step 4: Delete test file, commit**

```bash
rm case-studies/_test.html
git add case-studies/case-study.css
git commit -m "case-study.css: typography baseline (Inter + Charter)"
```

### Task 1.3: TL;DR Card component

- [ ] **Step 1: Append component CSS**

```css
.tldr {
  background: var(--white);
  border: 1px solid var(--border-hair);
  border-radius: 4px;
  padding: var(--space-5) var(--space-5) var(--space-4);
  margin-bottom: var(--space-6);
}

.tldr-constraints {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}
.tldr-constraint-tag {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ink-secondary);
  background: var(--cream-soft);
  border: 1px solid var(--border-hair);
  padding: 2px 8px;
  border-radius: 3px;
}

.tldr-title { font-size: 24px; font-weight: 800; margin-bottom: var(--space-1); }
.tldr-role { font-size: 13px; color: var(--ink-secondary); margin-bottom: var(--space-4); }

.tldr-scan { display: grid; grid-template-columns: 80px 1fr; gap: var(--space-2) var(--space-3); }
.tldr-scan dt {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--marigold);
  padding-top: 4px;
}
.tldr-scan dd { font-size: 14.5px; line-height: 1.55; }

.tldr-ctas { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--border-hair); }
.tldr-cta {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border: 1px solid var(--charcoal);
  border-radius: 3px;
  color: var(--charcoal);
  text-decoration: none;
}
.tldr-cta:hover { background: var(--charcoal); color: var(--cream); border-bottom-color: var(--charcoal); }
```

- [ ] **Step 2: Verify in test HTML**

Build a TL;DR card markup in a throwaway test page; open in browser; confirm: cream-tinted card, constraint tags read tight, dt/dd scan row reads as definition-list, CTAs render as outline buttons.

- [ ] **Step 3: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: TL;DR card component"
```

### Task 1.4: Section header + Editorial Reading Rhythm tokens

- [ ] **Step 1: Append**

```css
.section {
  margin-bottom: var(--space-7);
}
.section-header { margin-bottom: var(--space-4); }
.section-eyebrow {
  font-family: var(--font-display);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--marigold);
  padding-bottom: 6px;
  border-bottom: 1px solid var(--marigold);
  margin-bottom: var(--space-3);
}
.section h2 { font-size: 21px; }
.section-intro { font-size: 16px; color: var(--ink-secondary); margin-bottom: var(--space-4); }

/* Editorial Reading Rhythm — modal class hooks per section */
.section--narrative p { font-size: 16.5px; }
.section--analytical { /* default */ }
.section--evidence { /* see Field Notes */ }
.section--operational table { font-size: 14px; }
```

- [ ] **Step 2: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: section header + rhythm class hooks"
```

### Task 1.5: Decision Block component (the killer)

- [ ] **Step 1: Append**

```css
.decision {
  background: var(--white);
  border-left: 4px solid var(--marigold);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-4);
  border-radius: 0 3px 3px 0;
}
.decision-meta {
  font-family: var(--font-display);
  font-size: 11.5px;
  font-style: italic;
  color: var(--ink-tertiary);
  margin-bottom: var(--space-2);
}
.decision-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  margin-bottom: var(--space-3);
  line-height: 1.35;
}
.decision-row { margin-bottom: var(--space-2); font-size: 14.5px; }
.decision-row .label {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ink-secondary);
  width: 90px;
  vertical-align: top;
}
.decision-row .value { display: inline-block; max-width: calc(100% - 100px); }
.decision-row.rejected .value { font-style: italic; color: var(--ink-secondary); }

/* Simplification Decision callout — inline within Key Decisions narrative */
.simplification-callout {
  border-left: 2px solid var(--marigold-soft);
  padding: var(--space-2) var(--space-3);
  margin: var(--space-3) 0;
  font-size: 14px;
  color: var(--ink-secondary);
  font-style: italic;
}
.simplification-callout::before {
  content: "The Simplification Decision";
  display: block;
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-style: normal;
  color: var(--marigold);
  margin-bottom: 3px;
}
```

- [ ] **Step 2: Mock up a decision block in test HTML; confirm marigold left border, metadata line, OPTIONS/CHOSE/WHY/REJECTED labels render correctly**

- [ ] **Step 3: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: Decision Block + Simplification Callout"
```

### Task 1.6: "Why This Was Hard" sub-block + "What I Refused to Build" list

- [ ] **Step 1: Append**

```css
.why-hard {
  margin: var(--space-4) 0;
}
.why-hard-list { list-style: none; padding-left: 0; margin-top: var(--space-2); }
.why-hard-list li {
  padding: var(--space-2) 0;
  padding-left: var(--space-4);
  position: relative;
  font-size: 15px;
  color: var(--ink-secondary);
  border-bottom: 1px dashed var(--border-hair);
}
.why-hard-list li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: var(--marigold);
  font-weight: 700;
}
.why-hard-list li:last-child { border-bottom: none; }

.refused-list { list-style: none; padding-left: 0; margin-top: var(--space-3); }
.refused-list li {
  padding: var(--space-2) 0 var(--space-2) var(--space-5);
  font-size: 14.5px;
  position: relative;
}
.refused-list li::before {
  content: "✕";
  position: absolute;
  left: var(--space-1);
  color: var(--ink-tertiary);
  font-weight: 700;
}
```

- [ ] **Step 2: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: Why This Was Hard + Refused to Build"
```

### Task 1.7: Insight→Change & Before vs After tables (Discovery section)

- [ ] **Step 1: Append**

```css
.discovery-table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-3) 0;
  font-size: 14px;
  font-family: var(--font-display);
}
.discovery-table thead th {
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-secondary);
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-hair);
}
.discovery-table tbody td {
  padding: 10px 12px;
  vertical-align: top;
  border-bottom: 1px dashed var(--border-hair);
  color: var(--charcoal);
  line-height: 1.5;
}
.discovery-table tbody tr:last-child td { border-bottom: none; }

.pivot-moments { margin-top: var(--space-4); }
.pivot-moment {
  padding: var(--space-3) 0;
  border-bottom: 1px dashed var(--border-hair);
}
.pivot-moment-when {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: var(--marigold);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
```

- [ ] **Step 2: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: Discovery tables + Pivot Moments"
```

### Task 1.8: Execution System workflow table + sub-callouts

- [ ] **Step 1: Append**

```css
.workflow-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-display);
  font-size: 13.5px;
  margin: var(--space-3) 0;
}
.workflow-table thead th {
  text-align: left;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-secondary);
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-hair);
}
.workflow-table tbody td {
  padding: var(--space-2) var(--space-3);
  vertical-align: top;
  border-bottom: 1px dashed var(--border-hair);
  line-height: 1.55;
}
.workflow-table .tool-tag {
  display: inline-block;
  padding: 1px 6px;
  background: var(--cream-soft);
  border: 1px solid var(--border-hair);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  margin: 1px 2px 1px 0;
  color: var(--ink-secondary);
}

.iteration-cadence {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  font-family: var(--font-display);
  font-size: 13px;
  color: var(--ink-secondary);
}
.iteration-cadence .stat strong { color: var(--charcoal); margin-right: 4px; }

.manual-callout {
  border: 1px solid var(--border-hair);
  background: var(--cream-soft);
  padding: var(--space-3) var(--space-4);
  margin: var(--space-4) 0;
}
.manual-callout .eyebrow { color: var(--marigold); margin-bottom: var(--space-2); }
.manual-callout p { font-size: 14.5px; line-height: 1.6; }

.ai-disclosure {
  margin-top: var(--space-4);
  padding: var(--space-2) 0;
  font-size: 13px;
  font-style: italic;
  color: var(--ink-tertiary);
  border-top: 1px dashed var(--border-hair);
}
```

- [ ] **Step 2: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: Execution System (workflow table + callouts)"
```

### Task 1.9: Solution Architecture + Outcomes + Field Notes + Reflection

- [ ] **Step 1: Append Solution Architecture + Outcomes**

```css
.solution-arch img,
.solution-arch picture {
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--border-hair);
  border-radius: 3px;
  margin: var(--space-3) 0;
}
.solution-arch figcaption {
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--ink-tertiary);
  margin-top: var(--space-1);
  text-align: center;
}

.outcomes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin: var(--space-4) 0;
}
.outcome-stat {
  text-align: left;
  padding: var(--space-3) 0;
  border-top: 1px solid var(--marigold);
}
.outcome-stat .num {
  display: block;
  font-family: var(--font-display);
  font-size: 34px;
  font-weight: 800;
  color: var(--marigold);
  line-height: 1;
  margin-bottom: var(--space-2);
}
.outcome-stat .label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-secondary);
  margin-bottom: 4px;
}
.outcome-stat .context { font-size: 13.5px; color: var(--ink-secondary); line-height: 1.5; }
```

- [ ] **Step 2: Append Field Notes (forensic)**

```css
.field-notes {
  margin-top: var(--space-6);
}
.field-notes .section-eyebrow { color: var(--ink-secondary); border-bottom-color: var(--ink-tertiary); }
.field-note {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--border-hair);
}
.field-note:last-child { border-bottom: none; }
.field-note-meta {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-tertiary);
  margin-bottom: 4px;
}
.field-note-quote {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.65;
  font-style: italic;
  color: var(--charcoal);
}
.field-note-quote::before { content: "“"; }
.field-note-quote::after { content: "”"; }
.field-note img {
  width: 100%;
  border: 1px solid var(--border-hair);
  margin: var(--space-2) 0;
}
.field-note pre {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--cream-soft);
  padding: var(--space-3);
  border: 1px solid var(--border-hair);
  overflow-x: auto;
  margin: var(--space-2) 0;
}
```

- [ ] **Step 3: Append Reflection (narrow, slowed)**

```css
.reflection {
  max-width: var(--reflection-width);
  margin: var(--space-7) auto;
  font-size: 17px;
  line-height: 1.8;
}
.reflection .section-eyebrow { color: var(--ink-secondary); }
.reflection-block { margin-bottom: var(--space-5); }
.reflection-block .label {
  display: block;
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--marigold);
  margin-bottom: var(--space-2);
}
.reflection-block p { font-family: var(--font-body); }
```

- [ ] **Step 4: Commit**

```bash
git add case-studies/case-study.css
git commit -m "case-study.css: Solution Arch + Outcomes + Field Notes + Reflection"
```

### Task 1.10: Decision Appendix + Related Thinking + Footer + Mobile sweep

- [ ] **Step 1: Append**

```css
.decision-appendix { margin-top: var(--space-7); }
.decision-appendix summary {
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--marigold);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--marigold);
  list-style: none;
}
.decision-appendix summary::-webkit-details-marker { display: none; }
.decision-appendix summary::before { content: "+ "; }
.decision-appendix[open] summary::before { content: "− "; }
.appendix-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-display);
  font-size: 12.5px;
  margin-top: var(--space-3);
}
.appendix-table thead th {
  text-align: left;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-secondary);
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-hair);
}
.appendix-table tbody td {
  padding: 8px;
  vertical-align: top;
  border-bottom: 1px dashed var(--border-hair);
  line-height: 1.5;
}
.ai-badge {
  display: inline-block;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 1px 5px;
  border: 1px solid var(--marigold);
  border-radius: 2px;
  color: var(--marigold);
}

.related-thinking {
  margin: var(--space-6) 0 var(--space-5);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-hair);
}
.related-thinking .eyebrow { color: var(--ink-secondary); margin-bottom: var(--space-2); }
.related-thinking ul { list-style: none; padding: 0; }
.related-thinking li { padding: 4px 0; font-size: 14px; }
.related-thinking li::before { content: "→ "; color: var(--marigold); }

.case-footer {
  margin-top: var(--space-7);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border-hair);
  font-family: var(--font-display);
  font-size: 12px;
  color: var(--ink-tertiary);
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 720px) {
  .page { padding: var(--space-4) var(--space-3); }
  h1, .tldr-title { font-size: 22px; }
  .outcome-stat .num { font-size: 28px; }
  .tldr-scan { grid-template-columns: 68px 1fr; }
  .decision-row .label { width: 70px; }
}
```

- [ ] **Step 2: Final visual sweep — create a comprehensive test HTML that exercises every component**

Create `case-studies/_template-preview.html` containing one instance of each component (TL;DR, Decision Block, Why This Was Hard, workflow table, outcome grid, field note, reflection block, appendix). Open in browser at 720px and 375px widths. Confirm: every component renders, mobile layout doesn't break, marigold accents are restrained.

- [ ] **Step 3: Delete test file, commit**

```bash
rm case-studies/_template-preview.html
git add case-studies/case-study.css
git commit -m "case-study.css: Appendix + Related Thinking + Footer + mobile responsive"
```

### Task 1.11: Lighthouse + accessibility quick check

- [ ] **Step 1: Open Chrome DevTools on the test preview before deletion, run Lighthouse on accessibility category**

Expected: ≥95 on accessibility (basic semantic HTML + sufficient contrast).

- [ ] **Step 2: If issues, fix contrast ratios and re-test before committing**

### CSS verification note (applies to Tasks 1.3–1.9)

Each task above says "verify in test HTML" but only Task 1.2 creates the test file. Either build up a single persistent `case-studies/_template-preview.html` across Tasks 1.2–1.10 — appending one component-test fragment per task and re-opening the browser — OR rely on Task 1.10 Step 2's comprehensive sweep to catch component-level rendering issues. Junior should pick the persistent-preview approach if uncomfortable with delayed verification.

---

## Phase 2: Plan Karo Chalo Pilot (Case Study #1)

**Target:** ~7-12 hours including validation pass. This case study proves the template.

Material sources:
- `PRDs/04_plankarochalo_prd.html` — full original PRD
- `index.html` lines 235-280 — project card content
- Live product at https://plankarochalo.vercel.app

### Task 2.1: Material extraction (split into 3 sub-tasks — total ~60-90 min)

- [ ] **Step 1: Read existing PRD end-to-end**

```bash
start "" "file:///C:/Users/prate/my-portfolio/PRDs/04_plankarochalo_prd.html"
```

- [ ] **Step 2: Add `_*.md` to .gitignore for working notes**

```bash
echo "case-studies/_*.md" >> .gitignore
```

- [ ] **Step 3: Create `_pkc-notes.md` — Part A (Constraints, Problem, Decisions) — ~20 min**

Extract:
- Operating constraints (solo, 8 days, no eng support, cohort-tested)
- Problem (one sentence)
- Why this was hard (3-5 tensions)
- 3-5 key decisions with options/chose/why/rejected
- What was refused (anti-features, 2-4 bullets)

- [ ] **Step 4: Add to `_pkc-notes.md` — Part B (Discovery + Execution) — ~20 min**

Extract:
- Discovery insights → changes (table format, 3-5 rows)
- Before/After thinking (table format, 2-4 rows)
- Workflow stack (task / workflow / why it mattered, 4-6 rows)
- Speed of iteration stats (idea→prototype, prototype→test, total iterations)
- What stayed manual (and why)
- AI Contribution Disclosure draft (one paragraph)

- [ ] **Step 5: Add to `_pkc-notes.md` — Part C (Outcomes, Field Notes, Reflection, Appendix) — ~20 min**

Extract:
- Outcomes (91.7%, 85.2%, 132 surveys + 24 interviews) with context per number
- Available Field Notes evidence (inventory: production analytics, quotes, screenshots, changelog) — count to verify ≥2 artifacts exist
- Reflection: 1 specific mistake / 1 changed belief / 1 future improvement
- Decision Appendix entries (5 rows with columns including AI-assisted Y/N)

- [ ] **Step 6: Verify completeness — every section of the case-study template has source material in notes**

If any section comes up empty, surface to user before proceeding. Don't author from thin material.

**Date stamp note:** Every case study's footer line `Version 1.0 · Updated <date>` should use the *actual publish date* per file, not the placeholder from the template. When copying the template skeleton, immediately update this date to today before committing.

### Task 2.2: Scaffold `plan-karo-chalo.html` with all 10 sections

**Files:** Create `case-studies/plan-karo-chalo.html`

- [ ] **Step 1: Write the skeleton HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Plan Karo Chalo — Case Study · Prateek Mehta</title>
<meta name="description" content="Group trip coordination tool — solo PM/designer/builder, 8-day shipping, 91.7% live activation.">
<link rel="stylesheet" href="case-study.css">
</head>
<body>
<div class="page">

  <!-- Back nav -->
  <p class="small-meta"><a href="../index.html#projects">← Back to portfolio</a></p>

  <!-- 1. TL;DR Snapshot -->
  <header class="tldr">
    <!-- Operating constraints, title, role, 5-bullet scan, CTAs -->
  </header>

  <!-- 2. Problem & Stakes (includes Why This Was Hard) -->
  <section class="section section--narrative">
    <div class="section-header"><div class="section-eyebrow">Problem &amp; Stakes</div></div>
    <!-- Prose + Why This Was Hard sub-block -->
  </section>

  <!-- 3. Key Decisions (with What I Refused to Build) -->
  <section class="section section--analytical">
    <div class="section-header"><div class="section-eyebrow">Key Decisions</div></div>
    <!-- Decision blocks (3-5) + Refused to Build list -->
  </section>

  <!-- 4. Discovery & Validation (conditional — keep for PKC, rich research) -->
  <section class="section section--evidence">
    <div class="section-header"><div class="section-eyebrow">Discovery &amp; Validation</div></div>
    <!-- Insight→Change table + Before/After table -->
  </section>

  <!-- 5. Execution System -->
  <section class="section section--operational">
    <div class="section-header"><div class="section-eyebrow">Execution System</div></div>
    <!-- Workflow table + iteration cadence + What Stayed Manual + AI Disclosure -->
  </section>

  <!-- 6. Solution Architecture -->
  <section class="section solution-arch">
    <div class="section-header"><div class="section-eyebrow">Solution Architecture</div></div>
    <!-- Annotated screenshots, flow diagrams -->
  </section>

  <!-- 7. Outcomes -->
  <section class="section">
    <div class="section-header"><div class="section-eyebrow">Outcomes</div></div>
    <!-- Outcome stat grid + context -->
  </section>

  <!-- 8. Field Notes -->
  <section class="section field-notes">
    <div class="section-header"><div class="section-eyebrow">Field Notes</div></div>
    <!-- Evidence-of-realness: timestamps, quotes, analytics crops -->
  </section>

  <!-- 9. Reflection -->
  <section class="reflection">
    <div class="section-header"><div class="section-eyebrow">Reflection</div></div>
    <!-- 3 blocks: redesign, changed belief, do next time -->
  </section>

  <!-- 10. Decision Appendix -->
  <details class="decision-appendix">
    <summary>Decision Appendix</summary>
    <!-- Table -->
  </details>

  <!-- Related Thinking (optional; empty until cross-refs exist) -->
  <section class="related-thinking">
    <div class="eyebrow">Related Thinking</div>
    <ul>
      <li><a href="https://plankarochalo.vercel.app">Visit live product</a></li>
      <li><a href="../PRDs/04_plankarochalo_prd.html">Original PRD (cohort artifact)</a></li>
    </ul>
  </section>

  <!-- Footer -->
  <footer class="case-footer">
    <span>Current as of: April 2026</span>
    <span>Version 1.0 · Updated <span id="updated-date">12 May 2026</span></span>
  </footer>

</div>
</body>
</html>
```

- [ ] **Step 2: Open in browser**

```bash
start "" "file:///C:/Users/prate/my-portfolio/case-studies/plan-karo-chalo.html"
```

Expected: scaffold renders, every section eyebrow visible, footer shows version.

- [ ] **Step 3: Commit scaffold**

```bash
git add case-studies/plan-karo-chalo.html
git commit -m "Plan Karo Chalo case study: scaffold all 10 sections"
```

### Task 2.3: Fill TL;DR Snapshot

- [ ] **Step 1: Populate the `<header class="tldr">` block**

Pull material from `_pkc-notes.md`. Structure:
- Constraint tags: `solo build` · `8 days` · `no eng support` · `cohort-tested`
- Title + role line
- Definition list (`<dl class="tldr-scan">`): Problem / Decision / Build / Result / Learned
- CTAs: Visit live site · Original PRD · Back to portfolio

- [ ] **Step 2: Reload browser, confirm TL;DR card renders with constraint tags, 5-bullet scan as DT/DD grid, CTAs as outline buttons**

- [ ] **Step 3: Commit**

```bash
git commit -am "PKC: TL;DR Snapshot"
```

### Task 2.4: Fill Problem & Stakes + Why This Was Hard

- [ ] **Step 1: Write 2-3 paragraphs of Problem & Stakes**

User pain + business tension. Pull from PRD's user-research findings. Tone: narrative, not analytical.

- [ ] **Step 2: Write the Why This Was Hard sub-block**

3-5 bullets, each leading with a tension verb (*competed / conflicted / required / ran counter to*).

- [ ] **Step 3: Verify both sub-sections render correctly; commit**

```bash
git commit -am "PKC: Problem & Stakes + Why This Was Hard"
```

### Task 2.5: Fill Key Decisions (3-5) + What I Refused to Build

- [ ] **Step 1: Author 3-5 Decision Blocks**

Each block: `decision-meta` (e.g., "After 24 user interviews · Week 1 of build"), `decision-title`, OPTIONS / CHOSE / WHY / REJECTED rows. Use real options actually considered, not retrofitted ones.

Where a decision was a simplification, include the `simplification-callout` inline within the surrounding prose.

- [ ] **Step 2: Author What I Refused to Build list**

2-4 bullets, each rejected feature with a one-line reason.

- [ ] **Step 3: Commit**

```bash
git commit -am "PKC: Key Decisions + What I Refused to Build"
```

### Task 2.6: Fill Discovery & Validation (PKC has rich research → keep full depth)

- [ ] **Step 1: Author Insight→Change table**

3-5 rows. Left column: research insight; right column: what changed.

- [ ] **Step 2: Author Before vs After Thinking table**

2-4 rows.

- [ ] **Step 3: Decide whether Pivot Moments is honest material. If yes, add. If no, omit (optional per spec).**

- [ ] **Step 4: Commit**

```bash
git commit -am "PKC: Discovery & Validation"
```

### Task 2.7: Fill Execution System (workflow + iteration + manual + AI disclosure)

- [ ] **Step 1: Author workflow table**

Task / Workflow / Why this acceleration mattered. Tools as inline `<span class="tool-tag">` tags. Be honest about what AI tools actually accelerated.

- [ ] **Step 2: Author iteration cadence row**

Concrete numbers: idea→prototype, prototype→user test, iterations before handoff. Read from the actual git history of the live product where possible.

- [ ] **Step 3: Author What Stayed Manual callout**

What didn't get automated and why. PKC examples: hand-tagging survey responses, manually screen-sharing onboarding tests, etc.

- [ ] **Step 4: Author AI Contribution Disclosure footer**

Italic, gray, plain-spoken. One paragraph. Example shape: "AI assisted draft copy on PRD sections and synthesis of survey responses. All product decisions, prioritization, and tradeoffs were human-led."

- [ ] **Step 5: Commit**

```bash
git commit -am "PKC: Execution System"
```

### Task 2.8: Fill Solution Architecture

- [ ] **Step 1: Identify 2-4 strongest screenshots/mockups from live product or earlier PRD**

Save to `images/case-studies/plan-karo-chalo/` as descriptive filenames (e.g., `01-link-generation.png`, `02-coordination-screen.png`).

- [ ] **Step 2: Embed in section with figcaptions**

- [ ] **Step 3: If a flow diagram or system map can be quickly produced (Mermaid, sketch, or imported screenshot), add it. Otherwise, screenshots alone are fine.**

- [ ] **Step 4: Commit**

```bash
git add case-studies/plan-karo-chalo.html images/case-studies/plan-karo-chalo/
git commit -m "PKC: Solution Architecture (screenshots + diagrams)"
```

### Task 2.9: Fill Outcomes (metrics dominate, screenshots below)

- [ ] **Step 1: Write Outcomes intro paragraph**

One sentence framing what changed in the world.

- [ ] **Step 2: Build the outcomes-grid with 3 stat blocks**

```html
<div class="outcomes-grid">
  <div class="outcome-stat">
    <span class="num">91.7%</span>
    <span class="label">Live cohort activation</span>
    <span class="context">22 of 24 cohort members completed onboarding and locked their trip date within 48h.</span>
  </div>
  <div class="outcome-stat">
    <span class="num">85.2%</span>
    <span class="label">48-hour response rate</span>
    <span class="context">Members responded to coordination prompts within 48h on first prompt — vs typical 2-week WhatsApp coordination cycles.</span>
  </div>
  <div class="outcome-stat">
    <span class="num">8 days</span>
    <span class="label">Idea → production</span>
    <span class="context">From first survey to live cohort test, including 132 survey responses + 24 user interviews + product build.</span>
  </div>
</div>
```

- [ ] **Step 3: Below the grid, add an analytics screenshot or chart if available; otherwise omit**

- [ ] **Step 4: Commit**

```bash
git commit -am "PKC: Outcomes"
```

### Task 2.10: Fill Field Notes — apply minimum bar (≥2 artifacts)

- [ ] **Step 1: Inventory available evidence**

Check: production analytics screenshots from Supabase dashboard, WhatsApp test-group screenshots, user quotes from interview notes, changelog snippets, GitHub commit history.

- [ ] **Step 2: If ≥2 distinct artifacts available, include Field Notes section**

Otherwise omit per spec and add one-line rationale in Decision Appendix.

- [ ] **Step 3: Render artifacts forensically**

- Timestamps visible
- Cropped, not styled
- Raw cream background (no card chrome)
- Quote attribution: `— Cohort member · WhatsApp · 14 April 2026`

- [ ] **Step 4: Commit**

```bash
git commit -am "PKC: Field Notes"
```

### Task 2.11: Fill Reflection (3-rule format, all required)

- [ ] **Step 1: Author all three blocks with specific, non-performative content**

```html
<div class="reflection-block">
  <span class="label">What I'd redesign</span>
  <p>...specific strategic mistake...</p>
</div>
<div class="reflection-block">
  <span class="label">What changed in how I think about PM</span>
  <p>...belief-level shift...</p>
</div>
<div class="reflection-block">
  <span class="label">What this taught me to do next time</span>
  <p>...forward-looking operational learning...</p>
</div>
```

- [ ] **Step 2: Re-read aloud. If any sentence sounds like "I learned communication is important", rewrite.**

- [ ] **Step 3: Commit**

```bash
git commit -am "PKC: Reflection (3-rule format)"
```

### Task 2.12: Fill Decision Appendix

- [ ] **Step 1: Build the appendix table inside the `<details>` element**

Columns: Decision · Options · Chose · Why · Rejected Because · AI-assisted (Y/N).

Mirror the 3-5 decisions from Section 3 plus 1-2 additional smaller decisions that didn't make the main narrative. AI-assisted column uses small `<span class="ai-badge">Y</span>` or `N`.

- [ ] **Step 2: Verify collapsible behavior**

Open in browser, click toggle, confirm `+` becomes `−` and table appears.

- [ ] **Step 3: Commit**

```bash
git commit -am "PKC: Decision Appendix"
```

### Task 2.13: Update `index.html` project card link

**Files:** Modify `index.html` (the Plan Karo Chalo project card around line 235-247) and `styles-v3.css` (add 2 CSS rules).

- [ ] **Step 1: Find the existing "Read the PRD" link in PKC card**

```bash
grep -n "plankarochalo_prd" index.html
```

- [ ] **Step 2: Find the existing `.card-link` styling**

```bash
grep -n "card-link" styles-v3.css
```

Read the existing rule so the new `--primary` / `--secondary` modifiers extend the existing styling rather than conflict.

- [ ] **Step 3: Add a new primary CTA above the PRD link**

Change link row to:
```html
<a href="case-studies/plan-karo-chalo.html" class="card-link card-link--primary">Read the case study ↗</a>
<a href="PRDs/04_plankarochalo_prd.html" target="_blank" rel="noopener noreferrer" class="card-link card-link--secondary">Original PRD ↗</a>
```

- [ ] **Step 4: Add 2 CSS rules in styles-v3.css just below the existing `.card-link` block**

```css
.card-link--primary { font-weight: 700; }
.card-link--secondary { font-size: 12px; opacity: 0.65; }
```

The primary inherits `.card-link` styling but adds weight; the secondary demotes via size + opacity. Both inherit color, hover state, etc. from the base `.card-link` rule.

- [ ] **Step 5: Add noindex meta to PKC case study until validation passes (minor reviewer suggestion)**

In `case-studies/plan-karo-chalo.html` `<head>`, add (temporarily):
```html
<meta name="robots" content="noindex,nofollow">
```

This prevents search-engine indexing of the v1 draft. Remove after Phase 3 validation passes.

- [ ] **Step 6: Verify portfolio still renders correctly; both links work; PKC opens new case study by default**

- [ ] **Step 7: Commit**

```bash
git add index.html styles-v3.css case-studies/plan-karo-chalo.html
git commit -m "Portfolio: PKC card now links to new case study; original PRD demoted; noindex on case study v1"
```

### Task 2.14: Deploy Plan Karo Chalo to GitHub Pages

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

GitHub Pages auto-deploys in 30-90 seconds.

- [ ] **Step 2: Verify live**

```bash
start "" "https://proisback.github.io/my-portfolio/case-studies/plan-karo-chalo.html"
```

Expected: case study renders correctly on production.

---

## Phase 3: Validation Loop (7-day time-box)

Per spec: must satisfy 2 of 3 exit criteria within 7 days.

### Task 3.1: Self-eyeball test

- [ ] **Step 1: Read PKC case study end-to-end on desktop (1280px), mobile (375px emulation), and tablet (768px) widths**

- [ ] **Step 2: Confirm Editorial Reading Rhythm — does each section *feel* different? TL;DR dense vs Reflection slow vs Field Notes raw?**

- [ ] **Step 3: List any visual or structural issues in a `case-studies/_pkc-validation-notes.md` working file**

### Task 3.2: 15-Second Cold Recruiter Scroll Test (N ≥ 2)

- [ ] **Step 1: Identify 2+ non-PM friends to act as cold recruiters**

- [ ] **Step 2: Share the URL with each. Ask: "scroll for 15 seconds, then tell me: (a) what was this project, (b) does the work feel real, (c) does this person seem senior/junior/student/founder?"**

- [ ] **Step 3: Record answers in `_pkc-validation-notes.md`**

### Task 3.3: 5-Second & 1-Minute PM-Friend Tests

- [ ] **Step 1: Identify ≥1 PM-experienced friend**

- [ ] **Step 2: Ask 5-second test: "what does this person do, in one sentence?"**

- [ ] **Step 3: Ask 1-minute test: "would you screen-call this person? Why/why not?"**

- [ ] **Step 4: Record answers**

### Task 3.4: Evaluate exit criteria (2 of 3 must hold)

Per spec:
- PM-experienced reader says they'd interview/screen-call you
- ≥2 cold-recruiter readers each summarize your role accurately after a skim
- Someone *spontaneously* names decision quality / reflection depth / clarity without being prompted

- [ ] **Step 1: Check which criteria are met after feedback gathered**

- [ ] **Step 2: If 2/3 met, exit validation loop. Remove the `noindex` meta tag from `case-studies/plan-karo-chalo.html`, commit, push.**

```bash
git commit -am "PKC: validation passed, remove noindex meta"
git push origin main
```

- [ ] **Step 3: If <2/3 met after first read pass — diagnose the gap**

Distinguish two failure modes:
- **Content failure** — readers don't understand the project / role / decisions. Fix in PKC content (re-write specific sections).
- **Template failure** — readers found the layout confusing, hierarchy wrong, hard to scan. Fix in `case-study.css` (and document as Freeze Override IF the template-v1-frozen tag has been placed — but we're pre-freeze, so no override needed).

- [ ] **Step 4: Re-author the affected section(s), re-deploy, re-share with original readers asking specifically "did this fix it?"**

- [ ] **Step 5: Re-evaluate exit criteria**

### Task 3.5: Time-box enforcement and escalation

- [ ] **Step 1: If 7 days pass without securing the PM-friend read, exit on criteria 1 + 2 alone. Note the missing read in PKC case-study footer.**

- [ ] **Step 2: If 7 days pass AND criteria 1+2 not met after 2 revision passes, surface to user**

This means the case study is fundamentally not landing. Options to discuss:
- More dramatic template revision (high-cost)
- Switch pilot to a different case study (e.g., galpal) and start over
- Accept current state and proceed to Phase 4 with explicit limitation noted in VOICE.md

Don't stall silently. Surface, discuss, decide.

- [ ] **Step 3: Move on to Phase 4 (VOICE.md). Do not stall.**

---

## Phase 4: Author VOICE.md

Timing per spec: after Case Study #1's first draft and before Bhojan begins. ~1 hour.

### Task 4.1: Create VOICE.md

**Files:** Create `docs/superpowers/specs/VOICE.md`

- [ ] **Step 1: Write file with two parallel sections**

```markdown
# Portfolio Case Studies — Voice Style Sheet

> Authored after Plan Karo Chalo case study v1 draft, before Bhojan begins.
> Treat as a freeze artifact like `case-studies/case-study.css`.
> Review every case study against this list before publish.

## Positive constraints — what this portfolio sounds like

- [5-7 bullets — see spec Risk #6]
- E.g., "specific verbs only — owned, shipped, drove, declined"
- E.g., "numbers carry context — never bare metrics"
- E.g., "uses 'I' when solo, 'we' only for genuine team work"
- E.g., "names tradeoffs explicitly — what was given up to get this"
- E.g., "plain-text dates — '14 May 2026', not 'last month'"

## What this portfolio refuses to sound like

- [5-7 negative constraints]
- E.g., "no startup hype language — no 'revolutionizing', 'reimagining', 'transforming'"
- E.g., "no visionary claims without evidence"
- E.g., "no 'leveraging AI to...' phrasing"
- E.g., "no fake vulnerability — Reflection must be specific, not performative"
- E.g., "no inflated ownership wording — 'led a 6-person team' if you led it, 'contributed to' if you didn't"
- E.g., "no '10x' phrasing"
- E.g., "no motivational closer — case studies end with the work, not with platitudes"

## Review checklist (before each case study publish)

- [ ] Every metric carries context
- [ ] Every tradeoff names what was rejected
- [ ] Reflection is specific, not generic
- [ ] No phrase from the "refuses to sound like" list
- [ ] Voice consistent with PKC pilot reference draft
```

- [ ] **Step 2: Fill out the bullets with content discovered while authoring PKC. Be specific.**

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/specs/VOICE.md
git commit -m "VOICE.md: voice style sheet — positive + negative constraints"
```

---

## Phase 5: Case Study #2 — Bhojan (clean slate)

**Target:** ~5-7 hours. No existing PRD — tests template against greenfield authoring.

Material sources:
- Project card content on `index.html` lines 328-365
- Live product at https://bhojan-beta.vercel.app
- Working knowledge from prior conversation/notes

### Task 5.1: Material extraction (no existing PRD)

- [ ] **Step 1: Use live product + project card text + memory of pivot story**

Create `case-studies/_bhojan-notes.md`. Same section list as Task 2.1 but authored from scratch.

The pivot ("one user interview pivoted the entire model") is Bhojan's strongest hook — make sure Discovery & Validation surfaces this prominently.

### Task 5.2: Scaffold + fill `case-studies/bhojan.html`

**Per-section authoring follows the same granularity as Tasks 2.2 through 2.12. Don't compress — Bhojan has no PRD, so each section requires authoring from scratch. Steps below name the corresponding PKC tasks; apply the same step-by-step approach.**

- [ ] **Step 1: Copy template skeleton**

```bash
cp case-studies/plan-karo-chalo.html case-studies/bhojan.html
```

- [ ] **Step 2: Update `<head>` (title, meta description) and back-nav**

- [ ] **Step 3: Fill TL;DR Snapshot (mirror Task 2.3)**

Constraint tags: `solo build` · `4 days` · `no prior coding background` · `single pivot`. Problem line: ~1,095 daily meal decisions for a 6-person joint family. Decision: pivot from blank-grid planner to suggestion-first model. Build: suggestion-first PWA with festival calendar + WhatsApp share. Result: live product, 75+ meals, $0 infra. Learned: a single user interview can outweigh a survey if it invalidates the core model.

- [ ] **Step 4: Fill Problem & Stakes + Why This Was Hard (mirror Task 2.4)**

- [ ] **Step 5: Fill Key Decisions + What I Refused to Build (mirror Task 2.5)**

The strongest Decision Block is the pivot moment (blank-grid → suggestion-first). Include `simplification-callout` for the "remove the planning step" decision.

- [ ] **Step 6: Conditional check — does Bhojan have rich Discovery material? (mirror Task 2.6 if yes, else compress to 1 Insight→Change table + 1 Before/After row)**

Per spec Section 1, Discovery is conditional. For Bhojan, the pivot interview IS the discovery — likely worth a full section with the interview quote as the hero.

- [ ] **Step 7: Fill Execution System (mirror Task 2.7)**

Tools: Cursor (PWA scaffold), Supabase (RLS + auth), AI-assisted recipe DB population. AI Contribution Disclosure: "AI assisted PWA scaffold and recipe-database population. Pivot decision, product model, and family-domain logic were human-led."

- [ ] **Step 8: Fill Solution Architecture (mirror Task 2.8)**

Screenshots from live product into `images/case-studies/bhojan/`. Annotate the suggestion screen and the festival-calendar view as the differentiators.

- [ ] **Step 9: Fill Outcomes (mirror Task 2.9)**

Honest bar — Bhojan has no production analytics yet. Outcomes section may be lighter than PKC; that's OK. Lead with "the model pivot" as the outcome itself, not user metrics.

- [ ] **Step 10: Apply Field Notes minimum bar (mirror Task 2.10)**

If <2 artifacts available (likely), omit Field Notes with rationale in Decision Appendix per spec. Don't pad.

- [ ] **Step 11: Fill Reflection 3-rule format (mirror Task 2.11)**

- [ ] **Step 12: Fill Decision Appendix (mirror Task 2.12)**

- [ ] **Step 13: Apply VOICE.md checklist before saving**

Walk through every "refuses to sound like" bullet. Re-read once aloud.

- [ ] **Step 14: Open in browser at desktop + mobile widths; visual sanity check**

- [ ] **Step 15: Commit**

```bash
git add case-studies/bhojan.html images/case-studies/bhojan/
git commit -m "Bhojan case study v1.0"
```

### Task 5.3: Update Bhojan project card on index.html

- [ ] **Step 1: Add primary "Read the case study" link to the Bhojan card**

The Bhojan card currently has no PRD link — add only the new case-study CTA.

- [ ] **Step 2: Commit + push**

```bash
git commit -am "Portfolio: Bhojan card links to new case study"
git push origin main
```

---

## Phase 6: Template Freeze

After Bhojan ships, the template is proven. Lock it.

### Task 6.1: Git-tag `template-v1-frozen`

- [ ] **Step 1: Confirm `case-studies/case-study.css` is in the state you want frozen**

```bash
git log --oneline case-studies/case-study.css | head -5
```

- [ ] **Step 2: Tag the current HEAD**

```bash
git tag -a template-v1-frozen -m "Template frozen after Case Study #2 (Bhojan) ships. Any future change requires Freeze Override per FREEZE-OVERRIDES.md."
git push origin template-v1-frozen
```

### Task 6.2: Create empty FREEZE-OVERRIDES.md

- [ ] **Step 1: Create file**

```markdown
# Freeze Overrides Log

> Companion to `case-studies/case-study.css` git tag `template-v1-frozen`.
> Every change to that file (or to the section structure in the spec) after the tag was placed requires a one-paragraph entry below, naming the concrete rationale (validated reader feedback OR structural/readability defect discovered during implementation).

---

(No overrides yet.)
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/FREEZE-OVERRIDES.md
git commit -m "Create FREEZE-OVERRIDES.md companion to template-v1-frozen tag"
```

---

## Phase 7: Case Study #3 — galpal (Flagship, ~8-12 hours)

The flagship. Founder-mode role, deepest material. Includes optional Second-Order Effects section.

### Task 7.1: Material extraction

Sources: `PRDs/05_galpals_prd.html`, project card lines 175-225, live product galpal.in.

Special considerations:
- Place `Current as of <date>` in TL;DR card metadata row (per spec Risk #1)
- Founder-tone calibration — extra reads against VOICE.md "what this refuses to sound like"
- Second-Order Effects section (flagship-only)

### Task 7.2: Scaffold + fill `case-studies/galpal.html`

**Mirror per-section authoring from Tasks 2.2–2.12. Add Second-Order Effects section after Reflection. Budget 8-12h, not 4-6h — founder-tone calibration is the bulk.**

- [ ] **Step 1: Copy template skeleton**

```bash
cp case-studies/plan-karo-chalo.html case-studies/galpal.html
```

- [ ] **Step 2: Update `<head>` + back-nav**

- [ ] **Step 3: Fill TL;DR — place `Current as of <Month YYYY>` as an additional constraint tag** in the `.tldr-constraints` row alongside operating constraints (e.g., `solo build`, `4-day buildathon`, `Bangalore beta`, `Current as of May 2026`). This is the placement specified in spec Risk #1.

- [ ] **Steps 4–12: Per-section authoring (mirror Tasks 2.4–2.12)**

For each section, apply the same step-by-step granularity used for PKC. Don't compress.

- [ ] **Step 13: Add Second-Order Effects section AFTER Reflection (flagship-only, per spec Section 1)**

```html
<section class="section">
  <div class="section-header"><div class="section-eyebrow">Second-Order Effects</div></div>
  <p>2-4 short paragraphs OR a short Insight→Effect table. Cover: unintended consequences of the human-verification model, downstream behavior changes from no-feed/no-engagement-trap design, operational surprises discovered post-launch.</p>
</section>
```

- [ ] **Step 14: Apply VOICE.md checklist — extra reads against "refuses to sound like"**

Founder-tone risk is highest here. Re-read 3x. Strip every word that sounds like founder-Twitter copy.

- [ ] **Step 15: Open in browser; visual sanity check**

- [ ] **Step 16: Commit**

```bash
git add case-studies/galpal.html images/case-studies/galpal/
git commit -m "galpal case study v1.0 (flagship + Second-Order Effects)"
```

### Task 7.3: Update galpal project card on index.html

Mirror Task 2.13. Commit + push.

---

## Phase 8: Case Study #4 — PMPathfinder (~4-6 hours)

Source: `PRDs/03_pmpathfinder_prd.html`, project card lines 281-302.

### Task 8.1: Scaffold + fill `case-studies/pmpathfinder.html`

**Mirror per-section authoring from Tasks 2.3–2.12 (Bhojan-style granularity). PMPathfinder has an existing PRD and a research base (44-person survey) — material is rich. Budget 4-6 hours.**

- [ ] **Step 1: Copy template**

```bash
cp case-studies/plan-karo-chalo.html case-studies/pmpathfinder.html
```

- [ ] **Steps 2-13: Fill each section per the PKC step-by-step pattern (Tasks 2.3 through 2.12)**

For Execution System, lean into the AI orchestration angle — adaptive AI-scored practice across 6 PM dimensions is the strongest signal. Workflow table should show: question generation (AI), scoring rubric (human-led), question selection (adaptive engine). AI Contribution Disclosure must be specific about which parts are AI-orchestrated vs human-judged.

- [ ] **Step 14: Apply VOICE.md checklist**

- [ ] **Step 15: Commit + update index.html (mirror Task 2.13) + push**

```bash
git commit -am "PMPathfinder case study v1.0; portfolio card updated"
git push origin main
```

---

## Phase 9: Case Study #5 — Signal (Kill Criteria check)

Per spec: Signal is a likely Kill Criteria candidate (cohort/group, shared decision attribution, "surfaced opportunity" framing).

### Task 9.1: Material extraction + first-pass authoring

Source: `PRDs/02_signal_crm_prd.html`, project card lines 372-401.

- [ ] **Step 1: Apply objective Kill Criteria trigger UP FRONT (before authoring) — read the existing PRD and try to answer each question honestly:**

- Key Decisions: **Can you name ≥3 decisions where you (solo) considered ≥2 options and rejected one with a specific reason?** If the answer is "the team did X" rather than "I chose X over Y" — likely downgrade candidate.
- Reflection: **Can you name a specific personal mistake / belief shift / future improvement that isn't generic?** "I learned communication is important" = downgrade trigger.
- Evidence: **Are there ≥2 distinct production artifacts you personally can point to (analytics, user message, GitHub commit you authored, working prototype URL with measurable engagement)?**

If 2 of 3 fail honestly, **skip to Task 9.2 downgrade path directly**. Don't waste 4 hours authoring sections that will get cut.

- [ ] **Step 2: If trigger passes, attempt full template authoring (mirror Tasks 2.3–2.12)**

```bash
cp case-studies/plan-karo-chalo.html case-studies/signal.html
```

### Task 9.2: Honest Kill Criteria recheck after first-pass authoring (if full template attempted)

- [ ] **Step 1: Re-read against the objective trigger from Task 9.1 Step 1**

If after first pass any of the three trigger questions is honestly weak — proceed to downgrade.

- [ ] **Step 2: If after a second revision pass it's still weak — downgrade immediately. Don't try a third pass.**

Downgrade format (per spec):
- Keep: TL;DR Snapshot + Solution Architecture
- Add to Decision Appendix: a one-line rationale ("This project is presented as a lightweight summary because decision attribution was shared across a 4-person cohort group, limiting solo PM-decision claims.")
- Remove Sections 2, 3, 4, 5, 7, 8, 9 from the HTML

### Task 9.3: Commit, whichever path

```bash
git commit -am "Signal case study v1.0 (full | lightweight downgrade)"
git push origin main
```

---

## Phase 10: Case Study #6 — StoreOps (Kill Criteria check)

Same pattern as Phase 9. Source: `PRDs/01_storeops_prd.html`.

- [ ] **Step 1: Apply objective Kill Criteria trigger up front (mirror Task 9.1 Step 1)**

For StoreOps the trigger is sharper: this is a "surfaced opportunity" case study (you analyzed Blinkit's gap, you didn't deliver the fix). Specifically check:
- Can you name decisions about *case-study framing* you owned solo? (E.g., what to surface, what to recommend.)
- Can you point to ≥2 artifacts of the analytical work (your research deck, your prototype design, your decision rationale doc)?
- Can your Reflection name a specific framing mistake you'd correct?

If 2 of 3 fail, downgrade directly.

- [ ] **Step 2: Author full or downgrade per Kill Criteria**

```bash
cp case-studies/plan-karo-chalo.html case-studies/storeops.html
# Fill or downgrade per Kill Criteria
git commit -am "StoreOps case study v1.0 (full | lightweight downgrade)"
git push origin main
```

---

## Phase 11: Final Polish + Cross-linking

### Task 11.1: Cross-link `RELATED THINKING` footers (batch update)

Per spec: monthly batches, not real-time. Now is the appropriate batch.

- [ ] **Step 1: For each case study, identify natural cross-references**

E.g., galpal's "What Stayed Manual" theme connects to Plan Karo Chalo's manual-coordination insight. PMPathfinder's adaptive AI section relates to Bhojan's pivot moment.

- [ ] **Step 2: Update each `<section class="related-thinking">` block**

Per spec rule: every cross-link must introduce *new context*. Never duplicate.

- [ ] **Step 3: Commit**

```bash
git commit -am "Related Thinking: cross-link 6 case studies (first batch)"
```

### Task 11.2: Visual QA sweep across all 6 case studies

- [ ] **Step 1: Open each case study at desktop (1280px) and mobile (375px) widths**

- [ ] **Step 2: Confirm: consistent typography, Editorial Reading Rhythm holds, marigold cap respected, no broken images, no overflow at mobile**

- [ ] **Step 3: Confirm version footers all show consistent format**

- [ ] **Step 4: If any issues — log to FREEZE-OVERRIDES.md if it's a template-level fix; otherwise fix in-place**

### Task 11.3: Final deploy + announcement

- [ ] **Step 1: Final push**

```bash
git push origin main
```

- [ ] **Step 2: Verify live**

```bash
start "" "https://proisback.github.io/my-portfolio/"
```

- [ ] **Step 3: Optionally update the portfolio's hero copy if the 6 case studies' existence calls for a one-line announcement (out of scope but worth considering)**

---

## Phase 12: Substack Phase 2 (Out of v1 Scope)

Per spec: Substack begins after Case Study #3 (galpal) ships. Budget ~15-25 hours.

Captured here as **placeholder only** — separate plan to be written when entering Phase 2.

Stub:
- Substack account setup + voice calibration
- First essay: galpal — "Why trust systems fail when optimized for scale"
- Second essay: Plan Karo Chalo — "High activation is meaningless without behavioral completion"
- Third essay: Bhojan — "When one data point should outweigh six"
- Each essay manually re-authored (NOT auto-exported from HTML)
- Update RELATED THINKING footers on portfolio case studies in monthly batch after first 3 essays publish

---

## Verification Summary

After all phases complete, verify:

- [ ] 6 case-study HTML files exist in `case-studies/`, each opens without errors
- [ ] `case-studies/case-study.css` exists and is git-tagged `template-v1-frozen`
- [ ] `docs/superpowers/specs/VOICE.md` exists
- [ ] `docs/superpowers/specs/FREEZE-OVERRIDES.md` exists (entries optional)
- [ ] `index.html` project cards all point to case studies as primary CTA
- [ ] Existing `PRDs/*.html` files untouched
- [ ] Live site at `https://proisback.github.io/my-portfolio/case-studies/<each>.html` loads correctly
- [ ] All 6 case studies pass the VOICE.md checklist
- [ ] Plan Karo Chalo case study passed validation loop (2 of 3 criteria met)

## Success Criteria (per spec Section 5)

Within month 3 post-launch:

- A non-PM recruiter scrolling 15s can correctly identify project/role/realness for any case study
- A PM-experienced reader spontaneously notes decision rigor / reflection depth without prompting
- At least 1 hiring-manager-level reader says they'd take a screen call after reading 1-2 case studies cold
- ≥1 *high-quality* inbound contact attributable to the portfolio link (PM lead / founder / HM / experienced operator — not generic recruiter blast)
- Author's confidence in linking the portfolio in cold applications materially higher than before

---

## Open execution decisions for the user

Once this plan is approved, you'll be asked to choose:

1. **Subagent-Driven execution** (recommended) — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline execution** — execute tasks in this session using executing-plans skill, batch execution with checkpoints.
