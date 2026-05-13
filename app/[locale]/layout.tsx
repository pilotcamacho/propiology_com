import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import '../globals.css';
import { MarketingHeader } from '@/components/layout/MarketingHeader';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const title =
    locale === 'es'
      ? 'Propiology — Tu Sistema Operativo Personal'
      : 'Propiology — Your Personal OS';

  const description =
    locale === 'es'
      ? 'La plataforma SaaS de Propiología: hábitos, biométricos, herramientas de IA y reportes para equipos.'
      : 'The Propiology SaaS platform: habit tracking, biometric feedback, AI tools, and team analytics.';

  return {
    title: { template: '%s | Propiology', default: title },
    description,
    metadataBase: new URL('https://www.propiology.com'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <html lang={locale} className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <MarketingHeader locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
