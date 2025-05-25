import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  listingId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  text: string;
  read: boolean;
  sentAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);