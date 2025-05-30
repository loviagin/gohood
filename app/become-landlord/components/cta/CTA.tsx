import styles from "./CTA.module.css";

export function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Начните сдавать квартиру уже сегодня
          </h2>
          <p className={styles.subtitle}>
            Разместите объявление бесплатно и получите первых арендаторов уже через неделю
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureText}>Без комиссии за размещение</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureText}>Только проверенные арендаторы</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureText}>Полное онлайн-управление</span>
            </div>
          </div>
          <a href="/registration?role=landlord" className={styles.button}>
            Разместить объявление
          </a>
          <p className={styles.note}>
            Среднее время размещения объявления — 5 минут
          </p>
        </div>
      </div>
    </section>
  );
} 