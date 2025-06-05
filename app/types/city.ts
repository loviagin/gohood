export interface District {
  name: string;
  rating: number;
  factors: string[];
}

export interface CityDocument {
  name: string;
  fullName: string;
  country: string;
  description: string;
  imageUrl: string;
  districts: District[];
  transportation?: {
    general: string;
    types: {
      name: string;
      description: string;
      paymentMethods: string[];
      tips: string;
    }[];
  };
  mobileOperators?: {
    name: string;
    description: string;
    hasESim: boolean;
    website: string;
  }[];
} 