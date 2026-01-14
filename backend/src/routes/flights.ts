import express from 'express';
import { TravelpayoutsService } from '../services/travelpayouts';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const { origin, destination, date, adults, children, infants } = req.body;

        // Data Access API returns results immediately
        const data = await TravelpayoutsService.search({
            origin,
            destination,
            date,
            adults,
            children,
            infants
        });

        res.json(data);
    } catch (error: any) {
        console.error("Flight Search Route Error:", error.message);
        res.status(500).json({ error: "Failed to search flights", details: error.message });
    }
});

router.get('/results/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const data = await TravelpayoutsService.getSearchResults(uuid);
        res.json(data);
    } catch (error: any) {
        console.error("Flight Results Route Error:", error.message);
        res.status(500).json({ error: "Failed to fetch search results", details: error.message });
    }
});

export default router;
