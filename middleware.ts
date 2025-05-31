import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n/settings';

export default createMiddleware({
    // Список поддерживаемых языков
    locales,
    
    // Язык по умолчанию
    defaultLocale,
    
    // Определение языка на основе заголовков браузера
    localePrefix: 'always'
});

export const config = {
    // Матчер для всех путей, кроме API и статических файлов
    matcher: ['/', '/(ru|en)/:path*']
} 