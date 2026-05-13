'use client';

import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const t = {
  en: {
    title: 'Sign In',
    subtitle: 'Welcome back to your Personal OS',
    email: 'Email address',
    password: 'Password',
    submit: 'Sign In',
    forgot: 'Forgot password?',
    noAccount: "Don't have an account?",
    register: 'Start free trial',
  },
  es: {
    title: 'Iniciar Sesión',
    subtitle: 'Bienvenido a tu Sistema Operativo Personal',
    email: 'Correo electrónico',
    password: 'Contraseña',
    submit: 'Iniciar Sesión',
    forgot: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes cuenta?',
    register: 'Comenzar gratis',
  },
};

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const copy = t[locale as keyof typeof t] ?? t.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn({ username: email, password });
      // Route based on Cognito group
      const session = await fetchAuthSession();
      const groups =
        (session.tokens?.idToken?.payload['cognito:groups'] as string[] | undefined) ?? [];
      const isBusiness =
        groups.includes('CorporateAdmins') ||
        groups.includes('HealthcareProviders') ||
        groups.includes('Coaches');
      router.push(isBusiness ? `/${locale}/command` : `/${locale}/dashboard`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-subtle)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="text-xl font-bold text-[var(--color-brand-700)]">
            Propiology
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-[var(--color-brand-950)]">{copy.title}</h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">{copy.subtitle}</p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-elevated)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md border border-[var(--color-alert-100)] bg-[var(--color-alert-100)] p-3 text-sm text-[var(--color-alert-500)]">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">
                {copy.email}
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">
                {copy.password}
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[var(--color-brand-600)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-700)] disabled:opacity-50"
            >
              {loading ? '...' : copy.submit}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-[var(--color-text-secondary)]">
            <div>
              <Link href={`/${locale}/password-reset`} className="text-[var(--color-brand-700)] hover:underline">
                {copy.forgot}
              </Link>
            </div>
            <div>
              {copy.noAccount}{' '}
              <Link href={`/${locale}/register`} className="font-medium text-[var(--color-brand-700)] hover:underline">
                {copy.register}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
