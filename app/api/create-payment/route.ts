import { NextResponse } from 'next/server';

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID!;
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(request: Request) {
  try {
    const { amount, description } = await request.json();

    const idempotenceKey = crypto.randomUUID();

    const paymentData = {
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${BASE_URL}/payment/redirect`, // ключевой момент
      },
      description,
    };

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')}`,
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}