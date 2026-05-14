import { RequireAuth } from '@/components/auth/RequireAuth';

export default async function OnboardingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <RequireAuth locale={locale}>
      <div className="min-h-screen bg-[var(--color-sand)]">
        {children}
      </div>
    </RequireAuth>
  );
}
