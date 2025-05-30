import { Home, Users, Laptop, Wallet } from "lucide-react";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    icon: Home,
    title: "Размещаете своё жильё за 5 минут",
    description: "Описываете квартиру, отмечаете преимущества, загружаете фото — и объявление моментально появляется на платформе.",
  },
  {
    icon: Users,
    title: "Получайте только реальных арендаторов",
    description: "GoHood фильтрует отклики с помощью ИИ: вам пишут только настоящие люди с верификацией, рейтингом и отзывами.",
  },
  {
    icon: Laptop,
    title: "Управляете арендой полностью онлайн",
    description: "Всё — от согласования до оплаты и въезда — происходит в одном личном кабинете. Без звонков, нервов и бумажек.",
  },
  {
    icon: Wallet,
    title: "Ваш доход — под контролем",
    description: "Получаете деньги напрямую, следите за статусом платежей и управляете бронями с телефона или ноутбука.",
  },
];

export function HowItWorks() {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>Как это работает?</h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepIconWrapper}>
                <step.icon className={styles.stepIcon} />
                <span className={styles.stepNumber}>{index + 1}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
        <p className={styles.footerText}>
          GoHood экономит ваше время и деньги. Всё — онлайн.
        </p>
      </div>
    </section>
  );
} 