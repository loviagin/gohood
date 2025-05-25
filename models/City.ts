import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  country: string;
  description?: string;
  guide?: string; // гайд для новичков, ссылки и т.д.
  mainPhoto?: string;
  infrastructureData?: Record<string, any>; // тут могут быть summary по транспорту и т.д.
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: String,
  guide: String,
  mainPhoto: String,
  infrastructureData: Object
});

export default mongoose.models.City || mongoose.model<ICity>('City', CitySchema);