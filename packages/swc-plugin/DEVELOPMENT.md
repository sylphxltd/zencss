# SWC Plugin Development Guide

## Current Status

🚧 **Initial scaffolding complete** - Basic structure is in place, but the plugin is not functional yet.

## What's Done

✅ Project structure created
✅ Cargo.toml with dependencies configured
✅ Basic `VisitMut` visitor skeleton
✅ `is_css_call()` function to detect css() calls
✅ Configuration struct with serde
✅ package.json with build scripts

## What's Needed

### Phase 1: Core Transformation

- [ ] **Parse ObjectExpression arguments**
  - Extract property-value pairs from `css({ bg: 'red', p: 4 })`
  - Handle nested objects (pseudo-selectors, responsive values)

- [ ] **Generate class names**
  - Port hash generation logic from Babel plugin
  - Implement property shorthand expansion (bg → background-color)

- [ ] **Generate CSS rules**
  - Convert property-value pairs to CSS strings
  - Handle units (numbers → px/rem)
  - Resolve color tokens

- [ ] **Replace CallExpression**
  - Transform `css({...})` → `"silk_bg_red_a7f3 silk_p_4_b2e1"`
  - Return string literal with generated class names

### Phase 2: CSS Collection & Output

This is the **hardest part**. Unlike Babel plugin which uses `metadata`, SWC plugins run in WASM and can't easily write files.

**Options:**

1. **Use SWC comments** (similar to styled-components)
   ```rust
   // Inject: /*! silk:css .silk_bg_red_a7f3{background-color:red} */
   ```
   Then create a webpack/vite loader to extract these comments

2. **Use virtual modules** (complex)
   ```rust
   // Generate: import 'silk:css!a7f3'
   ```

3. **Use SWC metadata** (if available in newer versions)
   Check if SWC now supports metadata like Babel

4. **Hybrid approach** (recommended for now)
   - SWC plugin for transformation only
   - Keep unplugin for CSS collection
   - Document that both are needed temporarily

### Phase 3: Testing

- [ ] Unit tests for `is_css_call()`
- [ ] Integration tests with fixture files
- [ ] Snapshot testing for transformed output
- [ ] Manual testing with Next.js 16 + Turbopack

### Phase 4: Publishing

- [ ] Build WASM binary for all platforms
- [ ] Test installation from npm
- [ ] Write documentation
- [ ] Publish to npm

## Development Setup

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-wasip1

# Install SWC CLI (optional, for testing)
cargo install swc_cli
```

### Build

```bash
cd packages/swc-plugin
cargo build --release --target wasm32-wasip1
```

### Test

```bash
cargo test
```

### Local Testing with Next.js

```javascript
// next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      ['./packages/swc-plugin/target/wasm32-wasip1/release/swc_plugin_silk.wasm', {
        production: true
      }]
    ]
  }
}
```

## Learning Resources

- [SWC Plugin Handbook](https://swc.rs/docs/plugin/ecmascript/getting-started)
- [styled-components SWC plugin source](https://github.com/swc-project/plugins/tree/main/packages/styled-components)
- [SWC AST Explorer](https://play.swc.rs/)
- [Rust Book](https://doc.rust-lang.org/book/)

## Questions to Resolve

1. **How to collect CSS rules?**
   - SWC plugins run in WASM sandbox
   - Can't write to filesystem
   - Need to communicate with bundler

2. **Should we still use unplugin?**
   - Maybe: SWC plugin for transformation, unplugin for CSS output
   - Or: Find pure SWC solution

3. **Platform support?**
   - WASM works everywhere
   - But performance vs native binaries?

## Next Steps

**Immediate:**
1. Implement property-value extraction
2. Port class name generation logic
3. Test with simple example

**Later:**
4. Solve CSS collection problem
5. Comprehensive testing
6. Documentation

**Goal:**
Get a working prototype that transforms `css({ bg: 'red' })` to a class name string, even if CSS collection isn't perfect yet.
