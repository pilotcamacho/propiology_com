import { clsx } from 'clsx';

// ── Plan tier badges ──────────────────────────────────────────────────────────

const tierStyles = {
  trial:
    'bg-[var(--color-earth-100)] text-[var(--color-earth-700)] border border-[var(--color-earth-300)]',
  basic:
    'bg-[var(--color-brand-50)] text-[var(--color-brand-700)] border border-[var(--color-brand-200)]',
  pro:
    'bg-[var(--color-gold-100)] text-[var(--color-gold-700)] border border-[var(--color-gold-300)]',
};

const tierLabels = { trial: 'Trial', basic: 'Basic', pro: 'Pro' };

interface TierBadgeProps {
  tier: keyof typeof tierStyles;
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tierStyles[tier],
        className
      )}
    >
      {tierLabels[tier]}
    </span>
  );
}

// ── Streak badge ──────────────────────────────────────────────────────────────

interface StreakBadgeProps {
  days: number;
  className?: string;
}

export function StreakBadge({ days, className }: StreakBadgeProps) {
  if (days === 0) return null;

  const level =
    days >= 90 ? 'legendary' :
    days >= 30 ? 'gold'      :
    days >= 7  ? 'silver'    : 'bronze';

  const styles = {
    legendary: 'bg-purple-100 text-purple-700 border border-purple-300',
    gold:      'bg-[var(--color-gold-100)] text-[var(--color-gold-700)] border border-[var(--color-gold-300)]',
    silver:    'bg-gray-100 text-gray-600 border border-gray-300',
    bronze:    'bg-[var(--color-earth-100)] text-[var(--color-earth-700)] border border-[var(--color-earth-300)]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        styles[level],
        className
      )}
      title={`${days}-day streak`}
    >
      🔥 {days}d
    </span>
  );
}

// ── Journey stage badge ───────────────────────────────────────────────────────

const stageStyles: Record<string, { bg: string; text: string; label: string }> = {
  darkness:    { bg: 'var(--color-journey-darkness)',    text: '#e5e7eb', label: 'Darkness'    },
  glimpse:     { bg: 'var(--color-journey-glimpse)',     text: '#fff',    label: 'Glimpse'     },
  inner_light: { bg: 'var(--color-journey-inner-light)', text: '#1a1a2e', label: 'Inner Light' },
  mastery:     { bg: 'var(--color-journey-mastery)',     text: '#fff',    label: 'Mastery'     },
  illumination:{ bg: 'var(--color-journey-illumination)',text: '#1a1a2e', label: 'Illumination'},
};

interface JourneyStageBadgeProps {
  stage: string;
  className?: string;
}

export function JourneyStageBadge({ stage, className }: JourneyStageBadgeProps) {
  const s = stageStyles[stage] ?? stageStyles.glimpse;

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        className
      )}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ── Generic status badge ──────────────────────────────────────────────────────

type StatusVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info';

const statusStyles: Record<StatusVariant, string> = {
  success: 'bg-[var(--color-success-100)] text-[var(--color-success-500)]',
  warning: 'bg-[var(--color-warning-100)] text-[var(--color-warning-500)]',
  error:   'bg-[var(--color-alert-100)] text-[var(--color-alert-500)]',
  neutral: 'bg-[var(--color-earth-100)] text-[var(--color-earth-700)]',
  info:    'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: StatusVariant;
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
