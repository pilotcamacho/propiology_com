import { clsx } from 'clsx';

interface ReadinessScoreProps {
  score: number;           // 0–100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { diameter: 80,  stroke: 7,  fontSize: 'text-xl' },
  md: { diameter: 120, stroke: 9,  fontSize: 'text-3xl' },
  lg: { diameter: 160, stroke: 11, fontSize: 'text-4xl' },
};

function scoreColor(score: number): string {
  if (score >= 86) return 'var(--color-gold-500)';
  if (score >= 61) return 'var(--color-brand-500)';
  if (score >= 31) return 'var(--color-warning-500)';
  return 'var(--color-alert-500)';
}

function scoreLabel(score: number): string {
  if (score >= 86) return 'Excellent';
  if (score >= 61) return 'Good';
  if (score >= 31) return 'Building';
  return 'Rest needed';
}

export function ReadinessScore({ score, size = 'md', showLabel = true, className }: ReadinessScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const { diameter, stroke, fontSize } = sizeMap[size];
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  const color = scoreColor(clamped);
  const center = diameter / 2;

  return (
    <div className={clsx('flex flex-col items-center gap-2', className)}>
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        aria-label={`Readiness Score: ${clamped} out of 100`}
        role="img"
      >
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        {/* Progress arc — starts from top (−90°) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
        {/* Score number */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          className={clsx('font-bold tabular-nums', fontSize)}
          style={{ fill: color, fontFamily: 'var(--font-sans)' }}
        >
          {clamped}
        </text>
      </svg>

      {showLabel && (
        <p className="text-xs font-medium uppercase tracking-wider" style={{ color }}>
          {scoreLabel(clamped)}
        </p>
      )}
    </div>
  );
}

// ── Compact inline score (for tables and lists) ───────────────────────────────

interface ScoreChipProps {
  score: number;
  className?: string;
}

export function ScoreChip({ score, className }: ScoreChipProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = scoreColor(clamped);

  return (
    <span
      className={clsx('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold', className)}
      style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, white)`, color }}
    >
      {clamped}
    </span>
  );
}
