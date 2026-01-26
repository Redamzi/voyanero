
import Amadeus from 'amadeus';
import dotenv from 'dotenv';
import path from 'path';

// Load env from backend folder
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Explicitly use PRODUCTION env to check if keys are for prod
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    hostname: 'production'
});

async function testSearch() {
    console.log('Testing Amadeus Flight Search (Test Env)...');

    // SYD-BKK is the "Gold Standard" test route for Amadeus Sandbox
    const inputs = [
        { desc: 'SYD-BKK (Robust Test Route)', origin: 'SYD', dest: 'BKK' },
        { desc: 'MUC-LHR', origin: 'MUC', dest: 'LHR' }
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    for (const input of inputs) {
        console.log(`\n--- Test: ${input.desc} ---`);
        try {
            console.log(`Query: ${input.origin} -> ${input.dest} on ${dateStr}`);

            const params = {
                originLocationCode: input.origin,
                destinationLocationCode: input.dest,
                departureDate: dateStr,
                adults: 1,
                max: 1
            };

            const response = await amadeus.shopping.flightOffersSearch.get(params);
            console.log('✅ Success! Found results:', response.data.length);
        } catch (error: any) {
            console.log('❌ Failed:', error.response ? JSON.stringify(error.response.body) : error.message);
        }
        // Wait 1 second to avoid 429
        await new Promise(r => setTimeout(r, 1500));
    }
}

testSearch();
