# Accessibility Checker

## Description
Ensures components meet WCAG accessibility guidelines for users with disabilities.

## Trigger
- Component review
- `/a11y check` command
- Accessibility audit

## Instructions

### WCAG Levels

| Level | Description |
|-------|-------------|
| A | Minimum accessibility |
| AA | Standard (target) |
| AAA | Enhanced accessibility |

### Key Requirements

#### 1. Perceivable

**Images**
```tsx
// Good - descriptive alt text
<img src="chart.png" alt="Sales increased 25% in Q4 2024" />

// Decorative - empty alt
<img src="decoration.png" alt="" role="presentation" />

// Bad - missing or useless alt
<img src="chart.png" />
<img src="chart.png" alt="image" />
```

**Color Contrast**
```tsx
// Good contrast (4.5:1 for normal text)
<p className="text-gray-900 bg-white">Readable text</p>

// Bad contrast
<p className="text-gray-400 bg-gray-200">Hard to read</p>

// Don't rely on color alone
<span className="text-red-600">Error: </span> // Add text too
<span className="text-red-600 flex items-center">
  <ErrorIcon /> Error: Invalid email
</span>
```

**Form Labels**
```tsx
// Good - associated label
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Good - aria-label
<input aria-label="Search" type="search" />

// Bad - no label
<input type="email" placeholder="Email" />
```

#### 2. Operable

**Keyboard Navigation**
```tsx
// Focusable elements
<button>Click me</button>      // Naturally focusable
<a href="/page">Link</a>       // Naturally focusable

// Custom focusable element
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Custom button
</div>

// Focus styles
className="focus:outline-none focus:ring-2 focus:ring-blue-500"

// Skip link
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**Focus Management**
```tsx
// Focus trap in modals
useEffect(() => {
  if (isOpen) {
    firstFocusableElement.current?.focus();
  }
}, [isOpen]);

// Return focus after modal closes
useEffect(() => {
  return () => {
    previouslyFocusedElement?.focus();
  };
}, []);
```

#### 3. Understandable

**Error Messages**
```tsx
// Good - clear error with association
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid={!!error}
    aria-describedby={error ? 'email-error' : undefined}
  />
  {error && (
    <p id="email-error" role="alert" className="text-red-600">
      {error}
    </p>
  )}
</div>

// Form instructions
<p id="password-hint" className="text-sm text-gray-500">
  Must be at least 8 characters
</p>
<input aria-describedby="password-hint" />
```

**Language**
```tsx
// Set page language
<html lang="en">

// Mark language changes
<p>The French word <span lang="fr">bonjour</span> means hello.</p>
```

#### 4. Robust

**Semantic HTML**
```tsx
// Good - semantic
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

// Bad - div soup
<div className="header">...</div>
<div className="nav">...</div>
```

**ARIA Roles**
```tsx
// Use when semantic HTML isn't enough
<div role="alert">Error message</div>
<div role="dialog" aria-modal="true">Modal content</div>
<div role="tablist">
  <button role="tab" aria-selected="true">Tab 1</button>
  <button role="tab" aria-selected="false">Tab 2</button>
</div>
```

### Accessibility Checklist

```markdown
## Component Accessibility Checklist

### Keyboard
- [ ] All interactive elements are focusable
- [ ] Focus order is logical
- [ ] Focus is visible
- [ ] No keyboard traps
- [ ] Escape closes modals/menus

### Screen Reader
- [ ] All images have appropriate alt text
- [ ] Form inputs have labels
- [ ] Headings are hierarchical (h1 → h2 → h3)
- [ ] Links have descriptive text
- [ ] ARIA labels where needed

### Visual
- [ ] Color contrast meets 4.5:1 (text)
- [ ] Color contrast meets 3:1 (large text, UI)
- [ ] Information not conveyed by color alone
- [ ] Text is resizable to 200%
- [ ] Focus indicators visible

### Motion
- [ ] Animations respect prefers-reduced-motion
- [ ] No auto-playing content
- [ ] Users can pause/stop animations
```

### Screen Reader Only Text

```tsx
// Utility class
<span className="sr-only">Screen reader only text</span>

// Tailwind config already includes:
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Reduced Motion

```tsx
// CSS
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// Tailwind
<div className="motion-safe:animate-bounce motion-reduce:animate-none">
```

## Tools Used
- `Read`: Read component code
- `Edit`: Add accessibility attributes

## Best Practices
- Start with semantic HTML
- Test with keyboard only
- Test with screen reader
- Use ARIA sparingly
- Document accessibility features
