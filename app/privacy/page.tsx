import styles from './privacy.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Политика конфиденциальности</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Какие данные мы собираем:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>1.1.</h3>
            <p className={styles.text}>Имя, фамилия, email, телефон, дата рождения.</p>
          </div>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>1.2.</h3>
            <p className={styles.text}>Информация о сессии, cookies, IP-адрес, данные о бронированиях и объявлениях.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Как мы используем данные:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>2.1.</h3>
            <p className={styles.text}>Для регистрации, идентификации, обратной связи, бронирований, аналитики, улучшения сервиса.</p>
          </div>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>2.2.</h3>
            <p className={styles.text}>Для рассылки уведомлений и сервисных сообщений.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Передача данных третьим лицам:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3.1.</h3>
            <p className={styles.text}>Данные могут передаваться партнёрам для выполнения бронирования (Booking.com, Hotellook, Travelpayouts и др.).</p>
          </div>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>3.2.</h3>
            <p className={styles.text}>Данные могут быть раскрыты по требованию закона.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Безопасность данных:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>4.1.</h3>
            <p className={styles.text}>Мы принимаем все разумные меры для защиты персональных данных.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Права пользователя:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>5.1.</h3>
            <p className={styles.text}>Пользователь может запросить удаление, изменение, ограничение обработки своих данных, а также отказаться от рассылки.</p>
          </div>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>5.2.</h3>
            <p className={styles.text}>Для удаления данных — обращайтесь на <a href="mailto:support@gohood.city" className={styles.email}>support@gohood.city</a></p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Cookies:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>6.1.</h3>
            <p className={styles.text}>Мы используем cookies для работы сайта и аналитики. Пользователь может отключить cookies в настройках браузера.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Контакты:</h2>
          <div className={styles.subsection}>
            <h3 className={styles.subsectionTitle}>7.1.</h3>
            <p className={styles.text}>По вопросам обработки данных — <a href="mailto:support@gohood.city" className={styles.email}>support@gohood.city</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
