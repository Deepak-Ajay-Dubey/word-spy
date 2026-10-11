import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

// Batch Word Pair Generation API with multi-model failover & resilience
  app.post("/api/words/generate-batch", async (req, res) => {
    try {
      const { category, count = 20, exclude = [] } = req.body || {};
      const ai = getAi();

      if (!ai) {
        return res.status(200).json({
          success: false,
          fallback: true,
          message: "GEMINI_API_KEY not configured. Client fallback will be used.",
        });
      }

      const prompt = `Generate a JSON array of ${Math.min(
        count,
        30
      )} distinct, highly engaging secret word pairs for the social deduction party game "Word Spy" (similar to Undercover).
${category && category !== "All Categories" ? `Focused on category: "${category}".` : "Mix of common categories like Food, Animals, Movies & Pop Culture, Everyday Objects, Places & Travel, Sports & Hobbies, Technology, Nature, Clothing."}

CRITICAL RULES for word pairs:
1. "civilian" word and "undercover" word must be closely related and in the same conceptual sub-category (e.g., Coffee vs Tea, Penguin vs Ostrich, Batman vs Spider-Man, Beach vs Swimming Pool, Bicycle vs Motorcycle, Microwave vs Oven, Soccer vs Basketball, Toothbrush vs Hairbrush, Paris vs London).
2. The two words MUST NOT be literal synonyms of each other (e.g., do NOT do "Big" and "Huge", do NOT do "Automobile" and "Car").
3. Words must be common, everyday nouns recognizable to anyone.
4. Avoid these previously used words: ${exclude.slice(0, 50).join(", ") || "none"}.
5. Each item must have:
   - "civilian": string (1-2 words max, capitalized)
   - "undercover": string (1-2 words max, capitalized)
   - "category": string (e.g., Food & Drink, Animals, Objects, Places, Entertainment, Sports, etc.)
`;

      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-3.7-flash",
        "gemini-flash-latest",
      ];

      let responseText: string | null = null;
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    civilian: { type: Type.STRING, description: "Word for civilians" },
                    undercover: { type: Type.STRING, description: "Related word for undercover" },
                    category: { type: Type.STRING, description: "Category name" },
                  },
                  required: ["civilian", "undercover", "category"],
                },
              },
              temperature: 0.8,
            },
          });

          if (response.text && response.text.trim().length > 0) {
            responseText = response.text.trim();
            break; // Success!
          }
        } catch (err: any) {
          lastError = err;
          // Continue to next candidate model if 503/429/overloaded
          continue;
        }
      }

      if (!responseText) {
        return res.status(200).json({
          success: false,
          fallback: true,
          message: lastError?.message || "AI models busy. Using fallback dictionary.",
        });
      }

      let parsed = [];
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        console.warn("Failed to parse Gemini output:", parseErr);
      }

      // Filter and clean pairs
      const validPairs = (Array.isArray(parsed) ? parsed : []).filter(
        (p: any) =>
          p &&
          typeof p.civilian === "string" &&
          typeof p.undercover === "string" &&
          p.civilian.trim().toLowerCase() !== p.undercover.trim().toLowerCase() &&
          p.civilian.trim().length > 1 &&
          p.undercover.trim().length > 1
      ).map((p: any) => ({
        civilian: p.civilian.trim(),
        undercover: p.undercover.trim(),
        category: p.category?.trim() || "General",
      }));

      if (validPairs.length === 0) {
        return res.status(200).json({
          success: false,
          fallback: true,
          message: "No valid pairs generated. Using fallback dictionary.",
        });
      }

      return res.json({
        success: true,
        pairs: validPairs,
      });
    } catch (err: any) {
      return res.status(200).json({
        success: false,
        fallback: true,
        error: err.message || "Failed to generate word pairs",
      });
    }
  });

  // Vite middleware in dev or static server in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Word Spy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});
