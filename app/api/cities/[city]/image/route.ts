import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';
import { City } from '@/models/City';
import connectDB from '@/lib/db';


export async function GET(request: Request) {
  const url = new URL(request.url);
  const imageUrl = url.searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000', // Кэшируем на 1 год
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
} 

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ city: string }> }
) {
  try {
    // Проверяем JWT токен
    // const token = await getToken({ req: request });
    // if (!token) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    // Получаем параметры из запроса
    const { city } = await context.params;
    const cityName = decodeURIComponent(city);
    const { imageUrl } = await request.json();

    // Проверяем наличие URL изображения
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Проверяем валидность URL
    try {
      new URL(imageUrl);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid image URL' },
        { status: 400 }
      );
    }

    // Подключаемся к базе данных
    await connectDB();

    // Находим и обновляем город
    const updatedCity = await City.findOneAndUpdate(
      { 
        $or: [
          { _id: cityName }
        ]
      },
      { 
        $set: { 
          imageUrl,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!updatedCity) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Image URL updated successfully',
      city: updatedCity
    });

  } catch (error) {
    console.error('Error updating city image:', error);
    return NextResponse.json(
      { error: 'Failed to update city image' },
      { status: 500 }
    );
  }
} 