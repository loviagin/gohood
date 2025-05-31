import styles from './page.module.css';

export default function CookiePolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Политика обработки cookies</h1>
        
        <p className={styles.text}>
          Сайт GoHood.city использует cookies для корректной работы, аналитики, хранения пользовательских настроек и повышения удобства работы с сервисом. Пользователь может отключить cookies в настройках браузера, однако это может привести к ограничению работы сайта.
        </p>
      </div>
    </div>
  );
} 