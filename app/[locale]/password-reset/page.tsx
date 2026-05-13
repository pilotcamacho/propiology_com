import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export default async function PasswordResetPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PasswordResetForm locale={locale} />;
}
