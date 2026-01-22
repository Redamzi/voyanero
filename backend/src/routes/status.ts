import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/db', async (req, res) => {
    try {
        // Try to connect and query something simple
        const userCount = await prisma.user.count();

        res.json({
            status: 'connected',
            provider: 'supabase (postgresql)',
            userCount: userCount,
            message: 'Database connection successful!'
        });
    } catch (error) {
        console.error('Database Connection Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Could not connect to database',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
