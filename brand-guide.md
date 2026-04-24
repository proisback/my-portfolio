# galpal — Brand Guide

> Warm paper. Real women. Real life. No swipes.

---

## Visual Idea

One sentence: **galpal looks like your best friend's scrapbook, not an app.**

Every screen borrows from the physical world — polaroid photos held down by washi tape, postcards slipped under doors, torn paper edges between sections, ink-drawn doodles in margins. The UI feels handmade on purpose: imperfect angles, slight tilts, paper grain on every surface. The counterpoint is typographic precision — a single font, tightly tracked, italic for warmth. The result reads as warmth with intention, not chaos.

**Rule:** If it looks like it could be on a SaaS dashboard, it doesn't belong here. Every element should feel like it was cut, stamped, or written by hand.

---

## Typography

Single font family throughout both surfaces. Weight and style differentiate roles — not typeface switching.

### Fonts

**Sora** (Google Fonts) — geometric sans with rounded terminals that reads warm without being childish. Used at all sizes, all contexts.

- 400 — body copy, descriptions, secondary UI
- 500 — nav links, labels, medium-weight UI
- 600 — CTA text, semi-bold emphasis
- 700 + italic — wordmark, section headlines, hero display, pull moments

```tsx
// layout.tsx
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
});
```

Utility classes:
- `font-display` — `font-family: var(--font-sora); letter-spacing: -0.02em;`
- `font-nunito` — alias for `var(--font-sora)` (legacy name retained)
- `font-mono` — alias for `var(--font-sora)` (mono contexts use same font)

**Icon font:** Material Symbols Outlined — loaded via CDN. Used for UI icons in the app surface alongside Lucide (Lucide preferred for nav).

### Type Scale

| Context | Weight | Size | Style | Tracking |
|---------|--------|------|-------|----------|
| Hero headline | 500 | clamp(40px, 11vw, 96px) | normal | -0.035em |
| Section display headline | 700 | clamp(34px, 6vw, 60px) | italic | -0.03em |
| Card titles | 700 | 18px | normal | -0.01em |
| Step cards heading | 700 | 22px | normal | -0.01em |
| Body / descriptions | 400–500 | 15.5–19px | normal | 0 |
| Button text | 600 | 13–17px | normal | 0.005em |
| Eyebrow / section labels | 700 | 11px | normal | 0.14–0.18em |
| Nav links | 500 | 14px | normal | 0.005em |
| Mobile drawer nav | 700 | 26px | normal | -0.02em |
| Tiny metadata | 400–500 | 11–12.5px | — | 0 |
| Postcard/textarea text | 700 | 19px | normal | -0.005em |
| Wordmark | 700 | context-dependent | italic | -0.025em |

---

## Colors

### Surface Hierarchy

Surfaces stack from warm floor up to floating white. No dark mode — light warm theme only.

| Token | Value | Role |
|-------|-------|------|
| `--color-cream` | `#F5EFE1` | Page background (floor) |
| `--color-warm` | `#F9F3E5` | surface_container_low |
| `--color-surface-mid` | `#F3EDDF` | surface_container (shimmer base) |
| `--color-ivory` | `#FDFBF4` | Elevated paper — cards, panels |
| `--color-white` | `#FFFFFF` | Floating — modals, popovers |

Theme color (meta viewport): `#F5EFE1`

### Brand Tokens

| Token | Value | Role |
|-------|-------|------|
| `--color-charcoal` | `#1F1A1D` | Primary action, CTAs, ink, nav FAB |
| `--color-marigold` | `#F5C94C` | Reward / earned moments only |
| `--color-marigold-soft` | `#FFF0B3` | Marigold tint/glow |

### Ink

| Token | Value | Role |
|-------|-------|------|
| `--color-ink` | `#1F1A1D` | Primary text |
| `--color-ink-secondary` | `#6B6257` | Labels, descriptions, secondary text |
| `--color-ink-disabled` | `#A09687` | Placeholders, timestamps, disabled |

### Stitch Pastel System (5 accents)

Each pastel has a `chip` (richer) and `soft/wash` (diluted background) variant. Used as category accents and card washes — not brand colors.

