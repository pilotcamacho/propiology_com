'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

const nav = {
  en: {
    home: 'Overview',
    team: 'Team',
    programs: 'Programs',
    reports: 'Reports',
    seats: 'Seat Management',
    billing: 'Billing',
    signOut: 'Sign Out',
  },
  es: {
    home: 'Resumen',
    team: 'Equipo',
    programs: 'Programas',
    reports: 'Reportes',
    seats: 'Gestión de Cupos',
    billing: 'Facturación',
    signOut: 'Cerrar Sesión',
  },
};

export function CommandSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = nav[locale as keyof typeof nav] ?? nav.en;
  const base = `/${locale}/command`;

  const links = [
    { href: base, label: copy.home, icon: '⊙' },
    { href: `${base}/team`, label: copy.team, icon: '◎' },
    { href: `${base}/programs`, label: copy.programs, icon: '▤' },
    { href: `${base}/reports`, label: copy.reports, icon: '↓' },
    { href: `${base}/seats`, label: copy.seats, icon: '◫' },
    { href: `${base}/billing`, label: copy.billing, icon: '◈' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}/login`);
  };

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[var(--color-brand-950)] py-6">
      <div className="px-4 pb-6">
        <Link href={`/${locale}`} className="text-lg font-bold text-white">
          Propiology
        </Link>
        <p className="mt-0.5 text-xs text-[var(--color-brand-300)]">Command Center</p>
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
                  ? 'bg-[var(--color-brand-800)] font-semibold text-white'
                  : 'text-[var(--color-brand-200)] hover:bg-[var(--color-brand-900)] hover:text-white'
              }`}
            >
              <span className="w-4 text-center opacity-70">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pt-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-brand-300)] transition-colors hover:bg-[var(--color-brand-900)] hover:text-white"
        >
          <span className="w-4 text-center opacity-70">→</span>
          {copy.signOut}
        </button>
      </div>
    </aside>
  );
}
