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
    // Data Access API v1 - Cheapest Tickets
    search: async (params: SearchParams) => {
        if (!TOKEN) throw new Error("Missing API Token");

        // Extract year-month from date (e.g., "2026-01-29" -> "2026-01")
        const departDate = params.date.substring(0, 7); // YYYY-MM

        try {
            const response = await axios.get(`${API_URL}/cheap`, {
                params: {
                    origin: params.origin,
                    destination: params.destination,
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
                return {
                    success: true,
                    flights: Object.values(data.data).flatMap((dest: any) =>
                        Object.values(dest).map((flight: any) => ({
                            ...flight,
                            marker: MARKER
                        }))
                    )
                };
            }

            return { success: false, flights: [] };
        } catch (error) {
            console.error("Travelpayouts API Error:", error);
            throw error;
        }
    },

    // Not needed for Data Access API
    getSearchResults: async (searchUuid: string) => {
        // Data Access API returns results immediately, no polling needed
        return [];
    }
};
