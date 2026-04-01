---
name: web-designer
description: Restyle and redesign the KinetraX website with a creative, artistic aesthetic. Use when the user asks to change visual design, update styles, rework layouts, improve typography, add animations, implement dark mode, enhance responsiveness, or improve accessibility across HTML and CSS files.
---

# Web Designer

Creative web design skill for the KinetraX static site (HTML + CSS + vanilla JS).

## Project Context

- **Stack**: Static HTML pages, single `css/styles.css`, vanilla JS
- **Brand colors**: Teal `#2DC9D6` (primary), Peach `#FFA990` (secondary)
- **Font**: Inter (Google Fonts)
- **CSS approach**: Custom properties in `:root`, flat selectors, single stylesheet
- **Pages**: `index.html`, `whitepaper.html`, `terms-of-use.html`, `privacy-policy.html`

For current design tokens and component inventory, see [design-system.md](design-system.md).

## Design Philosophy

KinetraX targets a **creative, artistic** aesthetic — expressive layouts, bold visual identity, and memorable interactions. Every change should feel intentional and polished.

Guiding principles:
1. **Brand coherence** — teal/peach palette is the anchor; extend it, don't replace it
2. **Purposeful motion** — animations guide attention, never distract
3. **Visual hierarchy** — size, weight, color, and spacing create clear reading paths
4. **Whitespace as design** — generous spacing elevates perceived quality
5. **Progressive enhancement** — base experience works without JS; animations and effects layer on top

## Restyling Workflow

Copy this checklist and track progress:

```
Restyle Progress:
- [ ] Step 1: Audit current state
- [ ] Step 2: Define the direction
- [ ] Step 3: Update design tokens
- [ ] Step 4: Restyle components
- [ ] Step 5: Add motion & interactions
- [ ] Step 6: Responsive pass
- [ ] Step 7: Accessibility check
- [ ] Step 8: Dark mode (if requested)
```

### Step 1: Audit Current State

Before changing anything:
- Read `css/styles.css` to understand existing selectors and structure
- Read the target HTML page(s) to understand the DOM
- Note which `:root` variables are in use
- Identify reusable patterns vs. one-off styles

### Step 2: Define the Direction

Clarify the aesthetic with the user. If unclear, propose a direction using terms like:
- **Glassmorphism** — frosted glass panels, backdrop-filter, soft gradients
- **Neubrutalism** — thick borders, raw shadows, high contrast
- **Soft UI / Neumorphism** — subtle inset/outset shadows on light surfaces
- **Gradient-rich** — vivid gradient backgrounds, text gradients, mesh gradients
- **Dark cinematic** — dark base, neon accents, dramatic lighting effects
- **Organic / fluid** — blob shapes, rounded forms, flowing layouts

### Step 3: Update Design Tokens

All visual changes start in `:root`. Extend the existing custom properties:

```css
:root {
  /* Existing brand palette — preserve these */
  --primary-color: #2DC9D6;
  --secondary-color: #FFA990;

  /* Extend with semantic tokens */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-accent: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-on-accent: #ffffff;

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  --space-2xl: 8rem;

  /* Border radius scale */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.12);
  --shadow-glow: 0 0 20px rgba(45,201,214,0.3);

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

### Step 4: Restyle Components

Work through components in this order (highest visual impact first):

1. **Hero / above-the-fold** — first impression, biggest payoff
2. **Navigation** — sticky headers, scroll effects
3. **Section headings** — typographic treatments, decorative elements
4. **Cards / grid items** — hover states, shadows, borders
5. **Buttons / CTAs** — gradient fills, hover animations, focus rings
6. **Forms** — input styling, validation states, focus effects
7. **Footer** — layout, link groups, brand treatment

Rules:
- Edit `css/styles.css` directly; do not create new CSS files unless splitting is explicitly requested
- Use CSS custom properties for every magic value
- Prefer `clamp()` for fluid typography: `font-size: clamp(1rem, 2.5vw, 1.5rem)`
- Use `gap` in flex/grid layouts instead of margin hacks
- Add `will-change` only on elements that actually animate

### Step 5: Add Motion & Interactions

Layer in animations using CSS only (no JS animation libraries):

```css
/* Fade-in on scroll — pair with IntersectionObserver in JS */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--duration-slow) var(--ease-out),
              transform var(--duration-slow) var(--ease-out);
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hover lift for cards */
.card {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Gradient shimmer for buttons */
.btn-primary {
  background-size: 200% 100%;
  transition: background-position var(--duration-normal) var(--ease-out);
}
.btn-primary:hover {
  background-position: 100% 0;
}
```

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Step 6: Responsive Pass

Breakpoints (mobile-first):

| Token | Width | Target |
|-------|-------|--------|
| base | 0 | Mobile phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |

Rules:
- Start from mobile layout, add complexity upward with `min-width` queries
- Use `clamp()` for font sizes and spacing to reduce breakpoint count
- Test navigation collapse (hamburger), card grid reflow, hero text sizing
- Images: use `max-width: 100%; height: auto;` as baseline
- Container: `width: min(90%, 1200px); margin-inline: auto;`

### Step 7: Accessibility Check

Every restyle must pass these checks:

- [ ] Color contrast ratio >= 4.5:1 for body text, >= 3:1 for large text (use browser DevTools)
- [ ] Focus indicators visible on all interactive elements (`:focus-visible` outline)
- [ ] No information conveyed by color alone
- [ ] Touch targets >= 44x44px on mobile
- [ ] Skip-to-content link present
- [ ] `prefers-reduced-motion` respected (Step 5)
- [ ] `prefers-color-scheme` respected if dark mode is implemented

### Step 8: Dark Mode

When implementing dark mode, override tokens inside a media query and/or class toggle:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0f1117;
    --bg-secondary: #1a1d27;
    --text-primary: #e8e8e8;
    --text-secondary: #9ca3af;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
    --shadow-lg: 0 12px 32px rgba(0,0,0,0.5);
  }
}

/* Manual toggle override */
[data-theme="dark"] {
  --bg-primary: #0f1117;
  /* ... same overrides ... */
}
```

Provide a toggle button in the header and store preference in `localStorage`.

## Typography Guidelines

| Role | Font | Weight | Size (fluid) |
|------|------|--------|--------------|
| Display / Hero | Inter | 800 | `clamp(2.5rem, 5vw, 4.5rem)` |
| Section title | Inter | 700 | `clamp(1.75rem, 3vw, 2.5rem)` |
| Subtitle | Inter | 600 | `clamp(1.125rem, 2vw, 1.5rem)` |
| Body | Inter | 400 | `clamp(0.95rem, 1.2vw, 1.125rem)` |
| Caption / small | Inter | 400 | `clamp(0.75rem, 1vw, 0.875rem)` |

Use `letter-spacing: -0.02em` on headings for a tighter, modern feel. Use `line-height: 1.2` for headings, `1.6` for body.

## Color Palette Extension

When the user needs more colors, derive them from the brand:

```css
:root {
  --primary-light: #5fe0ea;
  --primary-dark: #1a9aa5;
  --secondary-light: #ffc4b3;
  --secondary-dark: #d4826e;
  --accent: #7c5cff;       /* violet accent for creative flair */
  --success: #34d399;
  --warning: #fbbf24;
  --error: #f87171;
}
```

## Additional Resources

- For the full current design token inventory, see [design-system.md](design-system.md)
- For before/after restyling examples, see [examples.md](examples.md)
