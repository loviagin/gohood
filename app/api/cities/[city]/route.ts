import { NextResponse } from 'next/server';
import { getCityInfo } from '../../../services/cities';

export async function GET(
  request: Request,
  context: { params: Promise<{ city: string }> }
) {
  try {
    const { city } = await context.params;
    const cityName = decodeURIComponent(city);
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