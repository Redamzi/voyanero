import axios from 'axios';
import crypto from 'crypto';

const API_URL = 'https://api.travelpayouts.com/v1/flight_search';
const TOKEN = process.env.TRAVELPAYOUTS_API_TOKEN;
const MARKER = process.env.TRAVELPAYOUTS_MARKER_ID;

interface SearchParams {
    currency?: string;
    locale?: string;
    host?: string;
    user_ip?: string;
    trip_class?: string;
    passengers?: {
        adults: number;
        children: number;
        infants: number;
    };
    segments: {
        origin: string;
        destination: string;
        date: string; // YYYY-MM-DD
    }[];
}

export const TravelpayoutsService = {
    generateSignature: (params: SearchParams): string => {
        if (!TOKEN || !MARKER) throw new Error("Missing API Credentials");

        // Signature construction: token + marker + (params in specific order)
        // Order: currency, host, locale, marker, passengers, segments...
        // Note: The specific order depends on the API version. 
        // For v1 search, it is often: token + currency + host + locale + marker + adults + children + infants + date + destination + origin + trip_class + user_ip

        // Simplified signature generation based on standard docs, may need adjustment
        const segmentsString = params.segments.map(s => s.date + s.destination + s.origin).join('');
        const passengersString = `${params.passengers?.adults || 1}${params.passengers?.children || 0}${params.passengers?.infants || 0}`;

        const rawString = [
            TOKEN,
            params.currency || 'EUR',
            params.host || 'voyanero.com',
            params.locale || 'de',
            MARKER,
            passengersString,
            segmentsString,
            params.trip_class || 'Y',
            params.user_ip || '127.0.0.1'
        ].join(':'); // Separator might be required or mostly just concatenation. Aviasales usually uses concatenation without separators or specific order.

        // Actually, the most robust way often is just passing the token in the request if strictly server-side for some endpoints, 
        // but Search API requires signature.
        // Let's use a standard concatenation for now:
        // MD5( token + currency + host + locale + marker + passengers + segment.date + segment.destination + segment.origin + trip_class + user_ip )

        const signatureBase =
            TOKEN +
            (params.currency || 'EUR') +
            (params.host || 'voyanero.com') +
            (params.locale || 'de') +
            MARKER +
            passengersString +
            segmentsString +
            (params.trip_class || 'Y') +
            (params.user_ip || '127.0.0.1');

        return crypto.createHash('md5').update(signatureBase).digest('hex');
    },

    search: async (params: SearchParams) => {
        if (!TOKEN) throw new Error("Missing API Token");

        // For simple testing, we might rely on their demo or simple request.
        // Construct the payload
        const payload = {
            signature: TravelpayoutsService.generateSignature(params),
            marker: MARKER,
            host: params.host || 'voyanero.com',
            user_ip: params.user_ip || '127.0.0.1',
            locale: params.locale || 'de',
            trip_class: params.trip_class || 'Y',
            passengers: {
                adults: params.passengers?.adults || 1,
                children: params.passengers?.children || 0,
                infants: params.passengers?.infants || 0
            },
            segments: params.segments,
            currency: params.currency || 'EUR'
        };

        try {
            const response = await axios.post(`${API_URL}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Travelpayouts API Error:", error);
            throw error;
        }
    },

    getSearchResults: async (searchUuid: string) => {
        try {
            const response = await axios.get(`${API_URL}/search_results`, {
                params: { uuid: searchUuid }
            });
            return response.data;
        } catch (error) {
            console.error("Travelpayouts Result Error:", error);
            throw error;
        }
    }
};
