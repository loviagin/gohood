'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.heroTitle}>
        Найдите жильё своей мечты — без бумажек и посредников
      </h1>
      <p className={styles.heroSubtitle}>
        GoHood подбирает лучшие квартиры, дома и хостелы с учётом ваших привычек, бюджета и реальных отзывов.
        Заселяйтесь за 1 день — всё онлайн, только проверенные собственники.
      </p>
      <Link href="/search" className={styles.heroButton}>
        <Search className="w-5 h-5" />
        Начать поиск жилья
      </Link>
      <div className={styles.heroFeatures}>
        <span className={styles.heroFeature}>
          <span className={styles.heroFeatureDot} />
          Безопасные сделки
        </span>
        <span className={styles.heroFeature}>
          <span className={styles.heroFeatureDot} />
          Мгновенный въезд
        </span>
        <span className={styles.heroFeature}>
          <span className={styles.heroFeatureDot} />
          Верифицированные арендодатели
        </span>
      </div>
    </section>
  );
} 