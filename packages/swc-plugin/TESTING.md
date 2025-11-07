# Testing Guide for SWC Plugin

Comprehensive testing strategy for `@sylphx/swc-plugin-silk`.

## Test Suite Overview

We use a **dual testing approach**:

1. **Rust Unit Tests** - Test individual helper functions
2. **Vitest Integration Tests** - Test actual transformation output

### Test Coverage

- ✅ Property shorthand expansion (m → margin, p → padding, etc.)
- ✅ CamelCase to kebab-case conversion
- ✅ CSS value normalization (units, spacing, unitless properties)
- ✅ Hash generation consistency
- ✅ Class name generation
- ✅ CSS rule generation
- ✅ Empty object handling
- ✅ Special characters sanitization
- ✅ Multiple css() calls in same file
- ✅ Custom configuration (prefix)
- ✅ Edge cases (zeros, non-css calls)

## Running Tests

### Prerequisites

1. **Build the plugin first:**
   ```bash
   cargo build --release --target wasm32-wasip1
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Run All Tests

```bash
npm test
```

This runs:
1. Rust unit tests (`cargo test`)
2. Vitest integration tests (`vitest run`)

### Run Specific Test Suites

**Rust unit tests only:**
```bash
npm run test:rust
# or
cargo test
```

**Vitest integration tests only:**
```bash
npm run test:vitest
# or
vitest run
```

**Watch mode (for development):**
```bash
npm run test:watch
```

**With coverage:**
```bash
npm run test:coverage
```

## Test Structure

```
packages/swc-plugin/
├── tests/
│   ├── fixtures/              # Test input/output pairs
│   │   ├── basic.input.ts
│   │   ├── basic.output.ts
│   │   ├── shorthands.input.ts
│   │   ├── edge-cases.input.ts
│   │   └── no-transform.input.ts
│   ├── integration.rs         # Rust integration tests
│   └── transform.test.ts      # Vitest transformation tests
├── src/
│   └── lib.rs                 # Unit tests at bottom of file
└── vitest.config.ts
```

## Rust Unit Tests

Located in `src/lib.rs` at the bottom of the file.

**Tests:**
- `test_config_default` - Default configuration values
- `test_config_deserialize` - JSON config parsing
- `test_camel_to_kebab` - Case conversion
- `test_resolve_css_property` - Property shorthand expansion
- `test_normalize_css_value` - Unit handling
- `test_generate_class_name` - Class name format
- `test_generate_css_rule` - CSS rule generation

**Run specific test:**
```bash
cargo test test_resolve_css_property -- --nocapture
```

**Run with output:**
```bash
cargo test -- --nocapture
```

## Vitest Integration Tests

Located in `tests/transform.test.ts`.

Tests actual SWC transformation by:
1. Loading the WASM plugin
2. Running SWC transform on test code
3. Verifying the output

**Test Suites:**
- **Basic Transformations** - Single/multiple properties, empty objects
- **Property Shorthands** - Margin, padding, size, background expansion
- **Value Handling** - Numeric, string, special characters
- **CamelCase Properties** - fontSize, backgroundColor, etc.
- **Multiple Calls** - Multiple css() in same file
- **Custom Configuration** - Custom class prefix
- **Edge Cases** - Zero values, non-css calls
- **Hash Consistency** - Same inputs → same hash, different inputs → different hash
- **Fixture Files** - Test with fixture files

**Run specific test:**
```bash
vitest run -t "should transform single property"
```

**Watch specific file:**
```bash
vitest watch tests/transform.test.ts
```

## Fixture Files

Fixture files provide realistic test cases:

**`basic.input.ts`**
- Single property
- Multiple properties
- Numbers with units
- CamelCase properties
- String values

**`shorthands.input.ts`**
- All margin shorthands (m, mt, mr, mb, ml, mx, my)
- All padding shorthands (p, pt, pr, pb, pl, px, py)
- Size shorthands (w, h, minW, minH, maxW, maxH)
- Background shorthands (bg, bgColor)
- Border radius shorthand (rounded)

**`edge-cases.input.ts`**
- Empty objects
- Single properties
- Special characters
- Zero values
- Unitless properties
- Properties with hyphens
- Multiple calls
- Conditional expressions
- Function arguments

**`no-transform.input.ts`**
- Non-Silk css() calls
- Regular function calls
- Object literals
- JSX props
- Arrays
- Variables
- Comments

### Using Fixtures

Fixtures are used in both Rust and Vitest tests:

**Vitest:**
```typescript
const fixture = readFileSync('tests/fixtures/basic.input.ts', 'utf-8')
const output = transform(fixture)
expect(output).toContain('silk_')
```

## Writing New Tests

### Adding Rust Unit Test

Add to `src/lib.rs`:

```rust
#[test]
fn test_my_feature() {
    use super::*;

    let result = my_function("input");
    assert_eq!(result, "expected");
}
```

### Adding Vitest Test

Add to `tests/transform.test.ts`:

```typescript
it('should test my feature', () => {
  const input = `
    import { css } from '@sylphx/silk'
    const style = css({ myProp: 'value' })
  `

  const output = transform(input)

  expect(output).toContain('silk_myProp_value_')
})
```

### Adding Fixture

1. Create `tests/fixtures/my-test.input.ts`:
   ```typescript
   import { css } from '@sylphx/silk'
   const style = css({ bg: 'red' })
   ```

2. Optionally create expected output `tests/fixtures/my-test.output.ts`

3. Add test in `tests/transform.test.ts`:
   ```typescript
   it('should transform my-test fixture', () => {
     const fixture = readFileSync('tests/fixtures/my-test.input.ts', 'utf-8')
     const output = transform(fixture)
     expect(output).toContain('silk_bg_red_')
   })
   ```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test SWC Plugin

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-wasip1

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Build Plugin
        run: |
          cd packages/swc-plugin
          cargo build --release --target wasm32-wasip1

      - name: Run Rust Tests
        run: cargo test

      - name: Install Dependencies
        run: npm install

      - name: Run Vitest Tests
        run: npm run test:vitest

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Debugging Tests

### Rust Tests

**Enable debug output:**
```bash
cargo test -- --nocapture
```

**Run single test:**
```bash
cargo test test_name -- --nocapture
```

**Show all output:**
```bash
RUST_BACKTRACE=1 cargo test
```

### Vitest Tests

**Debug single test:**
```bash
vitest run -t "test name" --reporter=verbose
```

**Node.js debugger:**
```bash
node --inspect-brk ./node_modules/.bin/vitest run
```

**VS Code launch.json:**
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:vitest", "--", "--run"],
  "console": "integratedTerminal"
}
```

