import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { name, phone, companyName, role } = await req.json();

        // Ensure MongoDB connection
        await connectDB();

        // Update user profile
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                name,
                phone,
                companyName,
                role,
                profileCompleted: true
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                companyName: user.companyName,
                role: user.role,
                profileCompleted: user.profileCompleted
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 