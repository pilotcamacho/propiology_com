'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const copy = {
  en: {
    title: 'AI Tools',
    sub: 'Conversation tools built on the Propiology framework.',
    tools: [
      {
        slug: 'care-multiplier',
        name: 'Care-Multiplier',
        desc: 'Analyze relational patterns and receive Propiology-framed micro-actions.',
        icon: '♡',
        tier: 'Pro',
      },
      {
        slug: 'cognitive-shield',
        name: 'Cognitive Shield',
        desc: 'Identify cognitive biases in your thinking and reframe them with Propiology.',
        icon: '◎',
        tier: 'Pro',
      },
    ],
    open: 'Open tool',
  },
  es: {
    title: 'Herramientas IA',
    sub: 'Herramientas de conversación construidas sobre el marco Propiology.',
    tools: [
      {
        slug: 'care-multiplier',
        name: 'Care-Multiplier',
        desc: 'Analiza patrones relacionales y recibe micro-acciones enmarcadas en Propiology.',
        icon: '♡',
        tier: 'Pro',
      },
      {
        slug: 'cognitive-shield',
        name: 'Escudo Cognitivo',
        desc: 'Identifica sesgos cognitivos en tu pensamiento y refórmalos con Propiology.',
        icon: '◎',
        tier: 'Pro',
      },
    ],
    open: 'Abrir herramienta',
  },
};

export default function ToolsPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {t.tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${locale}/dashboard/tools/${tool.slug}`}
            className="group relative rounded-2xl border border-[var(--color-border)] bg-white p-6 transition-shadow hover:shadow-md"
          >
            <span className="absolute right-4 top-4 rounded-full bg-[var(--color-gold-100)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-gold-700)]">
              {tool.tier}
            </span>
            <span className="text-3xl">{tool.icon}</span>
            <h2 className="mt-3 text-base font-semibold text-[var(--color-brand-950)]">
              {tool.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{tool.desc}</p>
            <p className="mt-4 text-xs font-semibold text-[var(--color-brand-600)] group-hover:underline">
              {t.open} →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
