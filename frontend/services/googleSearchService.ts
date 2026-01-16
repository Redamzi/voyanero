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
        if (!GOOGLE_API_KEY || !GOOGLE_CX) {
            console.warn("Google Search API credentials missing. Check your .env setup.");
            return [];
        }
        console.log(`Executing Google Search for: ${query} (CX: ${GOOGLE_CX})`);

        // 1. Check Daily Limit (Client-side implementation)
        const today = new Date().toISOString().split('T')[0]; // "2024-01-16"
        const storageKey = `google_search_count_${today}`;
        const currentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

        if (currentCount >= DAILY_LIMIT) {
            console.log(`Daily Google Search limit reached (${currentCount}/${DAILY_LIMIT}).`);
            return [];
        }

        try {
            // 2. Perform Search
            // We search for "travel [query]" to ensure relevance
            const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=travel+${encodeURIComponent(query)}&searchType=image&num=4`;

            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 429) {
                    // Quota exceeded signal
                    localStorage.setItem(storageKey, DAILY_LIMIT.toString());
                }
                throw new Error(`Google API Error: ${response.statusText}`);
            }

            const data = await response.json();

            // 3. Increment Counter
            localStorage.setItem(storageKey, (currentCount + 1).toString());

            console.log(`Google Search found ${data.items ? data.items.length : 0} items.`);

            if (!data.items) return [];

            // 4. Map to Listings
            return data.items.map((item: GoogleSearchItem, index: number) => ({
                id: `google-${Date.now()}-${index}`,
                title: `Web: ${item.title}`,
                description: item.snippet,
                type: ListingType.AFFILIATE, // Treat as external link
                propertyType: PropertyType.HOTEL, // Generic fallback
                price: 0, // Google results usually don't have structured price
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
            // Check if it's an API key restriction error (403)
            // @ts-ignore
            if (error.message?.includes("403")) {
                console.warn("Google API 403 Forbidden. Check Domain Restrictions in Cloud Console.");
            }
            return [];
        }
    }
};
