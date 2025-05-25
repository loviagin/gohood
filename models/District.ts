import mongoose, { Schema, Document } from 'mongoose';

export interface IDistrict extends Document {
  cityId: mongoose.Types.ObjectId;
  name: string;
  safetyScore?: number;      // Оценка безопасности
  quietnessScore?: number;   // Оценка тишины
  wifiAvg?: number;          // Средняя скорость интернета
  infrastructure?: Record<string, any>; // магазины, спорт, транспорт и т.д.
  description?: string;
  photo?: string;
}

const DistrictSchema = new Schema<IDistrict>({
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  name: { type: String, required: true },
  safetyScore: Number,
  quietnessScore: Number,
  wifiAvg: Number,
  infrastructure: Object,
  description: String,
  photo: String
});

export default mongoose.models.District || mongoose.model<IDistrict>('District', DistrictSchema);