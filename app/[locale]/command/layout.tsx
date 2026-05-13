import { RequireRole } from '@/components/auth/RequireRole';
import { CommandSidebar } from '@/components/layout/CommandSidebar';

export default async function CommandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <RequireRole locale={locale} allowed={['CorporateAdmins', 'HealthcareProviders', 'Coaches', 'SuperAdmins']}>
      <div className="flex min-h-screen bg-[var(--color-surface-dark)] text-white">
        <CommandSidebar locale={locale} />
        <div className="flex-1 overflow-auto">
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireRole>
  );
}
