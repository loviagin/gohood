import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        const { email, password, role } = await req.json();
        console.log('Registration attempt for:', email);

        // Validate input
        if (!email || !password) {
            console.log('Validation failed: missing email or password');
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Ensure MongoDB connection
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already EXISTS:', email);
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }
        console.log('NOT EXISTS:');
        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create new user
        try {
            const user = await User.create({
                email,
                passwordHash,
                role: role || 'landlord',
                profileCompleted: false
            });

            console.log('User created successfully:', email);

            // Remove password hash from response
            const { passwordHash: _, ...userWithoutPassword } = user.toObject();

            return NextResponse.json(
                { message: 'User created successfully', user: userWithoutPassword },
                { status: 201 }
            );
        } catch (createError) {
            console.error('Error creating user:', createError);
            if (createError instanceof mongoose.Error.ValidationError) {
                return NextResponse.json(
                    { error: 'Validation error: ' + Object.values(createError.errors).map(e => e.message).join(', ') },
                    { status: 400 }
                );
            }
            throw createError;
        }
    } catch (error) {
        console.error('Registration error details:', error);
        return NextResponse.json(
            { error: 'Error creating user: ' + (error instanceof Error ? error.message : 'Unknown error') },
            { status: 500 }
        );
    }
} 