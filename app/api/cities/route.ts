import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://engine.hotellook.com/api/v2/lookup.json?query=${encodeURIComponent(query)}&lang=ru&lookFor=city`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch city suggestions');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city suggestions' },
      { status: 500 }
    );
  }
} 