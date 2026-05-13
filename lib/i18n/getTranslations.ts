export const i18nConfig = {
  locales: ['en', 'es'],
  defaultLocale: 'en',
};

export function resolveLocale(locale: string): string {
  return i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
}

export async function getTranslations(
  locale: string,
  namespace = 'common'
): Promise<Record<string, unknown>> {
  try {
    const messages = await import(`../../public/locales/${locale}/${namespace}.json`);
    return messages.default ?? messages;
  } catch {
    const fallback = await import(
      `../../public/locales/${i18nConfig.defaultLocale}/${namespace}.json`
    );
    return fallback.default ?? fallback;
  }
}
