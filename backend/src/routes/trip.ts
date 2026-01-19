import express from 'express';
import { AmadeusService } from '../services/amadeusService';

const router = express.Router();

router.post('/parse', async (req, res) => {
    try {
        const { content } = req.body; // Expecting Base64 string

        if (!content) {
            return res.status(400).json({
                error: 'Missing content',
                details: 'Base64 encoded file content is required.'
            });
        }

        const tripData = await AmadeusService.parseTrip(content);
        res.json({ success: true, data: tripData });
    } catch (error: any) {
        console.error('Trip Parser Route Error:', error);
        res.status(500).json({ error: 'Failed to parse trip' });
    }
});

export default router;
