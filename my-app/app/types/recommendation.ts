import { z } from 'zod';

// ─── Input Preference Schema ──────────────────────────────────────────────────

export const PerfumePreferenceSchema = z.object({
  gender: z.string().trim().optional().nullable(),
  season: z.string().trim().optional().nullable(),
  occasion: z.string().trim().optional().nullable(),
  price: z.union([z.number(), z.string()]).optional().nullable(),
  budget: z.string().trim().optional().nullable(),
  intensity: z.union([z.number(), z.string()]).optional().nullable(),
  note: z.string().trim().optional().nullable(),
  userPrompt: z.string().trim().optional().nullable(),
});

export type PerfumePreferenceInput = z.infer<typeof PerfumePreferenceSchema>;

// ─── Real DB Perfume Row Schema (Kaggle Dataset) ─────────────────────────────

export interface PerfumeCandidate {
  id: number;
  url?: string | null;
  perfume?: string | null;
  brand?: string | null;
  gender?: string | null;
  rating_value?: number | null;
  rating_count?: number | null;
  top?: string | null;
  middle?: string | null;
  base?: string | null;
  mainaccord1?: string | null;
  mainaccord2?: string | null;
  mainaccord3?: string | null;
  approx_price?: number | null;
  season?: string | null;
  occasion?: string | null;
  intensity?: string | null;
  relevance_score?: number | null;
}

// ─── Final AI Recommended Output Schema ───────────────────────────────────────

export interface PerfumeRecommendationResult {
  id: number;
  perfume: string;
  brand: string;
  gender: string;
  matchScore: number;
  approx_price: number | null;
  rating_value: number | null;
  top: string | null;
  middle: string | null;
  base: string | null;
  mainaccords: string[];
  aiExplanation: string;
  buyUrl?: string | null;
}
