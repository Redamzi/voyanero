import { Listing, ListingType, PropertyType } from '../types';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '';
const GOOGLE_CX = process.env.NEXT_PUBLIC_GOOGLE_CX || '';
const DAILY_LIMIT = 70;

interface GoogleSearchItem {
    title: string;
    link: string;
    snippet: string;
    pagemap?: {
        cse_image?: { src: string }[];
    };
}

export const GoogleSearchService = {
    async search(query: string): Promise<Listing[]> {
        // SSR Guard: Return empty if running on server
        if (typeof window === 'undefined') {
            return [];
        }

        if (!GOOGLE_API_KEY || !GOOGLE_CX) {
            console.error("Google Search API credentials missing.");
            return [];
        }

        // 1. Check Daily Limit (Client-side implementation)
        const today = new Date().toISOString().split('T')[0];
        const storageKey = `google_search_count_${today}`;
        const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

        if (currentCount >= DAILY_LIMIT) {
            return [];
        }

        try {
            // 2. Perform Search
            const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=travel+${encodeURIComponent(query)}&searchType=image&num=4`;

            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 429) {
                    // Quota exceeded signal
                    localStorage.setItem(storageKey, DAILY_LIMIT.toString());
                }
                throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // 3. Increment Counter
            localStorage.setItem(storageKey, (currentCount + 1).toString());

            if (!data.items) return [];

            // 4. Map to Listings
            return data.items.map((item: GoogleSearchItem, index: number) => ({
                id: `google-${Date.now()}-${index}`,
                title: `Web: ${item.title}`,
                description: item.snippet,
                type: ListingType.AFFILIATE, // Treat as external link
                propertyType: PropertyType.HOTEL, // Generic fallback
                price: 0,
                location: {
                    address: "Google Search Result",
                    lat: 0,
                    lng: 0
                },
                images: item.pagemap?.cse_image?.[0]?.src ? [item.pagemap.cse_image[0].src] : ['https://via.placeholder.com/800x600?text=Google+Result'],
                amenities: ["Web Search", "External"],
                rating: 0,
                reviewCount: 0,
                maxGuests: 0,
                affiliateUrl: item.link
            }));

        } catch (error) {
            console.error("Google Search failed:", error);
            return [];
        }
    }
};
