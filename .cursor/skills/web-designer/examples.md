# Restyling Examples

Before/after patterns for common restyle requests.

## Example 1: Hero Section — Gradient Background with Glass Card

**Before (current):**
```css
.hero {
  padding: 8rem 0 4rem;
  background: var(--light-bg);
}
```

**After (creative restyle):**
```css
.hero {
  padding: 10rem 0 6rem;
  background: linear-gradient(135deg, #0f1117 0%, #1a1d27 50%, #0f1117 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 40%, rgba(45,201,214,0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(255,169,144,0.1) 0%, transparent 50%);
  animation: gradientShift 15s ease-in-out infinite alternate;
}

.hero-content {
  position: relative;
  z-index: 1;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
}

@keyframes gradientShift {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(2%, 2%) rotate(3deg); }
}
```

## Example 2: Card Component — Hover Lift with Glow

**Before:**
```css
.benefit-card {
  background: var(--white);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}
```

**After:**
```css
.benefit-card {
  background: var(--bg-primary);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid transparent;
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}

.benefit-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  border-color: rgba(45,201,214,0.2);
}
```

## Example 3: Button — Animated Gradient

**Before:**
```css
.btn.primary {
  background-color: var(--primary-color);
  color: var(--white);
}
.btn.primary:hover {
  background-color: #25a8b3;
}
```

**After:**
```css
.btn.primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color), var(--primary-color));
  background-size: 200% 100%;
  color: var(--white);
  border-radius: var(--radius-full);
  box-shadow: 0 4px 15px rgba(45,201,214,0.3);
  transition: background-position var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.btn.primary:hover {
  background-position: 100% 0;
  box-shadow: 0 6px 25px rgba(45,201,214,0.45);
  transform: translateY(-2px);
}

.btn.primary:active {
  transform: translateY(0);
}
```

## Example 4: Section Title — Text Gradient + Decorative Element

**Before:**
```css
.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}
.section-title::after {
  width: 80px;
  height: 4px;
  background: var(--secondary-color);
}
```

**After:**
```css
.section-title {
  text-align: center;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  margin-bottom: var(--space-xl);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.section-title::after {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: var(--radius-full);
}
```

## Example 5: Dark Mode Toggle (JS snippet)

Add to `js/script.js`:

```javascript
function initThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

document.addEventListener('DOMContentLoaded', initThemeToggle);
```
