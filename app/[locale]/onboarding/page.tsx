'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCurrentUser, fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    steps: ['Welcome', 'Your Goal', 'Assessment', 'WhatsApp', 'First Habit', 'Ready!'],
    welcome: {
      heading: (name: string) => `Welcome, ${name}`,
      sub: "Let's personalize your Propiology experience in about 2 minutes.",
      cta: 'Get started',
    },
    goal: {
      heading: 'What is your primary goal?',
      sub: 'This helps us tailor your Readiness Score and AI insights.',
      options: [
        { value: 'self_knowledge', label: 'Deep self-knowledge', desc: 'Understand my patterns, beliefs, and blind spots.' },
        { value: 'habit_building', label: 'Build lasting habits', desc: 'Create sustainable daily routines that stick.' },
        { value: 'peak_performance', label: 'Peak performance', desc: 'Optimize my mental and physical output.' },
        { value: 'team_health', label: 'Team or family wellbeing', desc: 'Improve collective health and relationships.' },
      ],
    },
    assessment: {
      heading: 'Quick Propiology assessment',
      sub: 'Five questions — honest answers give you the most accurate starting stage.',
      questions: [
        {
          q: 'How clearly can you articulate your life narrative — the story that explains who you are today?',
          opts: ['I have no idea', 'Vague sense', 'Partial clarity', 'Mostly clear', 'Fully clear and integrated'],
        },
        {
          q: 'How aware are you of the biases and emotional patterns that drive your daily decisions?',
          opts: ['Not at all', 'Rarely notice', 'Sometimes notice', 'Often aware', 'Continuously aware'],
        },
        {
          q: 'How consistent are your habits and behaviors with the person you want to become?',
          opts: ['Very inconsistent', 'Mostly inconsistent', 'Somewhat consistent', 'Mostly consistent', 'Fully aligned'],
        },
        {
          q: 'How would you rate the quality of your most important relationships right now?',
          opts: ['Very poor', 'Struggling', 'Adequate', 'Good', 'Excellent'],
        },
        {
          q: 'How often do you intentionally reflect on your inner life (journal, meditation, therapy, etc.)?',
          opts: ['Never', 'Rarely', 'Monthly', 'Weekly', 'Daily'],
        },
      ],
      next: 'See my stage',
    },
    stage: {
      label: 'Your starting stage:',
      descriptions: {
        darkness: 'The first step is awareness. You are beginning to recognise patterns that have held you back.',
        glimpse: 'You sense there is more. Glimpse is about curiosity and building foundational habits.',
        inner_light: 'You have real self-knowledge. Inner Light is about translating insight into consistent action.',
        mastery: 'You operate from your values most of the time. Mastery is about depth and sustained excellence.',
        illumination: 'You live from a place of deep alignment. Illumination is about contribution and legacy.',
      } as Record<string, string>,
    },
    whatsapp: {
      heading: 'Stay on track with WhatsApp',
      sub: 'Get daily habit check-ins, your Readiness Score, and weekly insights — right in WhatsApp.',
      phonePlaceholder: '+1 555 000 0000',
      skip: 'Skip for now',
      cta: 'Enable WhatsApp',
      skipping: 'You can enable this any time in Settings.',
    },
    habit: {
      heading: 'Create your first habit',
      sub: 'A small daily action that moves you toward your goal. You can add more later.',
      namePlaceholder: 'e.g. Morning walk, Meditation, Read 10 pages',
      frequencyLabel: 'Frequency',
      frequencies: ['Daily', 'Weekly'],
      skip: 'Skip for now',
      cta: 'Add habit',
    },
    done: {
      heading: "You're all set!",
      sub: 'Your Personal OS is ready. Your 14-day free trial is active.',
      cta: 'Go to my dashboard',
    },
    next: 'Continue',
    back: 'Back',
  },
  es: {
    steps: ['Bienvenido', 'Tu Meta', 'Evaluación', 'WhatsApp', 'Primer Hábito', '¡Listo!'],
    welcome: {
      heading: (name: string) => `Bienvenido/a, ${name}`,
      sub: 'Personalicemos tu experiencia Propiology en aproximadamente 2 minutos.',
      cta: 'Comenzar',
    },
    goal: {
      heading: '¿Cuál es tu meta principal?',
      sub: 'Esto nos ayuda a ajustar tu Puntaje de Disposición e ideas de IA.',
      options: [
        { value: 'self_knowledge', label: 'Autoconocimiento profundo', desc: 'Entender mis patrones, creencias y puntos ciegos.' },
        { value: 'habit_building', label: 'Construir hábitos duraderos', desc: 'Crear rutinas diarias sostenibles que se mantengan.' },
        { value: 'peak_performance', label: 'Rendimiento óptimo', desc: 'Optimizar mi producción mental y física.' },
        { value: 'team_health', label: 'Bienestar del equipo o familia', desc: 'Mejorar la salud colectiva y las relaciones.' },
      ],
    },
    assessment: {
      heading: 'Evaluación Propiology rápida',
      sub: 'Cinco preguntas — las respuestas honestas te dan la etapa inicial más precisa.',
      questions: [
        {
          q: '¿Con qué claridad puedes articular tu narrativa de vida — la historia que explica quién eres hoy?',
          opts: ['Sin idea', 'Sensación vaga', 'Claridad parcial', 'Mayormente clara', 'Totalmente clara e integrada'],
        },
        {
          q: '¿Cuánto eres consciente de los sesgos y patrones emocionales que impulsan tus decisiones diarias?',
          opts: ['Nada', 'Raramente', 'A veces', 'Con frecuencia', 'Continuamente'],
        },
        {
          q: '¿Qué tan consistentes son tus hábitos y comportamientos con la persona que quieres ser?',
          opts: ['Muy inconsistente', 'Mayormente inconsistente', 'Algo consistente', 'Mayormente consistente', 'Totalmente alineado'],
        },
        {
          q: '¿Cómo calificarías la calidad de tus relaciones más importantes en este momento?',
          opts: ['Muy mal', 'Con dificultades', 'Adecuadas', 'Buenas', 'Excelentes'],
        },
        {
          q: '¿Con qué frecuencia reflexionas intencionalmente sobre tu vida interior (diario, meditación, terapia, etc.)?',
          opts: ['Nunca', 'Raramente', 'Mensualmente', 'Semanalmente', 'A diario'],
        },
      ],
      next: 'Ver mi etapa',
    },
    stage: {
      label: 'Tu etapa inicial:',
      descriptions: {
        darkness: 'El primer paso es la conciencia. Estás comenzando a reconocer patrones que te han limitado.',
        glimpse: 'Sientes que hay algo más. El Destello se trata de curiosidad y de construir hábitos fundamentales.',
        inner_light: 'Tienes un verdadero autoconocimiento. La Luz Interior se trata de convertir la percepción en acción consistente.',
        mastery: 'Actúas desde tus valores la mayor parte del tiempo. La Maestría se trata de profundidad y excelencia sostenida.',
        illumination: 'Vives desde un lugar de profundo alineamiento. La Iluminación se trata de contribución y legado.',
      } as Record<string, string>,
    },
    whatsapp: {
      heading: 'Mantente en curso con WhatsApp',
      sub: 'Recibe registros diarios de hábitos, tu Puntaje de Disposición e ideas semanales — directo en WhatsApp.',
      phonePlaceholder: '+52 55 0000 0000',
      skip: 'Omitir por ahora',
      cta: 'Activar WhatsApp',
      skipping: 'Puedes activar esto en cualquier momento en Configuración.',
    },
    habit: {
      heading: 'Crea tu primer hábito',
      sub: 'Una pequeña acción diaria que te acerca a tu meta. Puedes agregar más después.',
      namePlaceholder: 'ej. Caminata matutina, Meditación, Leer 10 páginas',
      frequencyLabel: 'Frecuencia',
      frequencies: ['Diario', 'Semanal'],
      skip: 'Omitir por ahora',
      cta: 'Agregar hábito',
    },
    done: {
      heading: '¡Todo listo!',
      sub: 'Tu Sistema Operativo Personal está listo. Tu prueba gratuita de 14 días está activa.',
      cta: 'Ir a mi panel de control',
    },
    next: 'Continuar',
    back: 'Atrás',
  },
};

