import Anthropic from '@anthropic-ai/sdk';
import { AmadeusService } from './amadeusService';

// Initialize Anthropic (Claude)
// Requires ANTHROPIC_API_KEY in .env
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const tools: Anthropic.Tool[] = [
    {
        name: "searchHotels",
        description: "Find hotels in a specific city. Use this when the user asks for hotels/accommodation.",
        input_schema: {
            type: "object",
            properties: {
                cityCode: { type: "string", description: "IATA city code (e.g., LON, PAR, MUC)" },
                adults: { type: "number", description: "Number of adults" }
            },
            required: ["cityCode"]
        }
    },
    {
        name: "searchFlights",
        description: "Find flights between two locations. Use IATA codes.",
        input_schema: {
            type: "object",
            properties: {
                origin: { type: "string", description: "Origin IATA code (e.g., MUC)" },
                destination: { type: "string", description: "Destination IATA code (e.g., LHR)" },
                date: { type: "string", description: "Departure date (YYYY-MM-DD)" }
            },
            required: ["origin", "destination", "date"]
        }
    },
    {
        name: "searchActivities",
        description: "Find tours and activities at a specific location using coordinates.",
        input_schema: {
            type: "object",
            properties: {
                lat: { type: "number", description: "Latitude" },
                lng: { type: "number", description: "Longitude" }
            },
            required: ["lat", "lng"]
        }
    }
];

export const AIService = {
    chat: async (history: any[], userMessage: string) => {
        try {
            // Map generic history to Anthropic format if needed, or assume it's already compatible
            // Anthropic expects: { role: 'user' | 'assistant', content: string | block[] }
            // Our frontend sends: { role: 'user' | 'assistant', parts: [{text: ...}] } (Gemini format)
            // We need to convert it.

            const anthropicMessages: Anthropic.MessageParam[] = history.map((msg: any) => ({
                role: msg.role === 'model' ? 'assistant' : msg.role,
                content: msg.parts?.[0]?.text || msg.content || ''
            }));

            // Add current user message
            anthropicMessages.push({ role: 'user', content: userMessage });

            // 1. Initial Call (Claude decides if it needs tools)
            let response = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: anthropicMessages,
                tools: tools,
            });

            // 2. Check for Tool Use
            if (response.stop_reason === "tool_use") {
                const toolUseBlock = response.content.find(block => block.type === 'tool_use');

                if (toolUseBlock && toolUseBlock.type === 'tool_use') {
                    const toolName = toolUseBlock.name;
                    const toolInput = toolUseBlock.input as any;
                    const toolUseId = toolUseBlock.id;

                    console.log(`[Claude] Calling tool: ${toolName}`, toolInput);

                    let toolResultVal: any = {};

                    // Execute Tool
                    if (toolName === 'searchHotels') {
                        toolResultVal = await AmadeusService.searchHotels(toolInput.cityCode, toolInput.adults);
                    } else if (toolName === 'searchFlights') {
                        toolResultVal = await AmadeusService.searchFlights({
                            origin: toolInput.origin,
                            destination: toolInput.destination,
                            departureDate: toolInput.date
                        });
                    } else if (toolName === 'searchActivities') {
                        toolResultVal = await AmadeusService.searchActivities(toolInput.lat, toolInput.lng);
                    }

                    // Add the tool use interaction to messages
                    anthropicMessages.push({ role: 'assistant', content: response.content });

                    // Add tool result back to Claude
                    anthropicMessages.push({
                        role: 'user',
                        content: [
                            {
                                type: "tool_result",
                                tool_use_id: toolUseId,
                                content: JSON.stringify(toolResultVal)
                            }
                        ]
                    });

                    // 3. Follow-up Call (Claude interprets results)
                    const finalResponse = await anthropic.messages.create({
                        model: "claude-3-5-sonnet-20240620",
                        max_tokens: 1024,
                        messages: anthropicMessages,
                        tools: tools,
                    });

                    // Return final text
                    const textBlock = finalResponse.content.find(block => block.type === 'text');
                    return textBlock?.type === 'text' ? textBlock.text : "Received partial response.";
                }
            }

            // No tool used, just return text
            const textBlock = response.content.find(block => block.type === 'text');
            return textBlock?.type === 'text' ? textBlock.text : "I didn't understand that.";

        } catch (error) {
            console.error('Claude AI Service Error:', error);
            return "I'm having trouble connecting to Anthropic right now. Please check the API Key.";
        }
    }
};
