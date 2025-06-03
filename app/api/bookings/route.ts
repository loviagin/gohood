import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Booking from '@/models/Booking';
import connectDB from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role || (role !== 'landlord' && role !== 'tenant')) {
      return NextResponse.json(
        { error: 'Invalid role parameter' },
        { status: 400 }
      );
    }

    await connectDB();

    let bookings;
    if (role === 'landlord') {
      // For landlords, get bookings for their listings
      bookings = await Booking.find({ listingId: { $in: session.user.listings } })
        .populate('userId', 'name email')
        .populate('listingId', 'title images')
        .sort({ createdAt: -1 });
    } else {
      // For tenants, get their bookings
      bookings = await Booking.find({ userId: session.user.id })
        .populate('listingId', 'title images')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 