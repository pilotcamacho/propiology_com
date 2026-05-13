'use client';

import Link from 'next/link';
import { useState } from 'react';

const nav = {
  en: { features: 'Features', pricing: 'Pricing', forTeams: 'For Teams', login: 'Sign In', cta: 'Start Free Trial' },
  es: { features: 'Características', pricing: 'Precios', forTeams: 'Para Equipos', login: 'Iniciar Sesión', cta: 'Comenzar Gratis' },
};

export function MarketingHeader({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const copy = nav[locale as keyof typeof nav] ?? nav.en;
  const otherLocale = locale === 'en' ? 'es' : 'en';

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={`/${locale}`} className="text-xl font-bold text-[var(--color-brand-700)]">
          Propiology
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href={`/${locale}/features`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-700)]">{copy.features}</Link>
          <Link href={`/${locale}/pricing`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-700)]">{copy.pricing}</Link>
          <Link href={`/${locale}/for-teams`} className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-700)]">{copy.forTeams}</Link>
          <Link href={`/${otherLocale}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-700)]">
            {otherLocale.toUpperCase()}
          </Link>
          <Link href={`/${locale}/login`} className="text-[var(--color-brand-700)] font-medium hover:underline">{copy.login}</Link>
          <Link href={`/${locale}/register`} className="rounded-lg bg-[var(--color-brand-600)] px-4 py-2 text-white hover:bg-[var(--color-brand-700)] transition-colors">
            {copy.cta}
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--color-text-primary)]"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-[var(--color-border)] px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3 text-sm">
            <Link href={`/${locale}/features`} onClick={() => setOpen(false)}>{copy.features}</Link>
            <Link href={`/${locale}/pricing`} onClick={() => setOpen(false)}>{copy.pricing}</Link>
            <Link href={`/${locale}/for-teams`} onClick={() => setOpen(false)}>{copy.forTeams}</Link>
            <Link href={`/${locale}/login`} onClick={() => setOpen(false)}>{copy.login}</Link>
            <Link href={`/${locale}/register`} onClick={() => setOpen(false)} className="rounded-lg bg-[var(--color-brand-600)] px-4 py-2 text-center text-white">
              {copy.cta}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
