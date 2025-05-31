'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      // Получаем текущий путь без префикса языка
      const pathWithoutLocale = pathname.replace(`/${locale}`, '');
      router.push(`/${newLocale}${pathWithoutLocale}`);
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded ${
          locale === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        disabled={isPending}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('ru')}
        className={`px-3 py-1 rounded ${
          locale === 'ru' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
        disabled={isPending}
      >
        RU
      </button>
    </div>
  );
} 