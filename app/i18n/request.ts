import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '../i18n/settings';

export default getRequestConfig(async ({ locale }) => {
  // If locale is not provided or invalid, use default locale
  const validLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
    timeZone: 'Europe/Moscow'
  };
}); 