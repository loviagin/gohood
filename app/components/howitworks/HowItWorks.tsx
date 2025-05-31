import styles from "./HowItWorks.module.css";

interface HowItWorksProps {
  title: string;
  subtitle: string;
}

const steps = [
  {
    number: "01",
    title: "Вводите предпочтения",
    description: "Укажите свои пожелания по жилью, локации и датам заезда"
  },
  {
    number: "02",
    title: "ИИ находит варианты",
    description: "Наш искусственный интеллект подберет для вас лучшие варианты размещения"
  },
  {
    number: "03",
    title: "Вы бронируете и заезжаете",
    description: "Бронируйте онлайн и заезжайте без лишних бумажек и формальностей"
  }
];

export default function HowItWorks({ title, subtitle }: HowItWorksProps) {
  return (
    <section className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 