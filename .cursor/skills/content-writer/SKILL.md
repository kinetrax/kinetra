---
name: content-writer
description: Write and update content for the KinetraX website, technical documentation, and general copy in English and Russian. Use when the user asks to write, edit, or translate website text, page copy, section content, meta descriptions, whitepaper sections, legal text, FAQ entries, or any bilingual content.
---

# Content Writer

Professional content writing skill for KinetraX — bilingual (EN/RU), SEO-aware, blockchain-sport domain.

## Project Context

- **Domain**: Blockchain-powered sport platform on TON connecting trainers and athletes
- **Brand name**: KinetraX (always capitalize the X)
- **Token**: KinetraX token (KNT), total supply 21M
- **Stack**: Static HTML pages, vanilla JS, single CSS file
- **Pages**: `index.html`, `whitepaper.html`, `terms-of-use.html`, `privacy-policy.html`
- **Languages**: English (primary), Russian

## Voice & Tone

| Attribute | Guideline |
|-----------|-----------|
| Tone | Professional, authoritative, confident |
| Register | Clear and direct — avoid jargon unless addressing a technical audience |
| Perspective | First-person plural ("we", "our platform") for brand voice; second-person ("you") when addressing users |
| Sentence length | Mix short punchy sentences with longer explanatory ones |
| Avoid | Hype words ("revolutionary", "game-changing"), exclamation marks in body copy, vague superlatives |

**Good**: "KinetraX connects trainers and athletes through smart contracts on TON, enabling secure payments without intermediaries."

**Bad**: "KinetraX is a revolutionary game-changing platform that will disrupt the entire sport industry!!!"

## AI & Intelligent Features

When writing about AI on KinetraX:

- **Be concrete**: Say what the user gets (e.g. ranked sessions, short “why this fits” explanations, less manual filtering) — not abstract “powered by AI” fluff.
- **Set boundaries**: AI helps with **discovery and clarity**; verification, escrow, and payments remain blockchain- and policy-backed. Never imply medical diagnosis, guaranteed results, or fully automated coaching.
- **Prefer these patterns**: “AI-assisted matching”, “suggested sessions”, “ranked for your goals and schedule”, “optional drafting help for titles and descriptions” (coach remains in control).
- **Avoid**: “Our AI knows you better than you do”, unqualified superlatives, or promising features that are not shipped yet (use “rolling out”, “planned”, or describe the marketing site as reflecting the product roadmap only if accurate).
- **i18n**: On the marketing site, **Russian uses the Latin term `AI`** (not «ИИ») for product-facing matching/discovery copy, e.g. «matching с AI», «ранжирование AI», «модели AI».

## i18n System

All user-facing text uses a `data-i18n` attribute system with translations stored in `js/translations.js`.

### How it works

1. HTML elements carry a `data-i18n="key_name"` attribute with English text as fallback content
2. `js/translations.js` exports a `translations` object with `en` and `ru` keys
3. `js/script.js` swaps text content on language change

### Adding new content — checklist

When writing or updating content:

```
- [ ] Write the English copy
- [ ] Add data-i18n attribute to HTML element
- [ ] Add English translation key to translations.en
- [ ] Write the Russian translation
- [ ] Add Russian translation key to translations.ru
- [ ] Update meta tags if the content affects page title/description
```

### Key naming convention

- Use `snake_case` for all keys
- Prefix by section: `hero_`, `benefits_`, `faq_`, `wp_` (whitepaper), `token_`, `footer_`
- Keep keys descriptive: `hero_subtitle`, not `hs` or `text2`

### HTML pattern

```html
<h2 data-i18n="section_key">English fallback text</h2>
<p data-i18n="section_description">English fallback description.</p>
```

### Translation entry pattern

```javascript
// In translations.en:
"section_key": "English text",
"section_description": "English description.",

// In translations.ru:
"section_key": "Русский текст",
"section_description": "Русское описание.",
```

## Content Workflow

### Writing new page sections

