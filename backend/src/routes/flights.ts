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

router.post('/dates', async (req, res) => {
    try {
        const { origin, destination, oneWay } = req.body;
        console.log(`Searching flight dates (Amadeus): ${origin} -> ${destination}`);

        if (!origin || !destination) {
            res.status(400).json({ error: "Origin and Destination are required" });
            return;
        }

        const data = await AmadeusService.searchFlightDates({
            origin,
            destination,
            oneWay: oneWay ?? true
        });

        res.json({ success: true, data });
    } catch (error: any) {
        console.error("Amadeus Flight Dates Error:", error);
        res.status(500).json({ error: "Failed to search flight dates", details: error.message || error });
    }
});

router.post('/price', async (req, res) => {
    try {
        const { flightOffer } = req.body;
        console.log("Verifying flight price...");

        if (!flightOffer) {
            res.status(400).json({ error: "Flight offer is required" });
            return;
        }

        const data = await AmadeusService.confirmPrice(flightOffer);
        res.json({ success: true, data });
    } catch (error: any) {
        console.error("Amadeus Pricing Error:", error);
        res.status(500).json({ error: "Failed to verify price", details: error.message || error });
    }
});

router.get('/locations', async (req, res) => {
    try {
        const keyword = req.query.keyword as string;
        if (!keyword || keyword.length < 2) {
            res.json({ success: true, data: [] });
            return;
        }

        console.log(`Searching locations (Amadeus): ${keyword}`);
        const data = await AmadeusService.searchCity(keyword);
        res.json({ success: true, data: data.data || data }); // Amadeus response structure can vary, safeguarding
    } catch (error: any) {
        console.error("Amadeus Location Search Error:", error);
        res.status(500).json({ error: "Failed to search locations", details: error.message || error });
    }
});

export default router;
