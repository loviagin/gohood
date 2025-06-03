import { format } from 'date-fns';

export interface SearchParams {
  location: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  adults?: number;
  children?: number[];
  currency?: string;
  lang?: string;
}

export interface HotelResult {
  id: number;
  name: string;
  stars: number;
  location: {
    country: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
  };
  price: {
    amount: number;
    currency: string;
  };
  rating: {
    score: number;
    reviews: number;
  };
  images: string[];
  amenities: string[];
  rooms: {
    type: string;
    capacity: number;
    beds: number;
  }[];
}

export async function searchHotels(params: SearchParams): Promise<HotelResult[]> {
  if (!params.location) {
    throw new Error('Location parameter is required');
  }

  if (!params.checkIn || !params.checkOut) {
    throw new Error('Check-in and check-out dates are required');
  }

  if (params.checkOut <= params.checkIn) {
    throw new Error('Check-out date must be after check-in date');
  }

  const searchParams = new URLSearchParams({
    location: params.location,
    checkIn: format(params.checkIn, 'yyyy-MM-dd'),
    checkOut: format(params.checkOut, 'yyyy-MM-dd'),
    guests: params.guests.toString(),
    currency: params.currency || 'RUB',
    lang: params.lang || 'ru',
  });

  try {
    const response = await fetch(`/api/hotels/search?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.details || errorData.error || `API error (${response.status})`
      );
    }

    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from API');
    }

    // Transform the API response to our HotelResult format
    return data.results.map((hotel: any) => {
      if (!hotel || typeof hotel !== 'object') {
        console.warn('Invalid hotel data received:', hotel);
        return null;
      }

      try {
        return {
          id: hotel.id,
          name: hotel.name || 'Название не указано',
          stars: Number(hotel.stars) || 0,
          location: {
            country: hotel.country || '',
            city: hotel.city || '',
            address: hotel.address || '',
            lat: Number(hotel.lat) || 0,
            lng: Number(hotel.lng) || 0,
          },
          price: {
            amount: Number(hotel.price) || 0,
            currency: hotel.currency || 'RUB',
          },
          rating: {
            score: Number(hotel.rating) || 0,
            reviews: Number(hotel.reviews_count) || 0,
          },
          images: Array.isArray(hotel.images) ? hotel.images : [],
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
          rooms: Array.isArray(hotel.rooms) ? hotel.rooms.map((room: any) => ({
            type: room.type || '',
            capacity: Number(room.capacity) || 0,
            beds: Number(room.beds) || 0,
          })) : [],
        };
      } catch (error) {
        console.error('Error transforming hotel data:', error, hotel);
        return null;
      }
    }).filter(Boolean) as HotelResult[];
  } catch (error) {
    console.error('Error searching hotels:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to search hotels: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while searching hotels');
  }
}

export async function getHotelDetails(hotelId: number, params: Omit<SearchParams, 'location'>): Promise<HotelResult> {
  const searchParams = new URLSearchParams({
    hotelId: hotelId.toString(),
    checkIn: format(params.checkIn, 'yyyy-MM-dd'),
    checkOut: format(params.checkOut, 'yyyy-MM-dd'),
    guests: params.guests.toString(),
    currency: params.currency || 'RUB',
    lang: params.lang || 'ru',
  });

  try {
    const response = await fetch(`/api/hotels/details?${searchParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.details || errorData.error || `API error (${response.status})`
      );
    }

    const data = await response.json();
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API');
    }

    return {
      id: data.id,
      name: data.name || 'Название не указано',
      stars: Number(data.stars) || 0,
      location: {
        country: data.country || '',
        city: data.city || '',
        address: data.address || '',
        lat: Number(data.lat) || 0,
        lng: Number(data.lng) || 0,
      },
      price: {
        amount: Number(data.price) || 0,
        currency: data.currency || 'RUB',
      },
      rating: {
        score: Number(data.rating) || 0,
        reviews: Number(data.reviews_count) || 0,
      },
      images: Array.isArray(data.images) ? data.images : [],
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      rooms: Array.isArray(data.rooms) ? data.rooms.map((room: any) => ({
        type: room.type || '',
        capacity: Number(room.capacity) || 0,
        beds: Number(room.beds) || 0,
      })) : [],
    };
  } catch (error) {
    console.error('Error fetching hotel details:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch hotel details: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while fetching hotel details');
  }
} 