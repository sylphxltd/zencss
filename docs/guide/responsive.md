# Responsive Design

Silk provides powerful, type-safe responsive design utilities that generate mobile-first CSS.

## Breakpoint System

Silk uses a mobile-first breakpoint system with sensible defaults:

```tsx
{
  base: '0px',      // Mobile (default)
  sm: '640px',      // Small tablets
  md: '768px',      // Tablets
  lg: '1024px',     // Laptops
  xl: '1280px',     // Desktops
  '2xl': '1536px'   // Large desktops
}
```

## Responsive Values

Use object notation to define responsive values:

```tsx
import { css } from '@sylphx/silk'

const container = css({
  padding: {
    base: '1rem',    // Mobile: 16px
    md: '2rem',      // Tablet: 32px
    lg: '4rem'       // Desktop: 64px
  },

  fontSize: {
    base: '14px',
    md: '16px',
    lg: '18px'
  }
})
```

**Generated CSS (mobile-first):**

```css
.container {
  padding: 1rem;
  font-size: 14px;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 4rem;
    font-size: 18px;
  }
}
```

## Common Patterns

### Responsive Layout

```tsx
const layout = css({
  display: {
    base: 'block',      // Mobile: stack vertically
    md: 'flex'          // Tablet+: horizontal layout
  },

  flexDirection: {
    md: 'row'
  },

  gap: {
    base: '1rem',
    md: '2rem',
    lg: '3rem'
  }
})
```

### Responsive Grid

```tsx
const grid = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',                    // 1 column on mobile
    sm: 'repeat(2, 1fr)',          // 2 columns on small tablets
    md: 'repeat(3, 1fr)',          // 3 columns on tablets
    lg: 'repeat(4, 1fr)',          // 4 columns on laptops
    xl: 'repeat(6, 1fr)'           // 6 columns on desktops
  },

  gap: {
    base: '1rem',
    lg: '2rem'
  }
})
```

### Responsive Typography

```tsx
const heading = css({
  fontSize: {
    base: '1.5rem',     // 24px mobile
    md: '2rem',         // 32px tablet
    lg: '2.5rem',       // 40px desktop
    xl: '3rem'          // 48px large desktop
  },

  lineHeight: {
    base: '1.2',
    md: '1.3'
  },

  fontWeight: {
    base: 'bold',
    lg: '900'
  }
})
```

### Hide/Show at Breakpoints

```tsx
const mobileOnly = css({
  display: {
    base: 'block',
    md: 'none'           // Hidden on tablet and above
  }
})

const desktopOnly = css({
  display: {
    base: 'none',
    lg: 'block'          // Visible only on desktop
  }
})
```

## Advanced Techniques

### Responsive Spacing Scale

```tsx
const section = css({
  padding: {
    base: '1rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
    '2xl': '6rem'
  },

  marginBottom: {
    base: '2rem',
    lg: '4rem'
  }
})
```

### Responsive Images

```tsx
const imageContainer = css({
  width: {
    base: '100%',
    md: '50%',
    lg: '33.333%'
  },

  height: {
    base: '200px',
    md: '300px',
    lg: '400px'
  },

  objectFit: 'cover'
})
```

### Responsive Flex Direction

```tsx
const flexContainer = css({
  display: 'flex',

  flexDirection: {
    base: 'column',      // Stack on mobile
    md: 'row'            // Side-by-side on tablet+
  },

  alignItems: {
    base: 'stretch',
    md: 'center'
  },

  justifyContent: {
    md: 'space-between'
  }
})
```

## Container Queries

Silk supports modern CSS container queries for component-level responsiveness:

```tsx
const card = css({
  containerType: 'inline-size',
  containerName: 'card',

  // Children can respond to card size, not viewport
  '& .title': {
    fontSize: {
      base: '1rem',
      '@container (min-width: 400px)': '1.5rem',
      '@container (min-width: 600px)': '2rem'
    }
  }
})
```

## Best Practices

### ✅ Do

1. **Start Mobile-First**
   ```tsx
   // ✅ Good: Define mobile styles first
   padding: {
     base: '1rem',
     md: '2rem'
   }
   ```

