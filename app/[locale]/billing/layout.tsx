import { RequireAuth } from '@/components/auth/RequireAuth';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default async function BillingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <RequireAuth locale={locale}>
      <div className="flex min-h-screen bg-[var(--color-surface-subtle)]">
        <DashboardSidebar locale={locale} />
        <div className="flex-1 overflow-auto">
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
