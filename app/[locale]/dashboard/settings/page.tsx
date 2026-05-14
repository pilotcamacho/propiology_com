'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  fetchUserAttributes,
  updateUserAttributes,
  updatePassword,
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    title: 'Settings',
    sub: 'Manage your profile, notifications, and account.',
    profile: 'Profile',
    name: 'Display name',
    email: 'Email',
    language: 'Language preference',
    langEn: 'English',
    langEs: 'Español',
    saveProfile: 'Save profile',
    saving: 'Saving…',
    saved: 'Saved!',
    whatsapp: 'WhatsApp',
    whatsappSub: 'Link your WhatsApp number to receive daily check-ins and insights.',
    phone: 'WhatsApp number',
    phonePlaceholder: '+1 555 000 0000',
    connectWhatsapp: 'Connect WhatsApp',
    disconnectWhatsapp: 'Disconnect',
    optIns: 'Message types',
    optInHabit: 'Daily habit check-in',
    optInScore: 'Morning Readiness Score',
    optInWeekly: 'Weekly insights',
    saveWhatsapp: 'Save WhatsApp settings',
    security: 'Security',
    currentPassword: 'Current password',
    newPassword: 'New password (min. 8 characters)',
    changePassword: 'Change password',
    changingPassword: 'Changing…',
    passwordChanged: 'Password changed!',
    passwordError: 'Password change failed.',
    loading: 'Loading…',
    error: 'Something went wrong.',
  },
  es: {
    title: 'Configuración',
    sub: 'Administra tu perfil, notificaciones y cuenta.',
    profile: 'Perfil',
    name: 'Nombre para mostrar',
    email: 'Correo electrónico',
    language: 'Idioma preferido',
    langEn: 'English',
    langEs: 'Español',
    saveProfile: 'Guardar perfil',
    saving: 'Guardando…',
    saved: '¡Guardado!',
    whatsapp: 'WhatsApp',
    whatsappSub: 'Vincula tu número de WhatsApp para recibir registros diarios e ideas.',
    phone: 'Número de WhatsApp',
    phonePlaceholder: '+52 55 0000 0000',
    connectWhatsapp: 'Conectar WhatsApp',
    disconnectWhatsapp: 'Desconectar',
    optIns: 'Tipos de mensajes',
    optInHabit: 'Registro diario de hábitos',
    optInScore: 'Puntaje de disposición matutino',
    optInWeekly: 'Ideas semanales',
    saveWhatsapp: 'Guardar configuración de WhatsApp',
    security: 'Seguridad',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña (mín. 8 caracteres)',
    changePassword: 'Cambiar contraseña',
    changingPassword: 'Cambiando…',
    passwordChanged: '¡Contraseña cambiada!',
    passwordError: 'Error al cambiar la contraseña.',
    loading: 'Cargando…',
    error: 'Algo salió mal.',
  },
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
      <h2 className="mb-5 text-base font-semibold text-[var(--color-brand-950)]">{heading}</h2>
      {children}
    </section>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;

  // Profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lang, setLang] = useState<'en' | 'es'>(locale);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileFlash, setProfileFlash] = useState(false);

  // WhatsApp
  const [waSession, setWaSession] = useState<{
    id: string;
    phoneNumber: string;
    optInHabitCheckin: boolean;
    optInScoreDigest: boolean;
    optInWeeklyInsight: boolean;
  } | null>(null);
  const [waPhone, setWaPhone] = useState('');
  const [waHabit, setWaHabit] = useState(true);
  const [waScore, setWaScore] = useState(true);
  const [waWeekly, setWaWeekly] = useState(true);
  const [waSaving, setWaSaving] = useState(false);
  const [waFlash, setWaFlash] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwChanging, setPwChanging] = useState(false);
  const [pwFlash, setPwFlash] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const attrs = await fetchUserAttributes();
        setName(attrs.name ?? attrs.given_name ?? '');
        setEmail(attrs.email ?? '');
        const langPref = attrs['custom:language_preference'];
        if (langPref === 'en' || langPref === 'es') setLang(langPref);
        else setLang(locale);

        const { data: sessions } = await client.models.WhatsAppSession.list();
        if (sessions && sessions.length > 0) {
          const s = sessions[0]!;
          setWaSession({
            id: s.id,
            phoneNumber: s.phoneNumber,
            optInHabitCheckin: s.optInHabitCheckin ?? true,
            optInScoreDigest: s.optInScoreDigest ?? true,
            optInWeeklyInsight: s.optInWeeklyInsight ?? true,
          });
          setWaPhone(s.phoneNumber);
          setWaHabit(s.optInHabitCheckin ?? true);
          setWaScore(s.optInScoreDigest ?? true);
          setWaWeekly(s.optInWeeklyInsight ?? true);
        }
      } catch (err) {
        console.error('[settings] load error', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [locale]);

  async function saveProfile() {
    setProfileSaving(true);
    try {
      await updateUserAttributes({
        userAttributes: {
          name,
          'custom:language_preference': lang,
        },
      });
      setProfileFlash(true);
      setTimeout(() => setProfileFlash(false), 2000);
    } catch (err) {
      console.error('[settings] save profile error', err);
    } finally {
      setProfileSaving(false);
    }
  }

  async function saveWhatsApp() {
    if (!waPhone.trim()) return;
    setWaSaving(true);
    try {
      if (waSession) {
        await client.models.WhatsAppSession.update({
          id: waSession.id,
          phoneNumber: waPhone.trim(),
          optInHabitCheckin: waHabit,
          optInScoreDigest: waScore,
          optInWeeklyInsight: waWeekly,
        });
      } else {
        await client.models.WhatsAppSession.create({
          phoneNumber: waPhone.trim(),
          verified: false,
          optInHabitCheckin: waHabit,
          optInScoreDigest: waScore,
          optInWeeklyInsight: waWeekly,
          consentTimestamp: new Date().toISOString(),
        });
      }
      setWaFlash(true);
      setTimeout(() => setWaFlash(false), 2000);
    } catch (err) {
      console.error('[settings] save whatsapp error', err);
    } finally {
      setWaSaving(false);
    }
  }

  async function disconnectWhatsApp() {
    if (!waSession) return;
    try {
      await client.models.WhatsAppSession.delete({ id: waSession.id });
      setWaSession(null);
      setWaPhone('');
    } catch (err) {
      console.error('[settings] disconnect whatsapp error', err);
    }
  }

  async function changePassword() {
    if (!currentPw || !newPw) return;
    setPwChanging(true);
    setPwFlash('');
    try {
      await updatePassword({ oldPassword: currentPw, newPassword: newPw });
      setPwFlash(t.passwordChanged);
      setCurrentPw('');
      setNewPw('');
    } catch (err) {
      console.error('[settings] change password error', err);
      setPwFlash(t.passwordError);
    } finally {
      setPwChanging(false);
    }
  }

  const inputCls =
    'w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]';

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--color-text-muted)]">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
      </div>

      {/* Profile section */}
      <Section heading={t.profile}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
              {t.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
              {t.email}
            </label>
            <input type="email" value={email} readOnly className={`${inputCls} opacity-60`} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
              {t.language}
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'en' | 'es')}
              className={inputCls}
            >
              <option value="en">{t.langEn}</option>
              <option value="es">{t.langEs}</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => void saveProfile()}
              disabled={profileSaving}
              className="rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-50"
            >
              {profileSaving ? t.saving : t.saveProfile}
            </button>
            {profileFlash && (
              <span className="text-sm text-[var(--color-success-500)]">{t.saved}</span>
            )}
          </div>
        </div>
      </Section>

      {/* WhatsApp section */}
      <Section heading={t.whatsapp}>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">{t.whatsappSub}</p>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input
              type="tel"
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className={`${inputCls} flex-1`}
            />
            {waSession && (
              <button
                onClick={() => void disconnectWhatsApp()}
                className="rounded-xl border border-[var(--color-alert-300)] px-4 py-2.5 text-sm text-[var(--color-alert-500)] hover:bg-[var(--color-alert-50)] transition-colors"
              >
                {t.disconnectWhatsapp}
              </button>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">
              {t.optIns}
            </p>
            <div className="flex flex-col gap-2">
              {[
                { key: 'habit', label: t.optInHabit, val: waHabit, set: setWaHabit },
                { key: 'score', label: t.optInScore, val: waScore, set: setWaScore },
                { key: 'weekly', label: t.optInWeekly, val: waWeekly, set: setWaWeekly },
              ].map(({ key, label, val, set }) => (
                <label key={key} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => set(e.target.checked)}
                    className="h-4 w-4 accent-[var(--color-brand-600)]"
                  />
                  <span className="text-sm text-[var(--color-brand-900)]">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => void saveWhatsApp()}
              disabled={!waPhone.trim() || waSaving}
              className="rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-50"
            >
              {waSaving ? t.saving : t.saveWhatsapp}
            </button>
            {waFlash && (
              <span className="text-sm text-[var(--color-success-500)]">{t.saved}</span>
            )}
          </div>
        </div>
      </Section>

      {/* Security section */}
      <Section heading={t.security}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
              {t.currentPassword}
            </label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
              {t.newPassword}
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => void changePassword()}
              disabled={!currentPw || !newPw || pwChanging}
              className="rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-50"
            >
              {pwChanging ? t.changingPassword : t.changePassword}
            </button>
            {pwFlash && (
              <span
                className={`text-sm ${
                  pwFlash === t.passwordChanged
                    ? 'text-[var(--color-success-500)]'
                    : 'text-[var(--color-alert-500)]'
                }`}
              >
                {pwFlash}
              </span>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
