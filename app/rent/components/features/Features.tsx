'use client';

import { Sparkles, MessageCircle, Shield, Home, Phone, CreditCard } from 'lucide-react';
import styles from './Features.module.css';

export default function Features() {
    return (
        <section className={styles.features}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Почему GoHood — новый стандарт аренды</h2>
                <p className={styles.sectionSubtitle}>
                    Мы создали удобный сервис для поиска и аренды жилья, который помогает арендаторам быстро найти подходящий вариант, а арендодателям — надежно сдать недвижимость
                </p>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <Sparkles className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Идеальное жильё за 5 минут</h3>
                        <p className={styles.featureDescription}>
                            Просто введите ваши предпочтения — ИИ подберёт лучшие варианты по вашему запросу.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <MessageCircle className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Живые отзывы и честные оценки</h3>
                        <p className={styles.featureDescription}>
                            Узнавай всё о районе, интернете, транспорте, соседях — благодаря анализу отзывов.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <Shield className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Безопасность на каждом этапе</h3>
                        <p className={styles.featureDescription}>
                            Только верифицированные арендодатели. Деньги замораживаются до даты въезда.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <Home className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Онлайн-бронь и заселение</h3>
                        <p className={styles.featureDescription}>
                            Бронируйте и подписывайте договор онлайн. Заселяйтесь полностью удаленно.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <CreditCard className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Без посредников и скрытых комиссий</h3>
                        <p className={styles.featureDescription}>
                            Общайтесь только с собственниками.
                            Оплата — без переплат и комиссий сервиса.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <Phone className={styles.featureIcon} />
                        <h3 className={styles.featureTitle}>Поддержка 24/7</h3>
                        <p className={styles.featureDescription}>
                            Всегда на связи, поможем с любым вопросом.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
} 