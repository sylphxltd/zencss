#!/bin/bash

# Setup script for SWC Plugin development
# This script installs Rust, builds the WASM binary, and runs tests

set -e

echo "🎨 Silk SWC Plugin Setup"
echo "========================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Rust is installed
check_rust() {
    echo "📦 Checking for Rust installation..."
    if command -v cargo &> /dev/null; then
        echo -e "${GREEN}✓ Rust is already installed${NC}"
        cargo --version
        return 0
    else
        echo -e "${YELLOW}⚠ Rust is not installed${NC}"
        return 1
    fi
}

# Install Rust
install_rust() {
    echo ""
    echo "🦀 Installing Rust..."
    echo ""

    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "Please download and install Rust from: https://rustup.rs/"
        echo "After installation, run this script again."
        exit 1
    else
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
        echo -e "${GREEN}✓ Rust installed successfully${NC}"
    fi
}

# Add WASM target
add_wasm_target() {
    echo ""
    echo "🎯 Adding WASM target..."

    rustup target add wasm32-wasip1

    if rustup target list --installed | grep -q "wasm32-wasip1"; then
        echo -e "${GREEN}✓ WASM target added${NC}"
    else
        echo -e "${RED}✗ Failed to add WASM target${NC}"
        exit 1
    fi
}

# Build WASM binary
build_wasm() {
    echo ""
    echo "🔨 Building WASM binary..."
    echo ""

    cd packages/swc-plugin

    # Build release version
    cargo build --release --target wasm32-wasip1

    if [ -f "target/wasm32-wasip1/release/swc_plugin_silk.wasm" ]; then
        SIZE=$(ls -lh target/wasm32-wasip1/release/swc_plugin_silk.wasm | awk '{print $5}')
        echo -e "${GREEN}✓ WASM binary built successfully${NC}"
        echo "  Size: $SIZE"
        echo "  Location: target/wasm32-wasip1/release/swc_plugin_silk.wasm"
    else
        echo -e "${RED}✗ Failed to build WASM binary${NC}"
        exit 1
    fi

    cd ../..
}

# Run Rust tests
run_rust_tests() {
    echo ""
    echo "🧪 Running Rust tests..."
    echo ""

    cd packages/swc-plugin
    cargo test

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ All Rust tests passed${NC}"
    else
        echo -e "${RED}✗ Some Rust tests failed${NC}"
        exit 1
    fi

    cd ../..
}

# Install Node dependencies
install_node_deps() {
    echo ""
    echo "📦 Installing Node dependencies..."
    echo ""

    cd packages/swc-plugin

    if command -v bun &> /dev/null; then
        bun install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo -e "${RED}✗ Neither npm nor bun found${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Node dependencies installed${NC}"

    cd ../..
}

# Run Vitest tests
run_vitest_tests() {
    echo ""
    echo "🧪 Running Vitest integration tests..."
    echo ""

    cd packages/swc-plugin

    if command -v bun &> /dev/null; then
        bun run test:vitest
    else
        npm run test:vitest
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ All Vitest tests passed${NC}"
    else
        echo -e "${YELLOW}⚠ Some Vitest tests failed (this is expected if WASM binary is not compatible)${NC}"
    fi

    cd ../..
}

# Show next steps
show_next_steps() {
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo ""
    echo "1. Test with Next.js 16:"
    echo "   cd examples/nextjs-16-turbopack"
    echo "   npm install"
    echo "   # Uncomment plugin config in next.config.js"
    echo "   # Uncomment Silk imports in app/page.tsx"
    echo "   npm run dev"
    echo ""
    echo "2. Development workflow:"
    echo "   cd packages/swc-plugin"
    echo "   cargo watch -x 'build --target wasm32-wasip1'  # Terminal 1"
    echo "   npm run test:watch                               # Terminal 2"
    echo ""
    echo "3. Run all tests:"
    echo "   cd packages/swc-plugin"
    echo "   npm test"
    echo ""
    echo "📚 Documentation:"
    echo "   - Quick Start: packages/swc-plugin/QUICKSTART.md"
    echo "   - Build Guide: packages/swc-plugin/BUILD.md"
    echo "   - Testing: packages/swc-plugin/TESTING.md"
    echo ""
}

# Main execution
main() {
    echo "This script will:"
    echo "1. Install Rust (if not installed)"
    echo "2. Add WASM target"
    echo "3. Build WASM binary"
    echo "4. Run tests"
    echo ""

    read -p "Continue? (y/n) " -n 1 -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi

    echo ""
    echo "Starting setup..."
    echo ""

    # Check and install Rust if needed
    if ! check_rust; then
        install_rust
        # Source cargo env for this session
        source "$HOME/.cargo/env"
    fi

    # Add WASM target
    add_wasm_target

    # Build WASM binary
    build_wasm

    # Run Rust tests
    run_rust_tests

    # Install Node dependencies
    install_node_deps

    # Run Vitest tests
    run_vitest_tests

    # Show next steps
    show_next_steps
}

# Run main function
main
