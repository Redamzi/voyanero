import express from 'express';
import { AIService } from '../services/aiService';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Check for API Key
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is missing');
            return res.status(500).json({
                error: 'AI Service Config Error',
                details: 'API Key not configured'
            });
        }

        const response = await AIService.chat(history || [], message);
        res.json({ success: true, text: response });
    } catch (error: any) {
        console.error('AI Chat Route Error:', error);
        res.status(500).json({ error: 'Failed to process AI request' });
    }
});

export default router;
