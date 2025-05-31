import { NextRequest, NextResponse } from 'next/server';

const HOTELLOOK_API_URL = 'https://engine.hotellook.com/api/v2';
const TRAVELPAYOUTS_TOKEN = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_TOKEN;

export async function GET(request: NextRequest) {
  if (!TRAVELPAYOUTS_TOKEN) {
    return NextResponse.json(
      { error: 'Travelpayouts token is not configured' },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  
  // Validate required parameters
  const requiredParams = ['hotelId', 'checkIn', 'checkOut', 'guests'];
  const missingParams = requiredParams.filter(param => !searchParams.has(param));
  
  if (missingParams.length > 0) {
    return NextResponse.json(
      { error: `Missing required parameters: ${missingParams.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    // Add token to search params
    searchParams.set('token', TRAVELPAYOUTS_TOKEN);

    const response = await fetch(`${HOTELLOOK_API_URL}/hotel.json?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { 
          error: `Hotellook API error (${response.status})`,
          details: errorData?.message || response.statusText 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to Hotellook API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Hotellook API' },
      { status: 500 }
    );
  }
} 