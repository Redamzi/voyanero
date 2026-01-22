
import dotenv from 'dotenv';
import { AmadeusService } from './src/services/amadeusService';

dotenv.config();

async function testTransferSearch() {
    console.log('Testing Amadeus Transfer Search...');
    try {
        // Test Transfer: Paris (CDG) to City Center
        const transfers = await AmadeusService.searchTransfers({
            startLocationCode: 'CDG',
            endLocationCode: 'PAR',
            startDateTime: '2025-10-10T10:00:00',
            passengers: 2
        });

        console.log('✅ Transfer Search Success!');
        console.log(`Found ${transfers.length} transfer offers.`);
        if (transfers.length > 0) {
            console.log('Sample Transfer:', transfers[0].transferType);
            console.log('Vehicle:', transfers[0].vehicle.category);
            console.log('Price:', transfers[0].quotation.monetaryAmount, transfers[0].quotation.currencyCode);
        }
    } catch (error: any) {
        console.error('❌ Transfer Search Failed:', error.description || error);
    }
}

testTransferSearch();
