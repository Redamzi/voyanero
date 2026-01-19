
import { Listing, ListingType, PropertyType } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const HotelService = {
    searchHotels: async (query: string, adults: number = 1, date?: string): Promise<Listing[]> => {
        try {
            // Robustly handle API URL (ensure /api suffix)
            const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL : `${API_BASE_URL}/api`;
            const queryParams = new URLSearchParams({
                location: query,
                adults: adults.toString(),
                checkIn: date || ''
            });
            const response = await fetch(`${baseUrl}/hotels/search?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch hotels');

            const data = await response.json();
            if (data.success && data.hotels) {
                return data.hotels.map((hotel: any) => ({
                    id: hotel.id,
                    title: hotel.name,
                    description: hotel.description,
                    type: ListingType.AFFILIATE,
                    propertyType: PropertyType.HOTEL,
                    price: parseInt(hotel.price),
                    location: {
                        address: hotel.location,
                        lat: 0,
                        lng: 0
                    },
                    images: [hotel.image],
                    amenities: ["Hotel", "Awin Partner"],
                    rating: hotel.rating,
                    reviewCount: 100,
                    maxGuests: 2,
                    affiliateUrl: hotel.deepLink
                }));
            }
            return [];
        } catch (error) {
            console.error("Hotel Search Error:", error);
            return [];
        }
    }
};
