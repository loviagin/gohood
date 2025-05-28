import styles from "./Cities.module.css";
import Link from "next/link";

const cities = [
  { name: "Москва", image: "/images/moscow.jpg" },
  { name: "Лондон", image: "/images/london.jpg" },
  { name: "Рим", image: "/images/rome.jpg" },
  { name: "Милан", image: "/images/milan.jpg" },
  { name: "Казань", image: "/images/kazan.jpg" },
  { name: "Ярославль", image: "/images/yaroslavl.jpg" },
];

export default function Cities() {
  return (
    <section className={styles.cities}>
      <div className={styles.container}>
        <h2 className={styles.title}>Города</h2>
        <p className={styles.subtitle}>
          Исследуйте жильё в разных городах России и мира
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
          <Link href="/cities" className={styles.allCitiesButton}>
            Все города
          </Link>
        </div>
      </div>
    </section>
  );
} 