# Contributing to SWC Plugin

Thank you for your interest in contributing to `@sylphx/swc-plugin-silk`!

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Architecture](#architecture)

## Getting Started

### Prerequisites

- **Rust 1.70+** with `wasm32-wasip1` target
- **Node.js 18+**
- **npm or bun**
- **Git**

### Fork and Clone

```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/silk.git
cd silk/packages/swc-plugin

# Add upstream remote
git remote add upstream https://github.com/SylphxAI/silk.git
```

## Development Setup

### 1. Install Dependencies

```bash
# Rust dependencies (automatic via Cargo)
# Node dependencies
npm install
```

### 2. Build Development Binary

```bash
# Debug build (faster for development)
cargo build --target wasm32-wasip1

# Output: target/wasm32-wasip1/debug/swc_plugin_silk.wasm
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Or separately
npm run test:rust     # Rust unit tests
npm run test:vitest   # Integration tests
npm run test:watch    # Watch mode
```

### 4. Start Development

```bash
# Terminal 1: Watch Rust code
cargo watch -x 'build --target wasm32-wasip1'

# Terminal 2: Watch tests
npm run test:watch

# Terminal 3: Test with Next.js
cd ../../examples/nextjs-16-turbopack
npm run dev
```

## Making Changes

### Branch Naming

Use descriptive branch names:

- `feat/add-nested-object-support` - New features
- `fix/hash-collision-bug` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/simplify-visitor` - Code refactoring
- `test/add-unit-tests` - Test additions

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Add or modify tests
- `chore`: Build process, dependencies

**Examples:**
```
feat(visitor): add support for nested object properties

Implements recursive object traversal to handle:
- Nested pseudo-selectors (_hover, _focus)
- Responsive values (fontSize: { base: 16, md: 20 })
- Media queries

Closes #123

---

fix(hash): prevent hash collisions for similar values

Previously, 'rgb(255,0,0)' and 'rgb(255, 0, 0)' generated different
hashes due to spacing. Normalize whitespace before hashing.

Fixes #456

---

docs(readme): add installation instructions for Turbopack

Updates README with Next.js 16 specific configuration
```

### Code Changes

1. **Keep changes focused** - One feature/fix per PR
2. **Write tests** - All new code needs tests
3. **Update documentation** - Keep docs in sync
4. **Check performance** - Avoid regressions

## Testing

### Writing Tests

#### Rust Unit Test

Add to `src/lib.rs`:

```rust
#[test]
fn test_my_feature() {
    use super::*;

    let result = my_function("input");
    assert_eq!(result, "expected");
}
```

#### Vitest Integration Test

Add to `tests/transform.test.ts`:

```typescript
it('should handle my feature', () => {
  const input = `
    import { css } from '@sylphx/silk'
    const style = css({ myProp: 'value' })
  `

  const output = transform(input)

  expect(output).toContain('silk_myProp_value_')
  expect(output).not.toContain('css({')
})
```

#### Test Fixture

Create `tests/fixtures/my-feature.input.ts`:

```typescript
import { css } from '@sylphx/silk'

const style = css({
  // Your test case
})
```

### Running Tests

```bash
# Before committing
npm test

# Watch mode during development
npm run test:watch

# Specific test
cargo test test_name
vitest run -t "test description"
```

### Test Coverage

Aim for:
- **90%+ unit test coverage**
- **80%+ integration test coverage**
- **100% for critical paths** (property resolution, value normalization)

```bash
npm run test:coverage
```

## Submitting Changes

### Before Submitting

- [ ] Code compiles without warnings
  ```bash
  cargo clippy --target wasm32-wasip1 -- -D warnings
  ```

- [ ] Code is formatted
  ```bash
  cargo fmt
  ```

- [ ] All tests pass
  ```bash
  npm test
  ```

- [ ] Documentation updated

- [ ] CHANGELOG.md updated (if applicable)

### Pull Request Process

1. **Update your fork:**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feat/my-feature
   ```

3. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feat/my-feature
   ```

5. **Create Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in template
   - Link related issues

### PR Template

```markdown
## Description

Brief description of changes.

## Motivation

Why is this change needed?

## Changes

- Change 1
- Change 2

## Testing

How was this tested?

- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manually tested with Next.js

## Checklist

- [ ] Code compiles
- [ ] Tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No breaking changes (or documented)

## Related Issues

Closes #123
```

### Review Process

1. **Automated checks** run (GitHub Actions)
2. **Maintainers review** code
3. **Feedback addressed** if needed
4. **Approved and merged**

## Code Style

### Rust

Follow [Rust style guidelines](https://doc.rust-lang.org/1.0.0/style/):

```rust
// Use rustfmt
cargo fmt

// Good
fn generate_class_name(property: &str, value: &str, prefix: &str) -> String {
    let css_property = resolve_css_property(property);
    // ...
}

// Bad
fn generate_class_name(property:&str,value:&str,prefix:&str)->String{
    let css_property=resolve_css_property(property);
    // ...
}
```

### TypeScript

```typescript
// Use consistent formatting
// Good
function transform(code: string, config?: Config): string {
  const result = transformSync(code, {
    filename: 'test.ts',
    // ...
  })
  return result.code
}

// Bad
function transform(code:string,config?:Config):string{
  const result=transformSync(code,{filename:'test.ts'})
  return result.code
}
```

### Documentation

- Use **clear, concise language**
- Include **code examples**
- Document **why**, not just **what**
- Keep **README.md** up to date

## Architecture

### Project Structure

```
packages/swc-plugin/
├── src/
│   └── lib.rs              # Main plugin code
├── tests/
│   ├── integration.rs      # Rust integration tests
│   ├── transform.test.ts   # Vitest tests
│   └── fixtures/           # Test fixtures
├── assemblyscript/         # Reference implementation
├── Cargo.toml              # Rust dependencies
└── package.json            # Node dependencies
```

### Key Components

1. **Visitor (`SilkTransformVisitor`)**
   - Traverses AST
   - Detects `css()` calls
   - Replaces with string literals

2. **Property Resolution**
   - Expands shorthands (bg → background-color)
   - Converts camelCase to kebab-case

3. **Value Normalization**
   - Adds units (rem, px)
   - Handles unitless properties

4. **Class Name Generation**
   - Creates unique class names
   - Consistent hashing

5. **CSS Rule Generation**
   - Generates CSS strings
   - Collects for output

### Adding Features

**Example: Add new property shorthand**

1. **Update property map** in `src/lib.rs`:
   ```rust
   fn get_property_map() -> HashMap<&'static str, &'static str> {
       let mut map = HashMap::new();
       // ...
       map.insert("bd", "border");  // Add new shorthand
       map
   }
   ```

2. **Add test** in `src/lib.rs`:
   ```rust
   #[test]
   fn test_border_shorthand() {
       assert_eq!(resolve_css_property("bd"), "border");
   }
   ```

3. **Add integration test** in `tests/transform.test.ts`:
   ```typescript
   it('should expand border shorthand', () => {
     const input = `
       import { css } from '@sylphx/silk'
       const style = css({ bd: '1px solid red' })
     `
     const output = transform(input)
     expect(output).toContain('silk_bd_')
   })
   ```

4. **Update documentation** in README.md

## Common Tasks

### Adding Property Shorthand

See [Adding Features](#adding-features) above.

### Fixing Hash Collision

1. Identify collision in tests
2. Improve hash function in `hash_string()`
3. Verify with tests
4. Document in CHANGELOG.md

### Improving Performance

1. Profile with `cargo bench`
2. Identify bottleneck
3. Optimize
4. Verify improvement
5. Ensure tests still pass

### Adding Test Fixture

1. Create `tests/fixtures/my-test.input.ts`
2. Add test in `tests/transform.test.ts`
3. Run tests to verify

## Getting Help

- **Documentation:** Check README.md, DEVELOPMENT.md, BUILD.md, TESTING.md
- **Issues:** Search existing issues first
- **Discussions:** GitHub Discussions for questions
- **Discord:** Join Silk community (link in main README)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Mentioned in release notes
- Added to CONTRIBUTORS.md

Thank you for contributing! 🎉
