'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';
import { StreakBadge } from '@/components/ui/Badge';
import { currentStreak, bestStreak, todayStr } from '@/lib/habits/streaks';

const client = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    title: 'Habits',
    sub: 'Build the behaviors that define who you are becoming.',
    addHeading: 'Add a habit',
    namePlaceholder: 'e.g. Morning walk, Meditation, Cold shower',
    category: 'Category',
    frequency: 'Frequency',
    categories: [
      { value: 'body', label: 'Body' },
      { value: 'mind', label: 'Mind' },
      { value: 'relationships', label: 'Relationships' },
      { value: 'work', label: 'Work' },
    ],
    frequencies: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
    ],
    add: 'Add habit',
    adding: 'Adding…',
    cancel: 'Cancel',
    newHabit: '+ New habit',
    todayHeading: "Today's check-in",
    allHeading: 'All habits',
    currentStreak: 'Current streak',
    bestStreak: 'Best streak',
    days: 'd',
    done: 'Done today',
    mark: 'Mark done',
    note: 'Note (optional)',
    noHabits: 'You have no active habits yet.',
    loading: 'Loading…',
    deactivate: 'Deactivate',
    archive: 'Archive',
  },
  es: {
    title: 'Hábitos',
    sub: 'Construye los comportamientos que definen en quién te estás convirtiendo.',
    addHeading: 'Agregar un hábito',
    namePlaceholder: 'ej. Caminata matutina, Meditación, Ducha fría',
    category: 'Categoría',
    frequency: 'Frecuencia',
    categories: [
      { value: 'body', label: 'Cuerpo' },
      { value: 'mind', label: 'Mente' },
      { value: 'relationships', label: 'Relaciones' },
      { value: 'work', label: 'Trabajo' },
    ],
    frequencies: [
      { value: 'daily', label: 'Diario' },
      { value: 'weekly', label: 'Semanal' },
    ],
    add: 'Agregar hábito',
    adding: 'Agregando…',
    cancel: 'Cancelar',
    newHabit: '+ Nuevo hábito',
    todayHeading: 'Registro de hoy',
    allHeading: 'Todos los hábitos',
    currentStreak: 'Racha actual',
    bestStreak: 'Mejor racha',
    days: 'd',
    done: 'Hecho hoy',
    mark: 'Marcar hecho',
    note: 'Nota (opcional)',
    noHabits: 'Aún no tienes hábitos activos.',
    loading: 'Cargando…',
    deactivate: 'Desactivar',
    archive: 'Archivar',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface HabitWithStats {
  id: string;
  name: string;
  category: string | null | undefined;
  frequency: string | null | undefined;
  current: number;
  best: number;
  doneToday: boolean;
  logId?: string;
  noteToday?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  body: '♡',
  mind: '◎',
  relationships: '✦',
  work: '⊙',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function HabitsPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;
  const today = todayStr();

  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('body');
  const [newFreq, setNewFreq] = useState<'daily' | 'weekly'>('daily');
  const [adding, setAdding] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: defs } = await client.models.HabitDefinition.list({
        filter: { isActive: { eq: true } },
      });

      // Fetch 90 days of logs for streak calc
      const since90 = new Date();
      since90.setDate(since90.getDate() - 90);
      const since90Str = since90.toISOString().split('T')[0]!;

      const { data: allLogs } = await client.models.HabitLog.list({
        filter: { logDate: { ge: since90Str } },
      });

      const todayLogs = new Map(
        (allLogs ?? [])
          .filter((l) => l.logDate === today)
          .map((l) => [l.habitId, { done: l.completed ?? false, id: l.id, note: l.notes }])
      );

      const logsByHabit = new Map<string, { logDate: string; completed: boolean }[]>();
      for (const log of allLogs ?? []) {
        if (!logsByHabit.has(log.habitId)) logsByHabit.set(log.habitId, []);
        logsByHabit.get(log.habitId)!.push({
          logDate: log.logDate,
          completed: log.completed ?? false,
        });
      }

      setHabits(
        (defs ?? []).map((h) => {
          const logs = logsByHabit.get(h.id) ?? [];
          const todayLog = todayLogs.get(h.id);
          return {
            id: h.id,
            name: h.name,
            category: h.category,
            frequency: h.frequency,
            current: currentStreak(logs),
            best: bestStreak(logs),
            doneToday: todayLog?.done ?? false,
            logId: todayLog?.id,
            noteToday: todayLog?.note ?? undefined,
          };
        })
      );
    } catch (err) {
      console.error('[habits] load error', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    void load();
  }, [load]);

  async function addHabit() {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await client.models.HabitDefinition.create({
        name: newName.trim(),
        category: newCategory as 'body' | 'mind' | 'relationships' | 'work',
        frequency: newFreq,
        isActive: true,
      });
      setNewName('');
      setNewCategory('body');
      setNewFreq('daily');
      setShowForm(false);
      await load();
    } catch (err) {
      console.error('[habits] add error', err);
    } finally {
      setAdding(false);
    }
  }

  async function toggleHabit(habit: HabitWithStats) {
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
      console.error('[habits] toggle error', err);
    } finally {
      setToggling(null);
    }
  }

  async function deactivateHabit(id: string) {
    try {
      await client.models.HabitDefinition.update({ id, isActive: false });
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('[habits] deactivate error', err);
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
          <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-[var(--color-brand-600)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
          >
            {t.newHabit}
          </button>
        )}
      </div>

      {/* Add habit form */}
      {showForm && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--color-brand-950)]">
            {t.addHeading}
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                  {t.category}
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
                >
                  {t.categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                  {t.frequency}
                </label>
                <select
                  value={newFreq}
                  onChange={(e) => setNewFreq(e.target.value as 'daily' | 'weekly')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
                >
                  {t.frequencies.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => void addHabit()}
                disabled={!newName.trim() || adding}
                className="rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
              >
                {adding ? t.adding : t.add}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-12 text-center">
          <p className="text-[var(--color-text-muted)]">{t.noHabits}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
          >
            {t.newHabit}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-2xl border border-[var(--color-border)] bg-white p-5"
            >
              <div className="flex items-start gap-4">
                {/* Check button */}
                <button
                  onClick={() => void toggleHabit(habit)}
                  disabled={toggling === habit.id}
                  aria-label={habit.doneToday ? t.done : t.mark}
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    habit.doneToday
                      ? 'border-[var(--color-success-500)] bg-[var(--color-success-500)] text-white'
                      : 'border-[var(--color-border)] hover:border-[var(--color-brand-400)]'
                  } disabled:opacity-50`}
                >
                  {habit.doneToday && <span className="text-sm font-bold">✓</span>}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-medium text-[var(--color-brand-950)]">
                      {habit.name}
                    </span>
                    {habit.category && (
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {CATEGORY_ICONS[habit.category] ?? '·'}{' '}
                        {t.categories.find((c) => c.value === habit.category)?.label}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {t.currentStreak}:
                      </span>
                      {habit.current > 0 ? (
                        <StreakBadge days={habit.current} />
                      ) : (
                        <span className="text-xs text-[var(--color-text-muted)]">0{t.days}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {t.bestStreak}:
                      </span>
                      <span className="text-xs font-medium text-[var(--color-brand-700)]">
                        {habit.best}{t.days}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deactivate */}
                <button
                  onClick={() => void deactivateHabit(habit.id)}
                  title={t.deactivate}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-alert-500)] transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
