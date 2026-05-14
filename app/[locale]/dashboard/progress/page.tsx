'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';
import { ReadinessScore } from '@/components/ui/ReadinessScore';

const client = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    title: 'Progress',
    sub: 'Your Readiness Score trend over the last 30 days.',
    components: 'Score breakdown',
    habits: 'Habit adherence',
    biometric: 'Biometric signals',
    reflection: 'Reflection activity',
    milestones: 'Milestones',
    noScore: 'No score data yet. Complete your daily habits and journal to build your score.',
    loading: 'Loading…',
    today: 'Today',
    milestone_badges: [
      { key: 'first_habit', label: 'First habit logged', icon: '✓' },
      { key: 'streak_7', label: '7-day streak', icon: '🔥' },
      { key: 'streak_30', label: '30-day streak', icon: '⚡' },
      { key: 'first_journal', label: 'First journal entry', icon: '✎' },
      { key: 'score_70', label: 'Readiness Score 70+', icon: '↗' },
      { key: 'score_90', label: 'Readiness Score 90+', icon: '✦' },
    ],
  },
  es: {
    title: 'Progreso',
    sub: 'Tu tendencia de Puntaje de Disposición en los últimos 30 días.',
    components: 'Desglose del puntaje',
    habits: 'Adherencia a hábitos',
    biometric: 'Señales biométricas',
    reflection: 'Actividad de reflexión',
    milestones: 'Logros',
    noScore: 'Aún no hay datos de puntaje. Completa tus hábitos diarios y diario para construir tu puntaje.',
    loading: 'Cargando…',
    today: 'Hoy',
    milestone_badges: [
      { key: 'first_habit', label: 'Primer hábito registrado', icon: '✓' },
      { key: 'streak_7', label: 'Racha de 7 días', icon: '🔥' },
      { key: 'streak_30', label: 'Racha de 30 días', icon: '⚡' },
      { key: 'first_journal', label: 'Primera entrada de diario', icon: '✎' },
      { key: 'score_70', label: 'Puntaje de Disposición 70+', icon: '↗' },
      { key: 'score_90', label: 'Puntaje de Disposición 90+', icon: '✦' },
    ],
  },
};

// ── Inline SVG sparkline ──────────────────────────────────────────────────────

function ScoreChart({ scores }: { scores: { date: string; score: number }[] }) {
  if (scores.length < 2) return null;

  const W = 600;
  const H = 140;
  const PAD = 12;
  const max = Math.max(...scores.map((s) => s.score), 10);
  const min = Math.max(0, Math.min(...scores.map((s) => s.score)) - 5);

  const xs = scores.map((_, i) => PAD + (i / (scores.length - 1)) * (W - PAD * 2));
  const ys = scores.map((s) => H - PAD - ((s.score - min) / (max - min)) * (H - PAD * 2));

  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const area = [
    `M ${xs[0]},${H - PAD}`,
    ...xs.map((x, i) => `L ${x},${ys[i]}`),
    `L ${xs[xs.length - 1]},${H - PAD}`,
    'Z',
  ].join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1aa6ad" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1aa6ad" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#scoreGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="#1aa6ad"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Latest dot */}
      <circle cx={xs[xs.length - 1]!} cy={ys[ys.length - 1]!} r="4" fill="#1aa6ad" />
    </svg>
  );
}

// ── Component breakdown bar ───────────────────────────────────────────────────

function ComponentBar({ label, value, weight, color }: {
  label: string;
  value: number;
  weight: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-[var(--color-brand-900)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--color-brand-950)]">
          {value} <span className="text-xs text-[var(--color-text-muted)] font-normal">({weight}%)</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;

  const [scores, setScores] = useState<{ date: string; score: number; habit: number; bio: number; reflection: number }[]>([]);
  const [maxStreak, setMaxStreak] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Last 30 ReadinessScores
        const since30 = new Date();
        since30.setDate(since30.getDate() - 30);
        const since30Str = since30.toISOString().split('T')[0]!;

        const { data: scoreData } = await client.models.ReadinessScore.list({
          filter: { scoreDate: { ge: since30Str } },
        });

        const sorted = (scoreData ?? [])
          .sort((a, b) => (a.scoreDate ?? '').localeCompare(b.scoreDate ?? ''))
          .map((s) => ({
            date: s.scoreDate,
            score: s.score,
            habit: s.habitComponent ?? 0,
            bio: s.biometricComponent ?? 0,
            reflection: s.reflectionComponent ?? 0,
          }));
        setScores(sorted);

        // Streak: look at habit logs
        const { data: logs } = await client.models.HabitLog.list({
          filter: { logDate: { ge: since30Str }, completed: { eq: true } },
        });
        // Count completed days (unique dates)
        const uniqueDates = new Set((logs ?? []).map((l) => l.logDate)).size;
        setMaxStreak(uniqueDates);

        // Journal count
        const { data: journals } = await client.models.JournalEntry.list();
        setJournalCount((journals ?? []).length);
      } catch (err) {
        console.error('[progress] load error', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--color-text-muted)]">
        {t.loading}
      </div>
    );
  }

  const latest = scores[scores.length - 1];

  const milestones = t.milestone_badges.map((m) => {
    let earned = false;
    if (m.key === 'first_habit') earned = maxStreak > 0;
    if (m.key === 'streak_7') earned = maxStreak >= 7;
    if (m.key === 'streak_30') earned = maxStreak >= 30;
    if (m.key === 'first_journal') earned = journalCount > 0;
    if (m.key === 'score_70') earned = (latest?.score ?? 0) >= 70;
    if (m.key === 'score_90') earned = (latest?.score ?? 0) >= 90;
    return { ...m, earned };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
      </div>

      {scores.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-12 text-center text-sm text-[var(--color-text-muted)]">
          {t.noScore}
        </div>
      ) : (
        <>
          {/* Score trend */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                  {t.today}
                </p>
                <p className="text-4xl font-bold text-[var(--color-brand-950)]">
                  {latest?.score ?? '—'}
                </p>
              </div>
              {latest && <ReadinessScore score={latest.score} size="md" showLabel />}
            </div>
            <ScoreChart scores={scores} />
          </div>

          {/* Component breakdown */}
          {latest && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold text-[var(--color-brand-950)]">
                {t.components}
              </h2>
              <div className="flex flex-col gap-4">
                <ComponentBar
                  label={t.habits}
                  value={(latest.habit / (latest.score * 0.4)) * 100 || 0}
                  weight={40}
                  color="var(--color-brand-500)"
                />
                <ComponentBar
                  label={t.biometric}
                  value={(latest.bio / (latest.score * 0.3)) * 100 || 0}
                  weight={30}
                  color="var(--color-gold-500)"
                />
                <ComponentBar
                  label={t.reflection}
                  value={(latest.reflection / (latest.score * 0.3)) * 100 || 0}
                  weight={30}
                  color="#2cb67d"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Milestones */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-[var(--color-brand-950)]">
          {t.milestones}
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {milestones.map((m) => (
            <div
              key={m.key}
              className={`rounded-xl border p-4 transition-all ${
                m.earned
                  ? 'border-[var(--color-brand-300)] bg-[var(--color-brand-50)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] opacity-50'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <p className={`mt-2 text-xs font-medium ${m.earned ? 'text-[var(--color-brand-700)]' : 'text-[var(--color-text-muted)]'}`}>
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
