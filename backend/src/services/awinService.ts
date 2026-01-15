
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

export class AwinService {
    private static MOCK_HOTELS: HotelListing[] = [
        {
            id: 'h1',
            title: 'Grand Hyatt Berlin',
            description: 'Luxury hotel in the heart of Berlin featuring a spa, rooftop pool, and gourmet dining.',
            price: 250,
            currency: 'EUR',
            location: 'Berlin, Germany',
            rating: 4.8,
            reviews: 1240,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', // Valid Unsplash Image
            deepLink: 'https://www.booking.com/hotel/de/grand-hyatt-berlin.html', // Example deep link
            amenities: ['Spa', 'Pool', 'WiFi', 'Gym']
        },
        {
            id: 'h2',
            title: 'Hotel Adlon Kempinski',
            description: 'Legendary 5-star hotel next to the Brandenburg Gate. Historic charm meets modern luxury.',
            price: 380,
            currency: 'EUR',
            location: 'Berlin, Germany',
            rating: 4.9,
            reviews: 3500,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
            deepLink: 'https://www.booking.com/hotel/de/adlon-kempinski-berlin.html',
            amenities: ['Historic', 'Luxury', 'Fine Dining', 'Concierge']
        },
        {
            id: 'h3',
            title: 'Michelberger Hotel',
            description: 'Trendy, modern hotel in Friedrichshain. Known for its unique design and vibrant atmosphere.',
            price: 120,
            currency: 'EUR',
            location: 'Berlin, Germany',
            rating: 4.5,
            reviews: 890,
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
            deepLink: 'https://www.booking.com/hotel/de/michelberger.html',
            amenities: ['Trendy', 'Bar', 'Live Music', 'WiFi']
        },
        {
            id: 'h4',
            title: 'W Bali - Seminyak',
            description: 'Luxury beachfront resort with world-class amenities and stunning ocean views.',
            price: 450,
            currency: 'EUR',
            location: 'Bali, Indonesia',
            rating: 4.9,
            reviews: 2100,
            image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800',
            deepLink: 'https://www.booking.com/hotel/id/w-retreat-spa-bali.html',
            amenities: ['Beachfront', 'Pool', 'Spa', 'Nightclub']
        },
        {
            id: 'h5',
            title: 'Ubud Hanging Gardens',
            description: 'Iconic resort famous for its hanging infinity pools overlooking the rainforest.',
            price: 600,
            currency: 'EUR',
            location: 'Bali, Indonesia',
            rating: 4.9,
            reviews: 1500,
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800',
            deepLink: 'https://www.booking.com/hotel/id/ubud-hanging-gardens.html',
            amenities: ['Infinity Pool', 'Rainforest View', 'Spa', 'Privacy']
        }
    ];

    static async searchHotels(query: string = ""): Promise<HotelListing[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!query) {
            return this.MOCK_HOTELS;
        }

        const lowerQuery = query.toLowerCase();
        return this.MOCK_HOTELS.filter(hotel =>
            hotel.location.toLowerCase().includes(lowerQuery) ||
            hotel.title.toLowerCase().includes(lowerQuery)
        );
    }
}
