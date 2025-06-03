import { NextRequest, NextResponse } from 'next/server';

const OSTROVOK_API_URL = 'https://api.ostrovok.ru/v3';
const OSTROVOK_API_KEY = process.env.NEXT_PUBLIC_OSTROVOK_API_KEY;
const OSTROVOK_API_SECRET = process.env.NEXT_PUBLIC_OSTROVOK_API_SECRET;

export async function GET(request: NextRequest) {
  if (!OSTROVOK_API_KEY || !OSTROVOK_API_SECRET) {
    return NextResponse.json(
      { error: 'Ostrovok API credentials are not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;

  // Validate required parameters
  const requiredParams = ['location', 'checkIn', 'checkOut', 'guests'];
  const missingParams = requiredParams.filter(param => !searchParams.has(param));

  if (missingParams.length > 0) {
    return NextResponse.json(
      { error: `Missing required parameters: ${missingParams.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    const location = searchParams.get('location');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    if (!location || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'All parameters must have values' },
        { status: 400 }
      );
    }

    // First, search for the region/city ID
    const regionSearchResponse = await fetch(`${OSTROVOK_API_URL}/region/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${OSTROVOK_API_KEY}:${OSTROVOK_API_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        query: location,
        language: 'ru',
      }),
    });

    if (!regionSearchResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to search region' },
        { status: regionSearchResponse.status }
      );
    }

    const regionData = await regionSearchResponse.json();
    
    if (!regionData.regions?.length) {
      return NextResponse.json(
        { error: 'Region not found' },
        { status: 404 }
      );
    }

    const regionId = regionData.regions[0].id;

    // Search for hotels in the region
    const searchResponse = await fetch(`${OSTROVOK_API_URL}/hotels/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${OSTROVOK_API_KEY}:${OSTROVOK_API_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        region_id: regionId,
        checkin: checkIn,
        checkout: checkOut,
        guests: [{
          adults: parseInt(guests, 10),
          children: []
        }],
        currency: 'RUB',
        language: 'ru',
      }),
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => null);
      return NextResponse.json(
        {
          error: `Ostrovok API error (${searchResponse.status})`,
          details: errorData?.message || searchResponse.statusText
        },
        { status: searchResponse.status }
      );
    }

    const data = await searchResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to Ostrovok API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Ostrovok API' },
      { status: 500 }
    );
  }
} 