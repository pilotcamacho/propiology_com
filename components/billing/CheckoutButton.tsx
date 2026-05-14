'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface CheckoutButtonProps {
  priceId: string;
  userId: string;
  email: string;
  locale: string;
  label: string;
  featured?: boolean;
  className?: string;
}

export function CheckoutButton({
  priceId,
  userId,
  email,
  locale,
  label,
  featured = false,
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId,
          email,
          successUrl: `${origin}/${locale}/billing?success=true`,
          cancelUrl: `${origin}/${locale}/billing/upgrade`,
        }),
      });

      if (!res.ok) throw new Error('Session creation failed');

      const { url } = await res.json() as { url: string };
      if (url) window.location.href = url;
    } catch (err) {
      console.error('[CheckoutButton]', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={clsx(
        'rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60',
        featured
          ? 'bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)]'
          : 'border border-[var(--color-border)] text-[var(--color-brand-700)] hover:bg-[var(--color-brand-50)]',
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading…
        </span>
      ) : (
        label
      )}
    </button>
  );
}
