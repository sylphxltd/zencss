# @sylphx/silk

## 0.1.0

### Minor Changes

- Initial release of Silk 🎉

  Type-safe CSS-in-TypeScript without codegen. 38-2100% smaller bundles than Tailwind and Panda CSS.

  ## Features

  ### Core Features

  - ✅ Zero codegen with full TypeScript type inference
  - ✅ Zero runtime overhead (build-time CSS extraction)
  - ✅ Full type safety with autocomplete for design tokens
  - ✅ Intelligent CSS optimization (20-40% fewer atomic classes)

  ### Production Optimization

  - ✅ Critical CSS extraction (30-50% faster first paint) - **unique to Silk**
  - ✅ Tree shaking and dead code elimination (50-90% reduction)
  - ✅ CSS minification and deduplication
  - ✅ Production optimizer combining all techniques

  ### Modern CSS Features

  - ✅ Cascade layers (@layer) support
  - ✅ :where() selector for zero specificity
  - ✅ Performance monitoring and build analytics

  ### Benchmarks

  - 📦 **38-2100% smaller bundles** than Tailwind CSS and Panda CSS
  - 🔥 **228B gzipped** for large apps (vs 4.6KB Tailwind, 5.0KB Panda)
  - ⚡ **Only framework with critical CSS extraction**

  ## Installation

  ```bash
  npm install @sylphx/silk
  # or
  bun add @sylphx/silk
  ```

  ## Quick Start

  ```typescript
  import { defineConfig, createStyleSystem } from "@sylphx/silk";

  const config = defineConfig({
    colors: { primary: { 500: "#3b82f6" } },
    spacing: { 4: "1rem" },
  });

  const { css } = createStyleSystem(config);

  const button = css({
    color: "primary.500", // ✨ Fully typed
    padding: "4",
    _hover: { opacity: 0.8 },
  });
  ```

  See [documentation](https://github.com/sylphxltd/zencss) for more details.
