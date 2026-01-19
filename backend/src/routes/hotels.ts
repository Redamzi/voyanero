
import { Router } from 'express';

import { AmadeusService } from '../services/amadeusService';

const router = Router();

router.get('/search', async (req, res) => {
    try {
        const { location, adults, checkIn } = req.query;
        // Default to 'MUC' if no location provided, generic fallback
        let cityCode = (location as string) || 'MUC';

        // Auto-resolve non-IATA locations (e.g. "Bali" -> "DPS")
        if (cityCode.length !== 3) {
            console.log(`Resolving location name: ${cityCode}...`);
            const citySearch = await AmadeusService.searchCity(cityCode);
            if (citySearch && citySearch.length > 0) {
                cityCode = citySearch[0].iataCode;
                console.log(`Resolved ${location} to IATA: ${cityCode}`);
            } else {
                console.warn(`Could not resolve location: ${cityCode}`);
            }
        }


        console.log(`Searching hotels via Amadeus for: ${cityCode}`);

        // Extract filters
        const ratings = req.query.ratings ? (req.query.ratings as string).split(',') : undefined;
        const amenities = req.query.amenities ? (req.query.amenities as string).split(',') : undefined;

        const amadeusData = await AmadeusService.searchHotels(
            cityCode,
            parseInt(adults as string) || 1,
            checkIn as string,
            ratings,
            amenities
        );

        // Map Amadeus V3 response to frontend-friendly format
        // Amadeus V3 returns [{ hotel: {...}, offers: [...] }]
        const hotels = amadeusData.map((item: any) => {
            const offer = item.offers?.[0]; // Grab first offer
            return {
                id: item.hotel?.hotelId,
                name: item.hotel?.name,
                description: item.hotel?.description?.text || 'Keine Beschreibung verfügbar',
                // Fallback image since Amadeus often doesn't provide them in base search
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
                price: offer?.price?.total || '0',
                currency: offer?.price?.currency || 'EUR',
                rating: item.hotel?.rating || '4',
                location: item.hotel?.address?.cityName || cityCode,
                deepLink: '#', // TODO: Generate booking link or modal trigger
                amenities: item.hotel?.amenities || ['WLAN', 'Bar']
            };
        });

        res.json({ success: true, hotels });
    } catch (error) {
        console.error('Error fetching hotels:', error);
        // Return empty list instead of 500 to keep UI alive (fallback needed?)
        res.json({ success: false, hotels: [], error: 'Amadeus Search Failed' });
    }
});

export default router;
