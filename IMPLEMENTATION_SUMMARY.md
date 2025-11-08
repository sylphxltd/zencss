# 實現總結 - Framework Support

## ✅ 已完成實現

### 核心功能

1. **@sylphx/silk (core package)**
   - `scanAndGenerate()`: 掃描 src/ 搵 css() calls → 生成 CSS
   - lightningcss-wasm 優化（48%+ 壓縮）
   - Export: `@sylphx/silk/codegen`

2. **@sylphx/silk-vite-plugin**
   - Virtual module (`silk.css`)
   - 走 Vite CSS pipeline ✅
   - HMR support

3. **@sylphx/silk-webpack-plugin**
   - Virtual module (`node_modules/silk.css`)
   - 走 webpack CSS pipeline ✅
   - Watch mode support

4. **@sylphx/silk-nextjs**
   - Wrapper for SilkWebpackPlugin
   - Webpack mode: no-codegen
   - Turbopack mode: guide user to CLI

5. **@sylphx/silk-cli**
   - `silk generate`: Generate CSS
   - `silk generate --watch`: Watch mode
   - `silk init`: Create config

---

## 📊 Framework Support Matrix

| Framework | Method | Status | Setup |
|-----------|--------|--------|-------|
| **Vite** | ✅ No-codegen | ✅ Tested | `import 'silk.css'` |
| **Webpack** | ✅ No-codegen | ✅ Implemented | `import 'silk.css'` |
| **Next.js (webpack)** | ✅ No-codegen | ✅ Implemented | `import 'silk.css'` |
| **Next.js (turbopack)** | ⚠️ Semi-codegen | ✅ Implemented | `silk generate` + import |
| **Rollup** | ✅ No-codegen | 📋 Planned | Virtual module |
| **Create React App** | ✅ No-codegen | 📋 Planned | Webpack plugin via craco |

---

## ✅ No-Codegen Frameworks

### 1. Vite ✅ (已測試)

**Package**: `@sylphx/silk-vite-plugin`

**Setup**:
```typescript
// vite.config.ts
import silk from '@sylphx/silk-vite-plugin'

export default {
  plugins: [silk()]
}
```

```typescript
// main.tsx
import 'silk.css'  // Virtual module → Vite CSS pipeline
```

**架構**:
```
用戶: import 'silk.css'
  ↓
Plugin resolveId hook → '\0virtual:silk.css'
  ↓
Plugin load hook → scanAndGenerate('./src')
  ↓
Return CSS content
  ↓
Vite CSS transform
  ↓
PostCSS, minification
  ↓
Bundle with hash → dist/assets/[hash].css
```

**測試結果**:
- ✅ Build passed
- ✅ CSS generated: index-CsmmB6dj.css (407 bytes)
- ✅ Atomic classes: a0-b5
- ✅ CSS layers included
- ✅ Content hash for cache busting

---

### 2. Webpack ✅ (已實現)

**Package**: `@sylphx/silk-webpack-plugin`

**Setup**:
```javascript
// webpack.config.js
const SilkWebpackPlugin = require('@sylphx/silk-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new SilkWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  }
}
```

```javascript
// index.js
import 'silk.css'  // Virtual module → webpack CSS pipeline
```

**架構**:
```
用戶: import 'silk.css'
  ↓
webpack-virtual-modules creates node_modules/silk.css
  ↓
webpack resolves module
  ↓
css-loader processes CSS
  ↓
MiniCssExtractPlugin extracts
  ↓
Optimization, minification
  ↓
Output → dist/[hash].css
```

**測試**: 待實現（但技術上已準備好）

---

### 3. Next.js (webpack mode) ✅ (已實現)

**Package**: `@sylphx/silk-nextjs`

**Setup**:
```javascript
// next.config.js
const { withSilk } = require('@sylphx/silk-nextjs');

module.exports = withSilk({
  // Next.js config
});
```

```typescript
// app/layout.tsx
import 'silk.css'  // Virtual module → Next.js CSS pipeline
```

**Commands**:
```bash
next dev        # Webpack dev mode
next build      # Webpack production build
```

**架構**:
```
withSilk() injects SilkWebpackPlugin into Next.js webpack config
  ↓
Virtual module: node_modules/silk.css
  ↓
Next.js webpack CSS handling
  ↓
PostCSS transforms (from next.config.js)
  ↓
Optimization, minification
  ↓
Output → .next/static/css/[hash].css
  ↓
Automatic HTML injection
```

**測試**: 待實現

---

## ⚠️ Semi-Codegen Frameworks

### 1. Next.js (turbopack mode) ✅ (已實現)

**Why semi-codegen?**
- Turbopack 唔支援 webpack plugins
- Turbopack 仲未開放 virtual module API
- Next.js 無 prebuild hooks

**Setup**:

**Step 1: Config**
```javascript
// next.config.js
const { withSilk } = require('@sylphx/silk-nextjs');

module.exports = withSilk({
  // Next.js config
}, {
  turbopack: true  // 告訴 plugin 唔需要 inject webpack plugin
});
```

**Step 2: Package.json**
```json
{
  "scripts": {
    "predev": "silk generate",
    "prebuild": "silk generate --minify",
    "dev": "next dev --turbo",
    "build": "next build"
  }
}
```

**Step 3: Import**
```typescript
// app/layout.tsx
import '../src/silk.generated.css'  // Physical file → Next.js CSS pipeline
```

