# Resume Enrichment — Rethink Cohort + Consumer Empathy Signals

> Extract from the portfolio, organized for pulling into your resume. Answers the specific gap: **"Do I have anything consumer-facing from Rethink?"** Also gives you a summary line that reframes your ops background as consumer-empathy credibility, and a highlights reel for cover letters.

---

## The gap — direct answer

You asked:

> *"Do I have anything from Rethink — a project, a case study, a product I built or analyzed — that's consumer-facing? That's the one gap worth plugging before this resume goes out."*

**Short answer: yes, and it's not subtle.** Of the 6 products you shipped during Rethink Cohort 7, **3 are pure consumer products** (Bhojan, Plan Karo Chalo, galpal) and **2 more are user-first in a B2B/workforce setting** (StoreOps for stressed store managers, Signal for solo founders). The gap isn't that consumer work is missing — it's that the **current resume likely frames them as "AI builds" instead of surfacing the user-discovery foundation underneath each one.**

Every Rethink project in your portfolio opens with primary research. Bhojan pivoted on a single user interview quote. Plan Karo Chalo was reframed by 27 interviews + 105 surveys. galpal is built on a deliberate decision to *not* use engagement patterns that extract user time. These are the exact signals a consumer PM hiring manager is scanning for — you just need to pull them forward.

---

## Summary line options

Three variants — each explicitly bridges ops → consumer empathy. Pick the one whose voice fits the rest of your resume.

### Option A — friction from the user side
> *Eight years transforming operations systems taught me exactly how they fail — at the point where real people meet them. That's where consumer products live or die, and it's where I've chosen to build next.*

### Option B — diagnosing from the other side of the glass
> *I spent eight years fixing what was broken in systems other people used every day. I learned to diagnose friction from the user's side of the glass. Now I bring that same seat to consumer products — starting with 6 shipped in 2026.*

### Option C — ops experience, consumer instinct
> *Product Manager with 8 years of process transformation across financial services and 6 consumer/AI products shipped in 2026. I design for the person on the receiving end — because I spent most of a decade watching capable people get slowed down by systems built without them in mind.*

---

## Rethink Cohort 7 — Feb 2026 to Apr 2026

**Context line for resume:** *AI-first Product Management program. Shipped 6 products in 3 months across solo and group sprints. Every product started with primary research, not a brief.*

Below: each project in resume-ready form, with the **user-empathy signal** called out explicitly for each one. Use the bullets verbatim or tailor to the role.

---

### 1. **galpal** — Women-Only Friendship App for Bangalore
**Apr 2026 · Group project → currently co-founding as Co-Founder, Product & Ops**
**Live:** galpal.in · Tech: Next.js 16, Supabase, Tailwind, Framer Motion

**Consumer category:** social / community, women's safety
**User:** Bangalore women, 23–40, new to the city or with fraying social circles

**Resume bullets:**
- Co-founded a women-only friendship PWA for Bangalore, owning product strategy, data model, API design, and UX end-to-end — from a conviction that dating apps, professional networks, and interest-based communities all fail women who want one real friend.
- Built a human-led verification layer (every new member completes a video or phone call with a reviewer before seeing matches) as a deliberate safety-first design choice with real operational consequences.
- Held the product vision against conventional engagement tactics — banned feeds, stories, streaks, and swipe mechanics — in a domain where feature creep is the category norm.
- Shipped with a hand-written copy system: 14-word sentence cap, no emoji in system copy, no celebration language unless earned. Every line respects the user's time.

**User-empathy signal (for resume summary / cover letter):**
> *"The product should make it easier to find one real friend, not harder to leave the app."* Every product decision traces back to that single belief. Banned words in the product copy: journey, tribe, vibes, community, seamless, authentic, curated.

---

### 2. **Plan Karo Chalo** — Group Trip Coordination Tool
**Apr 2026 · Individual sprint, built solo in 8 days**
**Live:** plankarochalo.vercel.app

**Consumer category:** group coordination, travel planning
**User:** friend groups 22–35 trying to plan trips that usually die on WhatsApp

**Resume bullets:**
- Built and shipped a link-based trip coordination tool for friend groups. 91.7% member activation, 85.2% 48-hour response rate, 1.5-day average time-to-date-lock (against a 5-day target). All metrics from production, not modeled.
- Ran **132+ primary research data points before writing a line of code**: 27 interviews across structured conversations, qualitative retrospectives, cross-group sessions, plus 105 survey responses.
- Reframed the product direction through research: starting assumption was "itinerary building is the pain." Research showed **date alignment is the #1 friction for 80%+ of respondents** — 35% of trips that never happened died specifically on dates. Killed the itinerary feature before building it.
- Eliminated four feature categories (expense splitting, booking integration, in-app chat, AI recommendations) on research grounds — not scope grounds — because they belong in adjacent products (Splitwise, MMT, WhatsApp).

