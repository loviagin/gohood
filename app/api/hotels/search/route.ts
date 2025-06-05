import { NextRequest, NextResponse } from 'next/server';

const HOTELLOOK_API_URL = 'https://engine.hotellook.com/api/v2';
const TRAVELPAYOUTS_TOKEN = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_TOKEN;

export async function GET(request: NextRequest) {
  if (!TRAVELPAYOUTS_TOKEN) {
    console.error('Travelpayouts token is not configured');
    return NextResponse.json(
      { error: 'Travelpayouts token is not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  
  // Validate required parameters
  const requiredParams = ['location', 'checkIn', 'checkOut', 'adults'];
  const missingParams = requiredParams.filter(param => !searchParams.has(param));
  
  if (missingParams.length > 0) {
    console.error('Missing required parameters:', missingParams);
    return NextResponse.json(
      { error: `Missing required parameters: ${missingParams.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    // Add token to search params
    searchParams.set('token', TRAVELPAYOUTS_TOKEN);

    // First, verify the location exists
    const locationId = searchParams.get('location');
    const locationUrl = `${HOTELLOOK_API_URL}/lookup.json?query=${locationId}&token=${TRAVELPAYOUTS_TOKEN}`;
    
    console.log('Verifying location:', locationUrl);
    const locationResponse = await fetch(locationUrl);
    
    if (!locationResponse.ok) {
      console.error('Location verification failed:', {
        status: locationResponse.status,
        statusText: locationResponse.statusText
      });
      return NextResponse.json(
        { error: 'Invalid location ID' },
        { status: 400 }
      );
    }

    const locationData = await locationResponse.json();
    console.log('Location verification response:', locationData);

    if (!locationData.results?.locations?.length) {
      console.error('Location not found:', locationId);
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Now search for hotels
    const hotelSearchParams = new URLSearchParams({
      location: locationId!,
      checkIn: searchParams.get('checkIn')!,
      checkOut: searchParams.get('checkOut')!,
      adults: searchParams.get('adults')!,
      children: searchParams.get('children') || '',
      currency: searchParams.get('currency') || 'RUB',
      lang: searchParams.get('lang') || 'ru',
      limit: searchParams.get('limit') || '20',
      sortBy: searchParams.get('sortBy') || 'popularity',
      sortOrder: searchParams.get('sortOrder') || 'desc',
      token: TRAVELPAYOUTS_TOKEN
    });

    const apiUrl = `${HOTELLOOK_API_URL}/search.json?${hotelSearchParams.toString()}`;
    console.log('Making request to Hotellook API:', {
      url: apiUrl,
      params: Object.fromEntries(hotelSearchParams.entries())
    });

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Log the response status and headers
    console.log('Hotellook API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Hotellook API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        { 
          error: `Hotellook API error (${response.status})`,
          details: errorData?.message || response.statusText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Hotellook API response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to Hotellook API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Hotellook API' },
      { status: 500 }
    );
  }
} 