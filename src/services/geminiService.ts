import { GoogleGenAI, Type } from "@google/genai";

export async function analyzeTrackMetadata(fileName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analyze this audio file name: "${fileName}". 
  Intelligently guess the BPM, Musical Key Signature (e.g., Am, F#m, C major), and likely Duration in seconds.
  Return the result in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bpm: { type: Type.INTEGER },
            key_signature: { type: Type.STRING },
            duration: { type: Type.INTEGER },
            artist: { type: Type.STRING },
            trackName: { type: Type.STRING },
          },
          required: ["bpm", "key_signature", "duration", "artist", "trackName"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

export async function generatePromoPack(trackInfo: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

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

  try {
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Promo Error:", error);
    return null;
  }
}

export async function generateVideoAesthetic(trackInfo: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Based on this music track:
  - Name: ${trackInfo.name}
  - Artist: ${trackInfo.artist}
  - BPM: ${trackInfo.bpm}
  - Key: ${trackInfo.key_signature}
  
  Generate a visual aesthetic prompt for an AI video background. 
  The tone is professional, high-end hip-hop production (OG BEATZ branding: Orange, Black, Chrome, distressed metal).
  
  Return a prompt for image generation that would work as a background for a promo video.`;

  try {
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Video Aesthetic Error:", error);
    return null;
  }
}
