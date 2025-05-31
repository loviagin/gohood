'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './CTA2.module.css';

export function CTA2() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Забудь о сложностях с поиском жилья — попробуй GoHood прямо сейчас!
          </h2>
          <Link href="/cities" className={styles.button}>
            Начать поиск
            <ArrowRight className={styles.buttonIcon} />
          </Link>
        </div>
      </div>
    </section>
  );
} 