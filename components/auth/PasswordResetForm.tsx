'use client';

import { useState } from 'react';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const t = {
  en: {
    title: 'Reset Password',
    subtitle: 'Enter your email to receive a reset code.',
    email: 'Email address',
    sendCode: 'Send Reset Code',
    confirmTitle: 'Enter new password',
    confirmSubtitle: 'Check your email for the verification code.',
    code: 'Verification code',
    newPassword: 'New password',
    confirm: 'Reset Password',
    backToLogin: 'Back to sign in',
  },
  es: {
    title: 'Restablecer Contraseña',
    subtitle: 'Ingresa tu correo para recibir un código.',
    email: 'Correo electrónico',
    sendCode: 'Enviar Código',
    confirmTitle: 'Ingresa la nueva contraseña',
    confirmSubtitle: 'Revisa tu correo para el código de verificación.',
    code: 'Código de verificación',
    newPassword: 'Nueva contraseña',
    confirm: 'Restablecer Contraseña',
    backToLogin: 'Volver a iniciar sesión',
  },
};

export function PasswordResetForm({ locale }: { locale: string }) {
  const router = useRouter();
  const copy = t[locale as keyof typeof t] ?? t.en;

  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword({ username: email });
      setStep('confirm');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      router.push(`/${locale}/login`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-subtle)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="text-xl font-bold text-[var(--color-brand-700)]">Propiology</Link>
          <h1 className="mt-6 text-3xl font-bold text-[var(--color-brand-950)]">
            {step === 'request' ? copy.title : copy.confirmTitle}
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            {step === 'request' ? copy.subtitle : copy.confirmSubtitle}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-elevated)]">
          {step === 'request' ? (
            <form onSubmit={handleRequest} className="space-y-5">
              {error && <div className="rounded-md bg-[var(--color-alert-100)] p-3 text-sm text-[var(--color-alert-500)]">{error}</div>}
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">{copy.email}</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--color-brand-600)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] disabled:opacity-50 transition-colors">
                {loading ? '...' : copy.sendCode}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-5">
              {error && <div className="rounded-md bg-[var(--color-alert-100)] p-3 text-sm text-[var(--color-alert-500)]">{error}</div>}
              <div>
                <label htmlFor="code" className="mb-1 block text-sm font-medium">{copy.code}</label>
                <input id="code" type="text" required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} className="input-base" />
              </div>
              <div>
                <label htmlFor="newPassword" className="mb-1 block text-sm font-medium">{copy.newPassword}</label>
                <input id="newPassword" type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-base" />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--color-brand-600)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] disabled:opacity-50 transition-colors">
                {loading ? '...' : copy.confirm}
              </button>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <Link href={`/${locale}/login`} className="text-[var(--color-brand-700)] hover:underline">{copy.backToLogin}</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
