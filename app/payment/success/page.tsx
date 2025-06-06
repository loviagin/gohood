'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface PaymentResponse {
    status: 'succeeded' | 'pending' | 'waiting_for_capture' | 'canceled' | 'failed';
    amount: {
        value: string;
        currency: string;
    };
    description?: string;
}

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Проверяем статус платежа...');

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkPaymentStatus = async () => {
            try {
                const paymentId = searchParams.get('payment_id');
                console.log('Payment ID from URL:', paymentId);
                
                if (!paymentId) {
                    setStatus('error');
                    setMessage('Не удалось определить платеж');
                    return;
                }

                const response = await fetch(`/api/check-payment?payment_id=${paymentId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json() as PaymentResponse;
                console.log('Payment check response:', data);

                if (data.status === 'succeeded' || data.status === 'waiting_for_capture') {
                    setStatus('success');
                    setMessage('Оплата прошла успешно! Спасибо за покупку.');
                } else if (data.status === 'pending') {
                    setStatus('loading');
                    setMessage('Платеж обрабатывается...');
                    // Повторная проверка через 3 секунды
                    timeoutId = setTimeout(checkPaymentStatus, 3000);
                } else if (data.status === 'canceled') {
                    setStatus('error');
                    setMessage('Платеж был отменен. Пожалуйста, попробуйте еще раз.');
                } else if (data.status === 'failed') {
                    setStatus('error');
                    setMessage('Платеж не прошел. Пожалуйста, попробуйте еще раз.');
                } else {
                    setStatus('error');
                    setMessage('Неизвестный статус платежа. Пожалуйста, свяжитесь с поддержкой.');
                }
            } catch (error) {
                console.error('Payment check error:', error);
                setStatus('error');
                setMessage('Произошла ошибка при проверке платежа');
            }
        };

        checkPaymentStatus();

        // Очистка таймаута при размонтировании компонента
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={`${styles.statusIcon} ${styles[status]}`}>
                    {status === 'loading' && '⌛'}
                    {status === 'success' && '✓'}
                    {status === 'error' && '✕'}
                </div>
                <h1 className={styles.title}>
                    {status === 'loading' && 'Проверка платежа'}
                    {status === 'success' && 'Оплата успешна'}
                    {status === 'error' && 'Ошибка оплаты'}
                </h1>
                <p className={styles.message}>{message}</p>
                {status !== 'loading' && (
                    <a href="/" className={styles.button}>
                        Вернуться на главную
                    </a>
                )}
            </div>
        </div>
    );
} 