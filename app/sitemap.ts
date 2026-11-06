import type { MetadataRoute } from 'next';
import { UNDER_CONSTRUCTION } from '@/lib/site/status';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.propiology.com';
const locales = ['en', 'es'] as const;

const marketingRoutes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/for-teams', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/for-coaches', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/security', priority: 0.6, changeFrequency: 'monthly' },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  if (UNDER_CONSTRUCTION) return [];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of marketingRoutes) {
      entries.push({
        url: `${siteUrl}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}${route.path}`])
          ),
        },
      });
    }
  }

  return entries;
}
