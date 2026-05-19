// app/layout.tsx
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/store/CartDrawer'
import { AuthModal } from '@/components/layout/AuthModal'
import { WhatsAppFloat } from '@/components/ui/WhatsAppFloat'
import { Footer } from '@/components/layout/Footer'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ماركت برو — منصة تجارية متكاملة',
  description: 'منصة تجارية احترافية B2B & B2C — تسوق وبيع بأمان وسهولة',
  keywords: 'تسوق, بيع, متجر اونلاين, B2B, B2C, عربي',
  openGraph: {
    title: 'ماركت برو',
    description: 'منصة تجارية متكاملة للبيع بالتجزئة والجملة',
    locale: 'ar_SA',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-cairo bg-navy text-white min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <AuthModal />
        <WhatsAppFloat phone="+966501234567" />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0F1F3D',
              color: '#fff',
              border: '1px solid rgba(212,168,67,0.35)',
              fontFamily: 'Cairo, sans-serif',
              fontSize: '14px',
              fontWeight: '600',
              direction: 'rtl',
            },
          }}
        />
      </body>
    </html>
  )
}
