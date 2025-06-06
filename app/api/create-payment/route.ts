import { NextResponse } from 'next/server';

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const { amount, description } = await request.json();

        if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
            throw new Error('YooKassa credentials are not configured');
        }

        const idempotenceKey = crypto.randomUUID();

        const response = await fetch('https://api.yookassa.ru/v3/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')}`,
                'Idempotence-Key': idempotenceKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
            })
        });

        if (!response.ok) {
            throw new Error(`YooKassa API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Payment creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
} 