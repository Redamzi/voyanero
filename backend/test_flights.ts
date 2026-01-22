
import dotenv from 'dotenv';
import { AmadeusService } from './src/services/amadeusService';

dotenv.config();

async function testFlightSearch() {
    console.log('Testing Amadeus Flight Search...');
    try {
        const flights = await AmadeusService.searchFlights({
            origin: 'LHR', // London Heathrow (Standard Sandbox Route)
            destination: 'JFK', // New York JFK
            departureDate: '2025-11-01',
            adults: 1,
            travelClass: 'ECONOMY'
        });

        console.log('✅ Flight Search Success!');
        console.log(`Found ${flights.length} flight offers.`);
        if (flights.length > 0) {
            console.log('Sample Offer ID:', flights[0].id);
            console.log('Price:', flights[0].price.total, flights[0].price.currency);
        }
    } catch (error) {
        console.error('❌ Flight Search Failed:', error);
    }
}

testFlightSearch();