**User-empathy signal:**
> The strongest finding from the research wasn't what users wanted added. It was what they wanted *absent* — no app downloads for members, no in-app chat (they already have WhatsApp), no AI that suggests destinations (they want their friends' voices, not a model's).

---

### 3. **Bhojan** — Weekly Meal Planner for Indian Families
**Mar 2026 · Solo · Built in 4 days with zero prior coding experience**
**Live:** bhojan-beta.vercel.app

**Consumer category:** food / household planning
**User:** Indian homemakers and joint-family meal planners, 25–55

**Resume bullets:**
- Built a fully functional vegetarian meal planner for Indian families — 75+ pre-loaded meals, festival and fasting calendar, WhatsApp grocery sharing, Google Auth, Supabase RLS. Shipped in 4 days as a non-engineer using AI tooling.
- **Pivoted the entire product after a single user interview.** First prototype was a blank 7×3 planner grid. One user said: *"I don't want to think about what to make next week. Just tell me what to make, and I'll say yes or no."* That reframed the interaction model from planner-first to suggestion-first.
- Documented honest product limitations publicly ("The suggestion engine is a smart randomizer with filters, not ML. 75 meals is enough for 2–3 weeks before repetition becomes noticeable.") — transparency as a trust-building choice.

**User-empathy signal:**
> The cultural specificity was the point. "Aaj kya banayein?" is a 1,095-decision-a-year problem in Indian joint families — not a five-minute question. A generic "meal planner" misses this entirely. Building *for* the specific person (not the generic "user") was the product's whole premise.

---

### 4. **Signal** — Intelligence Layer for Founder CRM
**Mar 2026 · Group project**
**Live:** signalaicrm.lovable.app

**Consumer/Prosumer category:** productivity / CRM for solo operators
**User:** early-stage B2B founders doing sales as one of many responsibilities

**Resume bullets:**
- Co-authored full problem-space and solution-space PRD after **6 structured 60-minute founder interviews + secondary analysis of 80+ sources on CRM adoption failure.**
- Overturned the team's starting assumption through research: pipeline visibility isn't the answer. One interviewee had four years of enforced HubSpot use and complete visibility — and still lost deals. The real need is active prioritization: *which conversation, why now, what context.*
- Defined the architectural boundary: rule-based commitment extraction, zero AI hallucination risk, daily brief of 3–5 ranked deal cards with verbatim evidence. Signal surfaces context; the founder writes every message. No AI-generated outreach.

**User-empathy signal:**
> *"Deals die not from rejection, but from silence."* The product sentence: *"It reads my inbox and tells me who I'm about to lose."* Every founder we interviewed recognized themselves in that line immediately.

---

### 5. **PM Readiness Assessment** — Diagnostic for Aspiring PMs
**Mar 2026 · Solo**
**Live:** pm-readiness-survey.vercel.app

**Consumer category:** career tools / self-diagnostic
**User:** aspiring PMs preparing for their first PM role

**Resume bullets:**
- Reframed a data-collection problem as a value-delivery product. Our PM cohort needed primary research from aspiring PMs; everyone was sending Google Forms into the same communities with near-zero response. Built the survey *as* a product — filling it out gives the respondent the exact thing the research says they lack: a readiness signal.
- Designed a 21-question diagnostic scoring across 6 research-backed dimensions (role clarity, preparation quality, feedback access, experience signal, strategic targeting, self-awareness) out of 100. Every question serves dual purposes: contributes to the respondent's score AND maps to a specific research hypothesis.
- Chose credibility over engagement: expected median score is 35–50, not 70–80. 12+ months of prep scores lower than 3–6 months. Self-rating 9/10 triggers an over-confidence penalty if not backed by outcomes.

**User-empathy signal:**
> Counterintuitive scoring is the core user-respect move. Portfolio-grade PM content online is optimized to make you feel ready. This product is optimized to tell you the truth. That's the product.

---

### 6. **StoreOps Peak-Hour Decision Support** (Blinkit)
**Feb 2026 · Group project**
**Live prototype:** blinkit-alert-buddy.lovable.app

**B2B / internal tool category:** workforce enablement
**User:** Blinkit dark-store managers during the 6–10 PM peak window

