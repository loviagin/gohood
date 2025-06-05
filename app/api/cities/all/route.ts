import { NextResponse } from 'next/server';
import { City } from '@/models/City';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    await connectDB();
    
    const cities = await City.find({})
      .sort({ name: 1 });

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching all cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}