| Name | Chip | Soft/Wash | Category |
|------|------|-----------|----------|
| Peach | `#F7D4C3` | `#FDEEE8` | creative, food |
| Mint | `#D6E4C8` | `#EEF5E6` | fitness |
| Sky | `#D0DAE8` | `#E8EDF5` | social |
| Butter | `#F5E4B8` | `#FBF4DC` | workshop |
| Lilac | `#DDD1E6` | `#F0EBF5` | networking |

### Border

`--color-border: #CEC4C8` — always applied at 15% opacity for inputs (`rgba(206, 196, 200, 0.15)`). Never full opacity.

### Marigold Rule

Marigold (#F5C94C) is a **reward color only**. It appears on:
- Active state dot above bottom nav icons
- Active chat FAB indicator
- Ink-draw decorative stars/circles in hero
- Golden ring pulse on match reveal
- Confetti accent color

**Cap:** Max 5% of any screen. Never as a large fill or background.

### Semantic (Status)

| Token | Derivation | Usage |
|-------|------------|-------|
| Success / online | `rgba(105, 178, 120, -)` | Online presence dot |
| Error / danger | Terracotta `#F4A89A` / deep `#A64A3A` | Error states, danger badge |
| Warning | Butter system | Warning states |
| Info | `#5E8BA8` | Informational |

### Shadows

All shadows use charcoal `rgba(31,26,29,x)` base — never pure black.

| Name | Value | Usage |
|------|-------|-------|
| `--shadow-paper` | `0 12px 32px rgba(31,26,29,0.06)` | Cards resting |
| `--shadow-paper-hover` | `0 16px 48px rgba(31,26,29,0.10)` | Card hover |
| `--shadow-float` | `0 24px 64px rgba(31,26,29,0.12)` | Dialogs, modals, FABs |

---

## Logo

```
galpal
```

- Font: Sora 700, italic
- Color: #1F1A1D (charcoal)
- Letter spacing: -0.025em
- Line height: 1
- No icon. No symbol. Wordmark only.
- Always lowercase. Never capitalized. Never all-caps.

| Context | Size |
|---------|------|
| Nav (desktop + mobile) | 24px |
| Footer | 28px |
| Standalone headers | flexible, 26px default |

**Favicon:** `/brand/wordmark.svg` (SVG), plus 192x192 and 512x512 PNG variants for PWA.

**PWA name:** "galpal"

---

## Shape / Radius

Shapes read as soft and hand-cut. No sharp corners anywhere.

| Element | Radius |
|---------|--------|
| Primary CTA buttons | 28px |
| Pill buttons / badges / nav FAB | 999px |
| Cards | 20px |
| Modals / sheets | 24px |
| Avatars | 50% (full circle) |
| Step cards | 24px |
| Category chips | 999px |
| Feedback postcard | 20–22px |
| Focus rings | 6px |

---

## Icons

- **Primary library:** Lucide (for nav and app UI)
- **Secondary library:** Material Symbols Outlined (for in-content icons)
- **Size:** 22px default, 24px for FAB/primary actions
- **Stroke:** 2px default, 2.25px active
- **Color:** inherits from text color (`text-charcoal` active, `text-ink-disabled` rest)
- Active state: slightly heavier stroke + marigold dot indicator above (not on icon itself)

---

## Spacing

8px base grid. All values are multiples.

| Value | Use |
|-------|-----|
| 4px (0.5×) | Tight gaps, icon-to-label |
| 8px (1×) | Compact inner padding |
| 12px (1.5×) | Button padding-y, chip padding |
| 16px (2×) | Card internal padding, section gaps |
| 20px (2.5×) | Page horizontal padding (mobile) |
| 24px (3×) | Modal padding, step card padding |
| 28px (3.5×) | Drawer horizontal padding |
| 32px (4×) | Footer bottom padding |
| 40px (5×) | Section vertical padding (standard) |
| 64px (8×) | Major section padding, footer top |
| 80–112px (10–14×) | Large section vertical rhythm |

---

## Visual Texture

### 1. Global paper grain (body)

Fractal noise, 0.018 opacity, fixed to viewport, pointer-events none. Applied via `body::before`. Universal across all screens.

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.018;
  background-image: url("data:image/svg+xml,...fractalNoise baseFrequency='0.65' numOctaves='3'...");
}
```

### 2. Section paper grain (`.paper-grain`)

Denser grain on specific sections (Hero, How It Works). 0.035 opacity via `::after`, `mix-blend-mode: multiply`. Applied with utility class `paper-grain`.

### 3. Ink highlight (`.ink-highlight`)

Butter-tinted highlight under key words in headlines. Skewed -4deg, rotated -0.8deg. Color is configurable via `--ink-tint` CSS variable.

```css
/* Default: --ink-tint: #F5E4B8 (butter) */
/* How It Works headline: --ink-tint: #DDD1E6 (lilac) */
```

### 4. Paper edges (`PaperEdge`)

SVG-based torn / wavy / scalloped edges between sections. Variants: `torn`, `wavy`, `scalloped`. Heights: 32–40px. Color matches the adjacent section background.

### 5. Washi tape (`.washi`)

14px × 38px decorative strips. Rotated via `--washi-rotate`. Color via `--washi-color`. Edge texture via repeating gradient `::before`/`::after`. Used on polaroid tops and how-it-works step cards.

Colors: peach `#F7D4C3`, butter `#F5E4B8`, mint `#D6E4C8`, lilac `#DDD1E6`, sage `#B7D6BE`

