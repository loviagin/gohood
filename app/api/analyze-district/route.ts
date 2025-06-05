import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      Проанализируй район по адресу "${address}" в городе ${city}.
      Оцени район по следующим критериям (от 0 до 100):
      1. Экология и чистота
      2. Инфраструктура (школы, детские сады, магазины)
      3. Транспортная доступность
      4. Безопасность
      5. Стоимость недвижимости
      
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

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing district:', error);
    return NextResponse.json(
      { error: 'Failed to analyze district' },
      { status: 500 }
    );
  }
} 