import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/jwt';
import UserModel from '@/models/User';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        // Get JWT token from Authorization header
        const authResult = await verifyAuth(request);
        if (authResult instanceof NextResponse) {
            return authResult; // Returns error response if token is invalid
        }

        // Get userId from request body
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Validate if the user to be deleted exists
        if (!Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        const userToDelete = await UserModel.findById(userId);
        if (!userToDelete) {
            return NextResponse.json(
                { error: 'User to delete not found' },
                { status: 404 }
            );
        }

        // Delete the user
        await UserModel.findByIdAndDelete(userId);

        return NextResponse.json(
            { message: 'User successfully deleted' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 