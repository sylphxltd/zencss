---
"@sylphx/silk-nextjs": patch
---

Fix virtual module path resolution for automatic CSS injection

- Changed virtual module structure from flat to directory-based
- Virtual modules now in `node_modules/__silk__/` directory
- Fixed relative imports within virtual modules
- Resolves "Can't resolve '__silk_auto_inject__'" error
- Tested and verified working with Next.js 16 webpack mode
