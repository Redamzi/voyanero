
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

            // Enhanced IATA mapping (Temporary solution until Autocomplete is implemented)
            // Maps lowercase city names to IATA codes
            const iataMap: { [key: string]: string } = {
                // International
                "bali": "DPS",
                "berlin": "BER",
                "rome": "FCO",
                "rom": "FCO",
                "paris": "PAR",
                "tokyo": "TYO",
                "bangkok": "BKK",
                "istanbul": "IST",
                "london": "LON",
                "new york": "NYC",
                "dubai": "DXB",
                "singapore": "SIN",
                "singapur": "SIN",

                // Germany
                "münchen": "MUC",
                "munich": "MUC",
                "frankfurt": "FRA",
                "hamburg": "HAM",
                "dortmund": "DTM",
                "düsseldorf": "DUS",
                "duesseldorf": "DUS",
                "köln": "CGN",
                "cologne": "CGN",
                "stuttgart": "STR",
                "leipzig": "LEJ",
                "dresden": "DRS",
                "hannover": "HAJ",
                "bremen": "BRE",
                "nürnberg": "NUE",

                // Defaults
                "mein standort": "FRA"
            };

            const normalize = (loc: string) => loc ? loc.toLowerCase().trim() : "";
            const lookup = (loc: string) => {
                const norm = normalize(loc);
                // Direct map match
                if (iataMap[norm]) return iataMap[norm];
                // If it's already a 3-letter code (e.g. "BER"), use it
                if (norm.length === 3) return norm.toUpperCase();
                return loc; // Fallback (API will likely error if not IATA)
            };

            const origin = lookup(params.origin) || "MUC";
            const destination = lookup(params.destination);

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

    getFlightDates: async (params: { origin: string, destination: string }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/dates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            if (!response.ok) return []; // Silent fail for prices
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error("Flight Dates Fetch Error:", error);
            return [];
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
    },

    confirmPrice: async (flightOffer: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/price`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flightOffer }),
            });
            if (!response.ok) throw new Error("Price verification failed");
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error("Flight Price Confirmation Error:", error);
            throw error;
        }
    },

    searchLocations: async (keyword: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/locations?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) return [];
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error("Location Search Error:", error);
            return [];
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
