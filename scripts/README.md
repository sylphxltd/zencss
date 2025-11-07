# Setup Scripts

Automated setup scripts for Silk development.

## SWC Plugin Setup

### macOS / Linux

```bash
./scripts/setup-swc-plugin.sh
```

This script will:
1. ✅ Check for Rust installation
2. ✅ Install Rust if not present
3. ✅ Add wasm32-wasip1 target
4. ✅ Build WASM binary (release mode)
5. ✅ Run Rust unit tests
6. ✅ Install Node dependencies
7. ✅ Run Vitest integration tests
8. ✅ Show next steps

**Requirements:**
- macOS or Linux
- curl (for Rust installation)
- npm or bun

**Duration:** ~5-10 minutes (first time), ~2 minutes (subsequent runs)

### Windows

```powershell
.\scripts\setup-swc-plugin.ps1
```

This script will:
1. ✅ Check for Rust installation
2. ⚠️  Open rustup.rs if Rust not installed
3. ✅ Add wasm32-wasip1 target
4. ✅ Build WASM binary (release mode)
5. ✅ Run Rust unit tests
6. ✅ Install Node dependencies
7. ✅ Run Vitest integration tests
8. ✅ Show next steps

**Requirements:**
- Windows 10/11
- PowerShell 5.1+
- npm or bun

**Duration:** ~5-10 minutes (first time), ~2 minutes (subsequent runs)

**Note:** After installing Rust on Windows, close and reopen PowerShell before running the script again.

## Manual Setup

If you prefer manual setup, follow these steps:

### 1. Install Rust

**macOS / Linux:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Windows:**
Download from https://rustup.rs/

### 2. Add WASM Target

```bash
rustup target add wasm32-wasip1
```

### 3. Build WASM Binary

```bash
cd packages/swc-plugin
cargo build --release --target wasm32-wasip1
```

### 4. Run Tests

```bash
# Rust tests
cargo test

# Install Node deps
npm install

# Vitest tests
npm run test:vitest
```

### 5. Test with Next.js

```bash
cd examples/nextjs-16-turbopack
npm install

# Edit next.config.js and app/page.tsx to uncomment Silk usage

npm run dev
```

## Troubleshooting

### Script Permission Denied (macOS/Linux)

```bash
chmod +x scripts/setup-swc-plugin.sh
```

### Rust Not Found After Installation (Windows)

Close and reopen PowerShell/Command Prompt, then run the script again.

### WASM Binary Too Large

This is normal. Release builds are optimized but still ~600-800KB.

### Tests Fail

1. Check that WASM binary exists:
   ```bash
   ls packages/swc-plugin/target/wasm32-wasip1/release/swc_plugin_silk.wasm
   ```

2. Rebuild:
   ```bash
   cd packages/swc-plugin
   cargo clean
   cargo build --release --target wasm32-wasip1
   ```

3. Check Rust/Node versions:
   ```bash
   rustc --version  # Should be 1.70+
   node --version   # Should be 18+
   ```

### cargo watch Not Found

Install it:
```bash
cargo install cargo-watch
```

## What Gets Built

After running the setup script:

```
packages/swc-plugin/
├── target/
│   └── wasm32-wasip1/
│       ├── debug/
│       │   └── swc_plugin_silk.wasm    # Debug build (~2MB)
│       └── release/
│           └── swc_plugin_silk.wasm    # Release build (~800KB)
└── node_modules/                        # Node dependencies
```

## Development Workflow

After initial setup:

### Watch Mode (Recommended)

```bash
# Terminal 1: Watch Rust code
cd packages/swc-plugin
cargo watch -x 'build --target wasm32-wasip1'

# Terminal 2: Watch tests
npm run test:watch

# Terminal 3: Next.js dev server
cd examples/nextjs-16-turbopack
npm run dev
```

### Quick Rebuild

```bash
cd packages/swc-plugin
cargo build --target wasm32-wasip1  # Debug build (faster)
npm run test:vitest
```

### Full Rebuild

```bash
cd packages/swc-plugin
cargo clean
cargo build --release --target wasm32-wasip1
npm test
```

## CI/CD

The GitHub Actions workflow automatically:
- Installs Rust
- Adds WASM target
- Builds debug and release binaries
- Runs all tests
- Uploads WASM artifacts

See: `.github/workflows/swc-plugin-test.yml`

## Documentation

- **Quick Start:** [../packages/swc-plugin/QUICKSTART.md](../packages/swc-plugin/QUICKSTART.md)
- **Build Guide:** [../packages/swc-plugin/BUILD.md](../packages/swc-plugin/BUILD.md)
- **Testing:** [../packages/swc-plugin/TESTING.md](../packages/swc-plugin/TESTING.md)
- **Status:** [../SWC_PLUGIN_STATUS.md](../SWC_PLUGIN_STATUS.md)

## Support

- **GitHub Issues:** https://github.com/sylphxltd/silk/issues
- **Discussions:** https://github.com/sylphxltd/silk/discussions
