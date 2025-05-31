import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Валидация входных данных
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    // Отправляем email через Resend
    await resend.emails.send({
      from: 'GoHood Contact Form <no_reply@gohood.city>',
      to: 'ilia.loviagin@gmail.com',
      subject: `Новое сообщение с сайта: ${subject}`,
      text: `
Имя: ${name}
Email: ${email}
Тема: ${subject}

Сообщение:
${message}
      `,
      html: `
<h2>Новое сообщение с сайта</h2>
<p><strong>Имя:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Тема:</strong> ${subject}</p>
<p><strong>Сообщение:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json(
      { message: 'Сообщение успешно отправлено' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
} 