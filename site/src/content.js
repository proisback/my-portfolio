// Single source of truth for every word and link on the site.
// Copy is taken from the previous portfolio (index.html) and the Hitaarth
// landing page. Em-dashes are removed per Prateek's writing rules.
// Strings in `html` fields may contain <strong>/<em>/<a>; they are authored
// content, not user input.

export const SITE = {
  base: '/my-portfolio/',
  title: 'Prateek Mehta | Product Manager who builds with AI',
  description:
    'Prateek Mehta, Product Manager in Mumbai who builds with AI. Fly through eight years of operations work and the seven AI products built in 2026.',
  url: 'https://proisback.github.io/my-portfolio/',
};

export const PROFILE = {
  name: 'Prateek Mehta',
  eyebrow: 'AI-Native Product Manager · Mumbai',
  claim: 'Product Manager who builds with AI.',
  intro:
    "Eight years of solving operations problems across financial services taught me how to frame problems clearly, align teams, and ship. Now I bring that discipline to building AI-native products and I've built seven in 2026 to prove it.",
  availability: 'Open to PM roles · Mumbai',
  availabilityLong: 'Open to PM roles · Mumbai, open to remote',
  location: 'Mumbai, India',
  email: 'prateek.milestoneindia@gmail.com',
  linkedin: 'https://www.linkedin.com/in/prateek-mehta-xlri/',
  linkedinLabel: 'linkedin.com/in/prateek-mehta-xlri',
  calendly: 'https://calendly.com/iamprateekbm/get-in-touch-with-prateek',
  resume: 'Prateek-Mehta-AI-PM-Resume.pdf',
  thesis: ['Stop fixing systems.', 'Start building them.'],
};

export const STATS = [
  { value: '8+', label: 'Years in Business Analysis & Operations' },
  { value: '180+', label: 'User Research Data Points' },
  { value: '30%', label: 'Avg Efficiency Gain Delivered' },
  { value: '7', label: 'AI Products Built in 2026' },
];

// The hero boarding pass. Design copy, no facts beyond the profile.
export const HERO_PASS = {
  passenger: 'PRATEEK MEHTA',
  from: { code: 'OPS', label: 'Fixing systems' },
  to: { code: 'PM', label: 'Building them' },
  flight: 'PM 2026',
  seat: 'Captain',
  class: 'Builds with AI',
  gate: 'Mumbai',
};

export const CITIES = {
  BOM: { code: 'BOM', name: 'Mumbai' },
  IXW: { code: 'IXW', name: 'Jamshedpur' },
  MAA: { code: 'MAA', name: 'Chennai' },
};

