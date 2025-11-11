# @sylphx/silk-vue

Vue 3 bindings for Silk - zero-runtime CSS-in-TypeScript with **Composition API** and **reactive styling**.

## Installation

```bash
npm install @sylphx/silk-vue
# or
bun add @sylphx/silk-vue
```

## Quick Start

### 1. Create Silk Config

```typescript
// src/silk.config.ts
import { defineConfig } from '@sylphx/silk'
import { createSilkVue } from '@sylphx/silk-vue'

export const { styled, Box, Flex, Grid, css } = createSilkVue(
  defineConfig({
    colors: {
      brand: { 500: '#3b82f6' }
    },
    spacing: { 4: '1rem' }
  })
)
```

### 2. Use Styled Components

```vue
<script setup lang="ts">
import { styled } from '../silk.config'

const Button = styled('button', {
  bg: 'brand.500',
  px: 4,
  py: 2,
  color: 'white',
  _hover: { opacity: 0.8 }
})
</script>

<template>
  <Button>Click me</Button>
</template>
```

### 3. Use in App

```vue
<script setup lang="ts">
import { Box } from './silk.config'
import { Button } from './components/Button.vue'
</script>

<template>
  <Box :px="4" :py="6">
    <h1>Welcome to Silk + Vue!</h1>
    <Button>Click me</Button>
  </Box>
</template>
```

## Features

### ✅ Composition API Support
- Perfect integration with Vue 3 Composition API
- Reactive style props
- `<script setup>` syntax support

### ✅ Type Safety
- Full TypeScript support
- Only design tokens allowed
- Compile-time validation

### ✅ Zero Runtime
- CSS extracted at build time
- No runtime overhead
- Smallest possible bundles

### ✅ Modern CSS
- Container queries (93% support)
- @scope (85% support)
- @starting-style (88% support)
- OKLCH colors, color-mix

## Advanced Usage

### Styled Components with Props

```vue
<script setup lang="ts">
import { styled } from './silk.config'
import { computed } from 'vue'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary'
})

const StyledButton = styled('button', {
  px: 4,
  py: 2
})

const buttonStyles = computed(() => ({
  bg: props.variant === 'secondary' ? 'gray.200' : 'brand.500',
  color: props.variant === 'secondary' ? 'gray.900' : 'white'
}))
</script>

<template>
  <StyledButton v-bind="buttonStyles">
    <slot />
  </StyledButton>
</template>
```

### Dynamic Styles with Reactivity

```vue
<script setup lang="ts">
import { css } from './silk.config'
import { ref, computed } from 'vue'

const count = ref(0)

const containerStyle = css({
  display: 'flex',
  gap: 4,
  p: 4
})

const buttonStyle = computed(() => css({
  bg: count.value > 5 ? 'red.500' : 'blue.500',
  color: 'white',
  px: 4,
  py: 2
}))
</script>

<template>
  <div :class="containerStyle">
    <button :class="buttonStyle" @click="count++">
      Count: {{ count }}
    </button>
  </div>
</template>
```

### Container Queries

```vue
<script setup lang="ts">
import { styled } from './silk.config'

const ResponsiveCard = styled('div', {
  containerType: 'inline-size',
  display: 'flex',
  flexDirection: 'column',

  '@container (min-width: 400px)': {
    flexDirection: 'row',
    gap: 4
  }
})
</script>

<template>
  <ResponsiveCard>
    <div>Left</div>
    <div>Right</div>
  </ResponsiveCard>
</template>
```

### Layout Primitives

```vue
<script setup lang="ts">
import { Box, Flex, Grid } from './silk.config'
</script>

<template>
  <!-- Box - Basic container -->
  <Box :p="4" :bg="'gray.100'">
    <h1>Hello</h1>
  </Box>

  <!-- Flex - Flexbox layout -->
  <Flex :gap="4" :justify-content="'space-between'" :align-items="'center'">
    <div>Left</div>
    <div>Right</div>
  </Flex>

  <!-- Grid - Grid layout -->
  <Grid :grid-template-columns="'repeat(3, 1fr)'" :gap="4">
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </Grid>
</template>
```

## Vite Setup

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    // Silk Vite plugin for CSS extraction
  ],
})
```

## Nuxt Integration

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    // Silk works out of the box with Nuxt 3!
  ],
  vite: {
    // Add Silk Vite plugin here if needed
  }
})
```

## Performance Comparison

| Framework | Bundle Size | Re-renders | Reactivity |
|-----------|-------------|------------|------------|
| **Silk + Vue** | **500B** | ✅ Minimal | ✅ Fine-grained |
| Styled Components | 15KB | ❌ Many | ⚠️ Component-level |
| Emotion | 12KB | ❌ Many | ⚠️ Component-level |

Vue 3's reactivity + Silk's zero-runtime = **Optimal styling solution**.

## Ecosystem

- **[@sylphx/silk](https://www.npmjs.com/package/@sylphx/silk)** - Core styling system
- **[@sylphx/silk-react](https://www.npmjs.com/package/@sylphx/silk-react)** - React bindings
- **[@sylphx/silk-vite-plugin](https://www.npmjs.com/package/@sylphx/silk-vite-plugin)** - Vite plugin

## Documentation

Full documentation: [GitHub Repository](https://github.com/SylphxAI/silk)

## License

MIT © [SylphX Ltd](https://sylphx.com)
