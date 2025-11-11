# Silk Zero-Runtime - Dev Server & HMR Testing Guide

## Quick Start

```bash
cd examples/vite-react-test
bun install
bun run dev
```

Open browser at `http://localhost:5173`

---

## Test Checklist

### ✅ 1. Build-Time Compilation

**Test:** Open DevTools > Elements > Inspect any button

**Expected:**
- Class names like: `silk_bg_blue_xxxx silk_p_4_xxxx silk_rounded_8_xxxx`
- Each class has a unique hash
- No inline styles from Silk

**Verify:**
```javascript
// In browser console
document.querySelector('button').className
// Should output: "silk_bg_blue_xxxx silk_color_white_xxxx ..." (multiple atomic classes)
```

---

### ✅ 2. CSS Extraction

**Test:** Open DevTools > Network tab > Refresh page

**Expected:**
- `silk.css` file loaded (~1KB)
- Contains atomic CSS rules: `.silk_bg_blue_xxxx { background-color: blue; }`

**Verify:**
```bash
# Check generated CSS
cat dist/silk.css
# Should contain atomic classes with hashed names
```

---

### ✅ 3. Zero Runtime

**Test:** Check bundle size and imports

**Expected:**
- No `createStyleSystem` import in built JS
- No runtime CSS generation code
- `css()` calls replaced with string literals

**Verify:**
```bash
# Check built JS doesn't contain runtime
grep -i "createStyleSystem" dist/assets/*.js
# Should return nothing

# Check css() was transformed to strings
grep -o "silk_bg_blue_[a-z0-9]*" dist/assets/*.js | head -3
# Should show class name strings
```

---

### ✅ 4. Hot Module Replacement (HMR)

**Test:** Edit styles while dev server running

**Steps:**
1. Run `bun run dev`
2. Click "Increment" button a few times (count = 3)
3. Edit `src/App.tsx` - change button background:
   ```typescript
   const button = css({
     bg: 'green', // Change from 'blue' to 'green'
     // ...
   })
   ```
4. Save file

**Expected:**
- ✅ Button color changes instantly
- ✅ Counter stays at 3 (state preserved!)
- ✅ No page reload
- ✅ Console shows: `[Silk] Compiled X CSS rules from App.tsx`

**Screenshot:**
```
Before:  [Increment: blue] Count: 3
After:   [Increment: green] Count: 3  ← State preserved!
```

---

### ✅ 5. Pseudo-Selectors

**Test:** Hover over "Reset" button

**Expected:**
- Background darkens (red → darkred)
- Scale animation (1 → 1.05)
- Smooth transition

**Verify CSS:**
```css
.silk_bg_darkred_xxxx:hover { background-color: darkred; }
.silk_transform_scale_xxxx:hover { transform: scale(1.05); }
```

---

### ✅ 6. Focus States

**Test:** Click input field

**Expected:**
- Border changes from `#ccc` to `blue`
- No default outline (removed)

**Verify:**
```css
.silk_borderColor_blue_xxxx:focus { border-color: blue; }
.silk_outline_none_xxxx:focus { outline: none; }
```

---

## Performance Verification

### Production Build

```bash
bun run build
```

**Expected output:**
```
[Silk] Compiled 25 CSS rules
[Silk] Brotli: 389B (-61.1%)
[Silk] Gzip: 472B (-52.8%)

📦 Silk CSS Bundle:
  Original: 1.00 kB (silk.css)
  Rules: 25 atomic classes

dist/silk.css         1.00 kB
dist/silk.css.br      0.39 kB  ← Pre-compressed
dist/silk.css.gz      0.47 kB  ← Pre-compressed
```

### Bundle Analysis

```bash
# Check JS bundle size
ls -lh dist/assets/*.js
# Should be ~146KB gzipped (includes React)

# Verify CSS is separate
ls -lh dist/silk.css*
# CSS files should exist
```

---

## Common Issues

### Issue: `css()` not transformed

**Symptoms:**
- Error: "css() must be transformed at build-time"
- Runtime error in browser

**Fix:**
```typescript
// ❌ Wrong - runtime call
const { css } = createStyleSystem()

// ✅ Correct - build-time import
import { css } from '@sylphx/silk'
```

---

### Issue: HMR not working

**Symptoms:**
- Full page reload on save
- State not preserved

**Fix:**
1. Check Vite config has silk plugin **before** react plugin
2. Ensure `enforce: 'pre'` is set
3. Clear `.vite` cache: `rm -rf node_modules/.vite`

---

### Issue: CSS not extracted

**Symptoms:**
- No `silk.css` in dist folder
- Styles not applied

**Debug:**
```bash
# Check if Babel plugin ran
bun run build 2>&1 | grep Silk
# Should show: [Silk] Compiled X CSS rules

# Check if CSS was generated
cat dist/silk.css
```

---

## Next Steps

After verifying all tests pass:

1. ✅ **Phase 2B Complete** - Zero-runtime working
2. 📝 **Phase 2C** - Update framework integrations (Next.js, Remix, etc.)
3. 📚 **Phase 2D** - Write user documentation
4. 🚀 **Phase 2E** - Publish v2.0.0 to npm

---

## Dev Server Commands

```bash
# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run build && tsc --noEmit
```

---

## Questions?

Check the main README or create an issue at:
https://github.com/SylphxAI/silk/issues
