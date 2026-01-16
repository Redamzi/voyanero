import axios from 'axios';
import csv from 'csv-parser';
import { Readable } from 'stream';

const AWIN_FEED_URL = process.env.AWIN_FEED_URL;
const AWIN_API_TOKEN = process.env.AWIN_API_TOKEN;

export interface AwinHotelConfig {
    merchantId: string;
    affiliateId: string;
}

// Fallback Mock Data (High Quality)
const MOCK_HOTELS = [
    {
        id: 'awin-mock-1',
        name: 'Grand Hyatt Bali',
        description: 'Luxusresort direkt am Strand von Nusa Dua. Erleben Sie balinesische Gastfreundschaft in Perfektion.',
        price: '245',
        currency: 'EUR',
        deepLink: 'https://www.booking.com/searchresults.html?ss=Grand+Hyatt+Bali',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
        rating: 4.8,
        location: 'Nusa Dua, Bali'
    },
    {
        id: 'awin-mock-2',
        name: 'Ubud Hanging Gardens',
        description: 'Iconic Infinity Pool mitten im Dschungel. Ein unvergessliches Erlebnis für Paare und Ruhesuchende.',
        price: '450',
        currency: 'EUR',
        deepLink: 'https://www.booking.com/searchresults.html?ss=Hanging+Gardens+Ubud',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
        rating: 4.9,
        location: 'Ubud, Bali'
    },
    {
        id: 'awin-mock-3',
        name: 'Hard Rock Hotel Bali',
        description: 'Das führende Entertainment-Hotel in Kuta. Spaß für die ganze Familie mit riesigem Pool.',
        price: '120',
        currency: 'EUR',
        deepLink: 'https://www.booking.com/searchresults.html?ss=Hard+Rock+Hotel+Bali',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
        rating: 4.5,
        location: 'Kuta, Bali'
    },
    {
        id: 'awin-mock-4',
        name: 'The St. Regis Bali Resort',
        description: 'Exquisite Suiten und Villen am Strand. Ein Inbegriff von Luxus und Eleganz.',
        price: '680',
        currency: 'EUR',
        deepLink: 'https://www.booking.com/searchresults.html?ss=The+St+Regis+Bali+Resort',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
        rating: 5.0,
        location: 'Nusa Dua, Bali'
    }
];

export const AwinService = {
    searchHotels: async (query: string) => {
        // 1. If no feed URL, return Mock Data (for MVP/Testing/Fallback)
        if (!AWIN_FEED_URL) {
            console.log(`[AwinService] No Feed URL configured. Returning ${MOCK_HOTELS.length} mock hotels for query: ${query}`);
            // Filter mocks roughly by query if needed, or just return all for showcase
            return {
                success: true,
                hotels: MOCK_HOTELS.map(h => ({
                    ...h,
                    source: 'awin-mock'
                }))
            };
        }

        // 2. Stream Data from Awin Feed (Future: Cache this!)
        console.log(`[AwinService] Fetching feed from ${AWIN_FEED_URL}...`);
        const results: any[] = [];

        try {
            const response = await axios.get(AWIN_FEED_URL, {
                responseType: 'stream'
            });

            // Parse Stream
            // Note: This scans the huge feed on every request. 
            // TODO: Move this to a CRON job that updates a local DB/Cache.
            const stream = response.data.pipe(csv());

            return new Promise((resolve, reject) => {
                stream
                    .on('data', (data: any) => {
                        // Basic filtering logic (very rough for CSV)
                        // Adjust keys based on actual CSV headers (e.g. 'product_name', 'merchant_category')
                        const name = data.product_name || data.name || '';
                        const desc = data.description || '';
                        const loc = data.merchant_category || '';

                        if (
                            name.toLowerCase().includes(query.toLowerCase()) ||
                            loc.toLowerCase().includes(query.toLowerCase())
                        ) {
                            if (results.length < 20) { // Limit results per request
                                results.push({
                                    id: data.aw_product_id || Math.random().toString(),
                                    name: name,
                                    description: desc.substring(0, 150) + '...',
                                    price: data.search_price || data.price || '0',
                                    currency: data.currency || 'EUR',
                                    deepLink: data.aw_deep_link || data.merchant_deep_link,
                                    image: data.merchant_image_url || data.image_url,
                                    rating: 4.5, // Feed rarely has ratings, default to good
                                    location: data.merchant_category || 'Hotels',
                                    source: 'awin-feed'
                                });
                            }
                        }
                    })
                    .on('end', () => {
                        console.log(`[AwinService] Found ${results.length} matches in feed.`);
                        resolve({ success: true, hotels: results });
                    })
                    .on('error', (err: any) => {
                        console.error("[AwinService] CSV Parse Error:", err);
                        // Fallback to mock on crash?
                        resolve({ success: true, hotels: MOCK_HOTELS });
                    });
            });

        } catch (error) {
            console.error("[AwinService] Feed Fetch Error:", error);
            // Fallback to mock
            return { success: true, hotels: MOCK_HOTELS };
        }
    }
};
