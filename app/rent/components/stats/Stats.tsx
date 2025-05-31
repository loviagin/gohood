'use client';

import { Home, Users, Star, Building2 } from 'lucide-react';
import styles from './Stats.module.css';

const stats = [
  {
    icon: Home,
    value: '10,000+',
    label: 'Апартаментов',
    description: 'в базе GoHood'
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Арендаторов',
    description: 'нашли жилье'
  },
  {
    icon: Star,
    value: '4.9',
    label: 'Рейтинг',
    description: 'по отзывам клиентов'
  },
  {
    icon: Building2,
    value: '100+',
    label: 'Городов',
    description: 'по всему миру'
  }
];

export function Stats() {
  return (
    <section className={styles.stats}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>GoHood в цифрах</h2>
          <p className={styles.subtitle}>
            Мы помогаем арендаторам находить идеальное жилье по всему миру
          </p>
        </div>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.card}>
              <stat.icon className={styles.icon} />
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.label}</div>
              <div className={styles.description}>{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 