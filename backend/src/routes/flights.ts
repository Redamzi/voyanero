import express from 'express';
import { TravelpayoutsService } from '../services/travelpayouts';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const searchParams = req.body;
        // Basic validation could go here

        // Add user IP from request if not provided
        if (!searchParams.user_ip) {
            searchParams.user_ip = req.ip || '127.0.0.1';
        }

        const data = await TravelpayoutsService.search(searchParams);
        res.json(data);
    } catch (error: any) {
        console.error("Flight Search Route Error:", error.message);
        res.status(500).json({ error: "Failed to start flight search", details: error.message });
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
