//api/create-payment
import { NextResponse } from 'next/server';

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const { amount, description } = await request.json();
        console.log('Creating payment:', { amount, description });

        if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
            throw new Error('YooKassa credentials are not configured');
        }

        const idempotenceKey = crypto.randomUUID();
        console.log('Generated idempotenceKey:', idempotenceKey);

        const paymentData = {
            amount: {
                value: amount.toFixed(2),
                currency: 'RUB'
            },
            capture: true,
            confirmation: {
                type: 'redirect',
                return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`
            },
            description: description
        };

        console.log('Sending payment data to YooKassa:', paymentData);

        const response = await fetch('https://api.yookassa.ru/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')}`,
                'Idempotence-Key': idempotenceKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        console.log('YooKassa response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('YooKassa API error:', errorText);
            throw new Error(`YooKassa API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('YooKassa payment response:', data);
        
        // Update the confirmation URL with the actual payment ID
        if (data.id && data.confirmation?.confirmation_url) {
            data.confirmation.confirmation_url += `&payment_id=${data.id}`;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Payment creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
} 