### 6. Polaroids

White paper photo frames with caption below. Washi tape across top. Slight tilt, paper-sway animation, parallax group behavior on desktop. Hover lifts +6px with increased shadow.

---

## Animation

### Principles

1. Motion confirms action and creates the handmade paper-world illusion — never decorative for its own sake.
2. Entries ease out hard (`cubic-bezier(0.16, 1, 0.3, 1)`) — snappy start, soft landing.
3. Idle animations (sway, float, flicker) run slow (4–8s cycles) so they feel like breathing, not fidgeting.
4. All animations respect `prefers-reduced-motion: reduce` — collapsed to 0.01ms, no exceptions.

**Standard ease:** `cubic-bezier(0.16, 1, 0.3, 1)`
**Spring/overshoot (nav tap, emoji pop):** `cubic-bezier(0.34, 1.26, 0.64, 1)`
**Draw/ink:** `cubic-bezier(0.22, 1, 0.36, 1)`

### Keyframe Inventory

| Keyframe | Duration | Use |
|----------|----------|-----|
| `stagger-enter` | 0.45s | Section cascade reveals (d1–d5, 80ms steps) |
| `card-bloom` | 0.42s | Match/event card entrance (scale 0.94 → 1) |
| `fade-up` | 0.4s | General content reveal (translateY 12px → 0) |
| `paper-sway` | 6s infinite | Polaroid/card gentle idle sway |
| `float-drift` | 8s infinite | Floating elements (8s cycle) |
| `float-slow` | — | Slower variant with `--r` rotation |
| `shimmer` | 1.5s infinite | Skeleton loading state |
| `wave-ripple` | 0.6s | Wave send feedback burst |
| `wave-sweep` | — | Clip-path sweep reveal |
| `correct-bounce` | 0.4s | Correct answer feedback scale |
| `pulse-soft` | 2s infinite | Soft opacity pulse |
| `circle-pulse` | 2s infinite | Ripple circle (scale 1→1.8, opacity 0.5→0) |
| `sparkle-drift` | 1.5s | Sparkle drift up and fade |
| `ink-draw` | 1.8s | SVG stroke-dashoffset draw animation |
| `golden-ring-pulse` | — | Marigold box-shadow pulse on match |
| `confetti-fall` | — | Confetti piece fall+rotate |
| `heartbeat-double` | 2.6s infinite | Double heartbeat (1.32× → 1 → 1.18× → 1) |
| `reveal-burst` | 0.55s | Match reveal state transition |
| `slide-off-right` | 0.26s | Nudge dismiss sweep |
| `flame-flicker` | 1.8s infinite | Chat streak flame (asymmetric tremor) |
| `balloon-rise` | 1.4s | Heart reaction drift upward |
| `ribbon-shimmer` | 3.4s infinite | Diagonal sheen on streak ribbon |
| `letter-drop` | 1.3s | New message inbox: envelope falls and fades |
| `bubble-receive` | 0.42s | Bubble catches the landed message |
| `row-arrival-tint` | 1.8s | Inbox row terracotta tint on new message |
| `envelope-flutter` | 4.5s infinite | Unread envelope: subtle tilt every 4.5s |
| `unread-breathe` | 2.1s infinite | Unread count dot: scale + marigold ring |
| `ember-drift` | 2.2s infinite | Tiny sparks off streak flame |
| `bubble-pop` | 0.32s | Chat message lands (translateY 6 + scale 0.96 → 1) |
| `picker-pill-in` | 0.26s | Reaction picker pill scales in (80ms delay) |
| `picker-emoji-in` | 0.32s | Reaction emoji pops with overshoot spring |
| `online-pulse` | 2.2s infinite | Online presence dot ring pulse |
| `nav-spring` | 0.38s | Nav icon spring on tab activation |

