'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const appSyncClient = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    title: 'Cognitive Shield',
    sub: 'Identify cognitive biases in your thinking and reframe them with Propiology.',
    step1Label: 'Describe your thought',
    step1Heading: 'What thought or decision would you like to examine?',
    step1Placeholder:
      'Describe a decision you are stuck on, a recurring thought, or a situation you are trying to make sense of…',
    analyze: 'Analyze',
    analyzing: 'Analyzing…',
    step2Label: 'Biases identified',
    step2Heading: 'Here is what may be shaping your thinking',
    insight: 'Overall insight',
    microAction: 'Your micro-action',
    commitBtn: 'Commit to this action',
    step3Label: 'Commit',
    step3Heading: 'Commit to your reframe',
    journalPrompt: 'Add a journal note (optional)',
    journalPlaceholder: 'What will shift if you take this action?',
    saveJournal: 'Save to journal',
    savingJournal: 'Saving…',
    saved: 'Saved!',
    startOver: 'Start over',
    done: 'Done',
    limitReached: 'Daily limit reached. Upgrade to Pro for unlimited access.',
    error: 'Analysis failed. Please try again.',
    wordCount: (n: number) => `${n} word${n === 1 ? '' : 's'}`,
  },
  es: {
    title: 'Escudo Cognitivo',
    sub: 'Identifica sesgos cognitivos en tu pensamiento y refórmalos con Propiology.',
    step1Label: 'Describe tu pensamiento',
    step1Heading: '¿Qué pensamiento o decisión quieres examinar?',
    step1Placeholder:
      'Describe una decisión en la que estás atascado, un pensamiento recurrente o una situación que intentas comprender…',
    analyze: 'Analizar',
    analyzing: 'Analizando…',
    step2Label: 'Sesgos identificados',
    step2Heading: 'Esto puede estar moldeando tu pensamiento',
    insight: 'Perspectiva general',
    microAction: 'Tu micro-acción',
    commitBtn: 'Comprometerse con esta acción',
    step3Label: 'Comprometerse',
    step3Heading: 'Comprométete con tu reencuadre',
    journalPrompt: 'Agregar una nota al diario (opcional)',
    journalPlaceholder: '¿Qué cambiará si tomas esta acción?',
    saveJournal: 'Guardar en diario',
    savingJournal: 'Guardando…',
    saved: '¡Guardado!',
    startOver: 'Empezar de nuevo',
    done: 'Listo',
    limitReached: 'Límite diario alcanzado. Actualiza a Pro para acceso ilimitado.',
    error: 'El análisis falló. Por favor intenta de nuevo.',
    wordCount: (n: number) => `${n} palabra${n === 1 ? '' : 's'}`,
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface BiasResult {
  name: string;
  explanation: string;
  reframe: string;
}

interface Analysis {
  biases: BiasResult[];
  summaryInsight: string;
  microAction: string;
}

type Step = 'input' | 'analysis' | 'commit';

// ── Helpers ───────────────────────────────────────────────────────────────────

function StepIndicator({ current, labels }: { current: Step; labels: [string, string, string] }) {
  const steps: Step[] = ['input', 'analysis', 'commit'];
  return (
    <div className="mb-6 flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
              s === current
                ? 'bg-[var(--color-brand-600)] text-white'
                : steps.indexOf(current) > i
                ? 'bg-[var(--color-success-500)] text-white'
                : 'bg-[var(--color-sand)] text-[var(--color-text-muted)]'
            }`}
          >
            {steps.indexOf(current) > i ? '✓' : i + 1}
          </div>
          <span
            className={`text-xs ${
              s === current
                ? 'font-semibold text-[var(--color-brand-950)]'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            {labels[i]}
          </span>
          {i < 2 && <span className="text-[var(--color-border)]">—</span>}
        </div>
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CognitiveShieldPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;

  const [step, setStep] = useState<Step>('input');
  const [thought, setThought] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [journalNote, setJournalNote] = useState('');
  const [savingJournal, setSavingJournal] = useState(false);
  const [journalSaved, setJournalSaved] = useState(false);

  const wordCount = thought.trim() ? thought.trim().split(/\s+/).length : 0;

  async function runAnalysis() {
    if (!thought.trim() || loading) return;
    setLoading(true);
    setError('');

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() ?? '';

      const res = await fetch('/api/ai/cognitive-shield', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thought: thought.trim(), locale }),
      });

      if (res.status === 429) {
        setError(t.limitReached);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('API error');

      const data = (await res.json()) as Analysis;
      setAnalysis(data);
      setStep('analysis');
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  }

  async function saveJournalEntry() {
    if (!journalNote.trim() || !analysis) return;
    setSavingJournal(true);
    try {
      const content = `[Cognitive Shield] ${analysis.microAction}\n\n${journalNote.trim()}`;
      await appSyncClient.models.JournalEntry.create({
        content,
        prompt: analysis.summaryInsight,
        wordCount: content.trim().split(/\s+/).length,
      });
      setJournalSaved(true);
    } catch (err) {
      console.error('[cognitive-shield] journal save error', err);
    } finally {
      setSavingJournal(false);
    }
  }

  function reset() {
    setStep('input');
    setThought('');
    setAnalysis(null);
    setError('');
    setJournalNote('');
    setJournalSaved(false);
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
      </div>

      <StepIndicator
        current={step}
        labels={[t.step1Label, t.step2Label, t.step3Label]}
      />

      {/* Step 1 — Input */}
      {step === 'input' && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-[var(--color-brand-950)]">
            {t.step1Heading}
          </h2>
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder={t.step1Placeholder}
            rows={6}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-sand)] px-4 py-3 text-sm text-[var(--color-brand-900)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">{t.wordCount(wordCount)}</span>
          </div>
          {error && (
            <p className="mt-3 text-sm text-[var(--color-alert-500)]">{error}</p>
          )}
          <div className="mt-5">
            <button
              onClick={() => void runAnalysis()}
              disabled={!thought.trim() || loading}
              className="rounded-xl bg-[var(--color-brand-600)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
            >
              {loading ? t.analyzing : t.analyze}
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Analysis */}
      {step === 'analysis' && analysis && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="mb-5 text-base font-semibold text-[var(--color-brand-950)]">
              {t.step2Heading}
            </h2>

            {/* Original thought */}
            <div className="mb-5 rounded-xl bg-[var(--color-sand)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                {locale === 'es' ? 'Tu pensamiento' : 'Your thought'}
              </p>
              <p className="mt-1 text-sm italic text-[var(--color-brand-900)] line-clamp-3">
                {thought}
              </p>
            </div>

            {/* Biases */}
            <div className="space-y-4">
              {analysis.biases.map((bias, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--color-border)] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-gold-100)] text-xs font-semibold text-[var(--color-gold-700)]">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-[var(--color-brand-950)]">
                      {bias.name}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-[var(--color-brand-900)]">{bias.explanation}</p>
                  <div className="rounded-lg bg-[var(--color-brand-50)] px-3 py-2">
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-brand-600)] mb-1">
                      {locale === 'es' ? 'Reencuadre' : 'Reframe'}
                    </p>
                    <p className="text-sm text-[var(--color-brand-800)]">{bias.reframe}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary insight */}
            <div className="mt-5 rounded-xl border-l-4 border-[var(--color-brand-600)] bg-[var(--color-sand)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
                {t.insight}
              </p>
              <p className="text-sm font-medium text-[var(--color-brand-900)]">
                {analysis.summaryInsight}
              </p>
            </div>

            {/* Micro-action */}
            <div className="mt-4 rounded-xl bg-[var(--color-success-50, #f0fdf4)] border border-[var(--color-success-200, #bbf7d0)] px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-success-500)] mb-1">
                {t.microAction}
              </p>
              <p className="text-sm font-semibold text-[var(--color-brand-900)]">
                {analysis.microAction}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('commit')}
              className="rounded-xl bg-[var(--color-brand-600)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
            >
              {t.commitBtn}
            </button>
            <button
              onClick={reset}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-sand)] transition-colors"
            >
              {t.startOver}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Commit */}
      {step === 'commit' && analysis && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <h2 className="mb-5 text-base font-semibold text-[var(--color-brand-950)]">
            {t.step3Heading}
          </h2>

          {/* Micro-action reminder */}
          <div className="mb-5 rounded-xl bg-[var(--color-brand-50)] px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-brand-600)] mb-1">
              {t.microAction}
            </p>
            <p className="text-sm font-semibold text-[var(--color-brand-900)]">
              {analysis.microAction}
            </p>
          </div>

          {/* Journal note */}
          {!journalSaved && (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-text-muted)]">
                  {t.journalPrompt}
                </label>
                <textarea
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder={t.journalPlaceholder}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-sand)] px-4 py-3 text-sm text-[var(--color-brand-900)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
                />
              </div>
              <div className="flex gap-3">
                {journalNote.trim() && (
                  <button
                    onClick={() => void saveJournalEntry()}
                    disabled={savingJournal}
                    className="rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-50"
                  >
                    {savingJournal ? t.savingJournal : t.saveJournal}
                  </button>
                )}
                <button
                  onClick={reset}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-sand)] transition-colors"
                >
                  {t.done}
                </button>
              </div>
            </div>
          )}

          {journalSaved && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-success-500)] font-medium">{t.saved}</p>
              <button
                onClick={reset}
                className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-sand)] transition-colors"
              >
                {t.startOver}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
