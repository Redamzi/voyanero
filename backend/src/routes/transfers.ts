import express from 'express';
import { AmadeusService } from '../services/amadeusService';

const router = express.Router();

router.post('/search', async (req, res) => {
    try {
        const { startLocationCode, endLocationCode, startDateTime, passengers } = req.body;

        // Basic validation
        if (!startLocationCode || !endLocationCode || !startDateTime) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: 'startLocationCode, endLocationCode, and startDateTime are required'
            });
        }

        // Call Amadeus Service
        // Note: Amadeus Transfer API is quite strict. 
        // We are using simple IATA-to-IATA or IATA-to-City logic for MVP.
        const transferOffers = await AmadeusService.searchTransfers({
            startLocationCode,
            endLocationCode, // Using LocationCode for both for simplicity if supported, else assume address
            startDateTime,
            passengers: passengers || 1,
            transferType: 'PRIVATE'
        });

        res.json({ success: true, data: transferOffers });
    } catch (error: any) {
        console.error('Transfer Search Route Error:', error);
        res.status(500).json({
            error: 'Failed to search transfers',
            details: error.message || 'Unknown error'
        });
    }
});

export default router;
