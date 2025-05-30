import styles from "./CTA2.module.css";

export function CTA2() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Сдавайте жильё новым способом
          </h2>
          <p className={styles.subtitle}>
            — легко, безопасно и без посредников
          </p>
          <div className={styles.buttons}>
            <a href="/registration?role=landlord" className={styles.button}>
              Разместить объявление
            </a>
            <a href="/registration?role=landlord" className={styles.buttonSecondary}>
              Связаться с нами
            </a>
          </div>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureText}>Поддержка 24/7</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureText}>Без ограничений по странам</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureText}>Без комиссии за размещение</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 