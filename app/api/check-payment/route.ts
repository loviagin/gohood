//api/check-payment
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
        const paymentId = searchParams.get('payment_id');

        console.log('Checking payment status for ID:', paymentId);

        if (!paymentId) {
            console.error('Payment ID is missing');
            return NextResponse.json(
                { error: 'Payment ID is required' },
                { status: 400 }
            );
        }

        if (!YOOKASSA_SHOP_ID || !YOOKASSA_SECRET_KEY) {
            console.error('YooKassa credentials are missing');
            throw new Error('YooKassa credentials are not configured');
        }

        const authString = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64');
        console.log('Making request to YooKassa API...');

        const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('YooKassa API response status:', response.status);

        if (!response.ok) {
            let errorMessage = 'Unknown error';
            try {
                const errorData = await response.json() as YooKassaError;
                console.error('YooKassa API error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                errorMessage = errorData.description || response.statusText;
            } catch (e) {
                const errorText = await response.text();
                console.error('Failed to parse YooKassa error:', errorText);
                errorMessage = errorText || response.statusText;
            }
            throw new Error(`YooKassa API error: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Payment status:', data.status);
        
        if (!data.status) {
            console.error('Invalid response from YooKassa:', data);
            throw new Error('Invalid response from YooKassa: no status field');
        }

        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Payment check error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: 'Failed to check payment status', details: errorMessage },
            { status: 500 }
        );
    }
} 