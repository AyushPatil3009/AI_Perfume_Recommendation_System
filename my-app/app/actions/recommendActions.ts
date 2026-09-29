'use server';

import { PerfumePreferenceSchema, PerfumeRecommendationResult } from '@/app/types/recommendation';
import { parseUserPromptWithGemini, rankAndExplainWithGemini } from '@/app/services/geminiService';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function clean(val: unknown): string {
  return typeof val === 'string' ? val.trim() : '';
}

function parseGender(val: string): string[] | undefined {
  const v = val.toLowerCase();
  if (['male', 'man', 'men', 'for him'].includes(v)) return ['men', 'male', 'unisex'];
  if (['female', 'women', 'woman', 'for her'].includes(v)) return ['women', 'female', 'unisex'];
  if (['unisex', 'all'].includes(v)) return ['unisex', 'men', 'women'];
  return undefined;
}

export async function getRecommendationsAction(inputData: unknown): Promise<{
  success: boolean;
  message?: string;
  results?: PerfumeRecommendationResult[];
  vibeSummary?: string;
}> {
  try {
    const rawInput = (inputData && typeof inputData === 'object') ? inputData : {};
    let parsedInput = PerfumePreferenceSchema.safeParse(rawInput);

    let userPromptText = (rawInput as { userPrompt?: string }).userPrompt;

    // ─── Phase 1: If Natural Text Prompt provided, parse with Gemini first ───
    if (userPromptText && userPromptText.trim().length >= 5) {
      console.log('🤖 Parsing natural text prompt with Gemini AI:', userPromptText);
      const aiExtracted = await parseUserPromptWithGemini(userPromptText);

      // Smart Intent Guard check
      if (aiExtracted.isOffTopic) {
        return {
          success: false,
          message: "Please describe a mood, season, memory, or scent preference (e.g. 'cozy rainy evening date' or 'fresh citrus office scent').",
        };
      }

      parsedInput = PerfumePreferenceSchema.safeParse(aiExtracted);
    }

    if (!parsedInput.success) {
      return {
        success: false,
        message: parsedInput.error.issues[0]?.message || 'Invalid preferences.',
      };
    }

    const { gender, season, occasion, price, budget, intensity, note, userPrompt } = parsedInput.data;

    // ─── Phase 2: Soft SQL Scoring against PostgreSQL ─────────────────────────
    const genderCondition: Prisma.Sql[] = [];
    if (gender) {
      const allowed = parseGender(gender);
      if (allowed && allowed.length > 0) {
        genderCondition.push(Prisma.sql`AND LOWER(gender) IN (${Prisma.join(allowed)})`);
      }
    }

    const rawPrice = price ?? budget;
    let maxPriceCondition = Prisma.empty;
    if (rawPrice !== undefined && rawPrice !== null) {
      if (rawPrice === '$') {
        maxPriceCondition = Prisma.sql`AND approx_price <= 45`;
      } else if (rawPrice === '$$') {
        maxPriceCondition = Prisma.sql`AND approx_price <= 95`;
      } else if (rawPrice === '$$$') {
        maxPriceCondition = Prisma.sql`AND approx_price <= 200`;
      } else if (rawPrice === '$$$$') {
        maxPriceCondition = Prisma.empty;
      } else {
        const numPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^\d.]/g, ''));
        if (!isNaN(numPrice) && numPrice > 0) {
          maxPriceCondition = Prisma.sql`AND approx_price <= ${numPrice}`;
        }
      }
    }

    const seasonTerm = season ? `%${clean(season)}%` : null;
    const occasionTerm = occasion ? `%${clean(occasion)}%` : null;
    const intensityTerm = intensity ? `%${clean(intensity)}%` : null;
    const noteTerm = note ? `%${clean(note)}%` : null;

    const query = Prisma.sql`
      SELECT 
        id, url, perfume, brand, gender, rating_value, rating_count,
        top, middle, base, mainaccord1, mainaccord2, mainaccord3,
        approx_price, season, occasion, intensity,
        (
          (CASE WHEN ${occasionTerm}::text IS NOT NULL AND occasion ILIKE ${occasionTerm} THEN 3.0 ELSE 0.0 END) +
          (CASE WHEN ${seasonTerm}::text IS NOT NULL AND season ILIKE ${seasonTerm} THEN 2.5 ELSE 0.0 END) +
          (CASE WHEN ${noteTerm}::text IS NOT NULL AND (
            top ILIKE ${noteTerm} OR middle ILIKE ${noteTerm} OR base ILIKE ${noteTerm} OR
            mainaccord1 ILIKE ${noteTerm} OR mainaccord2 ILIKE ${noteTerm}
          ) THEN 2.0 ELSE 0.0 END) +
          (CASE WHEN ${intensityTerm}::text IS NOT NULL AND intensity ILIKE ${intensityTerm} THEN 1.0 ELSE 0.0 END) +
          COALESCE(rating_value, 4.0)
        ) AS relevance_score
      FROM "perfumes"
      WHERE id <= 100
        ${Prisma.join(genderCondition, ' ')}
        ${maxPriceCondition}
      ORDER BY relevance_score DESC, rating_value DESC
      LIMIT 20;
    `;

    const candidates = await prisma.$queryRaw<Record<string, unknown>[]>(query);

    // ─── Phase 3: Gemini Sommelier Reranking & Custom Explanations ───────────
    const vibeDescription = userPrompt || `${season || 'All-Season'} ${occasion || 'Daily'} (${gender || 'Unisex'}) ${note ? 'with notes of ' + note : ''}`;
    
    console.log('🤖 Reranking 20 candidates and generating explanations with Gemini...');
    const results = await rankAndExplainWithGemini(vibeDescription, candidates);

    return {
      success: true,
      results,
      vibeSummary: vibeDescription,
    };
  } catch (error) {
    console.error('❌ Error in getRecommendationsAction:', error);
    return {
      success: false,
      message: 'Failed to retrieve AI recommendations.',
    };
  }
}
