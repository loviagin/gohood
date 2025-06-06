'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentRedirect() {
  const router = useRouter();

  useEffect(() => {
    const paymentId = localStorage.getItem('lastPaymentId');
    if (paymentId) {
      router.replace(`/payment/success?payment_id=${paymentId}`);
    } else {
      router.replace('/payment/success?error=no-payment-id');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Пожалуйста, подождите...</h1>
    </div>
  );
}