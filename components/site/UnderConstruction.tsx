const copy = {
  en: {
    eyebrow: 'Propiology',
    title: 'Under construction',
    body: 'We are building something meaningful. This platform will open soon.',
    linkLabel: 'Meanwhile, explore propiology.org',
  },
  es: {
    eyebrow: 'Propiología',
    title: 'En construcción',
    body: 'Estamos construyendo algo significativo. Esta plataforma abrirá pronto.',
    linkLabel: 'Mientras tanto, visita propiology.org',
  },
} as const;

export function UnderConstruction({ locale }: { locale: string }) {
  const t = locale === 'es' ? copy.es : copy.en;
  const other = locale === 'es' ? { href: '/en', label: 'English' } : { href: '/es', label: 'Español' };

  return (
    <div
      style={{ backgroundColor: '#fbfcfb', color: '#0f2f4f' }}
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center font-sans"
    >
      <p style={{ color: '#1aa6ad' }} className="mb-4 text-sm font-semibold uppercase tracking-[0.2em]">
        {t.eyebrow}
      </p>
      <h1 className="font-display text-5xl font-light sm:text-6xl">{t.title}</h1>
      <p style={{ color: '#22496b' }} className="mt-6 max-w-md text-lg">
        {t.body}
      </p>
      <a
        href="https://www.propiology.org"
        style={{ backgroundColor: '#1aa6ad' }}
        className="mt-10 rounded-full px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        {t.linkLabel}
      </a>
      <a href={other.href} style={{ color: '#22496b' }} className="mt-8 text-sm underline underline-offset-4">
        {other.label}
      </a>
    </div>
  );
}
