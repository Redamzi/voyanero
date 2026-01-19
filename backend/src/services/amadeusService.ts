import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    hostname: process.env.AMADEUS_ENV === 'production' ? 'production' : 'test'
});

console.log(`Amadeus Service initialized in ${process.env.AMADEUS_ENV === 'production' ? 'PRODUCTION' : 'BETA/SANDBOX'} mode.`);

export const AmadeusService = {
    // Flight Search
    searchFlights: async (params: any) => {
        try {
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
                max: 20, // Limit results
            });
            return response.data;
        } catch (error) {
            console.error('Amadeus Flight Search Error:', error);
            throw error;
        }
    },

    // City Search (Autocomplete)
    searchCity: async (keyword: string) => {
        try {
            const response = await amadeus.referenceData.locations.get({
                keyword,
                subType: Amadeus.location.any,
            });
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


    // Flight Pricing (Verification)
    confirmPrice: async (flightOffer: any) => {
        try {
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

    // Hotel Search (V3 Workflow: City -> IDs -> Offers)
    searchHotels: async (cityCode: string, adults: number = 1, checkInDate?: string) => {
        try {
            console.log(`[HotelSearch] Step 1: Finding hotels in ${cityCode}...`);

            // Step 1: Get list of hotels in the city
            const hotelsList = await amadeus.referenceData.locations.hotels.byCity.get({
                cityCode: cityCode
            });

            if (!hotelsList.data || hotelsList.data.length === 0) {
                console.warn(`[HotelSearch] No hotels found for city ${cityCode}`);
                return [];
            }

            // Extract first 10-20 Hotel IDs (limit to avoid URL length issues)
            const hotelIds = hotelsList.data.slice(0, 20).map((h: any) => h.hotelId).join(',');
            console.log(`[HotelSearch] Step 2: Fetching offers for ${hotelsList.data.slice(0, 20).length} hotels...`);

            // Step 2: Get offers for these hotels (V3)
            const offersResponse = await amadeus.shopping.hotelOffersSearch.get({
                hotelIds: hotelIds,
                adults: adults,
                checkInDate: checkInDate // Optional, defaults to today/tomorrow in API if missing
            });

            return offersResponse.data;

        } catch (error: any) {
            console.error('Amadeus Hotel Search Error:', error?.response?.body || error);

            // Fallback: If 2-step fails, try returning an empty array or mock (handled in controller)
            // But log the specific Amadeus error for debugging
            throw error;
        }
    }
};
