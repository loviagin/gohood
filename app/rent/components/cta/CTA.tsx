'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './CTA.module.css';

export function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Готовы найти идеальное жилье?
          </h2>
          <p className={styles.description}>
            Присоединяйтесь к тысячам арендаторов, которые уже нашли свой дом через наш сервис. 
            Простой поиск, безопасная сделка и полное юридическое сопровождение.
          </p>
          <div className={styles.buttons}>
            <Link href="/cities" className={styles.primaryButton}>
              Начать поиск
              <ArrowRight className={styles.buttonIcon} />
            </Link>
            <Link href="/contact" className={styles.secondaryButton}>
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 