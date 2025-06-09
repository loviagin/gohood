import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { City } from '@/models/City';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export async function POST(request: Request) {
  try {
    const { address, city } = await request.json();

    if (!address || !city) {
      return NextResponse.json(
        { error: 'Address and city are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the city
    const cityDoc = await City.findOne({ name: city });
    if (!cityDoc) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    // Check if district already exists
    const existingDistrict = cityDoc.districts.find((d: { name: string }) => d.name === address);
    if (existingDistrict) {
      return NextResponse.json(existingDistrict);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Проанализируй район по адресу "${address}" в городе ${city}.
      Оцени район по следующим критериям (от 0 до 100):
      1. Экология и чистота
      2. Инфраструктура (школы, детские сады, магазины)
      3. Транспортная доступность
      4. Безопасность
      5. Стоимость недвижимости

      ОТВЕТ ДОЛЖЕН БЫТЬ НА РУССКОМ ЯЗЫКЕ
      
      Верни ответ в формате JSON:
      {
        "name": "название района",
        "rating": {
          "score": средний балл по всем критериям,
          "factors": [
            "краткое описание экологии",
            "краткое описание инфраструктуры",
            "краткое описание транспорта",
            "краткое описание безопасности",
            "краткое описание стоимости недвижимости"
          ]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Парсим JSON из ответа
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Add the new district to the city's districts array
    const newDistrict = {
      name: analysis.name,
      rating: analysis.rating,
      // Add default values for required fields
      population: 0,
      demographics: {
        white: 0,
        african: 0,
        other: 0
      },
      safety: {
        daytime: analysis.rating.score,
        nighttime: analysis.rating.score
      },
      transport: {
        score: analysis.rating.score,
        description: analysis.rating.factors[2] // Transport description from factors
      },
      network: {
        coverage: 0,
        description: 'Нет данных'
      },
      tourism: {
        popularity: 0,
        description: 'Нет данных'
      }
    };

    // Update the city document with the new district
    cityDoc.districts.push(newDistrict);
    await cityDoc.save();

    return NextResponse.json(newDistrict);
  } catch (error) {
    console.error('Error analyzing district:', error);
    return NextResponse.json(
      { error: 'Failed to analyze district' },
      { status: 500 }
    );
  }
} 