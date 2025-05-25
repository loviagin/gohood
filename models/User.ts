import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash: string;
  role: 'user' | 'admin' | 'owner' | 'landlord';
  phone?: string;
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  companyName?: string;
  profileCompleted: boolean;
  googleId?: string;
  vkId?: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    passwordHash: {
      type: String,
      required: function() {
        return !this.googleId && !this.vkId; // Required only for email/password auth
      }
    },
    role: { type: String, enum: ['user', 'admin', 'owner', 'landlord'], default: 'user' },
    phone: { type: String, required: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    companyName: String,
    profileCompleted: { type: Boolean, default: false },
    googleId: String,
    vkId: String
  },
  { timestamps: true }
);

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);