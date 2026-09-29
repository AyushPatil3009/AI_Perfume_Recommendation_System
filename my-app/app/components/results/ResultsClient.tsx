'use client';

import { useState, useRef, useEffect, useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Star,
  ArrowLeft,
  Trophy,
  Droplets,
  Wind,
  Flame,
  Share2,
  RefreshCcw,
} from 'lucide-react';
import { PerfumeRecommendationResult } from '@/app/types/recommendation';


function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' }) {
  const { ref, inView } = useInView();
  const map = { up: 'translate-y-10', left: 'translate-x-10', right: '-translate-x-10' };
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${map[direction]}`}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? 'text-emerald-400' : score >= 75 ? 'text-amber-400' : 'text-zinc-400';
  const bgColor = score >= 90 ? 'bg-emerald-500/10 border-emerald-500/40' : score >= 75 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-zinc-700/20 border-zinc-600/40';
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-3 ${bgColor}`}>
      <span className={`font-mono text-3xl font-black ${color}`}>{score}%</span>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">Match</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 px-3 py-1">
      <Trophy className="h-3.5 w-3.5 text-amber-400" />
      <span className="text-xs font-bold text-amber-300">Best Match</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1 rounded-full bg-zinc-800/80 border border-zinc-700 px-3 py-1">
      <span className="text-xs font-semibold text-zinc-400">#{rank} Match</span>
    </div>
  );
}

function NoteChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
      <Droplets className="h-2.5 w-2.5" />
      {name}
    </span>
  );
}

function PriceTierBadge({ price }: { price?: number | null }) {
  if (!price) return null;
  if (price <= 45) {
    return (
      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono text-emerald-300" title="Under ₹3,500 (Budget Friendly)">
        $ · Budget Friendly
      </span>
    );
  }
  if (price <= 95) {
    return (
      <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-mono text-blue-300" title="₹3,500 – ₹7,500 (Designer Signature)">
        $$ · Designer
      </span>
    );
  }
  if (price <= 200) {
    return (
      <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-mono text-amber-300" title="₹7,500 – ₹16,000 (Luxury Designer)">
        $$$ · Luxury Designer
      </span>
    );
  }
  return (
    <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 text-xs font-mono text-purple-300" title="Above ₹16,000 (Haute Niche Parfumerie)">
      $$$$ · Niche Parfumerie
    </span>
  );
}

// ─── Result Card Component ───────────────────────────────────────────────────

