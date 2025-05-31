import mongoose, { Schema, Document } from 'mongoose';

export interface CityDocument extends Document {
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  description: string;
  imageUrl: string;
  details: {
    population?: number;
    language?: string;
    currency?: string;
    timezone?: string;
    bestTimeToVisit?: string;
    averageTemperature?: {
      summer?: number;
      winter?: number;
    };
    attractions?: string[];
    localCuisine?: string[];
  };
  location: {
    lat?: number;
    lng?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const citySchema = new Schema<CityDocument>({
  name: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  country: { type: String, required: true },
  countryCode: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  details: {
    population: Number,
    language: String,
    currency: String,
    timezone: String,
    bestTimeToVisit: String,
    averageTemperature: {
      summer: Number,
      winter: Number
    },
    attractions: [String],
    localCuisine: [String]
  },
  location: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true // Автоматически добавляет createdAt и updatedAt
});

// Создаем модель только если она еще не существует
export const City = mongoose.models.City || mongoose.model<CityDocument>('City', citySchema); 