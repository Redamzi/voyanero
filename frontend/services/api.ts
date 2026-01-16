
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

// Use environment variable for API URL, fallback to localhost for local dev
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/flights';

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
                "Rome": "FCO",
                "Paris": "PAR",
                "Tokyo": "TYO",
                "Bangkok": "BKK",
                "Istanbul": "IST",
                "Mein Standort": "FRA" // Default to FRA for testing locate me
            };

            const origin = iataMap[params.origin] || params.origin || "MUC";
            const destination = iataMap[params.destination] || params.destination;

            const payload = {
                origin: origin,
                destination: destination,
                date: params.date,
                returnDate: params.return_date,
                adults: params.adults || 1,
                children: params.children || 0,
                infants: params.infants || 0,
                travelClass: params.trip_class
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

            const result = await response.json();
            return result.data; // Backend returns { success: true, data: [...] }
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

export const TransferService = {
    searchTransfers: async (params: {
        startLocationCode: string;
        endLocationCode: string;
        startDateTime: string;
        passengers: number
    }) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/transfers/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error("Transfer Search Error:", error);
            throw error;
        }
    }
};
