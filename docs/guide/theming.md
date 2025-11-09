# Theming

Build consistent, themeable applications with design tokens and CSS variables.

## Design Tokens

Design tokens are the foundation of a scalable design system. Silk supports tokens through CSS variables.

### Setting Up Tokens

```css
/* globals.css */
:root {
  /* Colors */
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #f59e0b;

  --color-text: #1a202c;
  --color-text-muted: #718096;
  --color-background: #ffffff;
  --color-surface: #f7fafc;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', Monaco, monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Using Tokens in Silk

```tsx
import { css } from '@sylphx/silk'

const button = css({
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  padding: 'var(--spacing-md) var(--spacing-lg)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  fontFamily: 'var(--font-sans)',
  boxShadow: 'var(--shadow-md)',

  _hover: {
    backgroundColor: 'var(--color-secondary)',
    boxShadow: 'var(--shadow-lg)'
  }
})
```

## Dark Mode

Implement dark mode using CSS variable overrides.

### Method 1: Data Attribute

```css
/* globals.css */
:root {
  --color-text: #1a202c;
  --color-background: #ffffff;
  --color-surface: #f7fafc;
}

[data-theme="dark"] {
  --color-text: #f7fafc;
  --color-background: #1a202c;
  --color-surface: #2d3748;
}
```

**Toggle dark mode:**

```tsx
// app/components/ThemeToggle.tsx
'use client'

import { useEffect, useState } from 'react'
import { css } from '@sylphx/silk'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    setIsDark(theme === 'dark' || (!theme && prefersDark))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
```

### Method 2: Media Query (System Preference)

```css
/* globals.css */
:root {
  --color-text: #1a202c;
  --color-background: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #f7fafc;
    --color-background: #1a202c;
  }
}
```

### Using Dark Mode in Components

```tsx
const card = css({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',

  // Variables automatically switch based on theme
  boxShadow: 'var(--shadow-md)'
})
```

## Semantic Color Tokens

Create semantic tokens for better maintainability:

```css
:root {
  /* Base colors */
  --color-blue-500: #667eea;
  --color-purple-500: #764ba2;
  --color-amber-500: #f59e0b;
  --color-red-500: #ef4444;
  --color-green-500: #10b981;

  /* Semantic tokens */
  --color-primary: var(--color-blue-500);
  --color-success: var(--color-green-500);
  --color-warning: var(--color-amber-500);
  --color-error: var(--color-red-500);

  /* Contextual tokens */
  --color-text-primary: #1a202c;
  --color-text-secondary: #4a5568;
  --color-text-muted: #a0aec0;

  --color-border: #e2e8f0;
  --color-divider: #edf2f7;
}

[data-theme="dark"] {
  --color-text-primary: #f7fafc;
  --color-text-secondary: #cbd5e0;
  --color-text-muted: #718096;

  --color-border: #4a5568;
  --color-divider: #2d3748;
}
```

**Usage:**

```tsx
const alert = css({
  backgroundColor: 'var(--color-error)',
  color: 'white',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--radius-md)'
})

const successBadge = css({
  backgroundColor: 'var(--color-success)',
  color: 'white',
  padding: 'var(--spacing-xs) var(--spacing-sm)',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--text-xs)'
})
```

## Component Variants

Create themeable component variants:

```tsx
// components/Button.tsx
import { css } from '@sylphx/silk'

const buttonBase = css({
  padding: 'var(--spacing-md) var(--spacing-lg)',
  borderRadius: 'var(--radius-md)',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',

  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
})

const buttonPrimary = css({
  backgroundColor: 'var(--color-primary)',
  color: 'white',

  _hover: {
    backgroundColor: 'var(--color-secondary)'
  }
})

const buttonSecondary = css({
  backgroundColor: 'transparent',
  color: 'var(--color-primary)',
  border: '2px solid var(--color-primary)',

  _hover: {
    backgroundColor: 'var(--color-primary)',
    color: 'white'
  }
})

const buttonGhost = css({
  backgroundColor: 'transparent',
  color: 'var(--color-text-primary)',

  _hover: {
    backgroundColor: 'var(--color-surface)'
  }
})

