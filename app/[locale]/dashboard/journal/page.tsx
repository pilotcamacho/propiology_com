'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';
import { promptOfTheDay } from '@/lib/journal/prompts';

const client = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    title: 'Journal',
    sub: 'A daily space for honest reflection.',
    todayPrompt: "Today's prompt",
    writePlaceholder: 'Write your thoughts here…',
    mood: 'How are you feeling?',
    moods: [
      { value: 'clarity', label: 'Clarity', icon: '◎' },
      { value: 'tension', label: 'Tension', icon: '⚡' },
      { value: 'curiosity', label: 'Curiosity', icon: '?' },
      { value: 'resistance', label: 'Resistance', icon: '↺' },
      { value: 'flow', label: 'Flow', icon: '~' },
      { value: 'fatigue', label: 'Fatigue', icon: '◑' },
      { value: 'gratitude', label: 'Gratitude', icon: '✦' },
    ],
    save: 'Save entry',
    saving: 'Saving…',
    saved: 'Saved!',
    pastEntries: 'Past entries',
    noEntries: 'No entries yet. Start your first reflection above.',
    loading: 'Loading…',
    wordsLabel: (n: number) => `${n} word${n === 1 ? '' : 's'}`,
    viewPrompt: 'View prompt',
  },
  es: {
    title: 'Diario',
    sub: 'Un espacio diario para la reflexión honesta.',
    todayPrompt: 'Pregunta de hoy',
    writePlaceholder: 'Escribe tus pensamientos aquí…',
    mood: '¿Cómo te sientes?',
    moods: [
      { value: 'clarity', label: 'Claridad', icon: '◎' },
      { value: 'tension', label: 'Tensión', icon: '⚡' },
      { value: 'curiosity', label: 'Curiosidad', icon: '?' },
      { value: 'resistance', label: 'Resistencia', icon: '↺' },
      { value: 'flow', label: 'Flujo', icon: '~' },
      { value: 'fatigue', label: 'Fatiga', icon: '◑' },
      { value: 'gratitude', label: 'Gratitud', icon: '✦' },
    ],
    save: 'Guardar entrada',
    saving: 'Guardando…',
    saved: '¡Guardado!',
    pastEntries: 'Entradas anteriores',
    noEntries: 'Aún no hay entradas. Comienza tu primera reflexión arriba.',
    loading: 'Cargando…',
    wordsLabel: (n: number) => `${n} palabra${n === 1 ? '' : 's'}`,
    viewPrompt: 'Ver pregunta',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

type MoodTag = 'clarity' | 'tension' | 'curiosity' | 'resistance' | 'flow' | 'fatigue' | 'gratitude';

interface EntryItem {
  id: string;
  content: string;
  moodTag: MoodTag | null;
  prompt: string | null;
  wordCount: number | null;
  createdAt: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;
  const prompt = promptOfTheDay(locale);

  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodTag | ''>('');
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await client.models.JournalEntry.list();
        const sorted = (data ?? [])
          .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
          .map((e) => ({
            id: e.id,
            content: e.content,
            moodTag: (e.moodTag as MoodTag | null) ?? null,
            prompt: e.prompt ?? null,
            wordCount: e.wordCount ?? null,
            createdAt: e.createdAt ?? '',
          }));
        setEntries(sorted);
      } catch (err) {
        console.error('[journal] load error', err);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  async function saveEntry() {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const { data: entry } = await client.models.JournalEntry.create({
        prompt,
        content: content.trim(),
        moodTag: mood || undefined,
        wordCount,
      });
      if (entry) {
        setEntries((prev) => [
          {
            id: entry.id,
            content: entry.content,
            moodTag: (entry.moodTag as MoodTag | null) ?? null,
            prompt: entry.prompt ?? null,
            wordCount: entry.wordCount ?? null,
            createdAt: entry.createdAt ?? '',
          },
          ...prev,
        ]);
      }
      setContent('');
      setMood('');
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      console.error('[journal] save error', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
      </div>

      {/* Editor card */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        {/* Prompt */}
        <div className="mb-4 rounded-xl bg-[var(--color-sand)] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
            {t.todayPrompt}
          </p>
          <p className="mt-1 text-sm italic text-[var(--color-brand-900)]">{prompt}</p>
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t.writePlaceholder}
          rows={6}
          className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-brand-900)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
        />
        <p className="mt-1 text-right text-xs text-[var(--color-text-muted)]">
          {t.wordsLabel(wordCount)}
        </p>

        {/* Mood selector */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">{t.mood}</p>
          <div className="flex flex-wrap gap-2">
            {t.moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(mood === m.value ? '' : (m.value as MoodTag))}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  mood === m.value
                    ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)] font-semibold text-[var(--color-brand-700)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-400)]'
                }`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => void saveEntry()}
            disabled={!content.trim() || saving}
            className="rounded-xl bg-[var(--color-brand-600)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
          >
            {saving ? t.saving : t.save}
          </button>
          {savedFlash && (
            <span className="text-sm text-[var(--color-success-500)]">{t.saved}</span>
          )}
        </div>
      </div>

      {/* Past entries */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-brand-950)]">
          {t.pastEntries}
        </h2>

        {loading ? (
          <p className="text-sm text-[var(--color-text-muted)]">{t.loading}</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">{t.noEntries}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id;
              const moodItem = t.moods.find((m) => m.value === entry.moodTag);
              const date = entry.createdAt
                ? new Date(entry.createdAt).toLocaleDateString(locale === 'es' ? 'es' : 'en', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : '';

              return (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden"
                >
                  <button
                    className="w-full px-5 py-4 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {moodItem && (
                          <span className="text-base">{moodItem.icon}</span>
                        )}
                        <p className="text-sm font-medium text-[var(--color-brand-900)] line-clamp-1">
                          {entry.content.slice(0, 80)}
                          {entry.content.length > 80 ? '…' : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-[var(--color-text-muted)]">{date}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[var(--color-border)] px-5 py-4">
                      {entry.prompt && (
                        <p className="mb-3 text-xs italic text-[var(--color-text-muted)]">
                          {entry.prompt}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-brand-900)]">
                        {entry.content}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        {moodItem && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {moodItem.icon} {moodItem.label}
                          </span>
                        )}
                        {entry.wordCount && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {t.wordsLabel(entry.wordCount)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
