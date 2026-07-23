import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.API_KEY);
const aiModel = ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
    }
});

export default aiModel