## Common Issues

### WASM Binary Not Found

**Error:**
```
⚠️  SWC plugin WASM not found
```

**Solution:**
```bash
cargo build --release --target wasm32-wasip1
```

### Tests Pass But Transformation Doesn't Work

1. Check that WASM binary is built
2. Verify path in test is correct
3. Try rebuilding: `cargo clean && cargo build --release --target wasm32-wasip1`

### Rust Test Fails

1. Run with output: `cargo test -- --nocapture`
2. Check error message
3. Fix code and rerun

### Vitest Test Fails

1. Check that input/output format is correct
2. Verify regex patterns match actual output
3. Add console.log to inspect actual output:
   ```typescript
   const output = transform(input)
   console.log(output)
   expect(output).toContain('...')
   ```

## Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| **Rust Unit Tests** | 90%+ | ~90% |
| **Integration Tests** | 80%+ | ~80% |
| **Edge Cases** | 100% | ~95% |
| **Property Shorthands** | 100% | 100% ✅ |
| **Value Normalization** | 100% | 100% ✅ |

## Next Steps

After all tests pass:

1. ✅ Build WASM binary
2. ✅ Run all tests
3. ✅ Test with Next.js 16 project
4. ✅ Performance benchmarks
5. ✅ Publish to npm

## Resources

- [Rust Testing Book](https://doc.rust-lang.org/book/ch11-00-testing.html)
- [Vitest Documentation](https://vitest.dev/)
- [SWC Plugin Testing](https://swc.rs/docs/plugin/ecmascript/testing)
- [Cargo Test Documentation](https://doc.rust-lang.org/cargo/commands/cargo-test.html)
