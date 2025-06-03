'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaBuilding, FaHome } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import styles from './page.module.css';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

interface Booking {
    id: string;
    listingId: string;
    checkIn: Date;
    checkOut: Date;
    totalPrice: number;
    currency: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}

export default function BookingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'landlord' | 'tenant'>('landlord');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user) {
            // Set initial tab based on user role
            setActiveTab(session.user.role === 'landlord' ? 'landlord' : 'tenant');
            fetchBookings();
        }
    }, [status, session, router]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/bookings?role=${activeTab}`);
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            setBookings(data.bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Ошибка при загрузке бронирований');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
        try {
            const response = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }

            // Refresh bookings after successful update
            await fetchBookings();
            toast.success(
                newStatus === 'confirmed' 
                    ? 'Бронирование подтверждено' 
                    : 'Бронирование отменено'
            );
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Ошибка при обновлении статуса бронирования');
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Бронирования</h1>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'landlord' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('landlord')}
                    >
                        <FaBuilding className={styles.tabIcon} />
                        Мои объекты
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'tenant' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('tenant')}
                    >
                        <FaHome className={styles.tabIcon} />
                        Мои бронирования
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {bookings.length === 0 ? (
                    <div className={styles.emptyState}>
                        <FaCalendarAlt className={styles.emptyIcon} />
                        <h2>Нет бронирований</h2>
                        <p>
                            {activeTab === 'landlord'
                                ? 'У вас пока нет бронирований ваших объектов'
                                : 'У вас пока нет активных бронирований'}
                        </p>
                    </div>
                ) : (
                    <div className={styles.bookingsGrid}>
                        {bookings.map((booking) => (
                            <div key={booking.id} className={styles.bookingCard}>
                                <div className={styles.bookingHeader}>
                                    <span className={`${styles.status} ${styles[booking.status]}`}>
                                        {booking.status === 'pending' && 'Ожидает подтверждения'}
                                        {booking.status === 'confirmed' && 'Подтверждено'}
                                        {booking.status === 'cancelled' && 'Отменено'}
                                        {booking.status === 'completed' && 'Завершено'}
                                    </span>
                                    <span className={styles.date}>
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles.bookingDetails}>
                                    <div className={styles.dates}>
                                        <div className={styles.dateRange}>
                                            <span className={styles.label}>Заезд:</span>
                                            <span className={styles.value}>
                                                {new Date(booking.checkIn).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={styles.dateRange}>
                                            <span className={styles.label}>Выезд:</span>
                                            <span className={styles.value}>
                                                {new Date(booking.checkOut).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.price}>
                                        <span className={styles.amount}>
                                            {booking.totalPrice} {booking.currency}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.bookingActions}>
                                    {booking.status === 'pending' && activeTab === 'landlord' && (
                                        <>
                                            <button 
                                                className={styles.confirmButton}
                                                onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                            >
                                                Подтвердить
                                            </button>
                                            <button 
                                                className={styles.cancelButton}
                                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                            >
                                                Отклонить
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button className={styles.viewButton}>
                                            Подробнее
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
