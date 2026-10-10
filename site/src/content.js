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
  eyebrow: 'Open to PM roles · Mumbai',
  claim: 'Product Manager who builds with AI.',
  intro: "I fixed systems across banking and insurance. Then I quit to see what AI made possible. Here's the flight.",
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

// All four sit on the cockpit gauges; `hero` ones also open the page.
export const STATS = [
  { value: '8+', label: 'Years in business analysis & ops', hero: true },
  { value: '180+', label: 'Research data points' },
  { value: '30%', label: 'Avg efficiency gain' },
  { value: '7', label: 'AI products built in 2026', hero: true },
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
// `pull` is the last line of a stop (or the leg caption's line): it sets up
// the next stop. `stamp` is the passport stamp that stands in for `org` on the
// home page: `logo` names a file in src/stamps/, `text` is a typeset stamp
// where no clean official vector exists, `mask` is a raster logo used as a
// one-ink mask. `org` stays for the read page.
export const SEGMENTS = [
  {
    id: 'mumbai',
    beat: 'mumbai-a',
    city: 'BOM',
    years: '2012 to 2017',
    label: 'Mumbai',
    title: 'My first job was finding the cracks.',
    role: 'BE (Information Technology)',
    org: 'Mumbai University / Ramrao Adik Institute of Technology',
    stamp: { text: ['University', 'of Mumbai'], rim: 'RAIT', name: 'University of Mumbai, Ramrao Adik Institute of Technology' },
    body: ['An IT degree from Mumbai University, then TCS as a tester. Thinking like a user, finding the cracks. That instinct stayed.'],
    pull: 'Finding them was the easy part.',
  },
  {
    id: 'tcs',
    beat: 'mumbai-b',
    city: 'BOM',
    years: '2017 to 2022',
    label: 'Mumbai',
    title: 'I cared more about the person than the system.',
    role: 'Tester, then IT Business Analyst',
    org: 'Tata Consultancy Services · Mumbai',
    stamp: { logo: 'tcs', name: 'Tata Consultancy Services' },
    clients: {
      label: 'Clients · via TCS',
      items: [
        { logo: 'citi', name: 'Citi' },
        { text: ['ICICI', 'Prudential'], name: 'ICICI Prudential' },
      ],
    },
    body: [
      'On the ICICI Prudential and Citibank Singapore accounts, the changes that landed removed complexity instead of adding features.',
    ],
    metrics: [
      { value: '~90%', label: 'less drop-off after digitised onboarding (est.)' },
      { value: '1,200 hrs', label: 'of manual testing cut a year' },
    ],
    quote: 'aruna',
  },
  { id: 'leg-1', beat: 'leg-1', leg: true, from: 'BOM', to: 'IXW', year: '2022', pull: 'Five years in, I went back to school.' },
  {
    id: 'jamshedpur',
    beat: 'jamshedpur',
    city: 'IXW',
    years: '2022 to 2023',
    label: 'Jamshedpur',
    title: 'In as an analyst. Out as a manager.',
    role: 'MBA, PGDM (General Management)',
    org: 'XLRI Jamshedpur',
    stamp: { logo: 'xlri', name: 'XLRI Jamshedpur' },
    body: ['One year at XLRI that sharpened the thinking.'],
    metrics: [
      { value: '#1', label: 'in my batch, AOL functional knowledge exam' },
      { value: 'CWC', label: 'Corporate Workshop Committee member' },
    ],
  },
  { id: 'leg-2', beat: 'leg-2', leg: true, from: 'IXW', to: 'MAA', year: '2023', pull: 'Chennai, where I learned what comes before automation.' },
  {
    id: 'chennai',
    beat: 'chennai',
    city: 'MAA',
    years: '2023 to 2025',
    label: 'Chennai',
    title: "You can't automate a mess.",
    role: 'Manager, Process Standardization',
    org: 'Standard Chartered GBS · Chennai',
    stamp: { logo: 'standard-chartered', name: 'Standard Chartered GBS' },
    body: [
      'So I split client communication into rules and judgment calls, standardised it across the top 5 markets, and only then automated.',
    ],
    metrics: [
      { value: '30 FTE', label: 'of manual work automated away' },
      { value: '50%', label: 'fewer manual touchpoints in rate booking' },
    ],
  },
  { id: 'leg-3', beat: 'leg-3', leg: true, from: 'MAA', to: 'BOM', year: '2025', pull: "Home to Mumbai. Five countries that couldn't all match." },
  {
    id: 'marsh',
    beat: 'mumbai-dusk',
    city: 'BOM',
    years: '2025',
    label: 'Mumbai',
    title: 'Not everything should be identical.',
    role: 'Senior Manager, Business Analysis',
    org: 'Marsh McLennan India · Mumbai',
    stamp: { logo: 'marsh-mclennan', name: 'Marsh McLennan India' },
    body: [
      'I harmonised one process across 5 EU countries by keeping what regulation required and cutting what was just legacy habit.',
    ],
    metrics: [
      { value: '~30%', label: 'less effort, year-end premium adjustment' },
      { value: '20+', label: 'countries in one data-capture model' },
    ],
    quote: 'ewa',
    pull: 'Eight years in, I kept seeing the same pattern.',
  },
  {
    id: 'turn',
    beat: 'turn',
    city: 'BOM',
    years: '2025',
    label: 'The turn',
    title: 'Nobody had built the alternative yet.',
    body: [
      'Capable people spent days on tasks AI could handle in minutes. Not because anyone chose that.',
      'So I quit my job to learn what was actually possible. My kid was one and a half.',
    ],
    pull: 'So, what was possible?',
  },
  {
    id: 'cockpit',
    beat: 'cockpit',
    city: 'BOM',
    years: '2026',
    label: "Captain's seat",
    title: 'Turns out, quite a lot.',
    role: 'AI-first Mastering Product Management 2.0, Cohort 7',
    org: 'Rethink Systems',
    stamp: { mask: 'rethink', ratio: 436 / 212, name: 'Rethink Systems' },
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
    body: ['Seven built in 2026. All boarding now.'],
  },
];

// `excerpt` is a verbatim span of `text` (cuts marked with …) for the home
// cards; the read page shows the full `text`.
export const TESTIMONIALS = {
  aruna: {
    name: 'Aruna Rajagopalan',
    role: 'Vice President, Citi',
    context: 'On the Citibank Singapore account during TCS tenure',
    text: 'I had the pleasure of managing Prateek during his tenure on Citi projects as a Business Analyst, and highly recommend him for his professionalism and strong work ethic. His positive attitude stands out and makes him a delight to work with.',
    excerpt: 'His positive attitude stands out and makes him a delight to work with.',
  },
  ewa: {
    name: 'Ewa Leszczyna',
    role: 'Broker / Client Executive, Marsh McLennan',
    context: 'On the Year-End Premium Adjustment harmonization across 5 EU countries',
    text: 'From the very beginning, he stood out for his exceptional ability to understand complex operations and break them down into clear, workable components. He consistently ensured that every feature we explored addressed a real and specific challenge, which made the direction of the project both meaningful and well-aligned with user expectations.',
    excerpt: '…exceptional ability to understand complex operations and break them down into clear, workable components.',
  },
  ravi: {
    name: 'K Ravi Kiran',
    role: 'PM, Broadcom',
    context: 'On the AI-first MPM Cohort 7 at Rethink Systems',
    text: "Prateek was someone who just got things done: no waiting around for permission or a perfect plan. When we were still figuring out what to even try, he'd already started building. He was one of the first in our cohort to dive into tools like Claude and Lovable, and he brought the same energy to leading discussions as he did to implementation. On top of that, he kept everything documented in a way that actually helped the rest of us stay aligned. Rare to find someone who's both a starter and a structurer.",
    excerpt: "When we were still figuring out what to even try, he'd already started building.",
  },
};

// Departures board order is the array order. `opener` is the 3-line manifest
// under each case study's boarding pass (and on the read page); `tagline` is
// the page's meta description.
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
    opener: {
      problem: '35% of planned group trips never happen. They die in the WhatsApp chaos before anyone books.',
      did: '132+ research data points (27 interviews, 105 surveys), then built it solo in 8 days.',
      result: '91.7% member activation in production.',
    },
    tags: ['Primary Research', 'Problem Framing', 'Zero-to-One Shipping'],
    image: 'products/plan-karo-chalo.jpg',
    links: [
      { label: 'Visit live site', href: 'https://plankarochalo.vercel.app' },
      { label: 'Read the PRD', href: 'PRDs/04_plankarochalo_prd.html' },
    ],
    sections: [
      {
        h: "Trips don't die at booking. They die at dates.",
        html: [
          'Dates never align, destination debates go in circles, and one organiser carries all of it. Booking tools arrive too late: the gap is between "let\'s go somewhere" and "everything\'s booked."',
        ],
      },
      {
        h: 'The research killed my first guess.',
        html: [
          "I assumed itinerary building was the pain. It wasn't. Date alignment was the #1 friction for 80%+ of respondents, and 35% of dead trips died on dates alone.",
        ],
        stats: [
          { value: '27', label: 'interviews' },
          { value: '105', label: 'survey responses' },
          { value: '80%+', label: 'say dates are the #1 friction' },
        ],
      },
      {
        h: 'One link. No app. Ten seconds to start.',
        html: [
          'The group moves through dates, budget, destination and commitment on one shared dashboard. Members never download anything.',
          'Four feature categories were cut on research grounds: expense splitting, booking, in-app chat and AI recommendations.',
        ],
        list: [
          '<strong>Tap-to-select calendar</strong> with auto-overlap.',
          '<strong>Anonymous budget slider</strong> that finds the group sweet spot.',
          '<strong>Destination voting</strong> with a shake-to-decide tiebreak.',
          '<strong>Hold-to-confirm</strong> commitment checkpoint.',
          '<strong>Nudge library</strong> with 6 tone variants.',
        ],
      },
      {
        h: 'The numbers from production',
        stats: [
          { value: '91.7%', label: 'member activation rate' },
          { value: '85.2%', label: '48-hour response rate' },
          { value: '1.5 days', label: 'average time to lock dates (target: 5)' },
          { value: '54.1%', label: 'return visit rate (target: 30%)' },
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
    opener: {
      problem: 'Aspiring PMs have no readiness signal. 84% get no feedback, or only vague feedback.',
      did: 'A 38-person survey and 6 interviews, then a 3-stage AI-scored platform.',
      result: 'Live, with all 7 Must-haves shipped: a Ready / Almost / Not Yet read against any real JD.',
    },
    tags: ['AI-Scored Practice', 'Adaptive Engine', 'Honest Scoring'],
    links: [
      { label: 'Visit live site', href: 'https://pmpathfinder-psi.vercel.app/' },
      { label: 'Research survey', href: 'https://pm-readiness-survey.vercel.app' },
      { label: 'Read the PRD', href: 'PRDs/03_pmpathfinder_prd.html' },
    ],
    sections: [
      {
        h: 'Engineers have LeetCode. PMs have nothing.',
        html: [
          "You can finish every course and still not know whether you'd pass an interview. Apply too early and a failed interview can mean a 12-month cooldown.",
        ],
        stats: [
          { value: '84%', label: 'get no or vague feedback' },
          { value: '1 in 38', label: 'gets specific feedback regularly' },
          { value: '12 months', label: 'cooldown after a failed interview' },
        ],
      },
      {
        h: 'They lacked signal, not skill.',
        html: [
          "Consultants with 7+ years, engineers who'd shipped at scale, designers who'd led UX for millions: all stuck in prep limbo. Three personas emerged (Domain Expert, Tech Switcher, MBA/Strategy Transitioner), and all three shared one problem: no way to know where they stood.",
        ],
      },
      {
        h: 'Three stages, one honest answer.',
        list: [
          '<strong>Archetype quiz.</strong> 12 scenarios in 10 minutes, ending in Consumer, B2B or Technical.',
          '<strong>Adaptive practice</strong> across 6 PM dimensions. A five-slot engine warms you up, then goes for your weakest areas.',
          "<strong>Real-job gap analysis.</strong> Paste any JD and get Ready / Almost / Not Yet, plus what to fix and how long it will take. <small>Why buckets, not a score? A 7.3 vs a 6.8 doesn't tell you what to do. Each bucket forces a next action.</small>",
        ],
      },
      {
        h: "Scoring that doesn't flatter.",
        html: [
          'The AI evaluator uses the same rubric at 2am and 2pm, tuned against inflation: 5 = on track, 7 = genuinely strong, 9 to 10 = would impress a senior PM interviewer.',
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
    opener: {
      problem: 'Women new to a city, or whose circle has thinned, have no good tool for finding real friends.',
      did: 'Led discovery, wrote the PRD, designed every page and ran QA on a 6-person Buildathon team.',
      result: 'Blank page to a Product Hunt launch in 4 days.',
    },
    tags: ['Safety-First Design', 'Scope Discipline', 'Systems Thinking'],
    image: 'products/galpal.jpg',
    links: [
      { label: 'Visit live site', href: 'https://galpal.in/' },
      { label: 'Read the PRD', href: 'PRDs/05_galpals_prd.html' },
    ],
    sections: [
      {
        h: 'Dating apps are the wrong context. Professional networks are the wrong intent.',
        html: [
          'Interest groups solve for the group, not the individual. The gap is a product that takes safety seriously, respects time, and gets out of the way once two people click.',
        ],
      },
      {
        h: 'What I owned',
        html: [
          "Discovery, the full PRD (what made the cut and what didn't), every page's visual design and UX flows, and end-to-end QA. One teammate owned development; the rest of the team pitched in on testing and strategy.",
        ],
      },
      {
        h: 'No feed. No groups. No games.',
        html: [
          "Every member passes a human-led video or phone verification before seeing matches. Each week brings a small scored set of nearby women, each with a reason you'd click. A wave with a preset reason, or 100 characters, opens the door; mutual waves open a chat.",
        ],
        stats: [
          { value: '3', label: 'lifetime waves to one person' },
          { value: '30 days', label: 'until a wave expires' },
          { value: '100', label: 'characters per wave' },
        ],
      },
      {
        h: 'Slower on purpose.',
        list: [
          '<strong>Manual verification.</strong> Automating it would be faster, and would kill the safety promise that sets galpals apart.',
          '<strong>PWA over native.</strong> Easier to try, faster to iterate, no app-store gatekeeping.',
          '<strong>Matching on what predicts friendship,</strong> not popularity: interests, neighbourhood, city tenure, personality.',
        ],
      },
      {
        h: 'Easier to find a friend, not harder to leave.',
        html: [
          'Second person always. 14-word sentence cap. No emoji in system copy. Banned words: journey, tribe, vibes, community, seamless, authentic, curated.',
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
    headline: '669 ideas, 4 languages, one a day',
    kind: 'A Daily Reading Practice in English and Hindi',
    meta: 'Sep 2026 · Solo build',
    tagline: 'One meaningful thought. One small action. Every day.',
    opener: {
      problem: 'Feeds give endless information and almost nothing that stays.',
      did: 'Built a daily practice: one idea, what it means, and one small action, in 4 languages.',
      result: '669 hand-picked ideas, launched September 2026.',
    },
    tags: ['Distribution Before Monetization', 'Demand Before Rails', 'Local-First Privacy'],
    links: [
      { label: 'Visit live app', href: 'https://the-awakening-quotes-app.vercel.app/' },
      { label: 'What it measures and why', href: 'https://the-awakening-quotes-app.vercel.app/metrics.md' },
    ],
    sections: [
      {
        h: 'One sentence can change a day. Feeds bury it.',
        html: [
          "Social media gave me endless information and almost nothing that stayed. Every so often, though, one sentence changed how I handled a conversation or a hard decision. I wanted a place where ideas weren't buried under algorithms.",
        ],
      },
      {
        h: 'One idea, three layers.',
        html: [
          '<strong>The thought</strong> (a line worth rereading), <strong>the meaning</strong> (why it matters), <strong>the practice</strong> (one small action for today). Tap "I did it" when you have. That tap is the whole point.',
        ],
        stats: [
          { value: '669', label: 'ideas, chosen by hand' },
          { value: '4', label: 'languages, Hindi in Devanagari' },
          { value: '3', label: 'WhatsApp card styles' },
        ],
      },
      {
        h: 'What It Refuses To Do',
        html: [
          'No feed, no engagement algorithm, no ads, no account. It works offline after the first visit, and favourites and notes never leave your phone.',
        ],
      },
      {
        h: 'Four rules I held to.',
        list: [
          '<strong>Distribution before monetization.</strong> The share card is the growth engine, so the craft went there first.',
          '<strong>Demand before rails.</strong> Payments get built only if 20% of the first 50+ premium visitors ask for it.',
          '<strong>Measure without watching.</strong> Cookieless, anonymous analytics, and a public metrics doc.',
          "<strong>Kill what can't ship.</strong> A promised widget died when the platform couldn't deliver it, and the copy was fixed the same day.",
        ],
      },
      {
        h: "Our son's name, and the value behind it.",
        html: [
          "When our son was born, we named him Hitaarth: Sanskrit for one whose purpose is to do good. The app isn't a tribute to him. It's named after the value I hope we both grow into.",
        ],
      },
      {
        h: 'One person, zero dependencies.',
        html: ['A small product experiment, run in public, in vanilla HTML, CSS and JavaScript with no build step.'],
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
    headline: "Tells founders who they're about to lose",
    kind: 'Intelligence Layer for Founder CRM',
    meta: 'Mar 2026 · Group Project',
    tagline:
      "Six founder interviews surfaced the insight that broke the team's starting hypothesis and reshaped the entire product.",
    opener: {
      problem: 'CRMs are built for salespeople. Early-stage founders lose deals to silence, not rejection.',
      did: 'Co-authored the PRD after 6 founder interviews and 80+ sources on CRM adoption.',
      result: "A prototype that reads a founder's channels and ranks 3 to 5 deals to act on each day.",
    },
    tags: ['Research-Led Reframing', 'Assumption Testing', 'Architectural Thinking'],
    links: [
      { label: 'Visit live prototype', href: 'https://signalaicrm.lovable.app' },
      { label: 'Read the PRD', href: 'PRDs/02_signal_crm_prd.html' },
    ],
    sections: [
      {
        h: "Deals don't die from rejection. They die from silence.",
        html: [
          "The $73.4B CRM market serves professional salespeople. Founders don't lack data; nothing reads it and tells them what to do next.",
        ],
      },
      {
        h: 'The interview that broke our hypothesis',
        html: [
          "One founder had four years of enforced HubSpot use and complete pipeline visibility, and still lost deals. Visibility wasn't the answer. Prioritisation was: which conversation, why now, with what context.",
        ],
      },
      {
        h: '"It reads my inbox and tells me who I\'m about to lose."',
        html: [
          'Signal reads email, calendar, WhatsApp Business, LinkedIn and Zoom in the background, flags open commitments and fading deals, and ranks a daily brief. A 4-state deal model and rule-based extraction keep hallucination risk at zero.',
          'Signal surfaces context; the founder writes every message.',
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
    opener: {
      problem: "Blinkit store managers can't see their pickers during the 6 to 10 PM peak.",
      did: 'Co-authored the PRD in a 4-person PM squad, from 392 reviews, 11 first-person accounts and a store-manager interview.',
      result: 'Surfaced an estimated ₹3.16 Cr per store in annual margin loss, plus a one-tap fix.',
    },
    tags: ['Problem Discovery', 'Solution Evaluation', 'Guardrail Design'],
    links: [
      { label: 'Visit live prototype', href: 'https://blinkit-alert-buddy.lovable.app' },
      { label: 'Read the PRD', href: 'PRDs/01_storeops_prd.html' },
    ],
    sections: [
      {
        h: 'Not a data problem. A data-routing problem.',
        html: ['The franchise owner outside the store sees live picker metrics. The store manager on the floor sees nothing.'],
        stats: [
          { value: '₹3.16 Cr', label: 'margin lost per store, per year (est.)' },
          { value: 'Up to 50%', label: 'of daily demand in the 6 to 10 PM peak' },
          { value: '392', label: 'reviews analysed' },
        ],
      },
      {
        h: 'What I worked on',
        html: ['Persona development, evaluating three solution options by when each one intervenes, and the MoSCoW feature spec.'],
      },
      {
        h: 'No new hardware. No new data.',
        html: [
          "A StoreOps extension that routes existing Kafka and scanner events to the manager's device: live picker status, floor alerts, one-tap interventions. Designed to be read by a stressed manager in under 5 seconds.",
          'We picked the option that intervenes while a decision can still change the outcome, not the easiest one to build.',
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
    opener: {
      problem: '"Aaj kya banayein?" In a joint family of six, that\'s 1,095 meal decisions a year.',
      did: 'Built a suggestion-first planner after one interview flipped the design.',
      result: 'Shipped in 4 days on $0 infrastructure, with no prior coding background.',
    },
    tags: ['User Research Pivot', 'Scope Discipline', 'Shipping as Non-Engineer'],
    links: [{ label: 'Visit live site', href: 'https://bhojan-beta.vercel.app' }],
    sections: [
      {
        h: '"Aaj kya banayein?"',
        html: [
          "Never a five-minute question: ingredients, yesterday's meals, diets, baby food, cooking time, the season, the festival calendar.",
        ],
      },
      {
        h: 'One interview flipped the product.',
        html: [
          '"I don\'t want to think about what to make next week. Just tell me what to make, and I\'ll say yes or no." My blank 7x3 grid was recreating the problem it claimed to solve.',
        ],
      },
      {
        h: 'What shipped in 4 days',
        html: [
          'Auto-suggest by season, effort and preference; family profiles; a festival and fasting calendar; grocery lists that share to WhatsApp; Google sign-in; Supabase with row-level security; PWA support.',
        ],
        stats: [
          { value: '75+', label: 'vegetarian meals' },
          { value: '4 days', label: 'to ship' },
          { value: '$0', label: 'infrastructure' },
        ],
      },
      {
        h: 'Honest Assessment',
        html: [
          "The engine is a smart randomiser with filters, not machine learning. 75 meals last 2 to 3 weeks before repeats show. I document what isn't built as carefully as what works.",
        ],
      },
    ],
  },
];

export const PRINCIPLES = {
  label: 'Safety card',
  title: 'Four rules I fly by.',
  items: [
    {
      title: 'Structure before speed.',
      text: "If you can't explain the problem in one sentence, you're not ready to build.",
    },
    {
      title: 'Removal is underrated.',
      text: "The customer didn't need a better form. They needed fewer forms.",
    },
    {
      title: 'AI is a lever, not a feature.',
      text: "Understand the problem first. Then ask whether AI is the answer. Sometimes it isn't.",
    },
    {
      title: "Show, don't pitch.",
      text: 'A working prototype beats a deck in ten seconds.',
    },
  ],
};

export const SITES_PITCH = {
  label: 'Like the flight?',
  title: 'I build sites like this.',
  body: 'I designed and built this one with Claude Code, 3D flight and all. Want a site that makes people ask how?',
  cta: 'Chart your route',
};

export const CONTACT = {
  label: 'Arrivals',
  title: 'Looking for a PM who ships?',
  body: [
    'I want to own problems end to end and ship them. Best fit: a team building AI-native products, or rethinking how its users work because of AI.',
    "If that's your team, let's talk.",
  ],
  book: 'Book a 30-min intro',
};

export const NOTIFY = {
  label: 'Stay in the Loop',
  title: 'Get the next one first.',
  body: 'A short note when I ship something new. Every few weeks at most.',
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
