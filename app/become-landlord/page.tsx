import { Building2, TrendingUp, Shield, Users, Clock, Globe, Link } from "lucide-react";
import styles from "./page.module.css";

export default function BecomeLandlord() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Станьте арендодателем
            <br />
            <span className={styles.titleHighlight}>на GoHood</span>
          </h1>
          <p className={styles.subtitle}>
            Размещайте свои объекты на платформе, где арендаторы ценят качество жилья и инфраструктуру района
          </p>
          <a href="/become-landlord/register" className={styles.ctaButton}>
            Начать размещение
          </a>
        </div>
      </section>

      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Почему стоит размещать жильё на GoHood</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <TrendingUp className={styles.icon} />
              <h3 className={styles.cardTitle}>Высокая доходность</h3>
              <p className={styles.description}>
                Наша платформа привлекает платежеспособных арендаторов, готовых платить за качественное жильё в хороших районах
              </p>
            </div>

            <div className={styles.card}>
              <Shield className={styles.icon} />
              <h3 className={styles.cardTitle}>Безопасность</h3>
              <p className={styles.description}>
                Проверка арендаторов, страховка имущества и юридическая поддержка на всех этапах
              </p>
            </div>

            <div className={styles.card}>
              <Users className={styles.icon} />
              <h3 className={styles.cardTitle}>Качественные арендаторы</h3>
              <p className={styles.description}>
                Наши арендаторы — это люди, которые ценят комфорт и готовы платить за качественное жильё
              </p>
            </div>

            <div className={styles.card}>
              <Clock className={styles.icon} />
              <h3 className={styles.cardTitle}>Экономия времени</h3>
              <p className={styles.description}>
                Автоматизация процессов, онлайн-договоры и удобный личный кабинет для управления объектами
              </p>
            </div>

            <div className={styles.card}>
              <Globe className={styles.icon} />
              <h3 className={styles.cardTitle}>Международная аудитория</h3>
              <p className={styles.description}>
                Доступ к арендаторам из разных стран, которые ищут качественное жильё в России
              </p>
            </div>

            <div className={styles.card}>
              <Building2 className={styles.icon} />
              <h3 className={styles.cardTitle}>Разные форматы жилья</h3>
              <p className={styles.description}>
                Размещайте квартиры, дома, апартаменты и другие типы недвижимости
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Готовы начать?</h2>
          <p className={styles.ctaSubtitle}>
            Зарегистрируйтесь как арендодатель и разместите своё первое объявление
          </p>
          <button className={styles.ctaButton}>
            Стать арендодателем
          </button>
        </div>
      </section>
    </main>
  );
}