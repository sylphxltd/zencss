---
"@sylphx/silk-nextjs": patch
---

Add automatic Turbopack support with SWC plugin

- Add `@sylphx/swc-plugin-silk` as optional peer dependency
- Automatic detection of Turbopack mode (already implemented in code)
- No configuration changes needed - works automatically
- Falls back to Babel if SWC plugin not installed
- Update documentation to clarify Turbopack support
