# Design System

## Description
Maintains design tokens, theme configuration, and ensures visual consistency across the application.

## Trigger
- Design system setup
- `/design system` command
- Theme configuration

## Instructions

### Design Tokens Structure

```
frontend/src/
├── styles/
│   ├── globals.css
│   └── tokens.css
├── lib/
│   └── utils.ts
└── tailwind.config.ts
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Semantic colors
        success: {
          light: '#dcfce7',
          DEFAULT: '#22c55e',
          dark: '#15803d',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        // Custom spacing if needed
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### CSS Variables (Optional)

```css
/* styles/tokens.css */
:root {
  /* Colors */
  --color-primary: 59 130 246;
  --color-secondary: 100 116 139;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --spacing-unit: 0.25rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

/* Dark mode */
[data-theme='dark'] {
  --color-primary: 96 165 250;
}
```

### Global Styles

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }

  body {
    @apply bg-white text-gray-900;
  }

  h1 {
    @apply text-3xl font-bold;
  }

  h2 {
    @apply text-2xl font-semibold;
  }

  h3 {
    @apply text-xl font-medium;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
  }

  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Component Variants Guide

```markdown
## Button Variants
| Variant | Use Case |
|---------|----------|
| Primary | Main actions (Submit, Save) |
| Secondary | Secondary actions |
| Outline | Tertiary actions |
| Ghost | Minimal emphasis |
| Destructive | Delete, danger actions |
| Link | Navigation-like buttons |

## Sizes
| Size | Use Case |
|------|----------|
| sm | Compact UI, tables |
| md | Default, most cases |
| lg | Hero sections, emphasis |

## States
| State | Description |
|-------|-------------|
| Default | Normal state |
| Hover | Mouse over |
| Focus | Keyboard focus |
| Active | Being clicked |
| Disabled | Not interactive |
| Loading | Processing |
```

### Usage Guidelines

```markdown
## Spacing
- Use 4px grid (1, 2, 3, 4, 5, 6, 8, 10, 12, 16...)
- Consistent padding: p-4 (16px) for cards, p-2 (8px) for buttons
- Section spacing: py-12 to py-24

## Typography
- Headings: Bold (font-bold) or Semibold (font-semibold)
- Body: Regular weight
- Max line length: max-w-prose (65ch)

## Colors
- Text: gray-900 (primary), gray-600 (secondary), gray-400 (muted)
- Backgrounds: white, gray-50, gray-100
- Borders: gray-200, gray-300
- Primary actions: primary-600

## Shadows
- Cards: shadow-sm or shadow-md
- Modals: shadow-lg
- Dropdowns: shadow-md
```

## Tools Used
- `Read`: Read config files
- `Write`: Create design system files
- `Edit`: Update configurations

## Best Practices
- Document all tokens
- Use semantic color names
- Maintain consistent scale
- Avoid arbitrary values
- Create component examples
