---
"@sylphx/silk-nextjs": patch
---

fix(nextjs): add empty turbopack config to silence Next.js 16 warning

Next.js 16 shows a warning when using webpack config without turbopack config. Added `turbopack: {}` to silence this warning when using Turbopack mode with Babel support.