**架構**:
```
開發者: npm run dev
  ↓
predev script: silk generate
  ↓
CLI: scanAndGenerate('./src')
  ↓
Write → src/silk.generated.css
  ↓
用戶 import '../src/silk.generated.css'
  ↓
Next.js/Turbopack CSS handling
  ↓
PostCSS, optimization
  ↓
Output → .next/static/css/[hash].css
```

**重點**:
- ⚠️ 需要手動 run `silk generate`
- ✅ CSS 仍然走 Next.js pipeline
- ✅ 有 PostCSS transforms
- ✅ 有 cache busting

**Watch Mode (開發時)**:
```bash
# Terminal 1
silk generate --watch

# Terminal 2
next dev --turbo
```

**測試**: 待實現

---

## 🔑 關鍵區別

### No-Codegen 架構

```
import 'silk.css'
  ↓
Virtual Module (plugin creates on-the-fly)
  ↓
Framework CSS Pipeline
  ↓
Output with hash
```

**優點**:
- ✅ 完全透明
- ✅ 無需手動步驟
- ✅ Watch mode 自動更新

**缺點**:
- ⚠️ 需要 framework 支援 plugin hooks

---

### Semi-Codegen 架構

```
silk generate
  ↓
Physical File (src/silk.generated.css)
  ↓
import '../src/silk.generated.css'
  ↓
Framework CSS Pipeline
  ↓
Output with hash
```

**優點**:
- ✅ 唔需要 plugin hooks
- ✅ 仍然走 framework pipeline
- ✅ 有 PostCSS, cache busting

**缺點**:
- ⚠️ 需要手動 run (或 prebuild script)
- ⚠️ Git workflow 要決定：commit CSS 定 ignore

---

## 📈 測試狀態

### ✅ 已測試

1. **Vite (No-codegen)** ✅
   - Build: ✅ 407 bytes CSS
   - Virtual module: ✅ Resolves correctly
   - Pipeline: ✅ Goes through Vite CSS transform
   - Output: ✅ Content hash (index-CsmmB6dj.css)

### ⚠️ 待測試

2. **Webpack (No-codegen)** - 技術上準備好，待建立 test app
3. **Next.js Webpack (No-codegen)** - 技術上準備好，待建立 test app
4. **Next.js Turbopack (Semi-codegen)** - 技術上準備好，待建立 test app + CLI integration

---

## 🎯 推薦使用

### 新項目
→ **Vite** (最佳 DX, 完美 no-codegen)

### Next.js 項目
→ **Webpack mode** (no-codegen, 穩定)
```bash
next dev        # No --turbo flag
next build      # Uses webpack
```

### Next.js + 追求極速
→ **Turbopack mode** (semi-codegen, 接受手動步驟)
```bash
silk generate --watch   # Terminal 1
next dev --turbo        # Terminal 2
```

### 既有 webpack 項目
→ **SilkWebpackPlugin** (no-codegen)

---

## 📋 未來計劃

### 短期

1. **完成測試**
   - Webpack build test
   - Next.js webpack build test
   - Next.js turbopack + CLI build test

2. **Rollup Plugin**
   - 同 Vite plugin (都係 Rollup based)
   - Virtual module approach

3. **Create React App Support**
   - 用 webpack plugin via craco/react-app-rewired

### 中期

4. **其他框架**
   - Remix (用 Vite plugin)
   - Astro (Integration API)
   - SvelteKit (Vite plugin)

### 長期

5. **Turbopack Plugin API**
   - 等 Turbopack 開放 plugin API
   - 實現真正 no-codegen for Turbopack

6. **AST Parsing**
   - 從 regex 改用 @babel/parser 或 @swc/core
   - 更準確既 css() 檢測

7. **Incremental Generation**
   - Cache results
   - 只 re-parse changed files
   - 提升大型項目性能

---

## 📊 Commits 總結

```
566c0b6 test: add Vite build test (no-codegen) ✅
d835bf6 feat(cli): implement silk CLI tool for semi-codegen
40b490d feat(nextjs-plugin): rewrite to use SilkWebpackPlugin
b0cb853 docs: add comprehensive framework support matrix
943db4a feat(webpack-plugin): implement zero-codegen plugin
ab12670 feat(vite-plugin): rewrite to use virtual CSS module
cd451e6 feat(core): add scanAndGenerate for build-time extraction
30b6fc4 research: webpack virtual module support confirmed ✅
15f2077 docs: add unified CSS generation process design
```

**Total: 9 commits** implementing complete architecture

---

## ✅ 結論

### 可以 No-Codegen 既框架

1. **Vite** ✅ (已測試)
   - Virtual module via resolveId + load hooks
   - `import 'silk.css'`

2. **Webpack** ✅ (已實現)
   - Virtual module via webpack-virtual-modules
   - `import 'silk.css'`

3. **Next.js (webpack)** ✅ (已實現)
   - 用 SilkWebpackPlugin
   - `import 'silk.css'`

### 需要 Semi-Codegen 既框架

1. **Next.js (turbopack)** ✅ (已實現)
   - 原因：Turbopack 無 plugin API
   - 方法：`silk generate` + `import '../src/silk.generated.css'`

### 重點

**兩種方法 CSS 都走 framework pipeline** ✅

區別只係：
- **No-codegen**: Virtual module (自動)
- **Semi-codegen**: Physical file (手動 generate)

但最後都係：
```
→ Framework CSS Pipeline
  → PostCSS transforms
  → Minification
  → Cache busting
  → Output with hash
```

**所以都係正確既做法！** 🎉
