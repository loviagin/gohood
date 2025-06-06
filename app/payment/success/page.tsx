'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.css';

interface PaymentResponse {
    id: string;
    status: string;
    amount: {
        value: string;
        currency: string;
    };
    description: string;
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                // Log all URL parameters for debugging
                const allParams: Record<string, string | null> = {};
                searchParams.forEach((value, key) => {
                    allParams[key] = value;
                });
                console.log('All URL parameters:', allParams);

                // YooKassa adds payment_id to the return URL
                const paymentId = searchParams.get('payment_id');
                console.log('Payment ID from URL:', paymentId);

                if (!paymentId) {
                    throw new Error('No payment ID found in URL');
                }

                console.log('Making request to check payment status...');
                const response = await fetch(`/api/check-payment?paymentId=${encodeURIComponent(paymentId)}`);
                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to check payment status');
                }

                const data: PaymentResponse = await response.json();
                console.log('Payment check response:', data);

                switch (data.status) {
                    case 'succeeded':
                        setStatus('success');
                        break;
                    case 'pending':
                        setStatus('pending');
                        // Retry after 3 seconds
                        setTimeout(() => checkPaymentStatus(), 3000);
                        break;
                    case 'waiting_for_capture':
                        setStatus('success');
                        break;
                    case 'canceled':
                        setStatus('error');
                        setError('Платеж был отменен');
                        break;
                    case 'failed':
                        setStatus('error');
                        setError('Платеж не удался');
                        break;
                    default:
                        setStatus('error');
                        setError('Неизвестный статус платежа');
                }
            } catch (error) {
                console.error('Payment check error:', error);
                setStatus('error');
                setError(error instanceof Error ? error.message : 'Произошла ошибка при проверке платежа');
            }
        };

        checkPaymentStatus();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Проверка статуса платежа...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h1>Ошибка оплаты</h1>
                    <p>{error || 'Произошла ошибка при обработке платежа'}</p>
                    <a href="/pay" className={styles.button}>Вернуться к оплате</a>
                </div>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className={styles.container}>
                <div className={styles.pending}>
                    <h1>Платеж обрабатывается</h1>
                    <p>Пожалуйста, подождите, мы проверяем статус вашего платежа...</p>
                    <div className={styles.spinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.success}>
                <h1>Оплата успешно завершена!</h1>
                <p>Спасибо за ваш заказ. Мы обработаем его в ближайшее время.</p>
                <a href="/" className={styles.button}>Вернуться на главную</a>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
} 