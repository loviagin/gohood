import { City, type CityDocument } from '@/models/City';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

interface CityInfo {
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  description: string;
  imageUrl: string;
  details: {
    population?: number;
    language?: string;
    currency?: string;
    timezone?: string;
    bestTimeToVisit?: string;
    averageTemperature?: {
      summer?: number;
      winter?: number;
    };
    attractions?: string[];
    localCuisine?: string[];
  };
  location: {
    lat?: number;
    lng?: number;
  };
}

async function generateCityInfo(cityName: string): Promise<CityInfo> {
  if (!process.env.GOOGLE_AI_KEY) {
    console.error('GOOGLE_AI_KEY не установлен в переменных окружения');
    throw new Error('API ключ Google AI не настроен');
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  });

  const prompt = `Ты - API, который возвращает информацию о городах. Верни ТОЛЬКО JSON объект без каких-либо дополнительных символов, комментариев или форматирования. Для поля imageUrl используй прямую ссылку на изображение города с Pexels или Unsplash, обязательно включая расширение файла (например, https://images.pexels.com/photos/.../photo.jpg или https://images.unsplash.com/photo-.../photo.jpg). Вот структура JSON для города ${cityName}:
  {
    "name": "название города",
    "fullName": "полное название города с указанием страны",
    "country": "название страны",
    "countryCode": "код страны (например, RU)",
    "description": "краткое описание города (2-3 предложения)",
    "imageUrl": "прямая ссылка на изображение города с Pexels или Unsplash (обязательно с расширением файла)",
    "details": {
      "population": численность населения,
      "language": "основной язык",
      "currency": "национальная валюта",
      "timezone": "часовой пояс",
      "bestTimeToVisit": "лучшее время для посещения",
      "averageTemperature": {
        "summer": средняя температура летом,
        "winter": средняя температура зимой
      },
      "attractions": ["достопримечательность 1", "достопримечательность 2", ...],
      "localCuisine": ["местное блюдо 1", "местное блюдо 2", ...]
    },
    "location": {
      "lat": широта,
      "lng": долгота
    }
  }`;

  try {
    console.log('Attempting to generate city info for:', cityName);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw response from model:', text);
    
    // Очищаем ответ от markdown-разметки и других возможных символов
    const cleanJson = text
      .replace(/```json\n?|\n?```/g, '') // удаляем markdown-разметку
      .replace(/^[^{]*/, '') // удаляем все до первой {
      .replace(/[^}]*$/, '') // удаляем все после последней }
      .trim();
    
    console.log('Cleaned JSON:', cleanJson);
    
    try {
      const cityInfo = JSON.parse(cleanJson) as CityInfo;
      console.log('Successfully parsed city info');

      return cityInfo;
    } catch (parseError) {
      console.error('JSON parse error:', {
        error: parseError,
        cleanedText: cleanJson,
        originalText: text
      });
      throw new Error('Failed to parse city information');
    }
  } catch (error) {
    console.error('Error generating city info:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cityName,
      apiKey: process.env.GOOGLE_AI_KEY ? 'Present' : 'Missing'
    });
    throw new Error('Failed to generate city information');
  }
}

export async function getCityInfo(cityName: string): Promise<CityDocument> {
  console.log('Getting city info for:', cityName);
  
  try {
    await connectDB();
    console.log('Connected to database');

    // Ищем город в базе данных по имени или полному имени
    let city = await City.findOne({
      $or: [
        { name: cityName },
        { fullName: cityName }
      ]
    });
    console.log('City found in database:', city ? 'yes' : 'no');

    // Если город найден — просто возвращаем его, ничего не обновляем
    if (city) {
      return city;
    }

    // Если город не найден — создаём новую запись через AI
    try {
      console.log('Generating city info with Gemini...');
      const cityInfo = await generateCityInfo(cityName);
      console.log('City info generated successfully');
      try {
        city = await City.create({
          ...cityInfo,
          lastUpdated: new Date(),
        });
        console.log('New city record created');
      } catch (createError: any) {
        // Если возникла ошибка дублирования, пробуем найти существующую запись
        if (createError.code === 11000) {
          console.log('Duplicate key error, trying to find existing record');
          city = await City.findOne({
            $or: [
              { name: cityInfo.name },
              { fullName: cityInfo.fullName }
            ]
          });
          if (city) {
            console.log('Found existing city record after duplicate error');
            return city;
          }
        }
        throw createError;
      }
      return city;
    } catch (error) {
      console.error('Error creating city info:', error);
      throw new Error('Failed to get city information');
    }
  } catch (error) {
    console.error('Error in getCityInfo:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cityName
    });
    throw error;
  }
} 