// Flight segments, in scroll order. `beat` names the 3D choreography beat
// that plays while the segment is on screen. `leg` segments carry no card.
export const SEGMENTS = [
  {
    id: 'mumbai',
    beat: 'mumbai-a',
    city: 'BOM',
    years: '2012 to 2016',
    label: 'Mumbai',
    title: 'Where it started',
    role: 'BE (Information Technology)',
    org: 'Mumbai University / Ramrao Adik Institute of Technology',
    body: ['I started at TCS as a tester: thinking like a user, finding the cracks. That instinct stayed.'],
  },
  {
    id: 'tcs',
    beat: 'mumbai-b',
    city: 'BOM',
    years: '2017 to 2022',
    label: 'Mumbai',
    title: 'Five years of removing complexity',
    role: 'IT Business Analyst',
    org: 'Tata Consultancy Services · Mumbai',
    body: [
      'Five years as a BA on the ICICI Prudential and Citibank Singapore accounts taught me the most impactful changes come from removing complexity, not adding features. I cared more about the person than the system.',
    ],
    metrics: [
      { value: '100+', label: 'New Business enhancements shipped' },
      { value: '30%', label: 'cost savings from a digitised purchase journey' },
      { value: '+10%', label: 'CSAT after redesigned onboarding' },
      { value: '50%', label: 'less manual testing (1,200 hrs/year)' },
    ],
    quote: 'aruna',
  },
  { id: 'leg-1', beat: 'leg-1', leg: true, from: 'BOM', to: 'IXW', year: '2022' },
  {
    id: 'jamshedpur',
    beat: 'jamshedpur',
    city: 'IXW',
    years: '2022 to 2023',
    label: 'Jamshedpur',
    title: 'An MBA sharpened the thinking',
    role: 'MBA, PGDM (General Management)',
    org: 'XLRI Jamshedpur',
    body: ['An MBA at XLRI sharpened the thinking.'],
  },
  { id: 'leg-2', beat: 'leg-2', leg: true, from: 'IXW', to: 'MAA', year: '2023' },
  {
    id: 'chennai',
    beat: 'chennai',
    city: 'MAA',
    years: '2023 to 2025',
    label: 'Chennai',
    title: 'Standardize first, then automate',
    role: 'Manager, Process Standardization',
    org: 'Standard Chartered GBS · Chennai',
    body: [
      'You cannot automate your way out of a process problem. The real value was the standardization that happened before the automation.',
    ],
    metrics: [
      { value: '30 HC', label: 'manual work removed by automating client communication' },
      { value: 'Top 5', label: 'global markets standardised across CDD and Servicing & Transactions' },
    ],
  },
  { id: 'leg-3', beat: 'leg-3', leg: true, from: 'MAA', to: 'BOM', year: '2025' },
  {
    id: 'marsh',
    beat: 'mumbai-dusk',
    city: 'BOM',
    years: '2025',
    label: 'Mumbai',
    title: 'Back in Mumbai, working across Europe',
    role: 'Senior Manager, Business Analysis',
    org: 'Marsh McLennan India · Mumbai',
    body: [
      'Standardization is not about making everything identical. It is about finding the right level of consistency.',
    ],
    metrics: [
      { value: '~30%', label: 'efficiency gain, Year-End Premium Adjustment across 5 EU countries' },
      { value: '20+', label: 'countries in the Placement Data Capture centralization TOM' },
      { value: '500+', label: 'users on the EU Access Authorization Framework' },
    ],
    quote: 'ewa',
  },
  {
    id: 'turn',
    beat: 'turn',
    city: 'BOM',
    years: '2025',
    label: 'The turn',
    title: 'Nobody had built the alternative yet',
    body: [
      'Ops roles at Standard Chartered and Marsh McLennan kept showing me the same pattern: capable people spending days on tasks AI could handle in minutes. Not because anyone chose that. Because nobody had built the alternative yet.',
      'So I quit my job to learn what was actually possible. My kid was one and a half years old at the time.',
    ],
  },
  {
    id: 'cockpit',
    beat: 'cockpit',
    city: 'BOM',
    years: '2026',
    label: "Captain's seat",
    title: 'Taking the controls',
    role: 'AI-first Mastering Product Management 2.0, Cohort 7',
    org: 'Rethink Systems',
    body: [],
    accolade: {
      text: 'Placed 2nd, AI-First Buildathon · 10-day build sprint',
      href: 'rethink-buildathon-2nd-place.pdf',
    },
    quote: 'ravi',
    gauges: true,
  },
  {
    id: 'thesis',
    beat: 'wave',
    city: 'BOM',
    years: '2026',
    label: 'Mumbai, tonight',
    thesis: true,
    title: 'Stop fixing systems. Start building them.',
    body: ['7 AI products built in 2026. They are boarding now.'],
  },
];

export const TESTIMONIALS = {
  aruna: {
    name: 'Aruna Rajagopalan',
    role: 'Vice President, Citi',
    context: 'On the Citibank Singapore account during TCS tenure',
    text: 'I had the pleasure of managing Prateek during his tenure on Citi projects as a Business Analyst, and highly recommend him for his professionalism and strong work ethic. His positive attitude stands out and makes him a delight to work with.',
  },
  ewa: {
    name: 'Ewa Leszczyna',
    role: 'Broker / Client Executive, Marsh McLennan',
    context: 'On the Year-End Premium Adjustment harmonization across 5 EU countries',
    text: 'From the very beginning, he stood out for his exceptional ability to understand complex operations and break them down into clear, workable components. He consistently ensured that every feature we explored addressed a real and specific challenge, which made the direction of the project both meaningful and well-aligned with user expectations.',
  },
  ravi: {
    name: 'K Ravi Kiran',
    role: 'PM, Broadcom',
    context: 'On the AI-first MPM Cohort 7 at Rethink Systems',
    text: "Prateek was someone who just got things done: no waiting around for permission or a perfect plan. When we were still figuring out what to even try, he'd already started building. He was one of the first in our cohort to dive into tools like Claude and Lovable, and he brought the same energy to leading discussions as he did to implementation. On top of that, he kept everything documented in a way that actually helped the rest of us stay aligned. Rare to find someone who's both a starter and a structurer.",
  },
};

