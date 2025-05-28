import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '../../../models/User';

export async function GET() {
  try {
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
