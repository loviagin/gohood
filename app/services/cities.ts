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

  const prompt = `Ты - API, который возвращает информацию о городах. Верни ТОЛЬКО JSON объект без каких-либо дополнительных символов, комментариев или форматирования. Вот структура JSON для города ${cityName}:
  {
    "name": "название города",
    "fullName": "полное название города с указанием страны",
    "country": "название страны",
    "countryCode": "код страны (например, RU)",
    "description": "краткое описание города (2-3 предложения)",
    "imageUrl": "URL фотографии города (используй Unsplash API)",
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

      // Получаем изображение города через Unsplash API
      const unsplashResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName)} city&per_page=1`,
        {
          headers: {
            'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const unsplashData = await unsplashResponse.json();
      if (unsplashData.results?.[0]?.urls?.regular) {
        cityInfo.imageUrl = unsplashData.results[0].urls.regular;
      }

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

    // Ищем город в базе данных
    let city = await City.findOne({ name: cityName });
    console.log('City found in database:', city ? 'yes' : 'no');

    // Если город не найден или информация устарела (старше 30 дней)
    if (!city || (Date.now() - city.lastUpdated.getTime()) > 30 * 24 * 60 * 60 * 1000) {
      console.log('City needs update:', !city ? 'not found' : 'outdated');
      try {
        // Получаем информацию о городе через Gemini
        console.log('Generating city info with Gemini...');
        const cityInfo = await generateCityInfo(cityName);
        console.log('City info generated successfully');

        if (city) {
          // Обновляем существующую запись
          console.log('Updating existing city record');
          Object.assign(city, cityInfo);
          city.lastUpdated = new Date();
          await city.save();
          console.log('City record updated');
        } else {
          // Создаем новую запись
          console.log('Creating new city record');
          city = await City.create({
            ...cityInfo,
            lastUpdated: new Date(),
          });
          console.log('New city record created');
        }
      } catch (error) {
        console.error('Error updating city info:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          cityName
        });
        if (!city) {
          throw new Error('Failed to get city information');
        }
      }
    }

    if (!city) {
      throw new Error('City not found and could not be created');
    }

    return city;
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