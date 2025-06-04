import styles from './Footer.module.css';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.section}>
                    <h3 className={styles.title}>Go Hood</h3>
                    <p>Мы помогаем людям находить лучшие места для жизни и работы в разных городах.</p>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.title}>Навигация</h3>
                    <Link href="/" className={styles.link}>
                        Главная
                    </Link>
                    <Link href="/cities" className={styles.link}>
                        Города
                    </Link>
                    <Link href="/service" className={styles.link}>
                        Услуги
                    </Link>
                    <Link href="/contacts" className={styles.link}>
                        Контакты
                    </Link>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.title}>Документы</h3>
                    <Link href="/terms" className={styles.link}>
                        Пользовательское соглашение
                    </Link>
                    <Link href="/privacy" className={styles.link}>
                        Политика конфиденциальности
                    </Link>
                    <Link href="/consent" className={styles.link}>
                        Обработка персональных данных
                    </Link>
                    <Link href="/cookies" className={styles.link}>
                        Cookies
                    </Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© {new Date().getFullYear()} GoHood. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
