import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_AI_KEY) {
  throw new Error('GOOGLE_AI_KEY is not set in environment variables');
}

export interface GeminiCityResponse {
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
  transportation: {
    types: Array<{
      name: string;
      description: string;
      paymentMethods: string[];
      tips: string;
    }>;
    generalInfo: string;
  };
  mobileOperators: Array<{
    name: string;
    website: string;
    hasESim: boolean;
    description: string;
  }>;
  districts: Array<{
    name: string;
    population: number;
    demographics: {
      white: number;
      african: number;
      other: number;
    };
    safety: {
      daytime: number;
      nighttime: number;
    };
    transport: {
      score: number;
      description: string;
    };
    network: {
      coverage: number;
      description: string;
    };
    tourism: {
      popularity: number;
      description: string;
    };
    rating: {
      score: number;
      factors: string[];
    };
  }>;
}

async function getGeminiResponse(prompt: string): Promise<string> {
  if (!process.env.GOOGLE_AI_KEY) {
    console.error('Gemini: GOOGLE_AI_KEY is not set');
    throw new Error('Google AI API key is not configured');
  }

  console.log('Gemini: Initializing with API key:', process.env.GOOGLE_AI_KEY ? 'Present' : 'Missing');
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

  try {
    console.log('Gemini: Getting model');
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    console.log('Gemini: Sending request to model');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      console.error('Gemini: Empty response from API');
      throw new Error('Empty response from Gemini API');
    }
    
    console.log('Gemini: Got response from API');
    return text;
  } catch (error) {
    console.error('Gemini: Error in getGeminiResponse:', error);
    throw error;
  }
}

export async function getCityInfo(cityName: string): Promise<GeminiCityResponse> {
  try {
    console.log('Gemini: Starting city info generation for:', cityName);
    
    // Извлекаем название города и страны
    const [city, country] = cityName.split(',').map(s => s.trim());
    console.log('Gemini: Parsed city:', city, 'country:', country);
    
    const prompt = `Generate detailed information about ${city}, ${country} in the following JSON format:
    {
      "name": "${city}",
      "fullName": "${city}, ${country}",
      "country": "${country}",
      "countryCode": "Country code",
      "description": "Brief description",
      "imageUrl": "https://images.pexels.com/photo/...",
      "details": {
        "population": number,
        "language": "Main language",
        "currency": "Currency name",
        "timezone": "Timezone",
        "bestTimeToVisit": "Best time to visit",
        "averageTemperature": {
          "summer": number,
          "winter": number
        },
        "attractions": ["Attraction 1", "Attraction 2"],
        "localCuisine": ["Dish 1", "Dish 2"]
      },
      "location": {
        "lat": number,
        "lng": number
      },
      "transportation": {
        "types": [
          {
            "name": "Transport type",
            "description": "Description",
            "paymentMethods": ["Method 1", "Method 2"],
            "tips": "Tips for using"
          }
        ],
        "generalInfo": "General transportation info"
      },
      "mobileOperators": [
        {
          "name": "Operator name",
          "website": "Website URL",
          "hasESim": boolean,
          "description": "Description"
        }
      ],
      "districts": [
        {
          "name": "District name",
          "population": number,
          "demographics": {
            "white": number,
            "african": number,
            "other": number
          },
          "safety": {
            "daytime": number,
            "nighttime": number
          },
          "transport": {
            "score": number,
            "description": "Description"
          },
          "network": {
            "coverage": number,
            "description": "Description"
          },
          "tourism": {
            "popularity": number,
            "description": "Description"
          },
          "rating": {
            "score": number,
            "factors": ["Factor 1", "Factor 2"]
          }
        }
      ]
    }`;

    console.log('Gemini: Sending prompt to model');
    const result = await getGeminiResponse(prompt);
    console.log('Gemini: Raw response:', result);

    // Очищаем ответ от markdown-разметки и лишних символов
    const cleanedResponse = result.replace(/```json\n?|\n?```/g, '').trim();
    console.log('Gemini: Cleaned response:', cleanedResponse);

    try {
      const cityInfo = JSON.parse(cleanedResponse) as GeminiCityResponse;
      console.log('Gemini: Parsed city info:', cityInfo);
      return cityInfo;
    } catch (parseError) {
      console.error('Gemini: Error parsing JSON:', parseError);
      throw new Error('Failed to parse city information from Gemini response');
    }
  } catch (error) {
    console.error('Gemini: Error in getCityInfo:', error);
    throw error;
  }
} 