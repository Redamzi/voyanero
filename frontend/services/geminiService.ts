export const getTravelAdvice = async (message: string, history: any[] = []) => {
    try {
        const response = await fetch('http://localhost:8000/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, history })
        });

        if (!response.ok) {
            throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        return {
            text: data.text,
            sources: [] // Keeping payload structure compatible with UI
        };
    } catch (error) {
        console.error('Frontend AI Service Error:', error);
        throw error;
    }
};
