import express from "express";
import { createServer as createViteServer } from "vite";
import Replicate from "replicate";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt: userPrompt, duration = 240 } = req.body;

      if (!process.env.REPLICATE_API_TOKEN) {
        return res.status(500).json({ error: "REPLICATE_API_TOKEN is not configured." });
      }

      console.log(`Enhancing prompt with Gemini: "${userPrompt}"`);
      
      // 1. Enhance prompt with Gemini
      const model = genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a professional music producer. Expand the following user request into a comprehensive musical metadata description for an AI music generator. Include genre, mood, tempo, instrumentation, and a lyrical structure with [Verse], [Chorus], and [Bridge] tags. 
        
        User Request: ${userPrompt}
        
        Output only the enhanced musical description and lyrics.`,
      });

      const geminiResponse = await model;
      const enhancedPrompt = geminiResponse.text || userPrompt;

      console.log(`Generating music using DiffRhythm for enhanced prompt: "${enhancedPrompt.substring(0, 100)}..." (${duration}s)`);

      // 2. Generate music with Replicate
      const output = await replicate.run(
        "aslp-lab/diffrhythm:23662283733a1e2632b49042b464872c6760085d3f237f3743513b1945398797",
        {
          input: {
            prompt: enhancedPrompt,
            duration: Math.min(duration, 240),
          },
        }
      );

      res.json({ 
        url: output,
        enhancedPrompt: enhancedPrompt 
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate music" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
