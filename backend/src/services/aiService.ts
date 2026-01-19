import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { AmadeusService } from './amadeusService';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    tools: [
        {
            functionDeclarations: [
                {
                    name: "searchHotels",
                    description: "Find hotels in a specific city.",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            cityCode: { type: SchemaType.STRING, description: "IATA city code (e.g., LON, PAR, MUC)" },
                            adults: { type: SchemaType.NUMBER, description: "Number of adults" }
                        },
                        required: ["cityCode"]
                    }
                },
                {
                    name: "searchFlights",
                    description: "Find flights between two locations.",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            origin: { type: SchemaType.STRING, description: "Origin IATA code (e.g., MUC)" },
                            destination: { type: SchemaType.STRING, description: "Destination IATA code (e.g., LHR)" },
                            date: { type: SchemaType.STRING, description: "Departure date (YYYY-MM-DD)" }
                        },
                        required: ["origin", "destination", "date"]
                    }
                },
                {
                    name: "searchActivities",
                    description: "Find tours and activities at a location.",
                    parameters: {
                        type: SchemaType.OBJECT,
                        properties: {
                            lat: { type: SchemaType.NUMBER, description: "Latitude" },
                            lng: { type: SchemaType.NUMBER, description: "Longitude" }
                        },
                        required: ["lat", "lng"]
                    }
                }
            ]
        }
    ]
});

export const AIService = {
    chat: async (history: any[], userMessage: string) => {
        try {
            const chat = model.startChat({
                history: history,
            });

            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            const functionCalls = response.functionCalls();

            if (functionCalls) {
                // Handle Function Calls
                const toolParts = [];
                for (const call of functionCalls) {
                    let functionResponse = {};

                    if (call.name === 'searchHotels') {
                        const args = call.args as any;
                        functionResponse = await AmadeusService.searchHotels(args.cityCode, args.adults);
                    } else if (call.name === 'searchFlights') {
                        const args = call.args as any;
                        functionResponse = await AmadeusService.searchFlights({
                            origin: args.origin,
                            destination: args.destination,
                            departureDate: args.date
                        });
                    } else if (call.name === 'searchActivities') {
                        const args = call.args as any;
                        functionResponse = await AmadeusService.searchActivities(args.lat, args.lng);
                    }

                    toolParts.push({
                        functionResponse: {
                            name: call.name,
                            response: { name: call.name, content: functionResponse }
                        }
                    });
                }

                // Send tool result back to model
                const finalResult = await chat.sendMessage(toolParts);
                return finalResult.response.text();
            }

            return response.text();
        } catch (error) {
            console.error('AI Service Error:', error);
            return "I'm having trouble connecting to my brain right now. Please try again later.";
        }
    }
};
