'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPlus, FaBuilding, FaCalendarAlt, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './page.module.css';

type ListingStatus = 'active' | 'pending' | 'rejected' | 'archived';

export default function LandlordListings() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<ListingStatus>('active');

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

    const tabs = [
        { id: 'active', label: 'Активные', count: 0 },
        { id: 'pending', label: 'На модерации', count: 0 },
        { id: 'rejected', label: 'Отклоненные', count: 0 },
        { id: 'archived', label: 'Архив', count: 0 }
    ] as const;

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Мои объекты</h1>
                    <button 
                        className={styles.addButton}
                        onClick={() => router.push('/account/listings/new')}
                    >
                        <FaPlus className={styles.addIcon} />
                        Добавить объект
                    </button>
                </div>

                <div className={styles.tabs}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={styles.tabCount}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className={styles.listingsGrid}>
                    {/* Placeholder for empty state */}
                    <div className={styles.emptyState}>
                        <FaBuilding className={styles.emptyIcon} />
                        <h2>У вас пока нет объявлений</h2>
                        <p>Разместите своё первое объявление и начните получать заявки от арендаторов</p>
                        <button 
                            className={styles.emptyButton}
                            onClick={() => router.push('/account/listings/new')}
                        >
                            Разместить объявление
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
