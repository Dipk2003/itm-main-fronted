import { Footer } from '@/components/shared/Footer'
import { Navbar } from '@/components/shared/Navbar'
import { ChatbotToggle } from '@/components/shared/Chatbot'
import ClientProviders from '@/components/providers/ClientProviders'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import '../styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Improve font loading performance
  preload: true,
})

export const metadata = {
  title: 'Indian Trade Mart - B2B Marketplace',
  description: 'India\'s leading B2B tech marketplace connecting vendors and buyers',
  keywords: 'B2B, marketplace, vendors, buyers, trade, business',
  authors: [{ name: 'Indian Trade Mart' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4f46e5',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
            <Navbar />
          </Suspense>
          <main className="pt-16 min-h-screen">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <LoadingSpinner size="lg" text="Loading content..." />
              </div>
            }>
              {children}
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <Suspense fallback={null}>
            <ChatbotToggle />
          </Suspense>
        </ClientProviders>
      </body>
    </html>
  )
}
