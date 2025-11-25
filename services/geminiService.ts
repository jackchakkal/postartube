import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVideoDetails = async (topic: string, channelName: string) => {
  try {
    const ai = getAiClient();
    
    const prompt = `
      You are a YouTube optimization expert. 
      Generate a catchy, click-worthy title and a short, SEO-optimized description for a video.
      
      Channel Name: ${channelName}
      Video Topic: ${topic}
      
      Return the result in JSON format with "title" and "description" keys.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The YouTube video title" },
            description: { type: Type.STRING, description: "A 2-3 sentence description" }
          },
          required: ["title", "description"]
        }
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeSchedule = async (slots: any[]) => {
  // Function to provide tips on the schedule
  try {
    const ai = getAiClient();
    const scheduleSummary = slots.map(s => `${s.time}: ${s.topic || 'Untitled'}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this YouTube posting schedule for a single day. Give me 3 short, bulleted tips to improve flow or audience retention based on these topics and times. \n\n${scheduleSummary}`
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error", error);
    return "Could not analyze schedule at this time.";
  }
};