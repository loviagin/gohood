import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Listing from '@/models/Listing';
import User from '@/models/User';
import { writeFile } from 'fs/promises';
import path from 'path';

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  return `${nameWithoutExt}-${timestamp}-${random}${extension}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const data = JSON.parse(formData.get('data') as string);
    const mainPhoto = formData.get('mainPhoto') as File;
    if (!mainPhoto) {
      return NextResponse.json({ error: 'Главное фото обязательно' }, { status: 400 });
    }
    const photos = formData.getAll('photos') as File[];
    const floorPlan = formData.get('floorPlan') as File;

    // Check for required district field
    if (!data.district || !data.district.trim()) {
      return NextResponse.json({ error: 'Поле "Район" обязательно для заполнения' }, { status: 400 });
    }

    // Save main photo
    const mainPhotoBuffer = await mainPhoto.arrayBuffer();
    const mainPhotoName = generateUniqueFileName(mainPhoto.name);
    const mainPhotoPath = path.join(process.cwd(), 'public', 'uploads', 'listings', mainPhotoName);
    await writeFile(mainPhotoPath, Buffer.from(mainPhotoBuffer));
    const mainPhotoUrl = `/uploads/listings/${mainPhotoName}`;

    // Save additional photos
    const photoUrls = await Promise.all(
      photos.map(async (photo) => {
        const buffer = await photo.arrayBuffer();
        const fileName = generateUniqueFileName(photo.name);
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'listings', fileName);
        await writeFile(filePath, Buffer.from(buffer));
        return `/uploads/listings/${fileName}`;
      })
    );

    // Save floor plan if exists
    let floorPlanUrl = null;
    if (floorPlan) {
      const floorPlanBuffer = await floorPlan.arrayBuffer();
      const floorPlanName = generateUniqueFileName(floorPlan.name);
      const floorPlanPath = path.join(process.cwd(), 'public', 'uploads', 'listings', floorPlanName);
      await writeFile(floorPlanPath, Buffer.from(floorPlanBuffer));
      floorPlanUrl = `/uploads/listings/${floorPlanName}`;
    }

    // Map form fields to Listing schema
    const listingData = {
      ...data,
      ownerId: user._id,
      mainPhoto: mainPhotoUrl,
      photos: photoUrls,
      floorPlan: floorPlanUrl,
      type: data.category, // category -> type
      pricePerDay: data.priceType === 'per_night' ? data.price : undefined,
      pricePerMonth: data.priceType === 'per_month' ? data.price : undefined,
      // district is already present in data
    };

    // Create listing
    const listing = await Listing.create(listingData);

    // Update user's listings
    await User.findByIdAndUpdate(user._id, {
      $push: { listings: listing._id }
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Error creating listing' },
      { status: 500 }
    );
  }
} 