**Resume bullets:**
- Co-authored full PRD as part of a 4-person PM squad. Discovery drew on **392 AmbitionBox reviews, 11 Reddit first-person accounts, ground journalism, and a primary interview with an actual dark-store manager.**
- Identified the core paradox: Blinkit's franchise owners outside the store see real-time picker metrics; the employed Store Manager on the floor — the person with authority to act — sees nothing. *"This wasn't a data problem. It was a data-routing problem."*
- Evaluated three solutions on temporal intervention logic — not "which is easiest to build" but "which intervenes at the moment a decision can still change the outcome." Chose real-time in-peak decision support over post-peak analytics and pre-peak predictive staffing.

**User-empathy signal (ops-adjacent, still user-first):**
> The design principles were user-cognitive load constraints: action-oriented alerts (never informational), stress-proof clarity (zero training required at peak, because nobody reads docs at 8pm on a Friday), zero context switching (extend StoreOps, don't build a separate app). These are empathy choices for a stressed human, not feature choices.

---

## Pre-Rethink case studies (already on resume, but worth re-framing)

Your existing case studies — Marsh McLennan, Standard Chartered, TCS/ICICI Prudential — are **B2B/internal but user-first in framing.** Each opens with the user problem, not the business problem. If your current resume bullets for these lead with efficiency numbers (30%, 1,200 hours saved, etc.), consider re-leading with the user insight:

- **Marsh McLennan:** *"The hardest part wasn't the process design; it was getting five country leads to agree on what 'good' looks like. That's a stakeholder alignment problem, not a workflow problem."*
- **Standard Chartered:** *"You can't automate your way out of a process problem. If the ops team doesn't trust the automation, they build shadow processes around it."*
- **TCS / ICICI Prudential:** *"The customer didn't need a better form. They needed fewer forms."*

These are all user-empathy lines already written — just use them as the hook instead of the metric.

---

## User-empathy highlights reel (for cover letters, LinkedIn About, interview stories)

Pull any of these verbatim — they're the strongest consumer-thinking moments across the whole portfolio:

1. *"The customer didn't need a better form. They needed fewer forms."* — TCS digitization work
2. *"Deals die not from rejection, but from silence."* — Signal problem framing
3. *"I don't want to think about what to make next week. Just tell me what to make, and I'll say yes or no."* — the Bhojan user interview quote that pivoted the product
4. *"Aaj kya banayein?"* — the 1,095-decision-a-year problem that Bhojan was built for
5. *"The product should make it easier to find one real friend, not harder to leave the app."* — galpal's north star
6. *"Banned words include: journey, tribe, vibes, community, seamless, authentic, curated."* — galpal's voice discipline
7. *"This wasn't a data problem. It was a data-routing problem."* — StoreOps problem framing
8. *"The score is the growth loop."* — PM Readiness design philosophy
9. *"Primary research that changed the product direction before a line of code was written."* — Plan Karo Chalo

---

## Framing tips for the resume itself

1. **Lead Rethink projects with the user insight, not the tech stack.** Every bullet I wrote above does this — you can keep the tech line at the end if you want, but the first thing a consumer PM hiring manager should read is *who you built for and what you learned about them.*
2. **Number the research.** "6 founder interviews," "132 data points," "392 reviews analyzed," "27 interviews + 105 survey responses." Primary-research counts are the single strongest signal that you don't just ship — you discover before you ship.
3. **Surface the pivots.** A project that pivoted on a user insight is worth more on a resume than a project that shipped as originally specified. Bhojan (planner → suggestion engine), Plan Karo Chalo (itinerary → date alignment), Signal (visibility → active prioritization) are all pivots. Name them.
4. **Keep the "what I didn't build" mentions.** Telling a reader which features you *killed on research grounds* is a louder PM signal than telling them which features you shipped. Bhojan's honest-limitations paragraph, PKC's four eliminated categories, galpal's banned-engagement patterns — these are the bullets that read as *senior* PM thinking.
5. **The consumer/B2B split is a feature, not a problem.** You can lead the resume with consumer builds (Bhojan, PKC, galpal) and use the B2B case studies (Marsh, SC, TCS) as depth. The pitch writes itself: *"I ship consumer products on an operations foundation that most PMs don't have."*

---

## Nothing to plug

Re-reading the portfolio end-to-end: **there is no consumer-empathy gap in the work itself.** The gap was only in how it's being pulled forward onto a 1-page resume. Everything in this doc is already in your portfolio — just not yet positioned to do the job it could for a consumer PM hiring manager. Pick the summary line, lead with the Rethink consumer work, lead each bullet with the user insight, and the resume will read as a consumer PM with operations depth — not an operations leader trying to pivot.
