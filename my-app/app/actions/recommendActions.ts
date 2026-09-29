'use server';

import { PerfumePreferenceSchema, PerfumeRecommendationResult } from '@/app/types/recommendation';
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
}> {
  try {
    const parsed = PerfumePreferenceSchema.safeParse(inputData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid preferences.',
      };
    }

    const { gender, season, occasion, price, budget, intensity, note } = parsed.data;

    // 1. Hard Constraints
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
        maxPriceCondition = Prisma.empty; // High-end allows all upper prices
      } else {
        const numPrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^\d.]/g, ''));
        if (!isNaN(numPrice) && numPrice > 0) {
          maxPriceCondition = Prisma.sql`AND approx_price <= ${numPrice}`;
        }
      }
    }

    // 2. Soft SQL Scoring
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

    // Format top 5 candidates for UI
    const results: PerfumeRecommendationResult[] = candidates.slice(0, 5).map((row, idx) => {
      const accords = [row.mainaccord1, row.mainaccord2, row.mainaccord3].filter(Boolean) as string[];
      const rating = row.rating_value ? Number(row.rating_value) : 4.5;
      const score = Math.min(99, Math.round(85 + (5 - idx) * 2.5 + (rating >= 4.5 ? 2 : 0)));

      return {
        id: Number(row.id),
        perfume: String(row.perfume || 'Unknown Perfume'),
        brand: String(row.brand || 'Luxury House'),
        gender: String(row.gender || 'Unisex'),
        matchScore: score,
        approx_price: row.approx_price ? Number(row.approx_price) : null,
        rating_value: rating,
        top: row.top ? String(row.top) : null,
        middle: row.middle ? String(row.middle) : null,
        base: row.base ? String(row.base) : null,
        mainaccords: accords,
        aiExplanation: `Recommended for ${clean(season) || 'all season'} ${clean(occasion) || 'daily wear'} featuring standout accords of ${accords.join(', ') || 'luxurious notes'}.`,
        buyUrl: row.url ? String(row.url) : null,
      };
    });

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('❌ Error getting recommendations:', error);
    return {
      success: false,
      message: 'Failed to retrieve recommendations.',
    };
  }
}
