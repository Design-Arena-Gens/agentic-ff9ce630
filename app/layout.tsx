import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Listener',
  description: 'A tall, unnaturally thin figure in the misty rain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
