'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Go<span className={styles.logoHighlight}>Hood</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/become-landlord" className={styles.navLink}>
            Стать арендодателем
          </Link>
          <Link href="/rent" className={styles.navLink}>
            Снять жилье
          </Link>
        </nav>

        <button className={styles.loginButton}>
          Войти
        </button>
      </div>
    </header>
  );
} 