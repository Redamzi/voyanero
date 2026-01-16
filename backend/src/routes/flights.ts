import express from 'express';
import { AmadeusService } from '../services/amadeusService';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const { origin, destination, date, returnDate, adults, children, infants, travelClass } = req.body;

        console.log(`Searching flights (Amadeus): ${origin} -> ${destination} on ${date}`);

        // Amadeus Flight Offers Search
        const data = await AmadeusService.searchFlights({
            origin,
            destination,
            departureDate: date,
            returnDate,
            adults,
            children,
            infants,
            travelClass
        });

        res.json({ success: true, data });
    } catch (error: any) {
        console.error("Amadeus Search Error:", error);
        // Return 500 but with a clean error message
        res.status(500).json({ error: "Failed to search flights", details: error.message || error });
    }
});

export default router;
