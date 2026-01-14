
interface FlightSearchParams {
    origin: string;
    destination: string;
    date: string; // YYYY-MM-DD
    return_date?: string;
    adults?: number;
    children?: number;
    infants?: number;
    trip_class?: string; // Y or C
}

const API_BASE_URL = 'http://localhost:8000/api/flights';

export const FlightService = {
    searchFlights: async (params: FlightSearchParams) => {
        try {
            // Transform frontend params to backend structure
            // Note: origin/destination might need IATA code resolution if they are full names.
            // For now, we assume the frontend passes city names which the API might accept or we need a lookup step.
            // Aviasales API usually requires IATA codes (e.g., BER, PAR).
            // We will need an Autocomplete step later. For now, let's pass them as is or try to map known ones temporarily.

            // Temporary IATA mapping for demo locations from SearchMask DESTINATIONS
            const iataMap: { [key: string]: string } = {
                "Bali": "DPS",
                "Berlin": "BER",
                "Rome": "ROM",
                "Paris": "PAR",
                "Tokyo": "TYO",
                "Mein Standort": "FRA" // Default to FRA for testing locate me
            };

            const origin = "MUC"; // Default origin Munich for now
            const destination = iataMap[params.destination] || params.destination;

            const payload = {
                segments: [
                    {
                        origin: origin,
                        destination: destination,
                        date: params.date
                    }
                ],
                passengers: {
                    adults: params.adults || 1,
                    children: params.children || 0,
                    infants: params.infants || 0
                },
                trip_class: params.trip_class || "Y"
            };

            const response = await fetch(`${API_BASE_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Flight Search Error:", error);
            throw error;
        }
    },

    getSearchResults: async (uuid: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/results/${uuid}`);
            if (!response.ok) {
                throw new Error("Failed to fetch results");
            }
            return await response.json();
        } catch (error) {
            console.error("Flight Results Error:", error);
            throw error;
        }
    }
};
