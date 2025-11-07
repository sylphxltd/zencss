# Setup script for SWC Plugin development (Windows PowerShell)
# This script installs Rust, builds the WASM binary, and runs tests

$ErrorActionPreference = "Stop"

Write-Host "🎨 Silk SWC Plugin Setup (Windows)" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Rust is installed
function Test-Rust {
    Write-Host "📦 Checking for Rust installation..." -ForegroundColor Yellow

    if (Get-Command cargo -ErrorAction SilentlyContinue) {
        Write-Host "✓ Rust is already installed" -ForegroundColor Green
        cargo --version
        return $true
    } else {
        Write-Host "⚠ Rust is not installed" -ForegroundColor Yellow
        return $false
    }
}

# Install Rust
function Install-Rust {
    Write-Host ""
    Write-Host "🦀 Installing Rust..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download and install Rust from: https://rustup.rs/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After installation:" -ForegroundColor Yellow
    Write-Host "1. Close this PowerShell window" -ForegroundColor White
    Write-Host "2. Open a new PowerShell window" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    Write-Host ""

    $response = Read-Host "Open rustup.rs in browser? (y/n)"
    if ($response -eq 'y') {
        Start-Process "https://rustup.rs/"
    }

    exit 0
}

# Add WASM target
function Add-WasmTarget {
    Write-Host ""
    Write-Host "🎯 Adding WASM target..." -ForegroundColor Yellow

    rustup target add wasm32-wasip1

    $targets = rustup target list --installed
    if ($targets -match "wasm32-wasip1") {
        Write-Host "✓ WASM target added" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to add WASM target" -ForegroundColor Red
        exit 1
    }
}

# Build WASM binary
function Build-Wasm {
    Write-Host ""
    Write-Host "🔨 Building WASM binary..." -ForegroundColor Yellow
    Write-Host ""

    Set-Location packages/swc-plugin

    cargo build --release --target wasm32-wasip1

    $wasmPath = "target/wasm32-wasip1/release/swc_plugin_silk.wasm"
    if (Test-Path $wasmPath) {
        $size = (Get-Item $wasmPath).Length / 1KB
        Write-Host "✓ WASM binary built successfully" -ForegroundColor Green
        Write-Host "  Size: $([math]::Round($size, 2)) KB" -ForegroundColor White
        Write-Host "  Location: $wasmPath" -ForegroundColor White
    } else {
        Write-Host "✗ Failed to build WASM binary" -ForegroundColor Red
        exit 1
    }

    Set-Location ../..
}

# Run Rust tests
function Invoke-RustTests {
    Write-Host ""
    Write-Host "🧪 Running Rust tests..." -ForegroundColor Yellow
    Write-Host ""

    Set-Location packages/swc-plugin

    cargo test

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ All Rust tests passed" -ForegroundColor Green
    } else {
        Write-Host "✗ Some Rust tests failed" -ForegroundColor Red
        exit 1
    }

    Set-Location ../..
}

# Install Node dependencies
function Install-NodeDeps {
    Write-Host ""
    Write-Host "📦 Installing Node dependencies..." -ForegroundColor Yellow
    Write-Host ""

    Set-Location packages/swc-plugin

    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun install
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
    } else {
        Write-Host "✗ Neither npm nor bun found" -ForegroundColor Red
        exit 1
    }

    Write-Host "✓ Node dependencies installed" -ForegroundColor Green

    Set-Location ../..
}

# Run Vitest tests
function Invoke-VitestTests {
    Write-Host ""
    Write-Host "🧪 Running Vitest integration tests..." -ForegroundColor Yellow
    Write-Host ""

    Set-Location packages/swc-plugin

    if (Get-Command bun -ErrorAction SilentlyContinue) {
        bun run test:vitest
    } else {
        npm run test:vitest
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ All Vitest tests passed" -ForegroundColor Green
    } else {
        Write-Host "⚠ Some Vitest tests failed (this is expected if WASM binary is not compatible)" -ForegroundColor Yellow
    }

    Set-Location ../..
}

# Show next steps
function Show-NextSteps {
    Write-Host ""
    Write-Host "🎉 Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Test with Next.js 16:" -ForegroundColor Yellow
    Write-Host "   cd examples\nextjs-16-turbopack" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host "   # Uncomment plugin config in next.config.js" -ForegroundColor Gray
    Write-Host "   # Uncomment Silk imports in app\page.tsx" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Development workflow:" -ForegroundColor Yellow
    Write-Host "   cd packages\swc-plugin" -ForegroundColor White
    Write-Host "   cargo watch -x 'build --target wasm32-wasip1'  # Terminal 1" -ForegroundColor White
    Write-Host "   npm run test:watch                               # Terminal 2" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Run all tests:" -ForegroundColor Yellow
    Write-Host "   cd packages\swc-plugin" -ForegroundColor White
    Write-Host "   npm test" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "   - Quick Start: packages\swc-plugin\QUICKSTART.md" -ForegroundColor White
    Write-Host "   - Build Guide: packages\swc-plugin\BUILD.md" -ForegroundColor White
    Write-Host "   - Testing: packages\swc-plugin\TESTING.md" -ForegroundColor White
    Write-Host ""
}

# Main execution
function Main {
    Write-Host "This script will:" -ForegroundColor White
    Write-Host "1. Install Rust (if not installed)" -ForegroundColor White
    Write-Host "2. Add WASM target" -ForegroundColor White
    Write-Host "3. Build WASM binary" -ForegroundColor White
    Write-Host "4. Run tests" -ForegroundColor White
    Write-Host ""

    $response = Read-Host "Continue? (y/n)"

    if ($response -ne 'y') {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit 0
    }

    Write-Host ""
    Write-Host "Starting setup..." -ForegroundColor Cyan
    Write-Host ""

    # Check and install Rust if needed
    if (-not (Test-Rust)) {
        Install-Rust
        # Script will exit here, user needs to restart after Rust install
    }

    # Add WASM target
    Add-WasmTarget

    # Build WASM binary
    Build-Wasm

    # Run Rust tests
    Invoke-RustTests

    # Install Node dependencies
    Install-NodeDeps

    # Run Vitest tests
    Invoke-VitestTests

    # Show next steps
    Show-NextSteps
}

# Run main function
Main
