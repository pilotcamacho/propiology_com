import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.propiology.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/en/dashboard',
          '/en/command',
          '/en/onboarding',
          '/en/billing',
          '/es/dashboard',
          '/es/command',
          '/es/onboarding',
          '/es/billing',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
