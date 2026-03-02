import { GoogleGenAI } from "@google/genai";

async function generateBackground() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: 'A dynamic, high-energy musical background for a premium AI agent. Deep black canvas with explosive golden particles, shimmering light trails, and abstract sound wave vibrations. Cinematic depth of field, glowing embers, and a sense of motion and rhythm. Luxurious, sophisticated, 4k resolution, modern classic aesthetic.',
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates![0].content.parts) {
    if (part.inlineData) {
      console.log(`data:image/png;base64,${part.inlineData.data}`);
      return;
    }
  }
}

generateBackground();
