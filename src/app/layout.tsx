import type { Metadata } from 'next';
import { Playfair_Display, Inter, Rye } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { InlineCMSProvider } from '@/context/InlineCMSContext';
import CartDrawer from '@/components/cart/CartDrawer';
import PageTransition from '@/components/common/PageTransition';
import SmoothScroll from '@/components/common/SmoothScroll';
import InlineCMSToolbar from '@/components/cms/InlineCMSToolbar';
import InlineEditModal from '@/components/cms/InlineEditModal';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const rye = Rye({
  subsets: ['latin'],
  variable: '--font-rye',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SAKALA — Motorcycle Club | Bandung',
  description: 'Klub motor dan ruang karya mandiri dari Bandung, Jawa Barat. Berjalan bersama atas dasar persaudaraan, motor kustom, dan catatan perjalanan.',
  icons: {
    icon: '/assets/sakala_emblem.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${rye.variable}`}>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#C5AA00] selection:text-black">
        <SmoothScroll>
          <AuthProvider>
            <InlineCMSProvider>
              <CartProvider>
                <PageTransition>
                  {children}
                </PageTransition>
                <CartDrawer />
                <InlineCMSToolbar />
                <InlineEditModal />
              </CartProvider>
            </InlineCMSProvider>
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

