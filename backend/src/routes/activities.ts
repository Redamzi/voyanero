import express from 'express';
import { AmadeusService } from '../services/amadeusService';

const router = express.Router();

router.get('/search', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                error: 'Missing coordinates',
                details: 'Latitude (lat) and Longitude (lng) are required.'
            });
        }

        const activities = await AmadeusService.searchActivities(
            parseFloat(lat as string),
            parseFloat(lng as string),
            parseInt(radius as string) || 5
        );

        res.json({ success: true, data: activities });
    } catch (error: any) {
        console.error('Activities Route Error:', error);
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

export default router;
