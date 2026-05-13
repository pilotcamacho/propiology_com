import { clsx } from 'clsx';

// ── Base Card ─────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// ── DashboardCard — header + body widget ─────────────────────────────────────

interface DashboardCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, action, children, className }: DashboardCardProps) {
  return (
    <Card padding="none" className={className}>
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

// ── MetricCard — big number + label + optional trend ─────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: { value: number; label: string };
  highlight?: boolean;
  className?: string;
}

export function MetricCard({ label, value, unit, trend, highlight, className }: MetricCardProps) {
  const trendUp = trend && trend.value > 0;
  const trendDown = trend && trend.value < 0;

  return (
    <Card
      padding="md"
      className={clsx(
        highlight && 'border-[var(--color-brand-200)] bg-[var(--color-brand-50)]',
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </p>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</span>
        {unit && <span className="mb-1 text-sm text-[var(--color-text-muted)]">{unit}</span>}
      </div>
      {trend && (
        <p
          className={clsx(
            'mt-1 text-xs font-medium',
            trendUp  && 'text-[var(--color-success-500)]',
            trendDown && 'text-[var(--color-alert-500)]',
            !trendUp && !trendDown && 'text-[var(--color-text-muted)]'
          )}
        >
          {trendUp ? '↑' : trendDown ? '↓' : '→'} {Math.abs(trend.value)} {trend.label}
        </p>
      )}
    </Card>
  );
}

// ── HabitCard — habit row with streak and check toggle ───────────────────────

interface HabitCardProps {
  name: string;
  category: string;
  streak: number;
  completed: boolean;
  onToggle?: () => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  body:          'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]',
  mind:          'bg-purple-100 text-purple-700',
  relationships: 'bg-pink-100 text-pink-700',
  work:          'bg-[var(--color-gold-100)] text-[var(--color-gold-700)]',
};

export function HabitCard({ name, category, streak, completed, onToggle, className }: HabitCardProps) {
  return (
    <Card padding="sm" className={clsx('flex items-center gap-3', className)}>
      <button
        onClick={onToggle}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        className={clsx(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          completed
            ? 'border-[var(--color-success-500)] bg-[var(--color-success-500)] text-white'
            : 'border-[var(--color-border-strong)] hover:border-[var(--color-brand-500)]'
        )}
      >
        {completed && (
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={clsx('truncate text-sm font-medium', completed && 'line-through text-[var(--color-text-muted)]')}>
          {name}
        </p>
        <span className={clsx('mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium', categoryColors[category] ?? categoryColors.body)}>
          {category}
        </span>
      </div>

      {streak > 0 && (
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-[var(--color-gold-600)]">{streak}</p>
          <p className="text-xs text-[var(--color-text-muted)]">day{streak !== 1 ? 's' : ''}</p>
        </div>
      )}
    </Card>
  );
}

// ── FeatureCard — marketing feature tile ──────────────────────────────────────

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card padding="lg" className={className}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-brand-50)] text-[var(--color-brand-600)]">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{description}</p>
    </Card>
  );
}
