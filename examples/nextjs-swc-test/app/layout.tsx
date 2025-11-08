import type { Metadata } from 'next'
import './globals.css'
// Import Silk CSS (auto-generated at build time)
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Silk SWC Plugin Test',
  description: 'Testing SWC plugin with Next.js 16 + Turbopack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Silk CSS is automatically included via static/css/silk.css */}
        <link rel="stylesheet" href="/_next/static/css/silk.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
