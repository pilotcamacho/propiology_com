'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';
import { ReadinessScore } from '@/components/ui/ReadinessScore';
import { JourneyStageBadge } from '@/components/ui/Badge';
import { insightOfTheDay } from '@/lib/habits/insights';
import { todayStr } from '@/lib/habits/streaks';

const client = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    greeting: (name: string, hour: number) => {
      const t = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      return `${t}, ${name}`;
    },
    score: 'Readiness Score',
    today: 'Today',
    avg7: '7-day avg',
    habits: "Today's Habits",
    noHabits: 'No habits yet.',
    addHabit: 'Add your first habit →',
    done: 'Done',
    mark: 'Mark done',
    insight: 'Insight of the day',
    quickLinks: 'Continue your practice',
    links: [
      { href: 'journal', label: 'Journal', icon: '✎', desc: "Today's reflection" },
      { href: 'tools', label: 'AI Tools', icon: '✦', desc: 'Care-Multiplier & more' },
      { href: 'progress', label: 'Progress', icon: '↗', desc: 'Score trend & badges' },
      { href: 'habits', label: 'Habits', icon: '✓', desc: 'All habits & streaks' },
    ],
    loading: 'Loading…',
  },
  es: {
    greeting: (name: string, hour: number) => {
      const t = hour < 12 ? 'Buenos días' : hour < 17 ? 'Buenas tardes' : 'Buenas noches';
      return `${t}, ${name}`;
    },
    score: 'Puntaje de Disposición',
    today: 'Hoy',
    avg7: 'Promedio 7 días',
    habits: 'Hábitos de Hoy',
    noHabits: 'Aún no tienes hábitos.',
    addHabit: 'Agrega tu primer hábito →',
    done: 'Hecho',
    mark: 'Marcar hecho',
    insight: 'Idea del día',
    quickLinks: 'Continúa tu práctica',
    links: [
      { href: 'journal', label: 'Diario', icon: '✎', desc: 'Reflexión de hoy' },
      { href: 'tools', label: 'Herramientas IA', icon: '✦', desc: 'Care-Multiplier y más' },
      { href: 'progress', label: 'Progreso', icon: '↗', desc: 'Tendencia de puntaje' },
      { href: 'habits', label: 'Hábitos', icon: '✓', desc: 'Todos los hábitos' },
    ],
    loading: 'Cargando…',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface HabitItem {
  id: string;
  name: string;
  doneToday: boolean;
  logId?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;
  const base = `/${locale}/dashboard`;

  const [name, setName] = useState('');
  const [journeyStage, setJourneyStage] = useState('');
  const [todayScore, setTodayScore] = useState<number | null>(null);
  const [avg7, setAvg7] = useState<number | null>(null);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [toggling, setToggling] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const insight = insightOfTheDay(locale);
  const hour = new Date().getHours();
  const today = todayStr();

  const load = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      setName(attrs.given_name ?? attrs.name ?? attrs.email?.split('@')[0] ?? 'there');
      setJourneyStage(attrs['custom:journey_stage'] ?? '');

      // Readiness scores
      const { data: scores } = await client.models.ReadinessScore.list();
      const sorted = (scores ?? [])
        .filter((s) => s.scoreDate)
        .sort((a, b) => (b.scoreDate ?? '').localeCompare(a.scoreDate ?? ''));

      if (sorted.length > 0) {
        setTodayScore(sorted[0]!.score);
        const last7 = sorted.slice(0, 7);
        const sum = last7.reduce((acc, s) => acc + s.score, 0);
        setAvg7(Math.round(sum / last7.length));
      }

      // Active habits (first 3)
      const { data: habitDefs } = await client.models.HabitDefinition.list({
        filter: { isActive: { eq: true } },
      });
      const top3 = (habitDefs ?? []).slice(0, 3);

      // Today's logs
      const { data: logs } = await client.models.HabitLog.list({
        filter: { logDate: { eq: today } },
      });
      const logsByHabit = new Map(
        (logs ?? []).map((l) => [l.habitId, { doneToday: l.completed ?? false, logId: l.id }])
      );

      setHabits(
        top3.map((h) => ({
          id: h.id,
          name: h.name,
          doneToday: logsByHabit.get(h.id)?.doneToday ?? false,
          logId: logsByHabit.get(h.id)?.logId,
        }))
      );

      void user; // used for auth check only
    } catch {
      // RequireAuth handles redirect
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleHabit(habit: HabitItem) {
    setToggling(habit.id);
    try {
      const newDone = !habit.doneToday;
      if (habit.logId) {
        await client.models.HabitLog.update({ id: habit.logId, completed: newDone });
      } else {
        await client.models.HabitLog.create({
          habitId: habit.id,
          logDate: today,
          completed: newDone,
          source: 'app',
        });
      }
      setHabits((prev) =>
        prev.map((h) => (h.id === habit.id ? { ...h, doneToday: newDone } : h))
      );
    } catch (err) {
      console.error('[dashboard] toggle habit error', err);
    } finally {
      setToggling(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[var(--color-text-muted)]">
        {t.loading}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">
            {t.greeting(name, hour)}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {new Date().toLocaleDateString(locale === 'es' ? 'es' : 'en', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {journeyStage && <JourneyStageBadge stage={journeyStage} />}
      </div>

      {/* Top grid */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Readiness Score card */}
        <div className="rounded-2xl bg-[#0b2a38] p-6 text-white">
          <p className="text-xs font-medium uppercase tracking-widest text-[#83d6d2]">
            {t.score}
          </p>
          <div className="mt-4 flex items-center gap-8">
            <ReadinessScore score={todayScore ?? 0} size="lg" showLabel />
            {avg7 !== null && (
              <div className="text-left">
                <p className="text-4xl font-bold text-[#d4a843]">{avg7}</p>
                <p className="mt-1 text-xs text-[#83d6d2]">{t.avg7}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-6 border-t border-white/10 pt-4">
            <div>
              <p className="text-xs text-[#83d6d2]">{t.today}</p>
              <p className="text-2xl font-semibold">{todayScore ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Today's habits card */}
        <div className="rounded-2xl bg-white border border-[var(--color-border)] p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            {t.habits}
          </p>
          {habits.length === 0 ? (
            <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
              <p>{t.noHabits}</p>
              <Link
                href={`${base}/habits`}
                className="mt-2 inline-block text-[var(--color-brand-600)] hover:underline"
              >
                {t.addHabit}
              </Link>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {habits.map((habit) => (
                <li key={habit.id} className="flex items-center justify-between gap-3">
                  <span
                    className={`text-sm ${
                      habit.doneToday
                        ? 'text-[var(--color-text-muted)] line-through'
                        : 'text-[var(--color-brand-900)]'
                    }`}
                  >
                    {habit.name}
                  </span>
                  <button
                    onClick={() => void toggleHabit(habit)}
                    disabled={toggling === habit.id}
                    aria-label={habit.doneToday ? t.done : t.mark}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      habit.doneToday
                        ? 'border-[var(--color-success-500)] bg-[var(--color-success-500)] text-white'
                        : 'border-[var(--color-border)] hover:border-[var(--color-brand-400)]'
                    } disabled:opacity-50`}
                  >
                    {habit.doneToday && <span className="text-xs font-bold">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {habits.length > 0 && (
            <Link
              href={`${base}/habits`}
              className="mt-5 block text-xs text-[var(--color-brand-600)] hover:underline"
            >
              {locale === 'es' ? 'Ver todos los hábitos →' : 'View all habits →'}
            </Link>
          )}
        </div>
      </div>

      {/* Insight of the day */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-sand)] p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
          {t.insight}
        </p>
        <blockquote className="mt-3 text-base italic leading-relaxed text-[var(--color-brand-900)]">
          &ldquo;{insight}&rdquo;
        </blockquote>
      </div>

      {/* Quick links */}
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
          {t.quickLinks}
        </p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={`${base}/${link.href}`}
              className="group flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-white p-4 transition-all hover:border-[var(--color-brand-400)] hover:shadow-sm"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-sm font-semibold text-[var(--color-brand-900)] group-hover:text-[var(--color-brand-600)]">
                {link.label}
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">{link.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