// Departures board order is the array order.
export const PRODUCTS = [
  {
    slug: 'plan-karo-chalo',
    code: 'PM 101',
    name: 'Plan Karo Chalo',
    board: 'PLAN KARO CHALO',
    month: 'APR 26',
    status: 'LIVE',
    headline: '91.7% activation · solo build in 8 days',
    kind: 'Group Trip Coordination Tool',
    meta: 'Apr 2026 · Individual Sprint',
    tagline: '132 research data points, solo build in 8 days, 91.7% live activation rate.',
    summary:
      "A link-based trip coordination tool that collapses weeks of WhatsApp chaos into minutes of structured decision-making. Built solo in 8 days after 132+ primary research data points.",
    tags: ['Primary Research', 'Problem Framing', 'Zero-to-One Shipping'],
    image: 'products/plan-karo-chalo.jpg',
    links: [
      { label: 'Visit live site', href: 'https://plankarochalo.vercel.app' },
      { label: 'Read the PRD', href: 'PRDs/04_plankarochalo_prd.html' },
    ],
    sections: [
      {
        h: 'The Problem',
        html: [
          '35% of planned group trips never happen. Not because people stop wanting to travel, because the coordination breaks down. Dates never get aligned. Destination debates go circular. One person absorbs all the cognitive load. The gap is not in booking tools. MakeMyTrip and Booking.com handle that. The gap is in the chaotic stretch between "let\'s go somewhere" and "everything\'s booked," a stretch that runs entirely through WhatsApp, Google Sheets, and one exhausted organizer.',
        ],
      },
      {
        h: 'Discovery',
        html: [
          '132+ research data points: 27 interviews across structured conversations, qualitative retrospectives, and cross-group sessions, plus 105 survey responses. The finding that overturned the starting assumption: itinerary building is not the core pain. The trip dies much earlier. Date alignment was the #1 friction point for 80%+ of respondents. 35% of trips that never happened died specifically because dates could not be aligned.',
        ],
      },
      {
        h: 'The Solution',
        html: [
          'A link-based coordination tool that guides groups through the pre-booking sequence of dates, budget, destination, and commitment, via a shared dashboard. No app download for members. The organizer creates a trip in 10 seconds, shares a link, and the tool handles the rest.',
          'Key mechanics: tap-to-select calendar with auto-overlap calculation, anonymous budget range slider with group sweet spot, destination voting with shake-to-decide tiebreak, hold-to-confirm commitment checkpoint, and a nudge library with 6 tone variants and dynamic member counts. Every feature traces back to a specific failure mode from the research.',
        ],
      },
      {
        h: 'Live Metrics (from production)',
        stats: [
          { value: '91.7%', label: 'member activation rate' },
          { value: '85.2%', label: '48-hour response rate' },
          { value: '1.5 days', label: 'average time to lock dates (target: 5)' },
          { value: '54.1%', label: 'return visit rate (target: 30%)' },
        ],
      },
      {
        h: 'What This Demonstrates',
        html: [
          'Primary research that changed the product direction before a line of code was written. Problem framing that eliminated four feature categories (expense splitting, booking integration, in-app chat, AI recommendations) on research grounds rather than scope grounds. And a clear architectural boundary: Plan Karo Chalo owns the coordination layer. Everything else belongs elsewhere.',
        ],
      },
    ],
  },
  {
    slug: 'pmpathfinder',
    code: 'PM 102',
    name: 'PMPathfinder',
    board: 'PMPATHFINDER',
    month: 'MAR 26',
    status: 'LIVE',
    headline: 'AI-scored PM readiness against any real JD',
    kind: 'Career Navigation for Aspiring PMs',
    meta: 'Mar 2026 · Individual Sprint',
    tagline:
      '44-person research turned into a 3-stage AI-scored assessment that benchmarks PM readiness against any real job description.',
    summary:
      'A three-stage career navigation platform for aspiring PMs: archetype diagnostic, adaptive AI-scored practice across 6 PM dimensions, and gap analysis against any real job description. Answers the one question every aspiring PM asks: <em>am I ready?</em>',
    tags: ['AI-Scored Practice', 'Adaptive Engine', 'Honest Scoring'],
    links: [
      { label: 'Visit live site', href: 'https://pmpathfinder-psi.vercel.app/' },
      { label: 'Research survey', href: 'https://pm-readiness-survey.vercel.app' },
      { label: 'Read the PRD', href: 'PRDs/03_pmpathfinder_prd.html' },
    ],
    sections: [
      {
        h: 'The Problem',
        html: [
          'PM preparation has no readiness signal. Unlike engineering (LeetCode) or consulting (case math), aspiring PMs can complete every course on the internet and still have no idea whether they would pass a real interview. 84% of aspiring PMs receive no or vague feedback. Only 1 in 38 gets specific, actionable feedback regularly. The cost of applying too early is permanent: top companies trigger a 12-month cooldown on failed interviews.',
        ],
      },
      {
        h: 'Discovery',
        html: [
          'A 38-person survey and 6 interviews revealed not people who lacked competence, but people who lacked signal. Consultants with 7+ years, engineers who had shipped at scale, designers who had led UX for millions of users, all stuck in preparation limbo, spending lakhs on courses with no way to measure progress. Three personas emerged: Domain Expert, Tech Switcher, MBA/Strategy Transitioner. All three shared one problem: they could not accurately assess where they stood.',
        ],
      },
      {
        h: 'What I Built',
        html: ['A three-stage platform:'],
        list: [
          '<strong>Stage 1: Archetype quiz.</strong> A 10-minute, 12-question scenario quiz assigns a PM archetype: Consumer, B2B, or Technical. <small>Why these three? Research surfaced them as the top PM archetypes by job-market presence. Narrower categories would have starved the matching engine; broader ones would have diluted the signal.</small>',
          '<strong>Stage 2: Adaptive AI-scored practice</strong> across six PM dimensions: Problem Framing, User Empathy, Structured Thinking, Prioritization, Metrics Reasoning, Communication. A five-slot engine (MCQ warm-up → weakest → second-weakest → mid → stretch) targets your gaps automatically.',
          '<strong>Stage 3: Real-job gap analysis.</strong> Paste any job description and get a Ready / Almost / Not Yet readout, with a specific improvement path and estimated time. <small>Why three buckets and not a numeric score? A 7.3 vs a 6.8 doesn\'t tell you what to do. Ready means apply now. Almost names the specific gap. Not Yet says where to focus first. The buckets force a clear next action.</small>',
        ],
      },
      {
        h: 'What This Demonstrates',
        html: [
          'Product discovery rigor: 38-person survey → three personas → MoSCoW prioritization → seven Must-haves shipped. AI treated as a calibrated feature, not a wrapper: the AI evaluator references the same rubric at 2am and 2pm, and scoring is deliberately tuned to resist inflation (5 = on track, 7 = genuinely strong, 9–10 = would impress a senior PM interviewer). In a market saturated with courses that promise transformation and deliver content, PMPathfinder\'s offer is narrower and harder: the truth about where you stand.',
        ],
      },
    ],
  },
  {
    slug: 'galpals',
    code: 'PM 103',
    name: 'galpals',
    board: 'GALPALS',
    month: 'APR 26',
    status: 'LIVE',
    headline: 'Founding PM · blank page to Product Hunt in 4 days',
    kind: 'Women-Only Friendship App for Bangalore',
    meta: 'Apr to Jul 2026 · Buildathon · Team of 6',
    badge: 'Founding PM',
    tagline:
      'Led discovery, PRD, and design on a 6-person Buildathon team: blank page to Product Hunt launch in 4 days.',
    summary:
      "A hand-verified PWA matching Bangalore-based women for genuine friendship. No feeds, no dating mechanics, no engagement traps. Built with Next.js, Supabase, and a brand system designed to take women's time seriously.",
    tags: ['Safety-First Design', 'Scope Discipline', 'Systems Thinking'],
    image: 'products/galpal.jpg',
    links: [
      { label: 'Visit live site', href: 'https://galpal.in/' },
      { label: 'Read the PRD', href: 'PRDs/05_galpals_prd.html' },
    ],
    sections: [
      {
        h: 'The Problem',
        html: [
          'Women relocating to a new city, or long-resident with a fraying social circle, have no good tool for finding real friends. Dating apps are the wrong context. Professional networks are the wrong intent. Interest-based communities solve for the group, not the individual. The gap is a surface that takes safety seriously, respects time, and gets out of the way once a connection is made.',
        ],
      },
      {
        h: 'My Contribution',
        html: [
          "I led discovery and authored the full PRD: framing the problem space, deciding what features made the cut and what didn't, and writing the spec the team built against. I designed every page (visual design and UX flows) and ran end-to-end QA, raising bugs against the build. One teammate owned development; the rest of the 6-person Buildathon team pitched in on testing and strategy.",
        ],
      },
      {
        h: 'The Product',
        html: [
          'galpals is a matches-and-chats surface only. No feed, no groups, no stories, no games. Every new member completes a human-led video or phone verification call before seeing matches. Once inside, they see a small scored set of nearby women each week with a reason they would click.',
          'Communication is intentionally low-friction and low-commitment: a wave with a preset reason or 100 characters of context. Mutual waves open a 1:1 chat. Max 3 lifetime waves to the same person. 30-day expiry. Nothing in the product tries to manufacture engagement.',
        ],
      },
      {
        h: 'Key Decisions',
        html: [
          '<strong>Manual verification, by design.</strong> Every member completes a human-led video or phone call before seeing matches. Automating it would be faster, but it kills the safety-first promise that makes the product different from dating apps and generic communities.',
          '<strong>PWA over native.</strong> Lower friction to try, faster to iterate, no app-store gatekeeping. Right call for a 4-day Buildathon shipping window, still the right call as we iterate.',
          '<strong>Matching scored on what predicts friendship, not popularity.</strong> Shared interests, looking-for overlap, neighborhood proximity, home state, city tenure, work situation, personality compatibility. Not "people you may know". People you\'d actually click with.',
        ],
      },
      {
        h: 'Brand Voice',
        html: [
          'The product should make it easier to find one real friend, not harder to leave the app. Every brand decision traces back to that one belief. Second person always. 14-word sentence cap. No emoji in system copy. Banned words: journey, tribe, vibes, community, seamless, authentic, curated.',
        ],
      },
      {
        h: 'What This Demonstrates',
        html: [
          'End-to-end PM ownership in a 4-day shipping sprint: discovery, PRD authoring, scope discipline, full-page design, and QA. Safety-first design with real operational consequences: verification is manual and human-led by design. And the ability to hold a product vision steady against the pull of engagement mechanics that would undermine it.',
        ],
      },
    ],
  },
  {
    slug: 'hitaarth',
    code: 'PM 104',
    name: 'Hitaarth',
    board: 'HITAARTH',
    month: 'SEP 26',
    status: 'LAUNCHED',
    headline: 'One thought, one action, every day · 669 ideas, 4 languages',
    kind: 'A Daily Reading Practice in English and Hindi',
    meta: 'Sep 2026 · Solo build',
    tagline: 'One meaningful thought. One small action. Every day.',
    summary:
      'Feeds give you endless information, and almost nothing that stays. Hitaarth gives you one carefully chosen idea each day, with one small action to carry into your life. In English and Hindi.',
    tags: ['Distribution Before Monetization', 'Demand Before Rails', 'Local-First Privacy'],
    links: [
      { label: 'Visit live app', href: 'https://the-awakening-quotes-app.vercel.app/' },
      { label: 'What it measures and why', href: 'https://the-awakening-quotes-app.vercel.app/metrics.md' },
    ],
    sections: [
      {
        h: 'The Problem',
        html: [
          'Social media gave me endless information, but almost nothing that stayed. Every once in a while, though, a single sentence would change how I handled a conversation, a hard decision, an ordinary day. I wanted a place where ideas weren\'t buried under algorithms.',
        ],
      },
      {
        h: 'The Product',
        html: [
          'One hand-picked thought a day, in layers: <strong>the thought</strong> (a line worth rereading), <strong>the meaning</strong> (why it matters, in plain words), and <strong>the practice</strong> (one small action for today). Mark "I did it" when you have. That tap is the whole point.',
          '669 ideas, chosen by hand, from scripture, aphorisms, poems, letters, speeches, books, essays, interviews, cinema and television. Every idea, its lesson, and its action in English, Hindi (written in Devanagari, not transliterated), Spanish and French.',
          'Any idea becomes a card made for WhatsApp Status, in three styles: Noir, Paper, and Dusk.',
        ],
      },
      {
        h: 'What It Refuses To Do',
        html: [
          'No infinite feed. No engagement algorithm. No ads. No account. Hitaarth succeeds when it gives you something to carry into your day, not another reason to stay on your screen.',
          'It works fully offline after the first visit. Favorites and notes live on your phone and never leave it.',
        ],
      },
      {
        h: 'Key Decisions',
        html: [
          '<strong>Distribution before monetization.</strong> The share card is the growth engine, so the craft went there first.',
          '<strong>Demand before rails.</strong> The premium screen is a single "I want this" button, not a checkout. Payment infrastructure gets built if 20% of the first 50+ premium page visitors ask for it. Not before.',
          '<strong>Measure without watching.</strong> Analytics are cookieless and anonymous, honor Do Not Track, and never identify a person. The metrics doc is public.',
          "<strong>Kill what can't ship.</strong> An early premium promise (home-screen widgets) died when the platform couldn't deliver it. The copy was corrected everywhere the same day.",
        ],
      },
      {
        h: 'Why It Exists',
        html: [
          'When our son was born, we named him Hitaarth: a Sanskrit word meaning one whose purpose is to do good. Becoming a father changed what I noticed about my own days.',
          "It isn't named after my son as a tribute. It's named after the value I hope we both grow into.",
        ],
      },
      {
        h: 'Status',
        html: [
          'Launched September 2026. A small product experiment, run in public by one person, in vanilla HTML, CSS, and JavaScript with zero dependencies and no build step.',
        ],
      },
    ],
  },
  {
    slug: 'signal',
    code: 'PM 105',
    name: 'Signal',
    board: 'SIGNAL',
    month: 'MAR 26',
    status: 'PROTOTYPE',
    headline: 'Intelligence layer for founder CRM',
    kind: 'Intelligence Layer for Founder CRM',
    meta: 'Mar 2026 · Group Project',
    tagline:
      "Six founder interviews surfaced the insight that broke the team's starting hypothesis and reshaped the entire product.",
    summary:
      "A passive prioritization layer that reads a founder's existing communication channels, extracts open commitments, detects deal momentum decay, and surfaces a ranked daily action list. No manual logging.",
    tags: ['Research-Led Reframing', 'Assumption Testing', 'Architectural Thinking'],
    links: [
      { label: 'Visit live prototype', href: 'https://signalaicrm.lovable.app' },
      { label: 'Read the PRD', href: 'PRDs/02_signal_crm_prd.html' },
    ],
    sections: [
      {
        h: 'The Problem',
        html: [
          'The $73.4B CRM market is built for professional salespeople. It systematically underserves early-stage B2B founders for whom sales is one of many simultaneous responsibilities. Through six in-depth founder interviews, we discovered that the core failure is not that founders lack data. No system reads that data and tells the founder what to do next. Deals die not from rejection, but from silence.',
        ],
      },
      {
        h: 'My Contribution',
        html: [
          'I co-authored the full problem-space and solution-space PRD. The research phase included six structured 60-minute founder interviews plus secondary analysis of 80+ sources on CRM adoption failure.',
          'The most significant finding, and the one that reshaped the entire product direction, was that pipeline visibility is not the answer. One founder achieved complete visibility through four years of enforced HubSpot use and still lost deals. The real need is active prioritization: which conversation, why now, what context.',
        ],
      },
      {
        h: 'The Solution',
        html: [
          'Signal reads a founder\'s existing email, calendar, WhatsApp Business, LinkedIn, and Zoom data in the background. It extracts open commitments, detects deal momentum decay, and surfaces a ranked daily action list. The founder sentence: "It reads my inbox and tells me who I\'m about to lose."',
          'The architecture includes a 4-state deal state machine, rule-based commitment extraction with zero AI hallucination risk, cross-channel decay calculation, and a daily brief delivering 3–5 ranked deal cards with verbatim evidence.',
        ],
      },
      {
        h: 'What This Demonstrates',
        html: [
          "Research-led problem framing that overturned the team's own starting assumptions. Solution evaluation that hard-eliminates options on legal and architectural grounds. And a product philosophy that draws a permanent line: Signal surfaces context; the founder writes every message.",
        ],
      },
    ],
  },
  {
    slug: 'storeops',
    code: 'PM 106',
    name: 'StoreOps Peak-Hour Decision Support',
    board: 'STOREOPS',
    month: 'FEB 26',
    status: 'PROTOTYPE',
    headline: 'Blinkit dark stores · ₹3.16 Cr/store margin loss surfaced',
    kind: 'Blinkit',
    meta: 'Feb 2026 · Group Project',
    tagline:
      '392 reviews and ground research surfaced ₹3.16 Cr/store annual margin loss, and the one-tap intervention to fix it.',
    summary:
      'Real-time module surfacing live picker status and one-tap interventions during peak hours. Designed to be comprehensible by a stressed store manager in under five seconds.',
    tags: ['Problem Discovery', 'Solution Evaluation', 'Guardrail Design'],
    links: [
      { label: 'Visit live prototype', href: 'https://blinkit-alert-buddy.lovable.app' },
      { label: 'Read the PRD', href: 'PRDs/01_storeops_prd.html' },
    ],
    sections: [
      {
        h: 'The Problem',
        html: [
          "Blinkit's highest-volume dark stores were losing an estimated ₹3.16 crore in annual contribution margin per store because Store Managers had zero real-time visibility into picker activity during the 6–10 PM peak window, which drives up to 50% of daily demand. The data existed centrally, but the people with authority to act on the floor could not access it. This was not a data problem. It was a data-routing problem.",
        ],
      },
      {
        h: 'My Contribution',
        html: [
          'I co-authored the full PRD as part of a 4-person PM squad. The discovery phase drew on 392 AmbitionBox reviews, 11 Reddit first-person accounts, ground journalism, and a primary interview with a dark store manager. We identified the core paradox: the franchise owner outside the store sees real-time picker metrics; the employed Store Manager on the floor sees nothing.',
          'I contributed to persona development, solution evaluation across three options evaluated by temporal intervention point, and the feature specification using MoSCoW prioritization.',
        ],
      },
      {
        h: 'The Solution',
        html: [
          "A real-time StoreOps module extension surfacing live picker status, automated floor alerts, and one-tap interventions during peak hours. No new hardware. No new data. It routes existing Kafka and Newland scanner event data to the SM's device.",
          'Three design principles governed every decision: action-oriented design (alerts must be actionable, not informational), stress-proof clarity (zero training at peak), and zero context switching (extend StoreOps, do not build a separate app).',
        ],
      },
      {
        h: 'What This Demonstrates',
        html: [
          'Problem framing rooted in primary and secondary research, not assumptions. Solution evaluation based on temporal intervention logic, asking not which is easiest to build but which intervenes at the moment a decision can still change the outcome. Guardrail design that anticipates iatrogenic risk. And a North Star metric tied directly to business impact.',
        ],
      },
    ],
  },
  {
    slug: 'bhojan',
    code: 'PM 107',
    name: 'Bhojan',
    board: 'BHOJAN',
    month: 'MAR 26',
    status: 'LIVE',
    headline: 'Weekly meal planner · shipped in 4 days',
    kind: 'Weekly Meal Planner for Indian Families',
    meta: 'Mar 2026 · Individual Sprint',
    tagline:
      'One user interview pivoted the entire product direction. Shipped a working app in 4 days with no prior coding background.',
    summary:
      'A suggestion-first meal planner for vegetarian Indian families. Auto-generates weekly plans with 75+ meals, festival calendar, grocery lists, and WhatsApp sharing. Built in 4 days with zero prior coding experience.',
    tags: ['User Research Pivot', 'Scope Discipline', 'Shipping as Non-Engineer'],
    links: [{ label: 'Visit live site', href: 'https://bhojan-beta.vercel.app' }],
    sections: [
      {
        h: 'The Problem',
        html: [
          'In a joint family of six, the question "aaj kya banayein?" consumed significant mental energy every single day. This was not a five-minute question. It was a cascading decision involving ingredient availability, yesterday\'s meals, dietary restrictions, baby food needs, cooking time, seasonal ingredients, and the festival calendar. That is 1,095 meal decisions annually.',
        ],
      },
      {
        h: 'The Pivotal Insight',
        html: [
          'The first prototype was a traditional weekly planner, a blank 7x3 grid. During a user interview, one piece of feedback changed everything: "I don\'t want to think about what to make next week. Just tell me what to make, and I\'ll say yes or no." This shifted the entire interaction model from planner-first to suggestion-first. The app was recreating the problem it claimed to solve.',
        ],
      },
      {
        h: 'What I Built',
        html: [
          'A fully functional web app with 75+ pre-loaded vegetarian Indian meals, auto-suggest engine with seasonal, effort, and preference filters, family profiles, festival and fasting calendar, smart grocery list with WhatsApp sharing, health analytics, Google Auth, Supabase backend with row-level security, and PWA support. Total infrastructure cost: $0.',
        ],
      },
      {
        h: 'Honest Assessment',
        html: [
          'The suggestion engine is a smart randomizer with filters, not machine learning. 75 meals is enough for 2–3 weeks before repetition becomes noticeable. These limitations are documented because transparency about what is not built is as important as showcasing what works.',
        ],
      },
    ],
  },
];

