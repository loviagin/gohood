import styles from './CTA.module.css';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.title}>Начните использовать GoHood сегодня</h2>
        <p className={styles.description}>
          Присоединяйтесь к сообществу GoHood и найдите идеальное жилье или арендатора
        </p>
        <div className={styles.buttons}>
          <Link href="/become-landlord/register" className={styles.button}>
            <span className={styles.buttonText}>Я арендодатель</span>
            <span className={styles.buttonDescription}>Разместите свое жилье</span>
          </Link>
          <Link href="/rent/register" className={`${styles.button} ${styles.buttonSecondary}`}>
            <span className={styles.buttonText}>Я арендующий</span>
            <span className={styles.buttonDescription}>Найдите жилье</span>
          </Link>
        </div>
      </div>
    </section>
  );
} 