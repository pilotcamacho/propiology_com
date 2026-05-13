'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export function RequireAuth({ children, locale }: { children: React.ReactNode; locale: string }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => setReady(true))
      .catch(() => router.replace(`/${locale}/login`));
  }, [locale, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-brand-600)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
