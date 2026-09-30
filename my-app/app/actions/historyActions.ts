'use server';

import { Pool } from 'pg';
import { PerfumeRecommendationResult } from '@/app/types/recommendation';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

export interface RecommendationHistoryItem {
  id: string;
  userId: string;
  transactionId?: string | null;
  rawPrompt: string;
  results: PerfumeRecommendationResult[];
  createdAt: string;
}

export async function getRecommendationHistoryAction(userId: string): Promise<{
  success: boolean;
  message?: string;
  history?: RecommendationHistoryItem[];
}> {
  try {
    if (!userId || userId === 'guest') {
      return {
        success: false,
        message: 'Valid user authentication required to fetch history.',
        history: [],
      };
    }

    const query = `
      SELECT 
        id, 
        "userId", 
        "transactionId", 
        "rawPrompt", 
        "resultsJson", 
        "createdAt"
      FROM "recommendation_logs"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC;
    `;

    const result = await pool.query(query, [userId]);

    const history: RecommendationHistoryItem[] = result.rows.map((row) => {
      let parsedResults: PerfumeRecommendationResult[] = [];
      try {
        parsedResults = typeof row.resultsJson === 'string' 
          ? JSON.parse(row.resultsJson) 
          : (row.resultsJson || []);
      } catch (e) {
        console.error('Failed to parse resultsJson for log:', row.id, e);
      }

      return {
        id: row.id,
        userId: row.userId,
        transactionId: row.transactionId,
        rawPrompt: row.rawPrompt || 'Custom Scent Consultation',
        results: parsedResults,
        createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
      };
    });

    return {
      success: true,
      history,
    };
  } catch (error: any) {
    console.error('❌ Error fetching recommendation history:', error);
    return {
      success: false,
      message: error?.message || 'Failed to retrieve recommendation history.',
      history: [],
    };
  }
}
