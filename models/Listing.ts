import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  type: string;
  city: string;
  address: string;
  district: string;
  ownerId: mongoose.Types.ObjectId;
  pricePerDay: number;
  currency: string;
  amenities: string[];
  wifiSpeed: number;
  photos: string[];
  selfCheckIn: boolean;
  isVerified: boolean;
  reviews: mongoose.Types.ObjectId[];
  infrastructureScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pricePerDay: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    amenities: [String],
    wifiSpeed: Number,
    photos: [String],
    selfCheckIn: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    infrastructureScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);