2. **Use Semantic Breakpoints**
   ```tsx
   // ✅ Good: Meaningful breakpoints
   fontSize: {
     base: '14px',  // Mobile
     md: '16px',    // Tablet
     lg: '18px'     // Desktop
   }
   ```

3. **Progressive Enhancement**
   ```tsx
   // ✅ Good: Add features for larger screens
   display: {
     base: 'block',
     lg: 'grid'
   }
   ```

### ❌ Don't

1. **Don't Define Desktop-First**
   ```tsx
   // ❌ Bad: Requires more media queries
   padding: {
     base: '4rem',
     md: '2rem',
     sm: '1rem'
   }
   ```

2. **Don't Over-Specify**
   ```tsx
   // ❌ Bad: Too many breakpoints
   padding: {
     base: '1rem',
     sm: '1.1rem',
     md: '1.2rem',
     lg: '1.3rem',
     xl: '1.4rem'
   }

   // ✅ Good: Only where needed
   padding: {
     base: '1rem',
     lg: '2rem'
   }
   ```

3. **Don't Mix Units Inconsistently**
   ```tsx
   // ❌ Bad: Mixing units makes scaling harder
   padding: {
     base: '16px',
     md: '2rem',
     lg: '24px'
   }

   // ✅ Good: Consistent units
   padding: {
     base: '1rem',
     md: '2rem',
     lg: '3rem'
   }
   ```

## Real-World Examples

### Responsive Navigation

```tsx
const nav = css({
  display: 'flex',
  flexDirection: {
    base: 'column',
    md: 'row'
  },

  padding: {
    base: '1rem',
    md: '1.5rem 2rem'
  },

  gap: {
    base: '0.5rem',
    md: '2rem'
  },

  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
})

const navLink = css({
  padding: {
    base: '0.75rem 1rem',
    md: '0.5rem 1rem'
  },

  fontSize: {
    base: '16px',
    md: '14px'
  },

  color: '#333',
  textDecoration: 'none',

  _hover: {
    color: '#667eea'
  }
})
```

### Responsive Card Grid

```tsx
const cardGrid = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)'
  },

  gap: {
    base: '1rem',
    md: '1.5rem',
    lg: '2rem'
  },

  padding: {
    base: '1rem',
    md: '2rem',
    lg: '3rem'
  }
})

const card = css({
  backgroundColor: '#fff',
  borderRadius: {
    base: '8px',
    md: '12px'
  },

  padding: {
    base: '1rem',
    md: '1.5rem'
  },

  boxShadow: {
    base: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    _hover: '0 10px 15px rgba(0,0,0,0.15)'
  }
})
```

### Responsive Hero Section

```tsx
const hero = css({
  display: 'flex',
  flexDirection: {
    base: 'column',
    lg: 'row'
  },

  alignItems: 'center',
  justifyContent: 'space-between',

  minHeight: {
    base: '60vh',
    md: '70vh',
    lg: '80vh'
  },

  padding: {
    base: '2rem 1rem',
    md: '3rem 2rem',
    lg: '4rem 3rem'
  },

  gap: {
    base: '2rem',
    lg: '4rem'
  }
})

const heroTitle = css({
  fontSize: {
    base: '2rem',
    sm: '2.5rem',
    md: '3rem',
    lg: '4rem',
    xl: '5rem'
  },

  lineHeight: {
    base: '1.2',
    md: '1.1'
  },

  fontWeight: 'bold',

  maxWidth: {
    base: '100%',
    lg: '50%'
  }
})
```

## Testing Responsive Designs

Use browser DevTools to test at different breakpoints:

1. **Chrome/Edge DevTools**: Toggle device toolbar (Cmd/Ctrl + Shift + M)
2. **Firefox DevTools**: Responsive Design Mode (Cmd/Ctrl + Shift + M)
3. **Safari DevTools**: Enter Responsive Design Mode

## Next Steps

- [Theming](/guide/theming) - Learn about design tokens and theming
- [Configuration](/api/configuration) - Customize breakpoints
- [Next.js Integration](/guide/nextjs) - Framework-specific tips
