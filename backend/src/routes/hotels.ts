
import { Router } from 'express';
import { AwinService } from '../services/awinService';

const router = Router();

router.get('/search', async (req, res) => {
    try {
        const { location } = req.query;
        const hotels = await AwinService.searchHotels(location as string);
        res.json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

export default router;
