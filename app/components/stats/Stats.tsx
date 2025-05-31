'use client';

import styles from "./Stats.module.css";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Home, MapPin, Users, Headset } from "lucide-react";

interface StatsProps {
  title: string;
  subtitle: string;
}

const stats = [
  {
    number: 1000,
    suffix: "+",
    label: "Объектов размещения",
    description: "Квартиры, дома и хостелы в разных городах",
    icon: Home
  },
  {
    number: 50,
    suffix: "+",
    label: "Городов",
    description: "Россия, Европа и другие страны",
    icon: MapPin
  },
  {
    number: 10000,
    suffix: "+",
    label: "Любимых пользователей",
    description: "Каждый день находят свое место",
    icon: Users
  },
  {
    number: 24,
    suffix: "/7",
    label: "Поддержка",
    description: "Всегда на связи и готовы помочь",
    icon: Headset
  }
];

export default function Stats({ title, subtitle }: StatsProps) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className={styles.stats} ref={ref}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          {subtitle}
        </p>
        <div className={styles.grid}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon className={styles.icon} />
                </div>
                <div className={styles.number}>
                  {inView && (
                    <CountUp
                      end={stat.number}
                      suffix={stat.suffix}
                      duration={2.5}
                      enableScrollSpy
                      scrollSpyOnce
                    />
                  )}
                </div>
                <h3 className={styles.label}>{stat.label}</h3>
                <p className={styles.description}>{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 