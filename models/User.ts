import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash?: string;
  role: 'user' | 'admin' | 'tenant' | 'landlord';
  phone?: string;
  avatar?: string;
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  companyName?: string;
  profileCompleted: boolean;
  verifiedTenant: boolean;
  verifiedLandlord: boolean;
  googleId?: string;
  yandexId?: string;
  vkId?: string;
  appleId?: string;
  listings: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    passwordHash: {
      type: String,
      required: false,
      validate: {
        validator: function(this: IUser, value: string) {
          // If any social login ID is present, password is not required
          if (this.googleId || this.yandexId || this.vkId || this.appleId) {
            return true;
          }
          // For non-social login, password is required
          return value !== undefined && value !== null && value !== '';
        },
        message: 'Password is required for non-social login users'
      }
    },
    role: { type: String, enum: ['user', 'admin', 'tenant', 'landlord'], default: 'user' },
    phone: { type: String, required: false },
    avatar: { type: String, required: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    companyName: String,
    profileCompleted: { type: Boolean, default: false },
    googleId: String,
    yandexId: String,
    vkId: String,
    appleId: String,
    verifiedTenant: { type: Boolean, default: false },
    verifiedLandlord: { type: Boolean, default: false },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }]
  },
  { timestamps: true }
);

// Update the updatedAt timestamp before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);