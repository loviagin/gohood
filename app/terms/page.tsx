import styles from './page.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Пользовательское соглашение</h1>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Общие положения</h2>
          <p className={styles.paragraph}>
            1.1. Настоящее соглашение (далее — "Соглашение") регулирует отношения между сервисом GoHood.city (далее — "Сервис") и физическим лицом (далее — "Пользователь"), использующим Сервис.
          </p>
          <p className={styles.paragraph}>
            1.2. Используя Сервис, Пользователь подтверждает, что ознакомился с Соглашением, понимает его и принимает все его условия в полном объёме.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Условия использования</h2>
          <p className={styles.paragraph}>
            2.1. Минимальный возраст для регистрации и использования сервиса — 18 лет.
          </p>
          <p className={styles.paragraph}>
            2.2. Пользователь обязуется предоставлять достоверную информацию о себе.
          </p>
          <p className={styles.paragraph}>
            2.3. Запрещается размещать незаконные, оскорбительные, мошеннические объявления и сообщения.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Права и обязанности сторон</h2>
          <p className={styles.paragraph}>
            3.1. Сервис предоставляет Пользователю доступ к функционалу поиска, аренды и сдачи жилья.
          </p>
          <p className={styles.paragraph}>
            3.2. Сервис не является стороной сделок между пользователями и не несёт ответственности за их исполнение.
          </p>
          <p className={styles.paragraph}>
            3.3. Пользователь несёт полную ответственность за содержание размещаемых объявлений.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Ответственность</h2>
          <p className={styles.paragraph}>
            4.1. Сервис не гарантирует соответствие объектов ожиданиям Пользователя.
          </p>
          <p className={styles.paragraph}>
            4.2. Сервис не несёт ответственности за действия третьих лиц и форс-мажорные обстоятельства.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Прочие условия</h2>
          <p className={styles.paragraph}>
            5.1. Все споры разрешаются в соответствии с законодательством страны регистрации Сервиса.
          </p>
          <p className={styles.paragraph}>
            5.2. Сервис вправе вносить изменения в Соглашение. Продолжая использовать Сервис, Пользователь соглашается с изменениями.
          </p>
        </section>
      </div>
    </div>
  );
}
