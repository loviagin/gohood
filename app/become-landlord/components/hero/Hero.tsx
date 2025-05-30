import { Sparkles, Rocket, Shield, BadgeCheck } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Сдайте свою квартиру быстро и выгодно с GoHood
        </h1>
        <p className={styles.subtitle}>
          Искусственный интеллект подберёт идеальных арендаторов. Ваше жильё — на виду у лучших digital-кочевников, путешественников и тех, кто ценит комфорт.
        </p>
        <div className={styles.benefitsList}>
          <div className={styles.benefitItem}>
            <Sparkles className={styles.benefitIcon} />
            <span className={styles.benefitText}>Без посредников</span>
          </div>
          <div className={styles.benefitItem}>
            <Rocket className={styles.benefitIcon} />
            <span className={styles.benefitText}>Мгновенная публикация</span>
          </div>
          <div className={styles.benefitItem}>
            <Shield className={styles.benefitIcon} />
            <span className={styles.benefitText}>Безопасные сделки</span>
          </div>
          <div className={styles.benefitItem}>
            <BadgeCheck className={styles.benefitIcon} />
            <span className={styles.benefitText}>Только проверенные арендаторы</span>
          </div>
        </div>
        <a href="/registration?role=landlord" className={styles.ctaButton}>
          <span>Разместить объявление бесплатно</span>
        </a>
      </div>
    </section>
  );
} 