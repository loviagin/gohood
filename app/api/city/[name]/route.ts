import { NextResponse } from 'next/server';
import { getCityByName, createCity } from '@/app/services/cities';
import { getCityInfo } from '@/app/services/gemini';
import { CityData } from '@/models/City';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const cityName = decodeURIComponent(name);
  
  try {
    console.log('API: Raw city name from params:', name);
    console.log('API: Decoded city name:', cityName);
    
    // Try to get city from database
    let city = await getCityByName(cityName);
    console.log('API: City from DB:', city ? 'Found' : 'Not found');
    
    // Если город найден, но нет информации о транспорте, обновляем ВСЮ информацию
    if (city && (!city.transportation || !city.transportation.types || city.transportation.types.length === 0)) {
      console.log('API: City found but missing transportation info, refreshing all data from Gemini...');
      try {
        const geminiData = await getCityInfo(cityName);
        if (geminiData) {
          console.log('API: Updating city with fresh data from Gemini');
          // Обновляем все поля, кроме _id и временных меток
          Object.assign(city, {
            ...geminiData,
            updatedAt: new Date()
          });
          await city.save();
          console.log('API: City updated with fresh data');
        }
      } catch (error) {
        console.error('API: Error refreshing city data from Gemini:', error);
      }
    }
    
    // Если город не найден в базе, получаем данные от Gemini и создаем новую запись
    if (!city) {
      console.log('API: City not found in DB, fetching from Gemini...');
      try {
        const geminiData = await getCityInfo(cityName);
        console.log('API: Gemini data received:', geminiData);
        
        if (!geminiData) {
          console.log('API: No data received from Gemini');
          return NextResponse.json(
            { error: 'Failed to get city information from Gemini' },
            { status: 404 }
          );
        }
        
        // Добавляем временные метки к данным
        const cityData: CityData = {
          ...geminiData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        console.log('API: Creating new city with data:', cityData);
        
        try {
          city = await createCity(cityData);
          console.log('API: New city created:', city ? 'Success' : 'Failed');
        } catch (createError: any) {
          // Если возникла ошибка дублирования, пробуем найти существующую запись
          if (createError.code === 11000) {
            console.log('API: Duplicate key error, trying to find existing record');
            city = await getCityByName(cityName);
            if (city) {
              console.log('API: Found existing city record after duplicate error');
              return NextResponse.json(city);
            }
          }
          throw createError;
        }
      } catch (error) {
        console.error('API: Error getting data from Gemini:', error);
        return NextResponse.json(
          { error: 'Failed to get city information from Gemini' },
          { status: 500 }
        );
      }
    }

    if (!city) {
      console.log('API: Failed to get city information');
      return NextResponse.json(
        { error: 'Failed to get city information' },
        { status: 404 }
      );
    }

    console.log('API: Returning city data:', city);
    return NextResponse.json(city);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 