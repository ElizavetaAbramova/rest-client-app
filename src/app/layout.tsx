import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Header from '@/widgets/Header'
import Footer from '@/widgets/Footer'
import AuthExpiryClient from '@/components/AuthExpiryClient'

export const metadata: Metadata = {
  title: 'REST Client App',
  description: 'REST Client App made by RSSchool students',
  icons: { icon: '/document-icon.png' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>REST Client App</title>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <Header />
          <AuthExpiryClient>{children}</AuthExpiryClient>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
