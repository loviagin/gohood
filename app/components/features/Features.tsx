import { Wifi, Key, MapPin, Building2, Globe, Shield } from "lucide-react";
import styles from "./Features.module.css";

export default function Features() {
  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Почему выбирают GoHood.city</h2>
        <p className={styles.subtitle}>
          GoHood — не просто аренда. Это комфорт в каждом районе
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Wifi className={styles.icon} />
            <h3 className={styles.cardTitle}>Гарантированный Wi-Fi</h3>
            <p className={styles.description}>
              Реальные спидтесты и стабильное подключение для комфортной работы
            </p>
          </div>

          <div className={styles.card}>
            <Key className={styles.icon} />
            <h3 className={styles.cardTitle}>Self Check-in</h3>
            <p className={styles.description}>
              Заселяйтесь самостоятельно без лишних контактов и бумажной волокиты
            </p>
          </div>

          <div className={styles.card}>
            <MapPin className={styles.icon} />
            <h3 className={styles.cardTitle}>Умный подбор районов</h3>
            <p className={styles.description}>
              Оценка инфраструктуры, безопасности и качества жизни в районе
            </p>
          </div>

          <div className={styles.card}>
            <Building2 className={styles.icon} />
            <h3 className={styles.cardTitle}>Разные форматы жилья</h3>
            <p className={styles.description}>
              Номера, квартиры, дома, хостелы — собственные и с популярных площадок
            </p>
          </div>

          <div className={styles.card}>
            <Globe className={styles.icon} />
            <h3 className={styles.cardTitle}>Расскажем про город</h3>
            <p className={styles.description}>
              Как пользоваться транспортом, как добраться до квартиры, мобильные операторы, банки и многое другое
            </p>
          </div>

          <div className={styles.card}>
            <Shield className={styles.icon} />
            <h3 className={styles.cardTitle}>Безопасность</h3>
            <p className={styles.description}>
              Проверенные объекты и районы с высоким рейтингом безопасности
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 