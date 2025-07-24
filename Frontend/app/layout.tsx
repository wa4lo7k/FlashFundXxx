import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import StructuredData from '@/components/seo/structured-data'

export const metadata: Metadata = {
  title: 'FlashFundX - Trading Education & Skill Development Platform',
  description: 'Advanced trading education platform with prop trading simulation, skill assessment, and comprehensive trader development programs',
  keywords: 'trading education, prop trading training, trading simulation, skill development, trading academy, market education, trading skills, prop trader training, financial education, trading mentorship, trading courses, market simulation, educational platform, skill assessment, trading practice, learning platform, trading school, market analysis training, risk management education, trading psychology',
  authors: [{ name: 'FlashFundX Trading Academy' }],
  creator: 'FlashFundX Trading Academy',
  publisher: 'FlashFundX Trading Academy',
  category: 'Education',
  classification: 'Educational Platform',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/16 3.png', sizes: '16x16', type: 'image/png' },
      { url: '/32 3.png', sizes: '32x32', type: 'image/png' },
      { url: '/48 3.png', sizes: '48x48', type: 'image/png' },
      { url: '/16 3.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/180 3.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FlashFundX Trading Academy'
  },
  openGraph: {
    title: 'FlashFundX - Trading Education & Skill Development Platform',
    description: 'Advanced trading education platform with prop trading simulation, skill assessment, and comprehensive trader development programs',
    type: 'website',
    siteName: 'FlashFundX Trading Academy',
    locale: 'en_US',
    url: 'https://flashfundx.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFundX - Trading Education & Skill Development Platform',
    description: 'Advanced trading education platform with prop trading simulation, skill assessment, and comprehensive trader development programs',
    creator: '@FlashFundX'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://flashfundx.com',
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
        <StructuredData />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
