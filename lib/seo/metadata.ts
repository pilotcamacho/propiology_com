import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.propiology.com';

interface BuildMetadataOptions {
  title: string;
  description: string;
  locale: string;
  path?: string;           // e.g. "/features" — without locale prefix
  image?: string;          // absolute URL; falls back to /opengraph-image
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  locale,
  path = '',
  image,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const otherLocale = locale === 'en' ? 'es' : 'en';
  const canonical   = `${siteUrl}/${locale}${path}`;
  const ogImage     = image ?? `${siteUrl}/opengraph-image`;

  return {
    title: `${title} | Propiology`,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: {
        [locale]:      canonical,
        [otherLocale]: `${siteUrl}/${otherLocale}${path}`,
        'x-default':   `${siteUrl}/en${path}`,
      },
    },
    openGraph: {
      title:       `${title} | Propiology`,
      description,
      url:         canonical,
      siteName:    'Propiology',
      locale:      locale === 'es' ? 'es_ES' : 'en_US',
      type:        'website',
      images:      [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${title} | Propiology`,
      description,
      images:      [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true,  follow: true,  googleBot: { index: true, follow: true } },
  };
}
