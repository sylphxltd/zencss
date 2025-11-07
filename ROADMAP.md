# ZenCSS Roadmap

Based on research of Tailwind v4, Panda CSS, and modern CSS-in-JS best practices (2024).

## 🔴 Critical Missing Features (Must Have)

These are **essential** features that every modern CSS-in-JS library needs:

### 1. **Responsive Breakpoints** ⚠️ HIGHEST PRIORITY
**Status**: TODO in code
**Why**: 50% of web traffic is mobile. This is non-negotiable.

```typescript
// Current: Not implemented
css({ fontSize: 'lg' })

// Needed:
css({
  fontSize: 'sm',
  md: { fontSize: 'lg' },
  lg: { fontSize: 'xl' }
})

// Or inline syntax:
css({ fontSize: { base: 'sm', md: 'lg', lg: 'xl' } })
```

**Implementation**:
- Media query generation
- Mobile-first or desktop-first approach
- Breakpoint tokens in config
- Type inference for breakpoint props

---

### 2. **Container Queries** 🔥 NEW STANDARD
**Status**: Missing
**Why**: Tailwind v4 built-in, game-changer for component modularity

```typescript
// Needed:
css({
  '@container': {
    sm: { fontSize: 'lg' },
    lg: { columns: 2 }
  }
})

// Or:
const Card = styled('div', {
  containerType: 'inline-size',
  '@sm': { padding: 4 },
  '@lg': { padding: 8 }
})
```

**Benefits**:
- Component-level responsive (not viewport-based)
- More reusable components
- Better composition

---

### 3. **Variants & Recipes** 🎯 CORE PATTERN
**Status**: Missing
**Why**: Panda CSS's killer feature, industry standard for component variants

```typescript
// Recipes: Multi-variant components
const button = recipe({
  base: {
    borderRadius: 'md',
    fontWeight: 'semibold',
  },
  variants: {
    visual: {
      solid: { bg: 'blue.500', color: 'white' },
      outline: { borderWidth: '1px', borderColor: 'blue.500' },
      ghost: { bg: 'transparent' }
    },
    size: {
      sm: { px: 3, py: 1, fontSize: 'sm' },
      md: { px: 4, py: 2, fontSize: 'md' },
      lg: { px: 6, py: 3, fontSize: 'lg' }
    }
  },
  compoundVariants: [
    {
      visual: 'solid',
      size: 'lg',
      css: { boxShadow: 'lg' }
    }
  ],
  defaultVariants: {
    visual: 'solid',
    size: 'md'
  }
})

// Usage:
<Button visual="outline" size="lg">Click me</Button>
```

**Key Features**:
- Type-safe variant props
- Compound variants (combinations)
- Default variants
- Zero runtime overhead (build-time)

---

### 4. **Theming & Dark Mode** 🌓 ESSENTIAL
**Status**: Missing
**Why**: Modern apps need theme switching

```typescript
// Semantic tokens
const config = defineConfig({
  semanticTokens: {
    colors: {
      bg: {
        DEFAULT: { light: 'white', dark: 'gray.900' },
        subtle: { light: 'gray.50', dark: 'gray.800' }
      },
      text: {
        DEFAULT: { light: 'gray.900', dark: 'white' }
      }
    }
  }
})

// Usage:
css({ bg: 'bg', color: 'text' })

// With theme toggle:
setTheme('dark') // Switches all semantic tokens
```

**Implementation Options**:
1. **CSS Variables** (recommended): `var(--silk-colors-bg)`
2. **Class-based**: `.dark .component { ... }`
3. **Data attributes**: `[data-theme="dark"]`

---

### 5. **CSS Variables / Custom Properties** 🎨 DYNAMIC THEMING
**Status**: Missing
**Why**: Runtime theme changes, user customization

```typescript
// Generate CSS variables
const system = createStyleSystem(config, {
  cssVarRoot: ':root',
  useCustomProperties: true
})

// Outputs:
// :root {
//   --silk-colors-blue-500: #3b82f6;
//   --silk-spacing-4: 1rem;
// }

// Runtime changes:
document.documentElement.style.setProperty('--silk-colors-blue-500', '#custom')
```

---

## 🟡 High Priority Features

### 6. **Slot Recipes** (Complex Components)
Multi-part component styling:

```typescript
const card = slotRecipe({
  slots: ['root', 'header', 'body', 'footer'],
  base: {
    root: { bg: 'white', borderRadius: 'lg' },
    header: { p: 4, borderBottom: '1px solid' },
    body: { p: 4 },
    footer: { p: 4, bg: 'gray.50' }
  },
  variants: {
    size: {
      sm: {
        header: { p: 2 },
        body: { p: 2 }
      },
      lg: {
        header: { p: 6 },
        body: { p: 6 }
      }
    }
  }
})
```

---

### 7. **Animation & Transitions** ✨
**Status**: Minimal
**Why**: Common use case, Tailwind v4 added @starting-style

```typescript
const config = defineConfig({
  animations: {
    spin: 'spin 1s linear infinite',
    fadeIn: 'fadeIn 0.3s ease-in'
  },
  keyframes: {
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' }
    },
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 }
    }
  }
})

css({
  animation: 'fadeIn',
  transition: 'all 0.3s ease'
})

// With @starting-style (CSS native):
css({
  opacity: 1,
  '@starting-style': {
    opacity: 0
  }
})
```

---

### 8. **Advanced Gradients** 🌈
**Status**: Basic
**Why**: Tailwind v4 expanded gradient APIs