1. **Read the target HTML file** to understand surrounding context and structure
2. **Read `js/translations.js`** to see existing keys and avoid collisions
3. **Draft the English copy** following the voice/tone guidelines
4. **Write the HTML** with `data-i18n` attributes and English fallback content
5. **Add both EN and RU entries** to `js/translations.js`
6. **Update SEO meta tags** if adding a major section or new page

### Editing existing content

1. Read the current text in both the HTML file and `js/translations.js`
2. Edit the English copy first, then update the Russian translation
3. Keep the same `data-i18n` key unless the semantic meaning has changed
4. Update the HTML fallback text to match the new English copy

### Writing technical documentation

For whitepaper and technical content:
- Use structured headings (H2 for major sections, H3 for subsections)
- Include concrete data points and specifics over vague claims
- Reference TON blockchain specifics accurately (smart contracts, Toncoin, Jettons)
- Keep paragraphs focused — one idea per paragraph

## SEO Guidelines

### Meta tags template

Every page needs these in `<head>`:

```html
<title>[Page Title] — KinetraX</title>
<meta name="description" content="[150–160 char description with primary keyword]">
<meta name="keywords" content="KinetraX, [relevant keywords]">
<link rel="canonical" href="https://kinetra-x.com/[page].html">

<!-- Open Graph -->
<meta property="og:title" content="[Same as title]">
<meta property="og:description" content="[Same as meta description]">
<meta property="og:image" content="https://kinetra-x.com/assets/images/logo-web.jpg?y=y">
<meta property="og:url" content="https://kinetra-x.com/[page].html">

<!-- Twitter -->
<meta name="twitter:title" content="[Same as title]">
<meta name="twitter:description" content="[Same as meta description]">
<meta name="twitter:image" content="https://kinetra-x.com/assets/images/logo-web.jpg?y=y">
```

### Writing meta descriptions

- 150–160 characters
- Include primary keyword naturally
- Write as a value proposition, not a list of features
- No duplicate descriptions across pages

## Russian Translation Guidelines

- **Don't transliterate** — use proper Russian equivalents where they exist
- **Keep technical terms** in English when standard: "TON", "blockchain", "smart contract", "token"
- **Adapt, don't translate literally** — Russian phrasing should sound natural, not like machine translation
- **Match formality** — use вы (formal "you") for user-facing content
- **Preserve brand names** — "KinetraX" stays in Latin script, never Cyrillic

### Common term glossary

| English | Russian | Notes |
|---------|---------|-------|
| Trainer | Тренер | |
| Athlete | Спортсмен | |
| Workout / Event | Тренировка / Мероприятие | Context-dependent |
| Smart contract | Смарт-контракт | Hyphenated in Russian |
| Blockchain | Блокчейн | Loan word |
| Token | Токен | Loan word |
| KNT payment discounts | Скидки при оплате KNT | Use this instead of staking references |
| Wallet | Кошелёк | |
| Verification | Верификация | |
| Platform | Платформа | |

For an extended glossary, see [glossary.md](glossary.md).

## Content Type Templates

### FAQ entry

```html
<div class="faq-item">
    <div class="faq-question" data-i18n="faq_[topic]_q">[Question in English?]</div>
    <div class="faq-answer">
        <p data-i18n="faq_[topic]_a">[Answer in English.]</p>
    </div>
</div>
```

### Feature/benefit card

```html
<div class="benefit-card">
    <h3 data-i18n="benefit_[name]_title">[Title]</h3>
    <ul>
        <li><i class="fas fa-check-circle"></i> <span data-i18n="benefit_[name]_1">[Point 1]</span></li>
        <li><i class="fas fa-check-circle"></i> <span data-i18n="benefit_[name]_2">[Point 2]</span></li>
    </ul>
</div>
```

### Whitepaper section

```html
<div class="whitepaper-section">
    <h2 data-i18n="wp_[section]_title">[Section Title]</h2>
    <p data-i18n="wp_[section]_p1">[First paragraph.]</p>
    <p data-i18n="wp_[section]_p2">[Second paragraph.]</p>
</div>
```
