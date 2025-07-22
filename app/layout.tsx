import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'FlashFundX - Professional Trading Platform',
  description: 'Professional prop trading platform with instant funding and comprehensive trader management',
  icons: {
    icon: [
      { url: '/16 3.png', sizes: '16x16', type: 'image/png' },
      { url: '/32 3.png', sizes: '32x32', type: 'image/png' },
      { url: '/48 3.png', sizes: '48x48', type: 'image/png' },
      { url: '/16 3.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/180 3.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FlashFundX'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
