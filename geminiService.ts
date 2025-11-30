import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithGemini = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  try {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const analyzeInsuranceCard = async (base64Images: string[]) => {
  try {
    const imageParts = base64Images.map(img => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: img,
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          ...imageParts,
          {
            text: "Analyze these insurance card images (e.g., front and back). Extract the Carrier Name, Member ID, Group Number, and the Main Policy Holder's Name. Return valid JSON.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            carrier: { type: Type.STRING },
            memberId: { type: Type.STRING },
            groupNumber: { type: Type.STRING },
            holderName: { type: Type.STRING },
          },
          required: ["carrier", "memberId"],
        },
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};