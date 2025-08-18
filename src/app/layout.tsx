import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Footer, Navbar, ChatbotToggle, ClientProviders } from '@/shared/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Indian Trade Mart',
  description: 'B2B tech marketplace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Navbar />
<main className="pt-16">{children}</main>
          <Footer />
          <ChatbotToggle />
        </ClientProviders>
      </body>
    </html>
  )
}
