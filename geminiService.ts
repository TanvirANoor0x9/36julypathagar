import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real production app, ensure API_KEY is set in the environment variables.
// This service gracefully handles missing keys by returning the prompt itself or a mock response if needed, 
// but strictly follows the instruction to use process.env.API_KEY.

const ai = new GoogleGenAI({ apiKey });

export const generateDraftContent = async (topic: string, type: 'notice' | 'activity'): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Returning raw topic.");
    return `[AI Unavailable] ${topic}`;
  }

  try {
    const prompt = type === 'notice' 
      ? `Write a formal and concise public notice for an organization regarding: "${topic}". Keep it under 100 words.`
      : `Write an engaging short description for a community activity about: "${topic}". Keep it under 80 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return topic; // Fallback
  }
};
