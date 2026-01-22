import Amadeus from 'amadeus';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

// Cache Setup
// stdTTL: Default 1 hour (3600s) for searches
// checkperiod: Delete expired keys every 600s
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    hostname: process.env.AMADEUS_ENV === 'production' ? 'production' : 'test'
});

console.log(`Amadeus Service initialized in ${process.env.AMADEUS_ENV === 'production' ? 'PRODUCTION' : 'BETA/SANDBOX'} mode.`);

export const AmadeusService = {
    // Flight Search (Cached)
    searchFlights: async (params: any) => {
        try {
            // Create a unique cache key based on search parameters
            const cacheKey = `flights_${JSON.stringify(params)}`;
            const cachedData = cache.get(cacheKey);

            if (cachedData) {
                console.log('⚡ Using cached Flight data');
                return cachedData;
            }

            console.log('🌍 Fetching live Flight data from Amadeus...');
            const response = await amadeus.shopping.flightOffersSearch.get({
                originLocationCode: params.origin,
                destinationLocationCode: params.destination,
                departureDate: params.departureDate,
                returnDate: params.returnDate, // Optional for one-way
                adults: params.adults || 1,
                children: params.children || 0,
                infants: params.infants || 0,
                travelClass: params.travelClass, // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
                currencyCode: 'EUR',
                max: 20, // Limit results to save bandwidth
            });

            // Save to cache (TTL: 30 minutes for flights to keep prices relatively fresh)
            cache.set(cacheKey, response.data, 1800);
            return response.data;
        } catch (error) {
            console.error('Amadeus Flight Search Error:', error);
            throw error;
        }
    },

    // City Search (Autocomplete) - Cached Long Term
    searchCity: async (keyword: string) => {
        try {
            const cacheKey = `city_${keyword.toLowerCase()}`;
            const cachedData = cache.get(cacheKey);

            if (cachedData) {
                return cachedData;
            }

            const response = await amadeus.referenceData.locations.get({
                keyword,
                subType: Amadeus.location.any,
            });

            // Cities don't change often -> Cache for 24 hours
            cache.set(cacheKey, response.data, 86400);
            return response.data;
        } catch (error) {
            console.error('Amadeus City Search Error:', error);
            throw error;
        }
    },

    // Transfer Search (Future Phase)
    searchTransfers: async (params: any) => {
        try {
            // Note: Transfer API might be restricted in test environment or require specific payload
            const response = await amadeus.shopping.transferOffers.post({
                "startLocationCode": params.startLocationCode,
                "endLocationCode": params.endLocationCode, // Added support for IATA/City Code
                "startDateTime": params.startDateTime,
                "passengers": params.passengers,
                "transferType": "PRIVATE"
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Transfer Search Error:', error);
            throw error;
        }
    },

    // Flight Dates (Cheapest Date Search)
    searchFlightDates: async (params: any) => {
        try {
            // This endpoint finds the cheapest flight dates for a specific route
            const response = await amadeus.shopping.flightDates.get({
                origin: params.origin,
                destination: params.destination,
                // departureDate: params.departureDate, // Optional range
                oneWay: params.oneWay || true
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Flight Dates Error:', error);
            // Return empty array instead of throwing to prevent UI crash
            return [];
        }
    },


    // Flight Pricing (Verification) - NEVER CACHED
    // This is the "Live Check"
    confirmPrice: async (flightOffer: any) => {
        try {
            console.log('💰 Performing LIVE Price Check...');
            const response = await amadeus.shopping.flightOffers.pricing.post({
                'data': {
                    'type': 'flight-offers-pricing',
                    'flightOffers': [flightOffer]
                }
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Pricing Error:', error);
            throw error;
        }
    },

    // Hotel Search (V3 Workflow: City -> IDs -> Offers) - Cached
    searchHotels: async (cityCode: string, adults: number = 1, checkInDate?: string, ratings?: string[], amenities?: string[]) => {
        try {
            // Cache logic
            const cacheParams = { cityCode, adults, checkInDate, ratings, amenities };
            const cacheKey = `hotels_${JSON.stringify(cacheParams)}`;
            const cachedData = cache.get(cacheKey);

            if (cachedData) {
                console.log('⚡ Using cached Hotel data');
                return cachedData;
            }

            console.log(`[HotelSearch] Step 1: Finding hotels in ${cityCode} with filters...`, { ratings, amenities });

            // Step 1: Get list of hotels in the city with filters
            // Note: Hotel List by City is relatively static, could be cached separately but for now we cache the whole flow
            const params: any = {
                cityCode: cityCode,
            };

            if (ratings && ratings.length > 0) {
                params.ratings = ratings.join(','); // Amadeus expects "3,4,5"
            }

            if (amenities && amenities.length > 0) {
                // Common amenities mapping if needed, or pass through
                params.amenities = amenities.join(',');
            }

            const hotelsList = await amadeus.referenceData.locations.hotels.byCity.get(params);

            if (!hotelsList.data || hotelsList.data.length === 0) {
                console.warn(`[HotelSearch] No hotels found for city ${cityCode} with given filters.`);
                return [];
            }

            // Extract first 20 Hotel IDs (limit to avoid URL length issues)
            const hotelIds = hotelsList.data.slice(0, 20).map((h: any) => h.hotelId).join(',');
            console.log(`[HotelSearch] Step 2: Fetching offers for ${hotelsList.data.slice(0, 20).length} hotels...`);

            // Step 2: Get offers for these hotels (V3)
            const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
                hotelIds: hotelIds,
                adults: adults,
                checkInDate: checkInDate // Optional, defaults to today/tomorrow in API if missing
            });

            // Cache result for 30 minutes
            cache.set(cacheKey, offersResponse.data, 1800);
            return offersResponse.data;

        } catch (error: any) {
            console.error('Amadeus Hotel Search Error:', error?.response?.body || error);
            throw error;
        }
    },

    // Destination Experiences (Tours & Activities)
    searchActivities: async (latitude: number, longitude: number, radius: number = 5) => {
        try {
            // Points of Interest / Activities
            const response = await amadeus.shopping.activities.get({
                latitude,
                longitude,
                radius
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Activities Search Error:', error);
            // Return empty array on error to keep UI stable
            return [];
        }
    },

    // Market Insights (Safety & Location Score)
    getSafetyScore: async (latitude: number, longitude: number) => {
        try {
            const response = await amadeus.safety.safetyRatedLocations.get({
                latitude,
                longitude
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Safety Score Error:', error);
            // Return null or empty to indicate no data available
            return null;
        }
    },

    // Itinerary Management (Trip Parser)
    parseTrip: async (base64Content: string) => {
        try {
            // "fromFile" expects base64 encoded content of the booking email/PDF
            // Amadeus SDK method signature: amadeus.travel.tripParser.post(body)
            const response = await amadeus.travel.tripParser.post({
                payload: base64Content
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Trip Parser Error:', error);
            throw error;
        }
    }
};