// ── Journey stage logic ───────────────────────────────────────────────────────

function scoreToStage(total: number): string {
  if (total <= 8) return 'darkness';
  if (total <= 13) return 'glimpse';
  if (total <= 18) return 'inner_light';
  if (total <= 22) return 'mastery';
  return 'illumination';
}

const stageBaselineScore: Record<string, number> = {
  darkness: 22,
  glimpse: 40,
  inner_light: 58,
  mastery: 74,
  illumination: 88,
};

const stageDisplayNames: Record<string, Record<string, string>> = {
  en: {
    darkness: 'Darkness',
    glimpse: 'Glimpse',
    inner_light: 'Inner Light',
    mastery: 'Mastery',
    illumination: 'Illumination',
  },
  es: {
    darkness: 'Oscuridad',
    glimpse: 'Destello',
    inner_light: 'Luz Interior',
    mastery: 'Maestría',
    illumination: 'Iluminación',
  },
};

// ── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full h-1 bg-[var(--color-border)] rounded-full overflow-hidden">
      <div
        className="h-full bg-[var(--color-brand-600)] transition-all duration-500"
        style={{ width: `${((step + 1) / total) * 100}%` }}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [goal, setGoal] = useState('');
  const [answers, setAnswers] = useState<number[]>([0, 0, 0, 0, 0]);
  const [journeyStage, setJourneyStage] = useState('');
  const [phone, setPhone] = useState('');
  const [habitName, setHabitName] = useState('');
  const [habitFreq, setHabitFreq] = useState<'daily' | 'weekly'>('daily');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const user = await getCurrentUser();
        setUserId(user.userId);
        const attrs = await fetchUserAttributes();
        setEmail(attrs.email ?? '');
        setName(attrs.given_name ?? attrs.name ?? attrs.email?.split('@')[0] ?? 'there');
        setRole(attrs['custom:role'] ?? 'end_user');
      } catch {
        // RequireAuth handles redirect
      }
    }
    void load();
  }, []);

  const totalSteps = t.steps.length;

  // Step 2: compute stage after last answer is set
  function computeStage(newAnswers: number[]) {
    const total = newAnswers.reduce((s, v) => s + v + 1, 0); // 1-5 scale
    return scoreToStage(total);
  }

  async function handleComplete() {
    setSubmitting(true);
    try {
      // 1. Update Cognito custom attributes
      await updateUserAttributes({
        userAttributes: {
          'custom:journey_stage': journeyStage,
          'custom:subscription_tier': 'trial',
        },
      });

      // 2. Create baseline ReadinessScore
      const baseScore = stageBaselineScore[journeyStage] ?? 40;
      await client.models.ReadinessScore.create({
        scoreDate: new Date().toISOString().split('T')[0],
        score: baseScore,
        habitComponent: Math.round(baseScore * 0.4),
        biometricComponent: Math.round(baseScore * 0.3),
        reflectionComponent: Math.round(baseScore * 0.3),
      });

      // 3. Create first habit (if provided)
      if (habitName.trim()) {
        await client.models.HabitDefinition.create({
          name: habitName.trim(),
          frequency: habitFreq,
          isActive: true,
        });
      }

      // 4. Create WhatsApp session (if opted in)
      if (phone.trim()) {
        await client.models.WhatsAppSession.create({
          phoneNumber: phone.trim(),
          verified: false,
          optInHabitCheckin: true,
          optInScoreDigest: true,
          optInWeeklyInsight: true,
          consentTimestamp: new Date().toISOString(),
        });
      }

      // 5. Server-side: create trial subscription, assign Cognito group, send welcome email
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, name, locale, journeyStage, role }),
      });

      // 6. Redirect to appropriate dashboard
      const dest = role === 'corporate_admin' || role === 'coach' ? 'command' : 'dashboard';
      router.push(`/${locale}/${dest}`);
    } catch (err) {
      console.error('[onboarding] complete error', err);
      setSubmitting(false);
    }
  }

  // ── Step renderers ──────────────────────────────────────────────────────────

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand-600)]">
              <span className="text-3xl text-white">✦</span>
            </div>
            <h1 className="text-3xl font-semibold text-[var(--color-brand-950)]">
              {t.welcome.heading(name || '…')}
            </h1>
            <p className="mt-3 text-[var(--color-text-secondary)]">{t.welcome.sub}</p>
            <button
              onClick={() => setStep(1)}
              className="mt-10 rounded-xl bg-[var(--color-brand-600)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
            >
              {t.welcome.cta}
            </button>
          </div>
        );

      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.goal.heading}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.goal.sub}</p>
            <div className="mt-6 grid gap-3">
              {t.goal.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setGoal(opt.value); setStep(2); }}
                  className={`flex flex-col gap-1 rounded-xl border-2 p-4 text-left transition-all ${
                    goal === opt.value
                      ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)]'
                      : 'border-[var(--color-border)] bg-white hover:border-[var(--color-brand-400)]'
                  }`}
                >
                  <span className="text-sm font-semibold text-[var(--color-brand-900)]">{opt.label}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2: {
        const allAnswered = answers.every((a) => a > 0);
        return (
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.assessment.heading}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.assessment.sub}</p>
            <div className="mt-6 flex flex-col gap-6">
              {t.assessment.questions.map((q, qi) => (
                <div key={qi}>
                  <p className="text-sm font-medium text-[var(--color-brand-900)] mb-3">{qi + 1}. {q.q}</p>
                  <div className="flex flex-col gap-2">
                    {q.opts.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => {
                          const next = [...answers];
                          next[qi] = oi;
                          setAnswers(next);
                        }}
                        className={`rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${
                          answers[qi] === oi
                            ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)] font-medium text-[var(--color-brand-900)]'
                            : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-brand-400)]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              disabled={!allAnswered}
              onClick={() => {
                const stage = computeStage(answers);
                setJourneyStage(stage);
                setStep(3);
              }}
              className="mt-8 w-full rounded-xl bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
            >
              {t.assessment.next}
            </button>
          </div>
        );
      }

      case 3: {
        const stageName = stageDisplayNames[locale]?.[journeyStage] ?? journeyStage;
        const stageDesc = t.stage.descriptions[journeyStage] ?? '';
        return (
          <div>
            <div className="rounded-2xl bg-[#0b2a38] p-8 text-center text-white">
              <p className="text-xs uppercase tracking-widest text-[#83d6d2]">{t.stage.label}</p>
              <p className="mt-2 text-4xl font-semibold">{stageName}</p>
              <p className="mt-4 text-sm text-[#c0e4e6] leading-relaxed">{stageDesc}</p>
              <p className="mt-6 text-2xl font-bold text-[#d4a843]">
                {stageBaselineScore[journeyStage] ?? 40}
                <span className="ml-1 text-base font-normal text-[#83d6d2]">/ 100</span>
              </p>
              <p className="text-xs text-[#83d6d2]">Readiness Score</p>
            </div>
            <button
              onClick={() => setStep(4)}
              className="mt-6 w-full rounded-xl bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors"
            >
              {t.next}
            </button>
          </div>
        );
      }

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.whatsapp.heading}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.whatsapp.sub}</p>
            <div className="mt-6">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.whatsapp.phonePlaceholder}
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => { setPhone(''); setStep(5); }}
                className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)] hover:bg-white transition-colors"
              >
                {t.whatsapp.skip}
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!phone.trim()}
                className="flex-1 rounded-xl bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
              >
                {t.whatsapp.cta}
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">{t.whatsapp.skipping}</p>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.habit.heading}</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.habit.sub}</p>
            <div className="mt-6 flex flex-col gap-4">
              <input
                type="text"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                placeholder={t.habit.namePlaceholder}
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)]"
              />
              <div>
                <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">{t.habit.frequencyLabel}</p>
                <div className="flex gap-2">
                  {t.habit.frequencies.map((f, fi) => {
                    const vals = ['daily', 'weekly'] as const;
                    return (
                      <button
                        key={fi}
                        onClick={() => setHabitFreq(vals[fi]!)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${
                          habitFreq === vals[fi]
                            ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)] font-semibold text-[var(--color-brand-700)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-brand-400)]'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setHabitName(''); setStep(6); }}
                className="flex-1 rounded-xl border border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)] hover:bg-white transition-colors"
              >
                {t.habit.skip}
              </button>
              <button
                onClick={() => setStep(6)}
                disabled={!habitName.trim()}
                className="flex-1 rounded-xl bg-[var(--color-brand-600)] py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
              >
                {t.habit.cta}
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-success)]">
              <span className="text-3xl text-white">✓</span>
            </div>
            <h2 className="text-3xl font-semibold text-[var(--color-brand-950)]">{t.done.heading}</h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">{t.done.sub}</p>
            <button
              onClick={() => void handleComplete()}
              disabled={submitting}
              className="mt-10 rounded-xl bg-[var(--color-brand-600)] px-10 py-3 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {locale === 'es' ? 'Cargando…' : 'Loading…'}
                </span>
              ) : t.done.cta}
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  // Steps 0 and 6 are welcome/done — no back/progress shown on step 0
  const showProgress = step > 0;
  const showBack = step > 1 && step < 6;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <p className="mb-10 font-serif text-2xl font-bold text-[var(--color-brand-950)]">Propiology</p>

      <div className="w-full max-w-xl">
        {/* Progress */}
        {showProgress && (
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-[var(--color-text-muted)]">
                {t.steps[Math.min(step, totalSteps - 1)]}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {step} / {totalSteps - 1}
              </p>
            </div>
            <ProgressBar step={step - 1} total={totalSteps - 1} />
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[var(--color-border)]">
          {renderStep()}
        </div>

        {/* Back */}
        {showBack && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="mt-4 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-brand-700)]"
          >
            {t.back}
          </button>
        )}
      </div>
    </div>
  );
}
