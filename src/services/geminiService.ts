export async function analyzeTrackMetadata(fileName: string) {
  try {
    const response = await fetch("/api/analyze-metadata", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });
    return await response.json();
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

export async function generatePromoPack(trackInfo: any) {
  try {
    const response = await fetch("/api/generate-promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackInfo }),
    });
    return await response.json();
  } catch (error) {
    console.error("Gemini Promo Error:", error);
    return null;
  }
}

export async function generateVideoAesthetic(trackInfo: any) {
  try {
    const response = await fetch("/api/generate-aesthetic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackInfo }),
    });
    return await response.json();
  } catch (error) {
    console.error("Gemini Video Aesthetic Error:", error);
    return null;
  }
}