### Button Interactions (global)

```css
button { transition: transform 150ms ease, background-color 200ms ease, box-shadow 200ms ease, opacity 200ms ease; }
button:not(:disabled):active { transform: scale(0.97); }
```

---

## Page Structure: Landing Page

### Sections (in order)

1. **AnnouncementBanner** — fixed top banner. Height contributes to `--banner-h` CSS variable used by nav offset.
2. **Nav** — fixed, frosted glass. Background: `rgba(245,239,225,0.92)` scrolled / `0.7` top. Blur: 20px. Height: 64px.
3. **Hero** — `#F5EFE1` bg, paper-grain, polaroid collage right (desktop), stacked headline left.
4. **HowItWorks** — `#FDFBF4` bg, paper-grain, 4 tilted pastel step cards with washi tape, PaperEdge top/bottom.
5. **SafetySection** — safety trust signals.
6. **Quotes** — community voice.
7. **Pricing** — pricing tiers.
8. **FAQ** — expandable questions.
9. **FinalCTA** — bottom conversion.
10. **Footer** — `#F5EFE1` bg, scalloped PaperEdge top, 3-column grid.

### Layout

- Max content width: 1280px (hero), 1240px (footer), 1200px (standard)
- Section horizontal padding: 20px mobile, 24–40px desktop
- Section dividers: PaperEdge components (no CSS borders between sections)

### Nav Glass

```
background: scrolled ? rgba(245,239,225,0.92) : rgba(245,239,225,0.70)
backdropFilter: blur(20px) saturate(140%)
borderBottom: scrolled ? 1px solid rgba(31,26,29,0.06) : transparent
```

### Eyebrow Pattern

```jsx
<p className="uppercase" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "rgba(31,26,29,0.6)", fontWeight: 600 }}>
  section label
</p>
```

---

## App Surface

### Layout

- **Mobile (all):** Full-width. Bottom nav fixed at bottom.
- **Desktop:** Centered max-width 720px for nav content area.

### Bottom Navigation

5-position layout: Home | Events | **[Chat FAB]** | Games | Profile

- Content height: 68px + safe area
- Background: `rgba(253,251,244,0.95)`, backdrop blur 20px
- Border: `1px solid rgba(31,26,29,0.05)`

**Tab item:**
- Active: `text-charcoal`, stroke 2.25, marigold dot indicator (1px × 1px) above icon
- Rest: `text-ink-disabled`, stroke 2, hover → `text-ink-secondary`
- Font: 10px, medium weight, tight tracking
- Nav spring animation on activation

**Chat FAB (center):**
- 56px circle, `#1F1A1D`, lifted 20px above nav bar
- Shadow: `0 8px 20px rgba(31,26,29,0.18)`
- Active: marigold 1.5px dot above

### Event Category System

| Category | Chip color | Wash color |
|----------|-----------|------------|
| creative | peach `#F7D4C3` | peach-soft `#FDEEE8` |
| food | peach `#F7D4C3` | peach-soft `#FDEEE8` |
| fitness | mint `#D6E4C8` | mint-soft `#EEF5E6` |
| workshop | butter `#F5E4B8` | butter-soft `#FBF4DC` |
| networking | lilac `#DDD1E6` | lilac-soft `#F0EBF5` |
| social | sky `#D0DAE8` | sky-soft `#E8EDF5` |

### Event Stamps

RSVP status as rubber-stamp overlays on event card images. Tones: `hosting`, `going`, `maybe`. Rotated slightly, crossings image/body edge for scrapbook feel.

