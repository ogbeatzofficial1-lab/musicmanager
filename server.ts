import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Initialize Gemini
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// API Routes
app.get("/api/config", (req, res) => {
  res.json({
    supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || null,
    supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || null
  });
});
app.post("/api/analyze-metadata", async (req, res) => {
  if (!ai) return res.status(500).json({ error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file." });
  const { fileName } = req.body;
  if (!fileName) return res.status(400).json({ error: "fileName is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this music track name: "${fileName}". Suggest its likely BPM (number), Key Signature (string like "Am", "F#m", "C"), approximate duration in seconds, and 3-5 descriptive tags (genres/moods). Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bpm: { type: Type.NUMBER },
            key: { type: Type.STRING },
            duration: { type: Type.NUMBER },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["bpm", "key", "tags"]
        }
      }
    });
    
    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("AI Analysis failed:", error);
    res.status(500).json({ error: "AI analysis failed", details: error instanceof Error ? error.message : String(error) });
  }
});

app.post("/api/generate-promo", async (req, res) => {
  if (!ai) return res.status(500).json({ error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file." });
  const { trackInfo } = req.body;
  if (!trackInfo) return res.status(400).json({ error: "trackInfo is required" });

  try {
    const prompt = `Generate a professional music marketing promo pack for the track:
    - Name: ${trackInfo.name}
    - Artist: ${trackInfo.artist}
    - BPM: ${trackInfo.bpm}
    - Key: ${trackInfo.key_signature}

    Brand Guidelines:
    - BAN amateur jargon: "type beat", "lease", "buy this beat", "beatmaker".
    - USE industry-focused words: "producer", "songwriter", "new music", "collaboration".
    - Tone: Professional, mature, polished.

    Requirement:
    1. YouTube: Title (under 100 chars), Description with timing symbols/CTAs.
    2. Instagram: Short, spaced caption with natural feel.
    3. Generic: A 2-sentence pitch.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            youtube: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["title", "description"],
            },
            instagram: { type: Type.STRING },
            generic: { type: Type.STRING },
          },
          required: ["youtube", "instagram", "generic"],
        },
      },
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Gemini Promo Error:", error);
    res.status(500).json({ error: "Promo generation failed" });
  }
});

app.post("/api/generate-aesthetic", async (req, res) => {
  if (!ai) return res.status(500).json({ error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file." });
  const { trackInfo } = req.body;
  if (!trackInfo) return res.status(400).json({ error: "trackInfo is required" });

  try {
    const prompt = `Based on this music track:
    - Name: ${trackInfo.name}
    - Artist: ${trackInfo.artist}
    - BPM: ${trackInfo.bpm}
    - Key: ${trackInfo.key_signature}
    
    Generate a visual aesthetic prompt for an AI video background. 
    The tone is professional, high-end hip-hop production (OG BEATZ branding: Orange, Black, Chrome, distressed metal).
    
    Return a prompt for image generation that would work as a background for a promo video.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            imagePrompt: { type: Type.STRING },
            suggestedStyle: { type: Type.STRING },
            motionDescription: { type: Type.STRING },
          },
          required: ["imagePrompt", "suggestedStyle", "motionDescription"],
        },
      },
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Gemini Video Aesthetic Error:", error);
    res.status(500).json({ error: "Aesthetic generation failed" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
