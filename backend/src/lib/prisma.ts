import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

console.log('Prisma Client Initialized');
// Do NOT log the full URL for security, just checking if it is empty
console.log('Database URL present:', !!process.env.DATABASE_URL);

export default prisma;
