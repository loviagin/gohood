import { NextRequest, NextResponse } from 'next/server';
import { getCityInfo } from '../../../services/cities';

export async function GET(
  request: NextRequest,
  { params }: { params: { city: string } }
) {
  try {
    // Await the params to ensure they are resolved
    const cityName = await Promise.resolve(params.city);
    const cityInfo = await getCityInfo(cityName);
    return NextResponse.json(cityInfo);
  } catch (error) {
    console.error('Error fetching city info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city information' },
      { status: 500 }
    );
  }
} 