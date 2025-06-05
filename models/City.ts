import mongoose, { Schema, Document } from 'mongoose';

// Интерфейс для данных города без методов Mongoose
export interface CityData {
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
  transportation: {
    types: Array<{
      name: string;
      description: string;
      paymentMethods: string[];
      tips: string;
    }>;
    generalInfo: string;
  };
  mobileOperators: Array<{
    name: string;
    website: string;
    hasESim: boolean;
    description: string;
  }>;
  districts: Array<{
    name: string;
    population: number;
    demographics: {
      white: number;
      african: number;
      other: number;
    };
    safety: {
      daytime: number;
      nighttime: number;
    };
    transport: {
      score: number;
      description: string;
    };
    network: {
      coverage: number;
      description: string;
    };
    tourism: {
      popularity: number;
      description: string;
    };
    rating: {
      score: number;
      factors: string[];
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CityDocument extends Document, CityData {}

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
  },
  transportation: {
    types: [{
      name: String,
      description: String,
      paymentMethods: [String],
      tips: String
    }],
    generalInfo: String
  },
  mobileOperators: [{
    name: String,
    website: String,
    hasESim: Boolean,
    description: String
  }],
  districts: [{
    name: String,
    population: Number,
    demographics: {
      white: Number,
      african: Number,
      other: Number
    },
    safety: {
      daytime: Number,
      nighttime: Number
    },
    transport: {
      score: Number,
      description: String
    },
    network: {
      coverage: Number,
      description: String
    },
    tourism: {
      popularity: Number,
      description: String
    },
    rating: {
      score: Number,
      factors: [String]
    }
  }]
}, {
  timestamps: true // Автоматически добавляет createdAt и updatedAt
});

// Создаем модель только если она еще не существует
export const City = mongoose.models.City || mongoose.model<CityDocument>('City', citySchema); 