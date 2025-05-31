import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import styles from './page.module.css';
import ContactForm from './components/ContactForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Контакты | GoHood – Умный поиск жилья с подбором районов',
    description: 'Свяжитесь с нами для любых вопросов или отзывов',
};

export default function ContactsPage() {
    return (
        <main className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Contact Us</h1>

                <div className={styles.contactGrid}>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <MdEmail className={styles.contactIcon} />
                            <div className={styles.contactText}>
                                <div className={styles.contactLabel}>Email</div>
                                <a href="mailto:contact@gohood.city" target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                                    contact@gohood.city
                                </a>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <MdPhone className={styles.contactIcon} />
                            <div className={styles.contactText}>
                                <div className={styles.contactLabel}>WhatsApp</div>
                                <a href="https://wa.me/447867246591" target="_blank" rel="noopener noreferrer" className={styles.contactValue}>
                                    +44 7867 246 591
                                </a>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <MdLocationOn className={styles.contactIcon} />
                            <div className={styles.contactText}>
                                <div className={styles.contactLabel}>Address</div>
                                <div className={styles.contactValue}>
                                    LOVIGIN LTD<br />
                                    86-90 Paul Street<br />
                                    London, EC2A 4NE<br />
                                    United Kingdom
                                </div>
                            </div>
                        </div>
                    </div>

                    <ContactForm />
                </div>
            </div>
        </main>
    );
}
