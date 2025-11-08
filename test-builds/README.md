# Framework Build Tests

Systematic build tests for all supported Silk frameworks. **Must pass before each release.**

## 🎯 Test Coverage

### ✅ Implemented Tests

| # | Framework | Type | Method | Status |
|---|-----------|------|--------|--------|
| 1 | **Vite + React** | No-codegen | Virtual module | ✅ Tested |
| 2 | **Webpack** | No-codegen | Virtual module | ✅ Tested |
| 3 | **Next.js (webpack)** | No-codegen | Virtual module | ✅ Tested |
| 4 | **Next.js (turbopack)** | Semi-codegen | CLI tool | ✅ Tested |
| 5 | **Vue 3 + Vite** | No-codegen | Virtual module | ✅ Tested |
| 6 | **Nuxt 3** | No-codegen | Auto-import | ✅ Tested |
| 7 | **Svelte + Vite** | No-codegen | Virtual module | ✅ Tested |
| 8 | **SvelteKit** | No-codegen | Virtual module | ✅ Tested |

### 🎯 Test Requirements

Each test must verify:

1. ✅ **Build succeeds** - No compilation errors
2. ✅ **CSS generated** - Output file exists
3. ✅ **Correct size** - CSS file is not empty
4. ✅ **Correct location** - CSS in expected output directory
5. ✅ **Framework pipeline** - CSS processed through framework tools

---

## 🚀 Running Tests

### Run All Tests

```bash
cd test-builds
./run-all-tests.sh
```

### Run Specific Test

```bash
cd test-builds/vite-app
npm install
npm run build
```

### Clean All Tests

```bash
cd test-builds
rm -rf */node_modules */dist */.next */package-lock.json
```

---

## 📋 Test Setup

### Creating a New Test

1. **Create test directory**:
   ```bash
   mkdir -p test-builds/my-framework-app/src
   ```

2. **Add package.json**:
   ```json
   {
     "name": "test-my-framework-app",
     "dependencies": {
       "@sylphx/silk": "file:../../packages/core"
     },
     "devDependencies": {
       "@sylphx/silk-vite-plugin": "file:../../packages/vite-plugin"
     }
   }
   ```

3. **Add framework config**:
   ```typescript
   // vite.config.ts / next.config.js / etc.
   import silk from '@sylphx/silk-vite-plugin'

   export default {
     plugins: [silk({ debug: true })]
   }
   ```

4. **Add test component**:
   ```typescript
   import { createStyleSystem } from '@sylphx/silk'
   import 'silk.css'

   const { css } = createStyleSystem({})

   const styles = {
     test: css({ color: 'blue' } as any)
   }
   ```

5. **Add to test script**:
   Update `run-all-tests.sh` with new test case.

---

## 🔧 CI/CD Integration

### GitHub Actions

Tests run automatically on:
- ✅ Push to `main` or `develop`
- ✅ Pull requests
- ✅ Manual trigger (`workflow_dispatch`)

**Test workflow**: `.github/workflows/test.yml`

### Test Jobs

1. **test-frameworks**: Runs all framework build tests
2. **unit-tests**: Runs core unit tests (400+ tests)
3. **lint-and-type-check**: TypeScript compilation
4. **release-check**: Validates all tests before release

### Pre-Release Requirements

Before publishing to npm:

```bash
# 1. Run all tests
cd test-builds && ./run-all-tests.sh

# 2. Verify unit tests
cd packages/core && bun test

# 3. Build all packages
bun run build

# 4. Check CI status
# All GitHub Actions must be green ✅
```

---

## 📊 Test Results

### Current Status

Run `./run-all-tests.sh` to see:

```
╔════════════════════════════════════════════════════════╗
║         Silk Framework Build Tests                    ║
╚════════════════════════════════════════════════════════╝

📦 Test 1: Vite + React (No-codegen)
  ✅ Build passed
  ✅ CSS generated: index-abc123.css (407 bytes)
  ✅ Virtual module → Vite CSS pipeline

...

╔════════════════════════════════════════════════════════╗
║              Test Summary                              ║
╚════════════════════════════════════════════════════════╝

  Total Tests:  8
  Passed:       8
  Failed:       0
  Skipped:      0
  Duration:     21s

╔════════════════════════════════════════════════════════╗
║  ✅ All tests passed! Ready for release.              ║
╚════════════════════════════════════════════════════════╝
```

---

## 🐛 Troubleshooting

### Test Fails with "Module not found"

```bash
# Rebuild all packages
cd packages/core && bun run build
cd ../vite-plugin && bun run build
cd ../webpack-plugin && bun run build
```

### Test Fails with "npm install error"

```bash
# Use workspace root dependencies
cd test-builds/my-app
rm -rf node_modules package-lock.json
npm install
```

### Test Passes but CSS not generated

Check build output:
```bash
cd test-builds/my-app
npm run build 2>&1 | grep -i "silk"
```

Look for Silk plugin logs.

---

## 📚 Documentation

- [Framework Support Matrix](../FRAMEWORK_SUPPORT.md)
- [Quick Start Guides](../FRAMEWORK_QUICKSTART.md)
- [Test Results](../TEST_RESULTS.md)
- [Implementation Summary](../IMPLEMENTATION_COMPLETE.md)

---

## ✅ Release Checklist

Before each release:

- [ ] All framework tests pass (`./run-all-tests.sh`)
- [ ] Unit tests pass (400+ tests)
- [ ] Type checking passes
- [ ] GitHub Actions green
- [ ] Changelog updated
- [ ] Version bumped

**Only release when all tests pass!** ✅
