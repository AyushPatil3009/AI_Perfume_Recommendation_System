import { GoogleGenAI, Type } from '@google/genai';
import { PerfumePreferenceInput, PerfumeRecommendationResult } from '../types/recommendation';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// ─── 1. Intent Parser: Natural Language Prompt -> Structured Filters ─────────

export interface ParsedPromptResult extends PerfumePreferenceInput {
  isOffTopic?: boolean;
}

export async function parseUserPromptWithGemini(userPrompt: string): Promise<ParsedPromptResult> {
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Returning basic defaults.');
    return { gender: 'UNISEX', userPrompt };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert master perfumer and scent analyst. 
Analyze the following user fragrance description/vibe and extract structured filter preferences.

User Description: "${userPrompt}"

Instructions:
- If the user description is completely unrelated to fragrances, perfumes, moods, vibes, memories, or occasions (e.g. "how are you", "write code", "hello", "what is 2+2"), set "isOffTopic" to true.
- Otherwise, extract:
  - gender: "MALE", "FEMALE", or "UNISEX" (default to UNISEX if not mentioned)
  - season: best matching season ("Summer", "Winter", "Spring", "Autumn") or null
  - occasion: best matching occasion ("Office", "DateNight", "Casual", "Party") or null
  - budget: "$" (under $45), "$$" ($50-$95), "$$$" ($100-$200), "$$$$" (luxury niche >$200) or null
  - intensity: 1 (very light) to 5 (heavy bold)
  - note: 1-3 primary requested olfactory notes or accords (e.g. "vanilla, leather, coffee")`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isOffTopic: { type: Type.BOOLEAN },
            gender: { type: Type.STRING, enum: ['MALE', 'FEMALE', 'UNISEX'] },
            season: { type: Type.STRING, nullable: true },
            occasion: { type: Type.STRING, nullable: true },
            budget: { type: Type.STRING, nullable: true },
            intensity: { type: Type.INTEGER, nullable: true },
            note: { type: Type.STRING, nullable: true },
          },
          required: ['gender', 'isOffTopic'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return {
      ...parsedJson,
      userPrompt,
    };
  } catch (error) {
    console.error('❌ Gemini intent parser error:', error);
    return { gender: 'UNISEX', userPrompt };
  }
}

// ─── 2. Reranker & Sommelier Explanation Generator ───────────────────────────

export async function rankAndExplainWithGemini(
  userVibe: string,
  candidates: Record<string, unknown>[]
): Promise<PerfumeRecommendationResult[]> {
  if (candidates.length === 0) return [];

  // If no Gemini key, fallback to direct candidate formatting
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Using fallback ranking.');
    return candidates.slice(0, 5).map((row, idx) => {
      const accords = [row.mainaccord1, row.mainaccord2, row.mainaccord3].filter(Boolean) as string[];
      return {
        id: Number(row.id),
        perfume: String(row.perfume || 'Perfume'),
        brand: String(row.brand || 'Luxury House'),
        gender: String(row.gender || 'Unisex'),
        matchScore: 95 - idx * 3,
        approx_price: row.approx_price ? Number(row.approx_price) : null,
        rating_value: row.rating_value ? Number(row.rating_value) : 4.5,
        top: row.top ? String(row.top) : null,
        middle: row.middle ? String(row.middle) : null,
        base: row.base ? String(row.base) : null,
        mainaccords: accords,
        aiExplanation: `A top-rated match featuring ${accords.join(', ') || 'luxurious accords'} crafted for your style.`,
        buyUrl: row.url ? String(row.url) : null,
      };
    });
  }

  try {
    // Pass clean compact candidate summaries to conserve tokens & maximize speed
    const candidateSummaries = candidates.map((c) => ({
      id: c.id,
      perfume: c.perfume,
      brand: c.brand,
      gender: c.gender,
      accords: [c.mainaccord1, c.mainaccord2, c.mainaccord3].filter(Boolean),
      top: c.top,
      middle: c.middle,
      base: c.base,
      price: c.approx_price,
      rating: c.rating_value,
    }));

    console.log(`🤖 [GEMINI] Sending ${candidateSummaries.length} candidates for reranking...`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an elite luxury perfume sommelier.
The user wants a perfume for this vibe/preference: "${userVibe}"

Here are the candidate perfumes from our database:
${JSON.stringify(candidateSummaries)}

Task:
1. Select the top 5 absolute best perfumes for this user.
2. Assign a matchScore percentage (from 80 to 99) reflecting how accurately it matches their mood/notes.
3. Write a warm, elegant, personalized 2-sentence explanation ("aiExplanation") for EACH perfume. Every explanation MUST be UNIQUE and describe THAT specific fragrance's notes, accords, and why they match the user's vibe. Do NOT repeat the same explanation for different perfumes.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              matchScore: { type: Type.INTEGER },
              aiExplanation: { type: Type.STRING },
            },
            required: ['id', 'matchScore', 'aiExplanation'],
          },
        },
      },
    });

    const aiRankings: Array<{ id: number; matchScore: number; aiExplanation: string }> = JSON.parse(
      response.text || '[]'
    );

    console.log(`✅ [GEMINI REAL] Got ${aiRankings.length} results:`);
    aiRankings.forEach((r, i) =>
      console.log(`  ${i + 1}. ID=${r.id} | Score=${r.matchScore}% | "${r.aiExplanation.slice(0, 80)}..."`)
    );

    // Map AI results back to full candidate database records
    const candidateMap = new Map(candidates.map((c) => [Number(c.id), c]));

    const finalResults: PerfumeRecommendationResult[] = aiRankings
      .filter((item) => candidateMap.has(item.id))
      .slice(0, 5)
      .map((item) => {
        const row = candidateMap.get(item.id)!;
        const accords = [row.mainaccord1, row.mainaccord2, row.mainaccord3].filter(Boolean) as string[];

        return {
          id: item.id,
          perfume: String(row.perfume || 'Perfume'),
          brand: String(row.brand || 'Luxury House'),
          gender: String(row.gender || 'Unisex'),
          matchScore: item.matchScore,
          approx_price: row.approx_price ? Number(row.approx_price) : null,
          rating_value: row.rating_value ? Number(row.rating_value) : 4.5,
          top: row.top ? String(row.top) : null,
          middle: row.middle ? String(row.middle) : null,
          base: row.base ? String(row.base) : null,
          mainaccords: accords,
          aiExplanation: item.aiExplanation,
          buyUrl: row.url ? String(row.url) : null,
        };
      });

    return finalResults;
  } catch (error) {
    console.error('❌ [FALLBACK ACTIVATED] Gemini ranking failed:', error);
    // Graceful fallback if Gemini API throws an error
    return candidates.slice(0, 5).map((row, idx) => {
      const accords = [row.mainaccord1, row.mainaccord2, row.mainaccord3].filter(Boolean) as string[];
      return {
        id: Number(row.id),
        perfume: String(row.perfume || 'Perfume'),
        brand: String(row.brand || 'Luxury House'),
        gender: String(row.gender || 'Unisex'),
        matchScore: 94 - idx * 3,
        approx_price: row.approx_price ? Number(row.approx_price) : null,
        rating_value: row.rating_value ? Number(row.rating_value) : 4.5,
        top: row.top ? String(row.top) : null,
        middle: row.middle ? String(row.middle) : null,
        base: row.base ? String(row.base) : null,
        mainaccords: accords,
        aiExplanation: `[AI Unavailable] A top SQL-scored match featuring ${accords.join(', ')}.`,
        buyUrl: row.url ? String(row.url) : null,
      };
    });
  }
}
