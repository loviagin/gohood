'use client';

import { MapPin, Home, CreditCard } from 'lucide-react';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Как это работает</h2>
        <p className={styles.sectionSubtitle}>
          Простой и понятный процесс аренды жилья через наш сервис. Всего три шага отделяют вас от нового дома
        </p>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <MapPin className={styles.stepIcon} />
            <h3 className={styles.stepTitle}>Выберите город</h3>
            <p className={styles.stepDescription}>
              Введите город, в котором хотите найти жилье
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <Home className={styles.stepIcon} />
            <h3 className={styles.stepTitle}>Подберите жилье</h3>
            <p className={styles.stepDescription}>
              Изучите доступные варианты жилья, сравните цены и условияв
            </p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <CreditCard className={styles.stepIcon} />
            <h3 className={styles.stepTitle}>Забронируйте онлайн</h3>
            <p className={styles.stepDescription}>
              Забронируйте понравившийся вариант прямо на сайте
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 