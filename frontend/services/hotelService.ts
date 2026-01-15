
export interface HotelListing {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    location: string;
    rating: number;
    reviews: number;
    image: string;
    deepLink: string;
    amenities: string[];
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/hotels';

export const HotelService = {
    searchHotels: async (location: string): Promise<HotelListing[]> => {
        try {
            const params = new URLSearchParams({ location });
            const response = await fetch(`${API_BASE_URL}/search?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Hotel API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Hotel Search Error:", error);
            // Fallback to empty array so UI doesn't crash
            return [];
        }
    }
};
