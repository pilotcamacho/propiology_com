'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

type CognitoGroup =
  | 'EndUsers'
  | 'Coaches'
  | 'CorporateAdmins'
  | 'HealthcareProviders'
  | 'SuperAdmins';

interface RequireRoleProps {
  children: React.ReactNode;
  locale: string;
  allowed: CognitoGroup[];
}

export function RequireRole({ children, locale, allowed }: RequireRoleProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        await getCurrentUser();
        const session = await fetchAuthSession();
        const groups =
          (session.tokens?.idToken?.payload['cognito:groups'] as string[] | undefined) ?? [];

        const hasRole = allowed.some((g) => groups.includes(g));
        if (!hasRole) {
          // Authenticated but wrong role — redirect to personal dashboard
          router.replace(`/${locale}/dashboard`);
          return;
        }
        setReady(true);
      } catch {
        router.replace(`/${locale}/login`);
      }
    }
    check();
  }, [locale, router, allowed]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-brand-600)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