export function Button({
  variant = 'primary',
  children,
  ...props
}: {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
  [key: string]: any
}) {
  const variantClass = {
    primary: buttonPrimary,
    secondary: buttonSecondary,
    ghost: buttonGhost
  }[variant]

  return (
    <button className={`${buttonBase} ${variantClass}`} {...props}>
      {children}
    </button>
  )
}
```

## Color Scales

Define color scales for consistent theming:

```css
:root {
  /* Gray scale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Primary scale */
  --primary-50: #f0f4ff;
  --primary-100: #e0e7ff;
  --primary-500: #667eea;
  --primary-600: #5a67d8;
  --primary-700: #4c51bf;
  --primary-900: #2d3748;
}
```

**Usage:**

```tsx
const card = css({
  backgroundColor: 'var(--gray-50)',
  border: '1px solid var(--gray-200)',

  '& .title': {
    color: 'var(--gray-900)'
  },

  '& .description': {
    color: 'var(--gray-600)'
  }
})
```

## Advanced Theming

### Multiple Themes

```css
/* Light theme (default) */
:root {
  --color-primary: #667eea;
  --color-background: #ffffff;
}

/* Dark theme */
[data-theme="dark"] {
  --color-primary: #818cf8;
  --color-background: #0f172a;
}

/* High contrast theme */
[data-theme="high-contrast"] {
  --color-primary: #000000;
  --color-background: #ffffff;
  --color-text: #000000;
}

/* Colorblind-friendly theme */
[data-theme="colorblind"] {
  --color-primary: #0066cc;
  --color-success: #0066cc;
  --color-error: #cc6600;
}
```

### Dynamic Theming

```tsx
'use client'

import { useEffect } from 'react'

export function ThemeProvider({
  theme,
  children
}: {
  theme: string
  children: React.ReactNode
}) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
```

## Best Practices

### ✅ Do

1. **Use Semantic Token Names**
   ```css
   /* ✅ Good: Describes purpose */
   --color-text-primary: #1a202c;
   --color-surface-elevated: #ffffff;

   /* ❌ Bad: Describes appearance */
   --dark-gray: #1a202c;
   --white: #ffffff;
   ```

2. **Group Related Tokens**
   ```css
   /* ✅ Good: Organized */
   --spacing-xs: 0.25rem;
   --spacing-sm: 0.5rem;
   --spacing-md: 1rem;
   ```

3. **Use Consistent Scales**
   ```css
   /* ✅ Good: Predictable scale */
   --text-xs: 0.75rem;   /* 12px */
   --text-sm: 0.875rem;  /* 14px */
   --text-base: 1rem;    /* 16px */
   --text-lg: 1.125rem;  /* 18px */
   --text-xl: 1.25rem;   /* 20px */
   ```

### ❌ Don't

1. **Don't Hardcode Colors**
   ```tsx
   // ❌ Bad
   const button = css({ backgroundColor: '#667eea' })

   // ✅ Good
   const button = css({ backgroundColor: 'var(--color-primary)' })
   ```

2. **Don't Mix Token Systems**
   ```css
   /* ❌ Bad: Inconsistent naming */
   --primary-color: #667eea;
   --spacing_md: 1rem;
   --text-Size-Large: 1.25rem;
   ```

## Real-World Example

Complete themed component system:

```css
/* theme.css */
:root {
  --color-primary: #667eea;
  --color-text: #1a202c;
  --color-bg: #ffffff;
  --color-surface: #f7fafc;
  --spacing-unit: 0.25rem;
  --radius-base: 0.5rem;
}

[data-theme="dark"] {
  --color-primary: #818cf8;
  --color-text: #f7fafc;
  --color-bg: #0f172a;
  --color-surface: #1e293b;
}
```

```tsx
// components/Card.tsx
import { css } from '@sylphx/silk'

const card = css({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  padding: 'calc(var(--spacing-unit) * 6)',
  borderRadius: 'var(--radius-base)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
})

const cardTitle = css({
  fontSize: 'calc(var(--spacing-unit) * 6)',
  fontWeight: 'bold',
  marginBottom: 'calc(var(--spacing-unit) * 2)'
})

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={card}>
      <h3 className={cardTitle}>{title}</h3>
      {children}
    </div>
  )
}
```

## Next Steps

- [Responsive Design](/guide/responsive) - Build responsive layouts
- [Configuration](/api/configuration) - Customize Silk settings
- [Next.js Integration](/guide/nextjs) - Framework-specific setup
