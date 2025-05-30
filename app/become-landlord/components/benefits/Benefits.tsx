import { Brain, Smartphone, Wifi, Settings, Shield, Heart } from "lucide-react";
import styles from "./Benefits.module.css";

export function Benefits() {
  return (
    <section className={styles.benefits}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          Почему GoHood — платформа нового поколения для арендодателей
        </h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Brain className={styles.icon} />
            <h3 className={styles.cardTitle}>Умный AI-подбор арендаторов</h3>
            <p className={styles.description}>
              GoHood использует искусственный интеллект для анализа анкет, истории аренды и отзывов — вы сдаёте жильё только проверенным, ответственным людям
            </p>
          </div>

          <div className={styles.card}>
            <Smartphone className={styles.icon} />
            <h3 className={styles.cardTitle}>Моментальная публикация и управление онлайн</h3>
            <p className={styles.description}>
              Вы создаёте объявление за 5 минут и сразу управляете всем дистанционно: меняйте цену, условия и бронирование с телефона или ноутбука — без звонков и рутинных встреч
            </p>
          </div>

          <div className={styles.card}>
            <Wifi className={styles.icon} />
            <h3 className={styles.cardTitle}>Максимальный охват digital-аудитории</h3>
            <p className={styles.description}>
              GoHood — это тысячи digital-кочевников, IT-специалистов и студентов, которые ищут комфортное жильё с быстрым Wi-Fi и современной инфраструктурой
            </p>
          </div>

          <div className={styles.card}>
            <Settings className={styles.icon} />
            <h3 className={styles.cardTitle}>Полная автоматизация процесса</h3>
            <p className={styles.description}>
              Система полностью берёт на себя переписку, проверку платежей, напоминания, договоры и поддержку — вы экономите время и минимизируете риски
            </p>
          </div>

          <div className={styles.card}>
            <Shield className={styles.icon} />
            <h3 className={styles.cardTitle}>Безопасность на всех этапах</h3>
            <p className={styles.description}>
              Верификация арендаторов, защищённые сделки и круглосуточная поддержка для арендодателей — ваш объект и деньги всегда под защитой
            </p>
          </div>

          <div className={styles.card}>
            <Heart className={styles.icon} />
            <h3 className={styles.cardTitle}>Реальные преимущества для жизни и работы</h3>
            <p className={styles.description}>
              Мы оцениваем район: наличие супермаркетов, транспорта, Wi-Fi, инфраструктуры для remote work. Ваше жильё рекомендует ИИ тем, кому оно идеально подходит
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 