import express from 'express';
import { AmadeusService } from '../services/amadeusService';

const router = express.Router();

router.get('/safety', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                error: 'Missing coordinates',
                details: 'Latitude (lat) and Longitude (lng) are required.'
            });
        }

        const safetyData = await AmadeusService.getSafetyScore(
            parseFloat(lat as string),
            parseFloat(lng as string)
        );

        res.json({ success: true, data: safetyData });
    } catch (error: any) {
        console.error('Safety Route Error:', error);
        res.status(500).json({ error: 'Failed to fetch safety scores' });
    }
});

export default router;
