import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

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
    }
};
