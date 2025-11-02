import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { FoodItem } from '../types';

// Fix: Implemented Gemini Service to provide expected exports and functionality.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
let chat: Chat | null = null;

const getChat = (menuItems: FoodItem[]) => {
    if (!chat) {
        const menuString = menuItems.map(item => `${item.name} (${item.category}): ${item.description} - $${item.price}`).join('\n');
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a helpful restaurant assistant for a restaurant named "LayLawn". 
                You can answer questions about the menu, suggest dishes, and help with reservations. 
                Be friendly and conversational.
                Here is the current menu:\n${menuString}`,
            },
        });
    }
    return chat;
}

export const sendMessageToChatbot = async (message: string, menuItems: FoodItem[]): Promise<string> => {
    try {
        const chatInstance = getChat(menuItems);
        const result = await chatInstance.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Error sending message to chatbot:", error);
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
};

export const generateMealPlan = async (preferences: string): Promise<string> => {
    try {
        const prompt = `Create a 3-day meal plan based on the following preferences: ${preferences}.
        Suggest dishes that are healthy and balanced. Structure the response in a clear, day-by-day format.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating meal plan:", error);
        return "Sorry, I couldn't generate a meal plan at this moment. Please try again.";
    }
};
