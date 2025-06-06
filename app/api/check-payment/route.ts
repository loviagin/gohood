import { NextResponse } from 'next/server';

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;

interface YooKassaError {
    type: string;
    id: string;
    code: string;
    description: string;
    parameter?: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentId = searchParams.get('paymentId');

        console.log('Checking payment status for ID:', paymentId);

        if (!paymentId) {
            console.error('No payment ID provided');
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
            console.error('YooKassa credentials are not configured');
            return NextResponse.json(
                { error: 'Payment system is not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')}`,
                'Content-Type': 'application/json',
            }
        });

        console.log('YooKassa API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json() as YooKassaError;
            console.error('YooKassa API error:', errorData);
            return NextResponse.json(
                { error: errorData.description || 'Failed to check payment status' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Payment status:', data.status);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Payment check error:', error);
        return NextResponse.json(
            { error: 'Failed to check payment status' },
            { status: 500 }
        );
    }
} 