### Key Component Specs

**Cards (event, match):**
- Background: `var(--color-ivory)` `#FDFBF4`
- Radius: `--radius-card` 20px
- Shadow: `--shadow-paper`
- Hover: `translateY(-0.5px)` (subtle lift)
- Card bloom animation on entrance

**Postcard dialog (feedback):**
- Ivory bg, radius 20–22px
- Shadow: `0 28px 64px rgba(31,26,29,0.22)`
- Textarea: lined paper via `repeating-linear-gradient` (27px lines)
- Send button: terracotta wax-seal circle, radial gradient `#F4A89A → #C86A58 → #7F3626`

**Chat inbox rows:**
- Postcard-row hover: `translateY(-2px) rotate(var(--tilt))`, shadow lift
- Washi tape strips on some cards (`--washi-color`, `--washi-rotate`)
- Pen-date dividers: italic display font, fading horizontal rules flanking

**Streak ribbon:**
- Diagonal shimmer sheen via ribbon-shimmer animation
- Flame flicker on streak flame icon

**Scrollbar:**
- Width: 4px
- Track: transparent
- Thumb: `rgba(31,26,29,0.12)`, 999px radius
- Thumb hover: `rgba(31,26,29,0.24)`

---

## Voice / Personality

**Tone:** Warm, direct, slightly playful. Never clinical. Never corporate. Never masculine.

**Register:** Like texting a close friend who gets it.

**Fixed conventions:**
- All copy lowercase (no sentence case for brand elements: wordmark, nav, section labels, tags, taglines)
- No swipe / dating vocabulary anywhere
- Location-specific when possible ("bangalore", "cubbon park", "commercial street")
- Short sentences. One idea per line in headings.
- Ellipses for trailing thoughts (not em dashes)
- "galpal" never "GalPal" or "GALPAL"

**Tone rules:**
- Safety is human, not legal-sounding: "women only · no swipes · no dating"
- Feedback copy is gentle: "tucked on the team's corkboard", "slipped under the team's door"
- Empty states get as much craft as full states
- Error messages don't apologize excessively: "Something jammed. Try again?"
- CTA on the nav: "continue *galpal*" — italic for warmth, implies returning home

**Analytics naming:** `noun_verb` — `event_viewed`, `wave_sent`, `feedback_submitted`, `landing_cta_clicked`

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|---------|
| < 640px (sm) | Single column. Mobile nav CTA hidden. Hero single polaroid. |
| >= 640px (sm) | Nav CTA appears (pill button). Flex CTAs in hero. |
| >= 768px (md) | Two-column hero (headline + polaroid collage). 12-col grid. Section padding increases. Event pinboard scatter activates. |
| >= 1024px (lg) | Larger section padding. Max content width expands. |

---

## Accessibility

- Focus rings: `outline: 2px solid rgba(31,26,29,0.35); outline-offset: 3px; border-radius: 6px`
- Buttons/links: `outline-color: #1F1A1D` on focus-visible
- All animations: `prefers-reduced-motion: reduce` → 0.01ms duration, 1 iteration, `scroll-behavior: auto`
- Touch targets: 44px minimum (buttons, nav items)
- All decorative SVG/emoji: `aria-hidden="true"`
- Icon-only buttons: explicit `aria-label`
- Dialog: `role="dialog" aria-modal="true" aria-labelledby`
- Nav active item: `aria-current="page"`

---

## What This Brand is NOT

- Not dark mode. Ever. The warm light palette is the identity.
- Not a dating app. No swipes, no matching mechanics, no "match" framing.
- Not AI/ML. No algorithmic recommendations surfaced to users in v1.
- Not corporate. No Helvetica, no blue links, no card-with-border-and-shadow-on-white grids.
- Not loud. Pastels are accents, not backgrounds. Marigold is earned, never decorative.
- Not gender-neutral in aesthetic. This is designed by and for women.
- Not a global app with ambiguous location. Bangalore is the identity. Other cities come later.
- Not a shadcn/MUI/Chakra install. No component library — all components are custom, built to this spec.
- Not high-density information. Breathing room is structural, not optional.
- Not emoji-forward. Emojis are used contextually (category icons, step vignettes), not as personality substitutes.
