import { NextRequest, NextResponse } from 'next/server';
import { City } from '@/models/City';
import connectDB from '@/lib/db';
import { verifyAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const authResult = await verifyAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Returns error response if token is invalid
  }

  try {
    await connectDB();
    const cities = await City.find().select('-__v');
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
