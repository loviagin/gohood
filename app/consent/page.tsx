import Link from 'next/link';
import styles from './page.module.css';

export default function ConsentPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Согласие на обработку персональных данных</h1>
        
        <p className={styles.text}>
          Регистрируясь на GoHood.city, я даю согласие на обработку моих персональных данных, включая передачу третьим лицам-партнёрам (Booking.com, Hotellook и др.) для выполнения бронирований, аналитики и сервисных уведомлений, согласно{' '}
          <Link href="/privacy" className={styles.link}>
            Политике конфиденциальности
          </Link>.
        </p>
      </div>
    </div>
  );
}
