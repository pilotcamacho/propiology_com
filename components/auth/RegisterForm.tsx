'use client';

import { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const t = {
  en: {
    title: 'Start Your Free Trial',
    subtitle: '14 days free · No credit card required',
    name: 'Full name',
    email: 'Email address',
    password: 'Password (min. 8 characters)',
    language: 'Preferred language',
    langEn: 'English',
    langEs: 'Español',
    role: 'I am registering as',
    roleIndividual: 'An individual (Personal OS)',
    roleTeam: 'A team or organization (B2B)',
    submit: 'Create Account',
    hasAccount: 'Already have an account?',
    signIn: 'Sign in',
    verifyTitle: 'Verify your email',
    verifySubtitle: 'We sent a 6-digit code to your email.',
    code: 'Verification code',
    confirm: 'Confirm & Continue',
    terms: 'By registering you agree to our Terms of Service and Privacy Policy.',
  },
  es: {
    title: 'Comenzar Prueba Gratuita',
    subtitle: '14 días gratis · Sin tarjeta de crédito',
    name: 'Nombre completo',
    email: 'Correo electrónico',
    password: 'Contraseña (mín. 8 caracteres)',
    language: 'Idioma preferido',
    langEn: 'English',
    langEs: 'Español',
    role: 'Me registro como',
    roleIndividual: 'Individuo (Sistema Operativo Personal)',
    roleTeam: 'Equipo u organización (B2B)',
    submit: 'Crear Cuenta',
    hasAccount: '¿Ya tienes cuenta?',
    signIn: 'Iniciar sesión',
    verifyTitle: 'Verifica tu correo',
    verifySubtitle: 'Enviamos un código de 6 dígitos a tu correo.',
    code: 'Código de verificación',
    confirm: 'Confirmar y Continuar',
    terms: 'Al registrarte aceptas nuestros Términos de Servicio y Política de Privacidad.',
  },
};

export function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const copy = t[locale as keyof typeof t] ?? t.en;

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [language, setLanguage] = useState(locale === 'es' ? 'es' : 'en');
  const [role, setRole] = useState<'individual' | 'team'>('individual');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
            'custom:language_preference': language,
            'custom:role': role === 'team' ? 'corporate_admin' : 'end_user',
            'custom:subscription_tier': 'trial',
          },
        },
      });
      setStep('verify');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      router.push(`/${locale}/onboarding`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    'input-base';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-subtle)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="text-xl font-bold text-[var(--color-brand-700)]">
            Propiology
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-[var(--color-brand-950)]">
            {step === 'register' ? copy.title : copy.verifyTitle}
          </h1>
          <p className="mt-2 text-[var(--color-text-secondary)]">
            {step === 'register' ? copy.subtitle : copy.verifySubtitle}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-elevated)]">
          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="rounded-md bg-[var(--color-alert-100)] p-3 text-sm text-[var(--color-alert-500)]">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">{copy.name}</label>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">{copy.email}</label>
                <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">{copy.password}</label>
                <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label htmlFor="language" className="mb-1 block text-sm font-medium">{copy.language}</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className={inputCls}>
                  <option value="en">{copy.langEn}</option>
                  <option value="es">{copy.langEs}</option>
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">{copy.role}</p>
                <div className="space-y-2">
                  {(['individual', 'team'] as const).map((r) => (
                    <label key={r} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border)] p-3 hover:border-[var(--color-brand-400)]">
                      <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="accent-[var(--color-brand-600)]" />
                      <span className="text-sm">{r === 'individual' ? copy.roleIndividual : copy.roleTeam}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--color-brand-600)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-700)] disabled:opacity-50">
                {loading ? '...' : copy.submit}
              </button>
              <p className="text-center text-xs text-[var(--color-text-muted)]">{copy.terms}</p>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              {error && (
                <div className="rounded-md bg-[var(--color-alert-100)] p-3 text-sm text-[var(--color-alert-500)]">{error}</div>
              )}
              <div>
                <label htmlFor="code" className="mb-1 block text-sm font-medium">{copy.code}</label>
                <input id="code" type="text" required inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} className={inputCls} />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[var(--color-brand-600)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-700)] disabled:opacity-50">
                {loading ? '...' : copy.confirm}
              </button>
            </form>
          )}

          {step === 'register' && (
            <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
              {copy.hasAccount}{' '}
              <Link href={`/${locale}/login`} className="font-medium text-[var(--color-brand-700)] hover:underline">
                {copy.signIn}
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
