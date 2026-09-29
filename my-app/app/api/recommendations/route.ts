import { z } from 'zod';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export const runtime = 'nodejs';

// Initialize Prisma with PG pool adapter
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Input Validation Schema ──────────────────────────────────────────────────

const requestSchema = z.object({
  gender: z.string().trim().optional().nullable(),
  season: z.string().trim().optional().nullable(),
  occasion: z.string().trim().optional().nullable(),
  price: z.union([z.number(), z.string()]).optional().nullable(),
  budget: z.string().trim().optional().nullable(),
  intensity: z.union([z.number(), z.string()]).optional().nullable(),
  note: z.string().trim().optional().nullable(),
});

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

// ─── POST Handler with Soft SQL Scoring ───────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: parsed.error.issues[0]?.message ?? 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { gender, season, occasion, price, budget, intensity, note } = parsed.data;

    // 1. Hard Constraints (Gender & Budget Dealbreakers only)
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

    // 2. Soft SQL Scoring Weights (Rank relevant candidates to the top)
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
          -- Soft scoring point calculation
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

    return Response.json({
      success: true,
      candidateCount: candidates.length,
      candidates,
    });
  } catch (error) {
    console.error('❌ Error in soft SQL scoring:', error);
    return Response.json(
      { success: false, message: 'Internal Server Error while querying perfumes.' },
      { status: 500 }
    );
  }
}