export const PRINCIPLES = {
  label: 'Safety card',
  title: 'How I think about product',
  lead: 'The best products are built by people who have sat close enough to the mess to know what simple actually takes.',
  items: [
    {
      title: 'Structure before speed.',
      text: 'Most teams rush to solutions before the problem is clear. I frame problems so business, tech, and users can align on them. If you cannot explain the problem in one sentence, you are not ready to build.',
    },
    {
      title: 'Removal is underrated.',
      text: 'The most impactful changes I have delivered were not about adding features. They were about eliminating steps, reducing friction, and simplifying decisions. The customer did not need a better form. They needed fewer forms.',
    },
    {
      title: 'AI is a lever, not a feature.',
      text: "I don't believe in adding AI to products. I believe in understanding user problems deeply, then asking whether AI is the right solution. Sometimes it is. Sometimes a better form field is the answer.",
    },
    {
      title: "Show, don't pitch.",
      text: 'A working prototype beats a deck in ten seconds. With AI, I can build enough to test an idea in an afternoon. I bring working demos into discovery conversations instead of asking people to imagine what I mean.',
    },
  ],
};

// New copy written for this site (flagged for Prateek's review).
export const SITES_PITCH = {
  label: 'Like the flight?',
  title: 'I build sites like this.',
  body: "This whole site, from the 3D flight to the departures board, was designed and built by me with Claude Code. If you want a portfolio that makes people ask how you made it, tell me where you're headed.",
  cta: 'Chart your route',
};

