import styles from "./Cities.module.css";
import Link from "next/link";

interface CitiesProps {
  title: string;
  subtitle: string;
}

const cities = [
  { name: "Москва", image: "/cities/moscow.webp" },
  { name: "Лондон", image: "/cities/london.webp" },
  { name: "Рим", image: "/cities/rome.webp" },
  { name: "Милан", image: "/cities/milan.webp" },
  { name: "Казань", image: "/cities/kazan.webp" },
  { name: "Ярославль", image: "/cities/yaroslavl.webp" },
];

export default function Cities({ title, subtitle }: CitiesProps) {
  return (
    <section className={styles.cities}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          {subtitle}
        </p>
        <div className={styles.grid}>
          {cities.map((city) => (
            <div key={city.name} className={styles.card}>
              <img
                src={city.image}
                alt={city.name}
                className={styles.image}
              />
              <div className={styles.overlay}>
                <h3 className={styles.name}>{city.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          {/* <Link href="/cities" className={styles.allCitiesButton}>
            Все города
          </Link> */}
        </div>
      </div>
    </section>
  );
} 