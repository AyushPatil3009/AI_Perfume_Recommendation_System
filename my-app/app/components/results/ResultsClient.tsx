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
  RefreshCcw,
  Lock,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PerfumeRecommendationResult } from '@/app/types/recommendation';
import { getRecommendationHistoryAction } from '@/app/actions/historyActions';

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
  const color = score >= 90 ? 'text-emerald-700' : score >= 75 ? 'text-[#704C16]' : 'text-stone-600';
  const bgColor = score >= 90 ? 'bg-emerald-50 border-emerald-300' : score >= 75 ? 'bg-[#C59B4B]/15 border-[#C59B4B]/40' : 'bg-stone-100 border-stone-200';
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border px-4 py-3 shadow-inner ${bgColor}`}>
      <span className={`font-mono text-3xl font-black ${color}`}>{score}%</span>
      <span className="text-[10px] uppercase tracking-widest text-stone-500 mt-0.5 font-bold">Match</span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C59B4B]/20 to-[#E6C675]/30 border border-[#C59B4B]/50 px-3 py-1 shadow-sm">
      <Trophy className="h-3.5 w-3.5 text-[#C59B4B]" />
      <span className="text-xs font-bold text-[#704C16]">Best Match</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1 rounded-full bg-stone-100 border border-stone-200 px-3 py-1">
      <span className="text-xs font-semibold text-stone-600">#{rank} Match</span>
    </div>
  );
}

function NoteChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#C59B4B]/30 bg-[#C59B4B]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#704C16]">
      <Droplets className="h-2.5 w-2.5 text-[#C59B4B]" />
      {name}
    </span>
  );
}

function PriceTierBadge({ price }: { price?: number | null }) {
  if (!price) return null;
  if (price <= 45) {
    return (
      <span className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-xs font-mono text-emerald-700" title="Under ₹3,500 (Budget Friendly)">
        $ · Budget Friendly
      </span>
    );
  }
  if (price <= 95) {
    return (
      <span className="rounded-full bg-blue-50 border border-blue-300 px-2.5 py-0.5 text-xs font-mono text-blue-700" title="₹3,500 – ₹7,500 (Designer Signature)">
        $$ · Designer
      </span>
    );
  }
  if (price <= 200) {
    return (
      <span className="rounded-full bg-[#C59B4B]/15 border border-[#C59B4B]/40 px-2.5 py-0.5 text-xs font-mono text-[#704C16]" title="₹7,500 – ₹16,000 (Luxury Designer)">
        $$$ · Luxury Designer
      </span>
    );
  }
  return (
    <span className="rounded-full bg-purple-50 border border-purple-300 px-2.5 py-0.5 text-xs font-mono text-purple-700" title="Above ₹16,000 (Haute Niche Parfumerie)">
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
      <div className={`relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-md backdrop-blur-md transition-all duration-500 hover:border-[#C59B4B]/60 hover:shadow-2xl ${rank === 1 ? 'border-[#C59B4B]/60 shadow-lg shadow-[#C59B4B]/10 ring-1 ring-[#C59B4B]/30' : ''}`}>
        <div className="relative z-10 p-6 md:p-8">
          {/* Top Row: Info + Score */}
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <RankBadge rank={rank} />
                <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-xs text-stone-600 font-mono">
                  {perfume.gender || 'Unisex'}
                </span>
                <PriceTierBadge price={perfume.approx_price} />
              </div>

              <h2 className="font-serif text-2xl font-bold text-stone-900 leading-tight">{perfume.perfume}</h2>
              <p className="text-sm text-stone-500 font-medium mt-0.5">{perfume.brand}</p>

              <div className="flex items-center gap-1.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(perfume.rating_value || 4.5) ? 'fill-[#C59B4B] text-[#C59B4B]' : 'text-stone-300'}`} />
                ))}
                <span className="text-xs text-stone-500 ml-1 font-semibold">{perfume.rating_value || 4.5}</span>
              </div>

              {/* Accords preview */}
              {perfume.mainaccords && perfume.mainaccords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {perfume.mainaccords.map((accord, idx) => (
                    <span key={idx} className="rounded-md bg-stone-100 border border-stone-200 px-2 py-0.5 text-[11px] text-stone-700 font-mono">
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
                className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm ${isWishlisted ? 'border-rose-400/50 bg-rose-50 text-rose-600' : 'border-stone-200 bg-white text-stone-400 hover:border-rose-300 hover:text-rose-600'}`}
              >
                <Heart className={`h-5 w-5 transition-all ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expand Toggle */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="mt-6 flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-[#C59B4B]/40 hover:text-[#704C16] hover:bg-white shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-[#C59B4B]" />
              {expanded ? 'Hide' : 'Show'} Olfactory Notes & AI Explanation
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Expanded Content */}
          {expanded && (
            <div className="mt-6 space-y-6">
              {/* AI Explanation */}
              <div className="rounded-2xl border border-[#C59B4B]/25 bg-[#FAF7F2] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-[#C59B4B] animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
                    Why we matched this for you
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-sans">{perfume.aiExplanation}</p>
              </div>

              {/* Fragrance Pyramid Notes */}
              {(topNotes.length > 0 || middleNotes.length > 0 || baseNotes.length > 0) && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">
                    Fragrance Note Pyramid
                  </h3>
                  <div className="space-y-3">
                    {topNotes.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase mr-2">Top:</span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1">
                          {topNotes.map((n, idx) => <NoteChip key={idx} name={n} />)}
                        </div>
                      </div>
                    )}
                    {middleNotes.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase mr-2">Heart:</span>
                        <div className="inline-flex flex-wrap gap-1.5 mt-1">
                          {middleNotes.map((n, idx) => <NoteChip key={idx} name={n} />)}
                        </div>
                      </div>
                    )}
                    {baseNotes.length > 0 && (
                      <div>
                        <span className="text-[11px] font-semibold text-stone-500 uppercase mr-2">Base:</span>
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
                    className="inline-flex items-center gap-2 rounded-xl border border-[#C59B4B]/40 bg-[#C59B4B]/10 px-5 py-2.5 text-sm font-semibold text-[#704C16] transition-all hover:bg-[#C59B4B] hover:text-white hover:scale-105 shadow-sm"
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
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string } | null | 'loading'>('loading');
  const [results, setResults] = useState<PerfumeRecommendationResult[]>([]);
  const [promptSummary, setPromptSummary] = useState('Your Custom Fragrance Match');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    async function loadData() {
      let activeUser: { id: string; email: string; name?: string } | null = null;
      try {
        const storedUser = localStorage.getItem('aura_user');
        if (storedUser) {
          activeUser = JSON.parse(storedUser);
          setCurrentUser(activeUser);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }

      // 1. First check sessionStorage for immediate display
      let hasSessionData = false;
      try {
        const storedResults = sessionStorage.getItem('aura_results');
        const storedPrompt = sessionStorage.getItem('aura_prompt');
        if (storedResults) {
          const parsed = JSON.parse(storedResults);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResults(parsed);
            hasSessionData = true;
          }
        }
        if (storedPrompt) {
          setPromptSummary(storedPrompt);
        }
      } catch (e) {
        console.error('Failed to parse session results', e);
      }

      // 2. If user is logged in, fetch the freshest prescription directly from PostgreSQL
      if (activeUser?.id) {
        try {
          const historyRes = await getRecommendationHistoryAction(activeUser.id);
          if (historyRes.success && historyRes.history && historyRes.history.length > 0) {
            const latest = historyRes.history[0];
            if (latest.results && latest.results.length > 0) {
              setResults(latest.results);
              setPromptSummary(latest.rawPrompt || 'Your Custom Fragrance Match');
              sessionStorage.setItem('aura_results', JSON.stringify(latest.results));
              sessionStorage.setItem('aura_prompt', latest.rawPrompt || 'Your Custom Fragrance Match');
              setIsLoading(false);
              return;
            }
          }
        } catch (dbErr) {
          console.error('Failed to sync history from DB in ResultsClient:', dbErr);
        }
      }

      setIsLoading(false);

      // If no data anywhere and not loading, redirect to dashboard if logged in or recommend
      if (!hasSessionData && !activeUser) {
        // Will show auth gate
      }
    }

    loadData();
  }, [router]);

  if (currentUser === 'loading' || isLoading) {
    return (
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-32 text-center">
        <div className="inline-flex items-center gap-2 text-[#704C16]">
          <Loader2 className="h-5 w-5 animate-spin text-[#C59B4B]" />
          <span className="text-sm font-mono">Loading curated results...</span>
        </div>
      </main>
    );
  }

  if (currentUser === null) {
    return (
      <main className="relative z-10 mx-auto max-w-lg px-4 py-24 sm:px-6">
        <FadeIn direction="up">
          <div className="glass-card rounded-3xl p-8 md:p-10 text-center shadow-xl relative overflow-hidden bg-white/95">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B]" />
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30">
              <Lock className="h-6 w-6 text-[#C59B4B]" />
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              Sign In to View <span className="golden-text-gradient">Results</span>
            </h1>
            <p className="text-stone-600 text-sm font-light leading-relaxed mb-8">
              Your personalized fragrance recommendations and sommelier analysis require an active account.
            </p>

            <button
              onClick={() => router.push('/login?redirect=/results')}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-[1.02] transition-all"
            >
              <span>Sign In to Access</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <FadeIn direction="up">
        <div className="mb-12">
          <Link
            href="/recommend"
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-all hover:border-[#C59B4B] hover:text-[#9A7025] hover:bg-stone-50 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Refine Preferences
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B4B]/35 bg-[#C59B4B]/10 px-4 py-1.5 mb-3">
                <Sparkles className="h-4 w-4 text-[#C59B4B] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
                  AI Matched — {results.length} Recommendations
                </span>
              </div>
              <h1 className="font-serif text-4xl font-extrabold sm:text-5xl text-stone-900">
                Your <span className="golden-text-gradient">Scent Profile</span>
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 max-w-lg shadow-inner">
                <Wind className="h-3.5 w-3.5 text-[#C59B4B] shrink-0" />
                <span className="text-xs text-stone-600 italic truncate">"{promptSummary}"</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/dashboard" className="flex h-10 items-center gap-2 rounded-xl border border-[#C59B4B]/35 bg-[#C59B4B]/10 px-4 text-sm font-semibold text-[#704C16] hover:bg-[#C59B4B]/20 transition-all shadow-sm">
                <Sparkles className="h-4 w-4 text-[#C59B4B]" /> Scent Vault
              </Link>
              <Link href="/recommend" className="flex h-10 items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-700 hover:border-[#C59B4B] hover:text-[#9A7025] transition-colors shadow-sm">
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
        <div className="glass-card rounded-2xl p-12 text-center bg-white/95 border border-stone-200 shadow-sm">
          <p className="text-stone-600 text-sm mb-4">No results found in current session. Take the questionnaire to get your personalized recommendations.</p>
          <Link href="/recommend" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] px-6 py-2.5 text-sm font-semibold text-white shadow-md">
            Take Scent Quiz
          </Link>
        </div>
      )}
    </main>
  );
}