function ResultCard({ perfume, rank, delay }: { perfume: PerfumeRecommendationResult; rank: number; delay: number }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const [isWishlisted, setIsWishlisted] = useOptimistic(false);
  const [, startTransition] = useTransition();

  function toggleWishlist() {
    startTransition(() => {
      setIsWishlisted((prev) => !prev);
    });
  }

  // Parse notes string into arrays
  const topNotes = perfume.top ? perfume.top.split(',').map(s => s.trim()) : [];
  const middleNotes = perfume.middle ? perfume.middle.split(',').map(s => s.trim()) : [];
  const baseNotes = perfume.base ? perfume.base.split(',').map(s => s.trim()) : [];

  return (
    <FadeIn direction="up" delay={delay}>
      <div className={`relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md transition-all duration-500 hover:border-zinc-700/80 hover:shadow-2xl ${rank === 1 ? 'border-amber-500/30 shadow-lg shadow-amber-500/10' : ''}`}>
        <div className="relative z-10 p-6 md:p-8">
          {/* Top Row: Info + Score */}
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <RankBadge rank={rank} />
                <span className="rounded-full bg-zinc-800/80 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400 font-mono">
                  {perfume.gender || 'Unisex'}
                </span>
                <PriceTierBadge price={perfume.approx_price} />
              </div>

              <h2 className="font-serif text-2xl font-bold text-white leading-tight">{perfume.perfume}</h2>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">{perfume.brand}</p>

              <div className="flex items-center gap-1.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(perfume.rating_value || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                ))}
                <span className="text-xs text-zinc-500 ml-1">{perfume.rating_value || 4.5}</span>
              </div>

              {/* Accords preview */}
              {perfume.mainaccords && perfume.mainaccords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {perfume.mainaccords.map((accord, idx) => (
                    <span key={idx} className="rounded-md bg-zinc-800/60 border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-300 font-mono">
                      #{accord}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Match Score + Wishlist */}
            <div className="flex sm:flex-col items-center gap-3 shrink-0">
              <ScoreRing score={perfume.matchScore} />
              <button
                onClick={toggleWishlist}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-110 active:scale-95 ${isWishlisted ? 'border-rose-400/50 bg-rose-500/15 text-rose-400' : 'border-zinc-700 bg-zinc-800/60 text-zinc-500 hover:border-rose-400/30 hover:text-rose-400'}`}
              >
                <Heart className={`h-5 w-5 transition-all ${isWishlisted ? 'fill-rose-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-6 flex w-full items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-800/40 px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:border-amber-500/20 hover:text-amber-300"
          >
            <span className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-amber-400" />
              {expanded ? 'Hide' : 'Show'} Olfactory Notes & AI Explanation
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Expanded Content */}
          {expanded && (
            <div className="mt-6 space-y-6">
              {/* AI Explanation */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                    Why we matched this for you
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{perfume.aiExplanation}</p>
              </div>

              {/* Fragrance Pyramid Notes */}
              {(topNotes.length > 0 || middleNotes.length > 0 || baseNotes.length > 0) && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                    Fragrance Note Pyramid
                  </h3>
                  <div className="space-y-3">
                    {topNotes.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-2">Top:</span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1">
                          {topNotes.map((n, idx) => <NoteChip key={idx} name={n} />)}
                        </div>
                      </div>
                    )}
                    {middleNotes.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-2">Heart:</span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1">
                          {middleNotes.map((n, idx) => <NoteChip key={idx} name={n} />)}
                        </div>
                      </div>
                    )}
                    {baseNotes.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase mr-2">Base:</span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1">
                          {baseNotes.map((n, idx) => <NoteChip key={idx} name={n} />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Buy / View Link */}
              {perfume.buyUrl && (
                <div>
                  <a
                    href={perfume.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20 hover:scale-105"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>View Store Link</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Results Client Main Component ───────────────────────────────────────────

export function ResultsClient() {
  const [results, setResults] = useState<PerfumeRecommendationResult[]>([]);
  const [promptSummary, setPromptSummary] = useState('Your Custom Fragrance Match');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem('aura_results');
      const storedPrompt = sessionStorage.getItem('aura_prompt');

      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResults(parsed);
          }
        } catch (e) {
          console.error('Failed to parse session results', e);
        }
      }

      if (storedPrompt) {
        setPromptSummary(storedPrompt);
      }
    }
  }, []);

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <FadeIn direction="up">
        <div className="mb-12">
          <Link
            href="/recommend"
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-400 transition-all hover:border-amber-500/30 hover:text-amber-300"
          >
            <ArrowLeft className="h-4 w-4" /> Refine Preferences
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mb-3">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                  AI Matched — {results.length} Recommendations
                </span>
              </div>
              <h1 className="font-serif text-4xl font-extrabold sm:text-5xl">
                Your <span className="golden-text-gradient">Scent Profile</span>
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2 max-w-lg">
                <Wind className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-zinc-400 italic truncate">"{promptSummary}"</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/recommend" className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-zinc-400 hover:border-amber-500/30 hover:text-amber-300 transition-colors">
                <RefreshCcw className="h-4 w-4" /> New Search
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Result Cards */}
      {results.length > 0 ? (
        <div className="space-y-6">
          {results.map((perfume, i) => (
            <ResultCard key={perfume.id || i} perfume={perfume} rank={i + 1} delay={i * 100} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-zinc-400 text-sm mb-4">No results found in current session. Take the questionnaire to get your personalized recommendations.</p>
          <Link href="/recommend" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-zinc-950">
            Take Scent Quiz
          </Link>
        </div>
      )}
    </main>
  );
}
