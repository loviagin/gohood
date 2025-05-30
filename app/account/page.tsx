'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaUser, FaBuilding, FaCalendarAlt, FaStar, FaCog, FaSignOutAlt, FaHome, FaKey } from 'react-icons/fa';
import { MdNotifications, MdPayment, MdMessage } from 'react-icons/md';
import styles from './page.module.css';

export default function Account() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const isLandlord = session.user.role === 'landlord';

    const renderLandlordDashboard = () => (
        <>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <FaBuilding className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Активные объявления</h3>
                        <p className={styles.statNumber}>0</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaCalendarAlt className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Бронирования</h3>
                        <p className={styles.statNumber}>0</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaStar className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Рейтинг</h3>
                        <p className={styles.statNumber}>0.0</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <MdPayment className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Доход</h3>
                        <p className={styles.statNumber}>0 ₽</p>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Быстрые действия</h2>
                <div className={styles.actionButtons}>
                    <button 
                        className={styles.actionButton}
                        onClick={() => router.push('/account/listings/new')}
                    >
                        <FaBuilding className={styles.actionIcon} />
                        Разместить объявление
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={() => router.push('/account/bookings')}
                    >
                        <FaCalendarAlt className={styles.actionIcon} />
                        Управление бронированиями
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={() => router.push('/account/messages')}
                    >
                        <MdMessage className={styles.actionIcon} />
                        Сообщения
                    </button>
                </div>
            </div>
        </>
    );

    const renderTenantDashboard = () => (
        <>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <FaHome className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Активные аренды</h3>
                        <p className={styles.statNumber}>0</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaCalendarAlt className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>История бронирований</h3>
                        <p className={styles.statNumber}>0</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <FaStar className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Отзывы</h3>
                        <p className={styles.statNumber}>0</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <MdPayment className={styles.statIcon} />
                    <div className={styles.statContent}>
                        <h3>Платежи</h3>
                        <p className={styles.statNumber}>0 ₽</p>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Быстрые действия</h2>
                <div className={styles.actionButtons}>
                    <button 
                        className={styles.actionButton}
                        onClick={() => router.push('/rent')}
                    >
                        <FaKey className={styles.actionIcon} />
                        Найти жилье
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={() => router.push('/account/my-rentals')}
                    >
                        <FaHome className={styles.actionIcon} />
                        Мои аренды
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={() => router.push('/account/messages')}
                    >
                        <MdMessage className={styles.actionIcon} />
                        Сообщения
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.profileSection}>
                    <div className={styles.avatar}>
                        {session.user?.image ? (
                            <img src={session.user.image} alt="Profile" />
                        ) : (
                            <FaUser className={styles.defaultAvatar} />
                        )}
                    </div>
                    <div className={styles.userInfo}>
                        <h2>{session.user?.name || 'Пользователь'}</h2>
                        <p>{session.user?.email}</p>
                        <span className={styles.roleBadge}>
                            {isLandlord ? 'Арендодатель' : 'Арендатор'}
                        </span>
                    </div>
                </div>

                <nav className={styles.navigation}>
                    <button className={styles.navButton}>
                        <FaUser className={styles.navIcon} />
                        Профиль
                    </button>
                    <button className={styles.navButton}>
                        <MdNotifications className={styles.navIcon} />
                        Уведомления
                    </button>
                    <button className={styles.navButton}>
                        <FaCog className={styles.navIcon} />
                        Настройки
                    </button>
                    <button 
                        className={styles.navButton}
                        onClick={() => router.push('/api/auth/signout')}
                    >
                        <FaSignOutAlt className={styles.navIcon} />
                        Выйти
                    </button>
                </nav>
            </div>

            <main className={styles.mainContent}>
                <div className={styles.header}>
                    <h1>Панель управления</h1>
                    <div className={styles.notifications}>
                        <MdNotifications className={styles.notificationIcon} />
                        <span className={styles.notificationBadge}>0</span>
                    </div>
                </div>

                {isLandlord ? renderLandlordDashboard() : renderTenantDashboard()}

                <div className={styles.recentActivity}>
                    <h2>Последние действия</h2>
                    <div className={styles.activityList}>
                        <p className={styles.emptyState}>
                            У вас пока нет активностей
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}