```typescript
css({
  background: 'linear-gradient(red, blue)',

  // Radial gradients
  background: 'radial-gradient(circle, red, blue)',

  // Conic gradients
  background: 'conic-gradient(from 0deg, red, blue)',

  // With interpolation
  background: 'linear-gradient(in oklch, red, blue)'
})
```

---

### 9. **3D Transforms** 📦
**Status**: Missing
**Why**: Tailwind v4 new feature

```typescript
css({
  transform: 'rotateX(45deg) rotateY(45deg)',
  transformStyle: 'preserve-3d',
  perspective: '1000px'
})
```

---

### 10. **CSS Layers (@layer)** 🏗️
**Status**: Missing
**Why**: Manage specificity, avoid conflicts

```typescript
// Generate in layers
const system = createStyleSystem(config, {
  layers: {
    reset: 0,
    base: 1,
    tokens: 2,
    recipes: 3,
    utilities: 4
  }
})

// Outputs:
// @layer reset { ... }
// @layer base { ... }
// @layer utilities { .silk-abc { ... } }
```

**Benefits**:
- Predictable specificity
- Easy override
- No `!important` needed

---

## 🟢 Nice to Have Features

### 11. **Composition / Mixins**
```typescript
const centered = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

const button = css({
  ...centered,
  bg: 'blue.500',
  color: 'white'
})
```

### 12. **Conditions** (Advanced Selectors)
```typescript
css({
  color: 'red',

  // Pseudo classes
  _hover: { color: 'blue' },
  _focus: { color: 'green' },

  // Pseudo elements
  _before: { content: '""' },
  _after: { content: '""' },

  // Advanced
  _firstChild: { ... },
  _lastChild: { ... },
  _not: { disabled: { opacity: 1 } },
  _has: { '[data-active]': { bg: 'blue' } },

  // Media features
  _dark: { bg: 'gray.900' },
  _light: { bg: 'white' },
  _print: { display: 'none' },
  _motionReduce: { animation: 'none' }
})
```

### 13. **Grid Utilities** 📐
```typescript
css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 4
})

// Helper patterns
const grid = pattern({
  cols: 3,
  gap: 4
})
```

### 14. **RTL Support** 🌍
```typescript
css({
  marginStart: 4,  // margin-left in LTR, margin-right in RTL
  marginEnd: 2,

  _ltr: { paddingLeft: 4 },
  _rtl: { paddingRight: 4 }
})
```

### 15. **Critical CSS Extraction** ⚡
For above-the-fold optimization:

```typescript
zenCSS({
  critical: {
    enabled: true,
    paths: ['/', '/about'],
    inline: true  // Inline in HTML
  }
})
```

---

## 🔧 Developer Experience

### 16. **Better Error Messages**
```typescript
// Current:
css({ color: 'reds.500' })  // Silent failure or generic error

// Needed:
// ❌ Type Error: Property 'reds' does not exist in colors
//    Did you mean 'red'?
//    Available: red, blue, green, gray
```

### 17. **VS Code Extension**
- Autocomplete for design tokens
- Inline color previews
- Jump to token definition
- Refactoring support

### 18. **Dev Tools / Inspector**
Browser extension to inspect ZenCSS styles:
- Which tokens are used
- Component variants
- CSS output
- Performance metrics

### 19. **ESLint Plugin**
Enforce best practices:
- Warn on arbitrary values
- Suggest semantic tokens
- Detect unused styles

---

## 📊 Performance Optimizations

### 20. **Incremental Builds**
Tailwind v4: "100x faster incremental builds"

Current: Full rebuild on any change
Needed: Cache and rebuild only changed styles

### 21. **Tree Shaking**
Remove unused recipes/patterns from bundle

### 22. **Parallel Processing**
Build CSS in parallel using workers

---

## 🎯 Recommended Implementation Order

### Phase 1 (MVP) - **2-3 weeks**
1. ✅ Responsive Breakpoints
2. ✅ Basic Variants/Recipes
3. ✅ Dark Mode (class-based)

### Phase 2 (Core) - **3-4 weeks**
4. ✅ CSS Variables
5. ✅ Container Queries
6. ✅ Semantic Tokens
7. ✅ Animation utilities

### Phase 3 (Advanced) - **2-3 weeks**
8. ✅ Slot Recipes
9. ✅ Compound Variants
10. ✅ CSS Layers
11. ✅ 3D Transforms

### Phase 4 (Polish) - **2 weeks**
12. ✅ Better error messages
13. ✅ Dev tools
14. ✅ Critical CSS

---

## 🚀 Quick Wins (Can Implement Now)

These are relatively easy to add:

1. **More pseudo selectors**: `_firstChild`, `_lastChild`, `_odd`, `_even`
2. **Text utilities**: `textOverflow`, `wordBreak`, `whiteSpace`
3. **Cursor utilities**: `cursor: pointer`, `cursor: not-allowed`
4. **User select**: `userSelect: none`
5. **Pointer events**: `pointerEvents: none`
6. **Aspect ratio**: `aspectRatio: '16/9'`
7. **Object fit/position**: `objectFit: 'cover'`

---

## 📖 Resources & References

- [Tailwind CSS v4 Features](https://tailwindcss.com/blog/tailwindcss-v4)
- [Panda CSS Recipes](https://panda-css.com/docs/concepts/recipes)
- [Container Queries Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [CSS Layers Spec](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [Modern CSS Features 2024](https://www.builder.io/blog/css-2024-nesting-layers-container-queries)

---

**Next Step**: Start with Phase 1 (Responsive Breakpoints + Variants)