export const CONTACT = {
  label: 'Arrivals',
  title: "Let's connect",
  body: [
    "I'm looking for a PM role where I own problems end-to-end and ship them. Best fit: a team building AI-native products, or one rethinking how their users work because of AI. I bring discovery discipline, and the habit of actually shipping.",
    "If that sounds like your team, let's talk.",
  ],
  book: 'Book a 30-min intro',
};

export const NOTIFY = {
  label: 'Stay in the Loop',
  title: 'Get a heads-up when I ship something new',
  body: 'I send a short note when I ship a new product, finish a case study, or write something worth reading. No fixed cadence, usually once every few weeks at most.',
  placeholder: 'your@email.com',
  button: 'Notify me',
  busy: 'Adding you…',
  note: 'Your email stays with me. No spam, ever.',
  success: "You're on the list.",
  successSub: "I'll be in touch when there's something worth sharing.",
  already: "You're already on the list. Thanks for being early.",
};

export const FOOTER = {
  credit: 'Designed and built by Prateek with Claude Code.',
  fieldGuides: { label: 'Explore the Field Guides', href: 'field-guides/' },
  comic: { label: 'Read the origin comic', href: 'comic/' },
};

export const COMIC = {
  title: 'Before the products. The real story.',
  lead: 'Eight years untangling enterprise systems. The moment AI changed what was possible. The call I made when my kid was one and a half.',
  pages: [
    'The City of Friction. Prateek walks through a city of broken systems where users struggle with endless form fields, forgotten passwords, 60-minute support queues, and managers drowning in five open spreadsheets.',
    'The Notebook. Prateek catalogues recurring pain points across nine sticky notes, then discovers AI as a potential helper and decides the first step is to start with users.',
    "First Rule. Prateek and his AI sidekick go out to listen, interviewing a delivery rider, an office manager, a shop owner, a student, and a parent, learning that people don't need more features, they need less friction.",
    'From Chaos to Clarity. Prateek maps a problem-to-solution-to-impact framework on a whiteboard, then works through journey mapping, ruthless prioritization, and persona-based design for three real users.',
    'The Giant Knot. Prateek examines a tangled mass of forms, approvals, tickets, and data silos, then works through four steps: observe everything, question assumptions, find the leverage, and pull the one thread that unravels the rest.',
    'First Product. Prateek picks one painful workflow, designs a simple solution, builds the minimum viable version, tests it with real users, iterates, and ships Version 0.1: just enough to help.',
    'Launch Day. Prateek ships quietly with no marketing, faces silence and zero sign-ups, then gets one user who says the tool saved her time, and treats that single win as enough reason to keep building.',
    "Epilogue. Prateek looks out over a city where users save time, teams move faster, and businesses grow, with a reminder that small is not a limitation, it's a starting point.",
    'Final epilogue. Prateek works late into the night as the impact spreads, the team grows, the product evolves, and the mission stays constant: human purpose, AI leverage, and beginning again every time a new problem arrives.',
  ],
};

// Prefix a site-relative path with the deploy base. External URLs pass through.
export function href(path) {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return SITE.base + path.replace(/^\//, '');
}
