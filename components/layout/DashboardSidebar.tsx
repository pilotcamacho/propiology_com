'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

const nav = {
  en: {
    home: 'Dashboard',
    habits: 'Habits',
    tools: 'AI Tools',
    biometrics: 'Biometrics',
    journal: 'Journal',
    progress: 'Progress',
    settings: 'Settings',
    billing: 'Billing',
    signOut: 'Sign Out',
  },
  es: {
    home: 'Inicio',
    habits: 'Hábitos',
    tools: 'Herramientas IA',
    biometrics: 'Biométricos',
    journal: 'Diario',
    progress: 'Progreso',
    settings: 'Configuración',
    billing: 'Facturación',
    signOut: 'Cerrar Sesión',
  },
};

export function DashboardSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = nav[locale as keyof typeof nav] ?? nav.en;
  const base = `/${locale}/dashboard`;

  const links = [
    { href: base, label: copy.home, icon: '⊙' },
    { href: `${base}/habits`, label: copy.habits, icon: '✓' },
    { href: `${base}/tools`, label: copy.tools, icon: '✦' },
    { href: `${base}/biometrics`, label: copy.biometrics, icon: '♡' },
    { href: `${base}/journal`, label: copy.journal, icon: '✎' },
    { href: `${base}/progress`, label: copy.progress, icon: '↗' },
    { href: `${base}/settings`, label: copy.settings, icon: '⚙' },
    { href: `/${locale}/billing`, label: copy.billing, icon: '◈' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}/login`);
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-[var(--color-border)] bg-white py-6">
      <div className="px-4 pb-6">
        <Link href={`/${locale}`} className="text-lg font-bold text-[var(--color-brand-700)]">
          Propiology
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-[var(--color-brand-50)] font-semibold text-[var(--color-brand-700)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-earth-50)] hover:text-[var(--color-brand-700)]'
              }`}
            >
              <span className="w-4 text-center">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pt-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-earth-50)] hover:text-[var(--color-alert-500)]"
        >
          <span className="w-4 text-center">→</span>
          {copy.signOut}
        </button>
      </div>
    </aside>
  );
}
