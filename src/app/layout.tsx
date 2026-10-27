import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'claude-code-tip-calculator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
