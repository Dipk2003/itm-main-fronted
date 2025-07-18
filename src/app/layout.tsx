import { Footer } from '@/components/shared/Footer'
import { Navbar } from '@/components/shared/Navbar'
import { ChatbotToggle } from '@/components/shared/Chatbot'
import ClientProviders from '@/components/providers/ClientProviders'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

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
          <main className="pt-[73px]">{children}</main>
          <Footer />
          <ChatbotToggle />
        </ClientProviders>
      </body>
    </html>
  )
}
