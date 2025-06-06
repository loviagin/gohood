// app/api/yookassa-webhook/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    console.log('[Webhook] Payment event:', body);

    if (body.event === 'payment.succeeded') {
        const payment = body.object;

        console.log('✅ Payment succeeded for ID:', payment.id);
        console.log('🧾 Metadata:', payment.metadata);

        // можно тут делать проверку и отправку email/обновление базы
    }

    return NextResponse.json({ status: 'ok' });
}