const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.propiology.com';

// ── Organization schema ───────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Propiology',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@propiology.com',
      contactType: 'customer support',
    },
  };
}

// ── SoftwareApplication schema ────────────────────────────────────────────────

export function softwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Propiology',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description:
      'The Personal OS for behavioral transformation — habit tracking, Readiness Score, AI tools, and micro-learning via WhatsApp.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: '14-day free trial, no credit card required',
    },
  };
}

// ── FAQPage schema ────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

export function faqPageSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

// ── Helper: render JSON-LD as a <script> tag string (for use in Server Components) ──

export function jsonLdScript(data: object): string {
  return JSON.stringify(data);
}
