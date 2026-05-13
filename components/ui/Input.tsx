'use client';

import { forwardRef, useId } from 'react';
import { clsx } from 'clsx';

// ── Shared field wrapper ──────────────────────────────────────────────────────

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-alert-500)]">*</span>}
        </label>
      )}
      {children}
      {error  && <FormError>{error}</FormError>}
      {!error && hint && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
    </div>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-xs text-[var(--color-alert-500)]">
      {children}
    </p>
  );
}

// ── Base input class ──────────────────────────────────────────────────────────

const inputBase =
  'w-full rounded-lg border border-[var(--color-border-strong)] bg-white px-3 py-2 text-sm ' +
  'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] ' +
  'transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-600)] focus:border-transparent ' +
  'disabled:bg-[var(--color-surface-muted)] disabled:cursor-not-allowed';

const inputError = 'border-[var(--color-alert-500)] focus:ring-[var(--color-alert-500)]';

// ── TextInput ─────────────────────────────────────────────────────────────────

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(inputBase, error && inputError, className)}
      {...props}
    />
  )
);
TextInput.displayName = 'TextInput';

// ── Textarea ──────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(inputBase, 'resize-y min-h-[100px]', error && inputError, className)}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

// ── Select ────────────────────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(inputBase, 'cursor-pointer', error && inputError, className)}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
);
Select.displayName = 'Select';

// ── Checkbox ──────────────────────────────────────────────────────────────────

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    const id = useId();
    return (
      <label htmlFor={id} className={clsx('flex cursor-pointer items-center gap-2 text-sm', className)}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={
            'h-4 w-4 rounded border-[var(--color-border-strong)] text-[var(--color-brand-600)] ' +
            'focus:ring-2 focus:ring-[var(--color-brand-600)] cursor-pointer'
          }
          {...props}
        />
        <span className="text-[var(--color-text-primary)]">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

// ── RadioGroup ────────────────────────────────────────────────────────────────

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function RadioGroup({ name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={clsx('flex flex-col gap-2', className)}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={clsx(
            'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
            value === opt.value
              ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-brand-300)] hover:bg-[var(--color-surface-subtle)]'
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            className="mt-0.5 h-4 w-4 text-[var(--color-brand-600)] focus:ring-[var(--color-brand-600)]"
          />
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{opt.label}</p>
            {opt.description && (
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{opt.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
