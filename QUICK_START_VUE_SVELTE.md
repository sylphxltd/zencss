# Quick Start - Vue & Svelte

## Vue 3 (Vite) ✅

### 安裝

```bash
npm install @sylphx/silk @sylphx/silk-vite-plugin
```

### 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [vue(), silk()]
})
```

### 使用

```vue
<!-- App.vue -->
<script setup lang="ts">
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem({})

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f5f5f5'
  } as any),
  title: css({
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50'
  } as any)
}
</script>

<template>
  <div :class="styles.container.className">
    <h1 :class="styles.title.className">Vue + Silk ✅</h1>
  </div>
</template>
```

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'silk.css'  // ← 導入虛擬 CSS module

createApp(App).mount('#app')
```

---

## Vue 2 / Vue CLI (Webpack) ✅

### 安裝

```bash
npm install @sylphx/silk @sylphx/silk-webpack-plugin
```

### 配置

```javascript
// vue.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [new SilkWebpackPlugin()]
  }
}
```

### 使用

```vue
<!-- App.vue -->
<script>
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem({})

export default {
  data() {
    return {
      styles: {
        container: css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }),
        title: css({
          fontSize: '2rem',
          color: '#2c3e50'
        })
      }
    }
  }
}
</script>

<template>
  <div :class="styles.container.className">
    <h1 :class="styles.title.className">Vue 2 + Silk ✅</h1>
  </div>
</template>
```

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'
import 'silk.css'  // ← 導入虛擬 CSS module

new Vue({
  render: h => h(App)
}).$mount('#app')
```

---

## Nuxt 3 (暫時方案)

Nuxt 3 基於 Vite，暫時可以直接用 Vite plugin：

```typescript
// nuxt.config.ts
import silk from '@sylphx/silk-vite-plugin'

export default defineNuxtConfig({
  vite: {
    plugins: [silk()]
  }
})
```

```vue
<!-- app.vue -->
<script setup>
import 'silk.css'
</script>
```

**注意**: 計劃實現專門的 `@sylphx/silk-nuxt` module，提供更好的集成。

---

## Svelte (Vite) ✅

### 安裝

```bash
npm install @sylphx/silk @sylphx/silk-vite-plugin
```

### 配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import silk from '@sylphx/silk-vite-plugin'

export default defineConfig({
  plugins: [svelte(), silk()]
})
```

### 使用

```svelte
<!-- App.svelte -->
<script lang="ts">
  import { createStyleSystem } from '@sylphx/silk'

  const { css } = createStyleSystem({})

  const styles = {
    container: css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: '#f5f5f5'
    } as any),
    title: css({
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#ff3e00'
    } as any)
  }
</script>

<div class={styles.container.className}>
  <h1 class={styles.title.className}>Svelte + Silk ✅</h1>
</div>
```

```typescript
// main.ts
import App from './App.svelte'
import 'silk.css'  // ← 導入虛擬 CSS module

const app = new App({
  target: document.getElementById('app')!
})

export default app
```

---

## SvelteKit ✅

### 安裝

```bash
npm install @sylphx/silk @sylphx/silk-vite-plugin
```

### 配置

```javascript
// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite'
import silk from '@sylphx/silk-vite-plugin'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), silk()]
}

export default config
```

### 使用

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import 'silk.css'  // ← 全局導入
</script>

<slot />
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { createStyleSystem } from '@sylphx/silk'

  const { css } = createStyleSystem({})

  const styles = {
    hero: css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    } as any)
  }
</script>

<div class={styles.hero.className}>
  <h1>SvelteKit + Silk ✅</h1>
</div>
```

---

## 常見問題

### Q: Vue 3 Composition API 可以用嗎？

A: 可以！`createStyleSystem()` 與 Composition API 完全兼容：

```vue
<script setup lang="ts">
import { createStyleSystem } from '@sylphx/silk'

const { css } = createStyleSystem({})

const buttonStyle = css({
  padding: '1rem 2rem',
  backgroundColor: '#42b983'
} as any)
</script>

<template>
  <button :class="buttonStyle.className">Click</button>
</template>
```

### Q: Svelte 的 reactive statements 會觸發 CSS 重新生成嗎？

A: 不會。CSS 在 build time 生成，runtime 只返回 class name。這是 zero-runtime 的核心優勢。

### Q: 可以在 Nuxt 3 用嗎？

A: 可以，暫時用 Vite plugin。計劃實現專門的 Nuxt module 提供更好的集成（如 auto-import 等）。

### Q: 點解要 `as any`？

A: TypeScript strict mode 下，CSS 屬性值的類型檢查比較嚴格。用 `as any` 可以繞過。我們計劃改進類型定義來避免這個問題。

---

## 完整示例

完整的 Vue 和 Svelte 示例項目：

```bash
# Vue 3 示例
git clone https://github.com/SylphxAI/silk-examples
cd silk-examples/vue-vite-app
npm install
npm run dev

# Svelte 示例
cd ../svelte-vite-app
npm install
npm run dev

# SvelteKit 示例
cd ../sveltekit-app
npm install
npm run dev
```

---

## 總結

### ✅ 已支援（開箱即用）

- Vue 3 (Vite) → `@sylphx/silk-vite-plugin`
- Vue 2 (Vue CLI) → `@sylphx/silk-webpack-plugin`
- Svelte (Vite) → `@sylphx/silk-vite-plugin`
- SvelteKit → `@sylphx/silk-vite-plugin`

### 📋 計劃支援

- Nuxt 3 → `@sylphx/silk-nuxt` (專門的 Nuxt module)

### 🎯 優勢

1. **Zero-codegen**: 無需手動運行 `generate` 命令
2. **Zero-runtime**: CSS 在 build time 生成，runtime 沒有性能開銷
3. **Framework CSS Pipeline**: CSS 走框架的官方處理流程（PostCSS, minification, cache busting）
4. **Type-safe**: 完整的 TypeScript 支援
5. **HMR**: Hot Module Replacement 支援
