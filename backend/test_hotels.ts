
import dotenv from 'dotenv';
import { AmadeusService } from './src/services/amadeusService';

dotenv.config();

async function testHotelSearch() {
    console.log('Testing Amadeus Hotel Search...');
    try {
        // Test for a known IATA city code like MUC
        const hotels = await AmadeusService.searchHotels('MUC', 2);

        console.log('✅ Hotel Search Success!');
        console.log(`Found ${hotels.length} hotel offers.`);
        if (hotels.length > 0) {
            console.log('Sample Hotel:', hotels[0].hotel.name);
            console.log('Price:', hotels[0].offers[0].price.total, hotels[0].offers[0].price.currency);
        }
    } catch (error) {
        console.error('❌ Hotel Search Failed:', error);
    }
}

testHotelSearch();
