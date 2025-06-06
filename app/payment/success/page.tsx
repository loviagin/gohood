'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

interface PaymentResponse {
    id: string;
    status: 'succeeded' | 'pending' | 'waiting_for_capture' | 'canceled' | 'failed';
    amount: {
        value: string;
        currency: string;
    };
    description?: string;
    confirmation?: {
        confirmation_url: string;
    };
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Проверяем статус платежа...');

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const checkPaymentStatus = async () => {
            try {
                // Try to get payment ID from different possible URL parameters
                const paymentId = searchParams.get('payment_id') || 
                                searchParams.get('paymentId') || 
                                searchParams.get('id');
                
                console.log('Payment ID from URL:', paymentId);
                
                if (!paymentId) {
                    console.error('No payment ID in URL');
                    setStatus('error');
                    setMessage('Не удалось определить платеж. Пожалуйста, свяжитесь с поддержкой.');
                    return;
                }

                console.log('Making request to check payment status...');
                const response = await fetch(`/api/check-payment?payment_id=${paymentId}`);
                console.log('Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API error response:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }
                
                const data = await response.json() as PaymentResponse;
                console.log('Payment check response:', data);

                if (!data.status) {
                    console.error('No status in response:', data);
                    throw new Error('Invalid response format: no status field');
                }

                switch (data.status) {
                    case 'succeeded':
                    case 'waiting_for_capture':
                        console.log('Payment successful');
                        setStatus('success');
                        setMessage('Оплата прошла успешно! Спасибо за покупку.');
                        break;
                    case 'pending':
                        console.log('Payment pending, will check again');
                        setStatus('loading');
                        setMessage('Платеж обрабатывается...');
                        timeoutId = setTimeout(checkPaymentStatus, 3000);
                        break;
                    case 'canceled':
                        console.log('Payment canceled');
                        setStatus('error');
                        setMessage('Платеж был отменен. Пожалуйста, попробуйте еще раз.');
                        break;
                    case 'failed':
                        console.log('Payment failed');
                        setStatus('error');
                        setMessage('Платеж не прошел. Пожалуйста, попробуйте еще раз.');
                        break;
                    default:
                        console.error('Unknown payment status:', data.status);
                        setStatus('error');
                        setMessage('Неизвестный статус платежа. Пожалуйста, свяжитесь с поддержкой.');
                }
            } catch (error) {
                console.error('Payment check error:', error);
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Произошла ошибка при проверке платежа');
            }
        };

        checkPaymentStatus();

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
                    <a href="/pay" className={styles.button}>
                        Вернуться на страницу оплаты
                    </a>
                )}
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.statusIcon}>
                        ⌛
                    </div>
                    <h1 className={styles.title}>Загрузка...</h1>
                    <p className={styles.message}>Пожалуйста, подождите</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
} 