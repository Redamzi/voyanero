import axios from 'axios';

const API_URL = 'https://api.travelpayouts.com/v1/prices';
const TOKEN = process.env.TRAVELPAYOUTS_API_TOKEN;
const MARKER = process.env.TRAVELPAYOUTS_MARKER_ID;

interface SearchParams {
    origin: string;
    destination: string;
    date: string; // YYYY-MM-DD
    adults?: number;
    children?: number;
    infants?: number;
}

export const TravelpayoutsService = {
    // Helper to resolve City/Airport to IATA
    getIataCode: async (term: string): Promise<string> => {
        if (term.length === 3) return term.toUpperCase();
        try {
            const response = await axios.get(`https://autocomplete.travelpayouts.com/places2`, {
                params: {
                    term,
                    locale: 'de',
                    types: ['city', 'airport']
                }
            });
            if (response.data && response.data.length > 0) {
                return response.data[0].code;
            }
            return term; // Fallback
        } catch (e) {
            console.error("IATA lookup failed for:", term);
            return term;
        }
    },

    // Data Access API v1 - Cheapest Tickets
    search: async (params: SearchParams) => {
        if (!TOKEN) throw new Error("Missing API Token");

        // Resolve IATA codes
        const originCode = await TravelpayoutsService.getIataCode(params.origin);
        const destCode = await TravelpayoutsService.getIataCode(params.destination);

        console.log(`Searching flights: ${originCode} -> ${destCode}`);

        // Extract year-month from date (e.g., "2026-01-29" -> "2026-01")
        // API v1 supports exact dates too, but /cheap aligns better with monthly cache. 
        // Let's try passing full date if supported or stick to month.
        // Documentation says /cheap uses depart_date (YYYY-MM or YYYY-MM-DD).
        const departDate = params.date;

        try {
            const response = await axios.get(`${API_URL}/cheap`, {
                params: {
                    origin: originCode,
                    destination: destCode,
                    depart_date: departDate,
                    currency: 'EUR'
                },
                headers: {
                    'X-Access-Token': TOKEN
                }
            });

            // Transform response to include marker for affiliate links
            const data = response.data;
            if (data.success && data.data) {
                // Determine the correct key for destination (API returns { "DPS": { ... } })
                const flightData = data.data[destCode] || {};

                return {
                    success: true,
                    flights: Object.values(flightData).map((flight: any) => ({
                        ...flight,
                        marker: MARKER,
                        destination: destCode, // Ensure destination is in result
                        origin: originCode
                    }))
                };
            }

            return { success: false, flights: [] };
        } catch (error) {
            // @ts-ignore
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                console.warn("Travelpayouts 400: Likely invalid route or date.");
                return { success: false, flights: [] };
            }
            console.error("Travelpayouts API Error:", error);
            throw error;
        }
    },

    // Not needed for Data Access API
    getSearchResults: async (searchUuid: string) => {
        return [];
    }
};
