/**
 * Silk Styles Component
 *
 * Automatically injects Silk CSS into Next.js App Router layouts
 * Usage: Import this in app/layout.tsx
 */

export function SilkStyles() {
  // In production, CSS is extracted to static/css/silk.css
  // Next.js will automatically handle the link injection
  return null
}

/**
 * Get the CSS link element for manual injection (if needed)
 */
export function getSilkCssLink() {
  if (typeof window === 'undefined') {
    // Server-side: return link tag
    return {
      __html: '<link rel="stylesheet" href="/_next/static/css/silk.css" />',
    }
  }
  return null
}
