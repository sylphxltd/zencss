# Quick Start Guide

Get the SWC plugin up and running in 5 minutes.

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** installed
- **Rust toolchain** installed (see below)
- **Next.js 15+** project (for testing)

## 1. Install Rust (if not already installed)

### macOS / Linux

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Windows

Download and run [rustup-init.exe](https://rustup.rs/)

### Verify Installation

```bash
rustc --version
cargo --version
```

## 2. Add WASM Target

```bash
rustup target add wasm32-wasip1
```

## 3. Clone and Build

```bash
# Clone the repository
git clone https://github.com/SylphxAI/silk.git
cd silk/packages/swc-plugin

# Install dependencies
npm install

# Build the plugin
npm run build
```

**Output:** `target/wasm32-wasip1/release/swc_plugin_silk.wasm`

## 4. Run Tests

```bash
# Run all tests
npm test

# Or individually
npm run test:rust     # Rust unit tests
npm run test:vitest   # Integration tests
```

## 5. Test with Next.js

### Option A: Use Example Project

```bash
cd ../../examples/nextjs-16-turbopack

# Install dependencies
npm install

# Uncomment plugin config in next.config.js
# Uncomment Silk imports in app/page.tsx

# Run dev server
npm run dev
```

### Option B: Use Your Own Project

1. **Install Silk:**
   ```bash
   npm install @sylphx/silk
   ```

2. **Configure Next.js:**
   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       swcPlugins: [
         [
           './path/to/swc_plugin_silk.wasm',
           {
             production: process.env.NODE_ENV === 'production',
             classPrefix: 'silk',
           }
         ]
       ]
     }
   }
   ```

3. **Use in Code:**
   ```typescript
   // app/page.tsx
   import { css } from '@sylphx/silk'

   const button = css({
     bg: 'blue',
     color: 'white',
     p: 4,
     rounded: 8,
   })

   export default function Page() {
     return <button className={button}>Click me</button>
   }
   ```

4. **Run:**
   ```bash
   npm run dev --turbopack
   ```

## 6. Verify It Works

### Check Browser DevTools

1. **Inspect button element:**
   - Should have classes like `silk_bg_blue_a7f3 silk_color_white_b2e4`

2. **View page source:**
   - No `css()` calls should remain
   - Classes should be string literals

3. **Check console:**
   - No SWC plugin errors

### Test HMR

1. Change a style value
2. Save the file
3. Verify instant update without page reload

## Common Issues

### `cargo: command not found`

**Solution:** Rust is not installed or not in PATH.

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### `error: target 'wasm32-wasip1' not found`

**Solution:** WASM target not installed.

```bash
rustup target add wasm32-wasip1
```

### `Module not found: Can't resolve '@sylphx/silk'`

**Solution:** Install Silk package.

```bash
npm install @sylphx/silk
```

### Plugin doesn't transform code

**Solution:** Verify WASM path in `next.config.js` is correct.

```javascript
// Use absolute path
const path = require('path')

module.exports = {
  experimental: {
    swcPlugins: [
      [
        path.resolve(__dirname, './path/to/swc_plugin_silk.wasm'),
        { production: true }
      ]
    ]
  }
}
```

### Build is slow

**Solution:** Use debug build during development.

```bash
# Debug build (faster)
cargo build --target wasm32-wasip1

# Release build (slower, smaller)
cargo build --release --target wasm32-wasip1
```

## Next Steps

Once you have the plugin working:

1. **Read documentation:**
   - [README.md](./README.md) - Overview and usage
   - [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
   - [BUILD.md](./BUILD.md) - Detailed build instructions
   - [TESTING.md](./TESTING.md) - Testing guide

2. **Try advanced features:**
   - Custom class prefix
   - Production mode optimizations
   - Integration with CSS collection

3. **Report issues:**
   - [GitHub Issues](https://github.com/SylphxAI/silk/issues)

## Performance Comparison

After setup, compare performance vs Babel:

```bash
# Time with Babel
npm run build

# Time with SWC plugin (should be 20-70x faster)
npm run build
```

## Development Workflow

For active development:

```bash
# Terminal 1: Watch Rust code
cd packages/swc-plugin
cargo watch -x 'build --target wasm32-wasip1'

# Terminal 2: Watch tests
npm run test:watch

# Terminal 3: Run Next.js dev server
cd examples/nextjs-16-turbopack
npm run dev
```

## Help & Support

- **Documentation:** See README.md and other .md files
- **Issues:** https://github.com/SylphxAI/silk/issues
- **Discussions:** https://github.com/SylphxAI/silk/discussions

## Summary

```bash
# Complete setup in one go
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32-wasip1

git clone https://github.com/SylphxAI/silk.git
cd silk/packages/swc-plugin
npm install
npm run build
npm test

cd ../../examples/nextjs-16-turbopack
npm install
npm run dev
```

**You're all set!** 🚀
