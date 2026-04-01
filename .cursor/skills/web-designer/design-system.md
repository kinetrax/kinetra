# KinetraX Design System — Current State

Reference document for the existing design tokens, components, and layout patterns in `css/styles.css`.

## Design Tokens (`:root`)

```css
--primary-color: #2DC9D6;   /* Teal from logo */
--secondary-color: #FFA990; /* Peach from logo */
--text-color: #333;
--light-bg: #f5f5f5;
--white: #ffffff;
--dark: #212121;
--gray: #757575;
--light-gray: #e0e0e0;
```

Hardcoded values also in use (not yet tokenized):
- `#25a8b3` — darker teal (btn hover)
- `#ff8c70` — darker peach (btn hover)
- `rgba(0,0,0,0.1)` — default shadow
- `rgba(0,0,0,0.15)` — scrolled header shadow

## Typography

- **Font family**: `'Inter', sans-serif` via Google Fonts
- **Body**: `line-height: 1.6`
- **Headings**: `font-weight: 700; line-height: 1.2`
- **Section titles**: `font-size: 2.5rem; text-align: center` with `::after` underline bar (80px, 4px, peach)

## Layout

- **Container**: `width: 90%; max-width: 1200px; margin: 0 auto; padding: 0 15px`
- **Sections**: `padding: 5rem 0`
- **Header**: Fixed, white bg, `z-index: 1000`, flexbox row (logo | nav | actions)

## Component Inventory

| Component | Selector(s) | CSS Lines |
|-----------|-------------|-----------|
| Buttons | `.btn`, `.btn.primary`, `.btn.secondary` | 72–104 |
| Header | `header`, `header.scrolled` | 106–128 |
| Navigation | `.main-nav`, `.nav-menu`, `.nav-link` | 129–183 |
| Mobile menu | `.mobile-menu-toggle` | 184–328 |
| Hero | `.hero`, `.hero-content` | 329–384 |
| Sport map animation | Various `.map-*` classes | 385–623 |
| Benefits | `.benefits-*` | 624–669 |
| How it works | `.how-it-works-*` | 670–717 |
| Phone mockup | `.phone-*`, `.app-screen-*` | 718–1079 |
| Legal content | `.legal-*` | 1080–1121 |
| Event examples | `.event-*` | 1122–1171 |
| Token section | `.token-*` | 1172–1231 |
| Documentation | `.doc-*` | 1232–1275 |
| Whitepaper | `.whitepaper-*` | 1276–1359 |
| Roadmap | `.roadmap-*` | 1360–1459 |
| Footer | `footer`, `.footer-*` | 1460–1532 |
| Animations | `@keyframes`, `.animate-*` | 1533–1581 |
| Modal | `.modal-*` | 1582–1671 |
| Pricing | `.pricing-*` | 1672–1756 |
| FAQ | `.faq-*` | 1757–1819 |

## Breakpoints (current)

| Query | Target |
|-------|--------|
| `max-width: 992px` | Tablets — nav collapse, grid reflow |
| `max-width: 768px` | Small tablets — stacked layouts |
| `max-width: 576px` | Phones — single column, reduced padding |
| `min-width: 993px` | Desktop nav visibility |

## Animations

Keyframes defined: `pulse`, `pinPulse`, `dataFlow`, `float`, `fadeInUp`, `moveParticle`, plus sport-map related animations.

Scroll-reveal class: `.animate-on-scroll` (toggled via IntersectionObserver in `js/script.js`).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with all sections |
| `whitepaper.html` | Project whitepaper |
| `terms-of-use.html` | Legal terms |
| `privacy-policy.html` | Privacy policy |
