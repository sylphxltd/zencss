# Release Checklist

Complete checklist before publishing `@sylphx/swc-plugin-silk` to npm.

## Pre-Release

### 1. Code Quality

- [ ] All Rust unit tests passing
  ```bash
  cargo test
  ```

- [ ] All Vitest integration tests passing
  ```bash
  npm run test:vitest
  ```

- [ ] No Clippy warnings
  ```bash
  cargo clippy --target wasm32-wasip1 -- -D warnings
  ```

- [ ] Code is formatted
  ```bash
  cargo fmt -- --check
  ```

- [ ] TypeScript types are correct
  ```bash
  cd tests && tsc --noEmit
  ```

### 2. Documentation

- [ ] README.md is up to date
  - [ ] Installation instructions accurate
  - [ ] Usage examples work
  - [ ] API documentation complete
  - [ ] Current status reflected

- [ ] CHANGELOG.md updated with new version
  - [ ] All features listed
  - [ ] All bug fixes listed
  - [ ] Breaking changes highlighted
  - [ ] Migration guide (if needed)

- [ ] BUILD.md reflects current process

- [ ] TESTING.md has all test instructions

- [ ] Examples work
  - [ ] Next.js 16 example runs
  - [ ] All code examples in docs are tested

### 3. Build & Test

- [ ] Clean build successful
  ```bash
  cargo clean
  cargo build --release --target wasm32-wasip1
  ```

- [ ] WASM binary size reasonable
  ```bash
  ls -lh target/wasm32-wasip1/release/swc_plugin_silk.wasm
  # Should be < 1MB
  ```

- [ ] Test in Next.js 16 + Turbopack
  ```bash
  cd examples/nextjs-16-turbopack
  npm run build
  npm run dev
  ```

- [ ] Test with actual styles
  - [ ] Property shorthands work (bg, p, m, etc.)
  - [ ] Units are correct (rem, px, unitless)
  - [ ] Class names generated correctly
  - [ ] Hash is consistent
  - [ ] HMR works without issues

- [ ] Test edge cases
  - [ ] Empty css() calls
  - [ ] Special characters in values
  - [ ] Multiple css() in same file
  - [ ] Custom prefix configuration

### 4. Performance

- [ ] Benchmark vs Babel plugin
  ```bash
  # Record build times
  # Should be 20-70x faster
  ```

- [ ] Memory usage acceptable
  ```bash
  # Check during Next.js build
  # Should use < 100MB
  ```

- [ ] WASM binary optimized
  ```bash
  # Check with wasm-opt
  wasm-opt -Oz target/wasm32-wasip1/release/swc_plugin_silk.wasm -o optimized.wasm
  ```

### 5. Compatibility

- [ ] Works with Next.js 15+
- [ ] Works with Turbopack
- [ ] Works with webpack (fallback)
- [ ] Works with custom SWC config
- [ ] Node.js 18+ compatible

### 6. Security

- [ ] No known vulnerabilities
  ```bash
  cargo audit
  npm audit
  ```

- [ ] Dependencies up to date
  ```bash
  cargo update
  npm update
  ```

- [ ] No secrets in code or config
  ```bash
  git log --all --source --full-history -S "password\|secret\|api_key" | head -20
  ```

### 7. Package Files

- [ ] `package.json` correct
  - [ ] Version number updated
  - [ ] Dependencies accurate
  - [ ] Scripts work
  - [ ] Files field includes WASM binary

- [ ] `Cargo.toml` correct
  - [ ] Version matches package.json
  - [ ] Dependencies minimal
  - [ ] Metadata accurate

- [ ] `.gitignore` excludes build artifacts

- [ ] `LICENSE` file present and correct

- [ ] Files to publish are correct
  ```bash
  npm pack --dry-run
  # Should include:
  # - target/wasm32-wasip1/release/*.wasm
  # - README.md
  # - LICENSE
  ```

## Release Process

### 1. Version Bump

```bash
# Update version in both files
# packages/swc-plugin/package.json
# packages/swc-plugin/Cargo.toml

# Semantic versioning:
# - Major: Breaking changes
# - Minor: New features (backward compatible)
# - Patch: Bug fixes
```

### 2. Update CHANGELOG.md

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature descriptions

### Changed
- Modified feature descriptions

### Fixed
- Bug fix descriptions

### Breaking Changes
- Breaking change descriptions (if major version)
```

### 3. Build Release Binary

```bash
cargo clean
cargo build --release --target wasm32-wasip1

# Verify size
ls -lh target/wasm32-wasip1/release/swc_plugin_silk.wasm
```

### 4. Create Git Tag

```bash
git add .
git commit -m "chore: release v0.1.0"
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin main
git push origin v0.1.0
```

### 5. Test Package Locally

```bash
# Create tarball
npm pack

# Install in test project
cd /path/to/test/project
npm install /path/to/sylphx-swc-plugin-silk-0.1.0.tgz

# Test that it works
npm run dev
```

### 6. Publish to npm

```bash
# Dry run first
npm publish --dry-run

# Review what will be published
# Then publish for real
npm publish

# Or with OTP if 2FA enabled
npm publish --otp=123456
```

### 7. Create GitHub Release

1. Go to https://github.com/SylphxAI/silk/releases/new
2. Choose tag `v0.1.0`
3. Title: `SWC Plugin v0.1.0`
4. Description: Copy from CHANGELOG.md
5. Attach WASM binary as asset
6. Publish release

### 8. Verify Publication

- [ ] Package appears on npm
  ```bash
  npm view @sylphx/swc-plugin-silk
  ```

- [ ] Installation works
  ```bash
  npm install @sylphx/swc-plugin-silk
  ```

- [ ] Documentation links work
  - [ ] npm page
  - [ ] GitHub repository
  - [ ] Homepage

### 9. Announce

- [ ] Update main Silk README.md
- [ ] Post on GitHub Discussions
- [ ] Tweet announcement (if applicable)
- [ ] Update documentation site
- [ ] Notify users in Discord/Slack

## Post-Release

### Monitor

- [ ] Watch for bug reports
- [ ] Monitor npm download stats
- [ ] Check GitHub issues
- [ ] Review CI/CD passes

### Update Examples

- [ ] Update Next.js example to use published package
  ```javascript
  // Change from local path to npm package
  swcPlugins: [
    ['@sylphx/swc-plugin-silk', { production: true }]
  ]
  ```

- [ ] Test examples still work

### Documentation

- [ ] Add migration guide (if breaking changes)
- [ ] Update ROADMAP.md
- [ ] Close completed GitHub issues
- [ ] Update project board

## Rollback Plan

If issues are discovered after release:

### Minor Issues

- Fix in next patch release
- Document workaround in issues

### Critical Issues

```bash
# Unpublish if within 72 hours
npm unpublish @sylphx/swc-plugin-silk@0.1.0

# Or deprecate
npm deprecate @sylphx/swc-plugin-silk@0.1.0 "Critical bug, use version X.Y.Z instead"
```

## Version History

Track versions and dates:

- `v0.1.0` - YYYY-MM-DD - Initial release
- `v0.1.1` - YYYY-MM-DD - Bug fixes
- `v0.2.0` - YYYY-MM-DD - New features

## Release Cadence

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly for new features
- **Major releases**: Yearly or for breaking changes

## Support Policy

- **Current major version**: Full support
- **Previous major version**: Security fixes for 1 year
- **Older versions**: No support, users should upgrade

## Contact

Release manager: [Your Name/Team]
Emergency contact: [Email/Slack]
