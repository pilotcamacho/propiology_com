import Link from 'next/link';

const copy = {
  en: { tagline: 'The study of oneself, applied.', privacy: 'Privacy', terms: 'Terms', security: 'Security' },
  es: { tagline: 'El estudio de uno mismo, aplicado.', privacy: 'Privacidad', terms: 'Términos', security: 'Seguridad' },
};

export function Footer({ locale }: { locale: string }) {
  const t = copy[locale as keyof typeof copy] ?? copy.en;
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-8">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:justify-between">
        <div>
          <span className="font-semibold text-[var(--color-brand-700)]">Propiology</span>
          {' · '}
          {t.tagline}
        </div>
        <div className="flex gap-4">
          <Link href={`/${locale}/privacy`} className="hover:text-[var(--color-brand-700)]">{t.privacy}</Link>
          <Link href={`/${locale}/terms`} className="hover:text-[var(--color-brand-700)]">{t.terms}</Link>
          <Link href={`/${locale}/security`} className="hover:text-[var(--color-brand-700)]">{t.security}</Link>
        </div>
      </div>
    </footer>
  );
}
