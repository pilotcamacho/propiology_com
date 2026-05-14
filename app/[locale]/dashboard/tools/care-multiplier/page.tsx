'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';

// ── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    title: 'Care-Multiplier',
    sub: 'Analyze relational patterns through the Propiology framework.',
    placeholder: 'Describe a relationship situation, pattern, or conflict…',
    send: 'Send',
    thinking: 'Thinking…',
    newChat: 'New conversation',
    disclaimer:
      'This is an AI guide, not therapy. For crisis support, contact a mental health professional.',
    limitReached: 'Daily limit reached. Upgrade to Pro for unlimited access.',
    error: 'Something went wrong. Please try again.',
    empty: 'Start by describing a relationship situation or pattern that is on your mind.',
    pressEnter: 'Press Enter to send, Shift+Enter for new line.',
  },
  es: {
    title: 'Care-Multiplier',
    sub: 'Analiza patrones relacionales a través del marco Propiology.',
    placeholder: 'Describe una situación, patrón o conflicto relacional…',
    send: 'Enviar',
    thinking: 'Pensando…',
    newChat: 'Nueva conversación',
    disclaimer:
      'Este es un guía de IA, no terapia. Para apoyo en crisis, contacta a un profesional de salud mental.',
    limitReached: 'Límite diario alcanzado. Actualiza a Pro para acceso ilimitado.',
    error: 'Algo salió mal. Por favor intenta de nuevo.',
    empty: 'Comienza describiendo una situación relacional o patrón que tengas en mente.',
    pressEnter: 'Enter para enviar, Shift+Enter para nueva línea.',
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CareMultiplierPage() {
  const params = useParams();
  const locale = ((params?.locale as string) ?? 'en') as 'en' | 'es';
  const t = copy[locale] ?? copy.en;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setStreaming(true);

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() ?? '';

      const res = await fetch('/api/ai/care-multiplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: nextMessages, locale }),
      });

      if (res.status === 429) {
        setMessages((prev) => prev.slice(0, -1));
        setError(t.limitReached);
        setStreaming(false);
        return;
      }
      if (!res.ok || !res.body) throw new Error('API error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }
    } catch {
      setError(t.error);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      textareaRef.current?.focus();
    }
  }

  function reset() {
    setMessages([]);
    setError('');
    setInput('');
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-brand-950)]">{t.title}</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.sub}</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="shrink-0 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-sand)] transition-colors"
          >
            {t.newChat}
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <p className="text-3xl">♡</p>
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{t.empty}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-brand-600)] text-white'
                      : 'bg-[var(--color-sand)] text-[var(--color-brand-700)]'
                  }`}
                >
                  {msg.role === 'user' ? 'U' : '♡'}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[var(--color-brand-600)] text-white'
                      : 'bg-[var(--color-sand)] text-[var(--color-brand-900)]'
                  }`}
                >
                  {msg.content ? (
                    msg.content
                  ) : (
                    <span className="inline-flex gap-1 py-1">
                      <span className="h-2 w-2 rounded-full bg-[var(--color-brand-400)] animate-bounce" />
                      <span
                        className="h-2 w-2 rounded-full bg-[var(--color-brand-400)] animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <span
                        className="h-2 w-2 rounded-full bg-[var(--color-brand-400)] animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-[var(--color-alert-500)]">{error}</p>
      )}

      {/* Input */}
      <div className="mt-3 flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void sendMessage();
            }
          }}
          placeholder={t.placeholder}
          rows={2}
          disabled={streaming}
          className="flex-1 resize-none rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-400)] disabled:opacity-60"
        />
        <button
          onClick={() => void sendMessage()}
          disabled={!input.trim() || streaming}
          className="shrink-0 self-end rounded-xl bg-[var(--color-brand-600)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-40"
        >
          {streaming ? t.thinking : t.send}
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">{t.disclaimer}</p>
    </div>
  );
}
