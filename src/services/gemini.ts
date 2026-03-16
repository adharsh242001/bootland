import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Mood } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MOOD_PROMPTS: Record<Mood, string> = {
  Cyberpunk: "Neon lights, high-tech materials, dark chrome, futuristic silhouettes, glowing accents.",
  Botanical: "Organic textures, leaf patterns, earthy tones, floral embroidery, sustainable materials.",
  Minimalist: "Clean lines, monochromatic palette, premium leather, subtle branding, architectural form.",
  "Retro-Futurism": "1960s space age, pastel colors, plastic textures, rounded shapes, vintage tech vibes.",
  Oceanic: "Wave patterns, translucent materials, sea-foam greens and blues, coral textures, fluid lines."
};

export const generateShoeImage = async (mood: Mood, customPrompt: string) => {
  const fullPrompt = `A professional, high-end sneaker design. Style: ${MOOD_PROMPTS[mood]}. Details: ${customPrompt}. The shoe is presented on a clean, studio background, 4k resolution, cinematic lighting, fashion photography.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ text: fullPrompt }],
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const getCoDesignerResponse = async (history: ChatMessage[], mood: Mood) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a world-class sneaker designer and creative director. 
      Your goal is to help the user refine their shoe design based on the mood: ${mood}.
      Be encouraging, creative, and professional. 
      Keep your responses short and punchy (max 2 sentences). 
      Ask clarifying questions about materials, colors, or specific features.
      When you have enough information to generate a design, suggest that you are ready to create the first draft.`
    }
  });

  // Send the last message
  const lastMessage = history[history.length - 1].text;
  const response = await chat.sendMessage({ message: lastMessage });
  return response.text;
};
