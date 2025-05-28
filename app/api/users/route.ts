import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '../../../models/User';
import { verifyAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const authResult = await verifyAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Returns error response if token is invalid
    }

    await connectDB();
    
    const users = await User.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
