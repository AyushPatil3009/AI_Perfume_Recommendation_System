'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Search,
  ChevronDown,
  Calendar,
  Star,
  ShoppingCart,
  ExternalLink,
  Lock,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Wind,
  TrendingUp,
  Flame,
  Award,
  FlaskConical,
  CheckCircle2,
} from 'lucide-react';
import { getRecommendationHistoryAction, RecommendationHistoryItem } from '@/app/actions/historyActions';
import { PerfumeRecommendationResult } from '@/app/types/recommendation';

// ─── Animation Wrapper Hook ──────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Note Chip Component ─────────────────────────────────────────────────────

function NoteChip({ name, type }: { name: string; type?: 'top' | 'heart' | 'base' | 'accord' }) {
  const colorMap = {
    top: 'border-[#C59B4B]/30 bg-[#C59B4B]/10 text-[#704C16]',
    heart: 'border-rose-400/30 bg-rose-50 text-rose-700',
    base: 'border-amber-700/30 bg-amber-50 text-amber-800',
    accord: 'border-stone-200 bg-stone-100 text-stone-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-all hover:scale-105 ${
        colorMap[type || 'accord']
      }`}
    >
      {name}
    </span>
  );
}

// ─── Single Perfume Result Card (Inside Expanded Accordion) ───────────────────

function HistoryPerfumeCard({
  perfume,
  rank,
}: {
  perfume: PerfumeRecommendationResult;
  rank: number;
}) {
  const topNotes = perfume.top ? perfume.top.split(',').map((n) => n.trim()).filter(Boolean) : [];
  const middleNotes = perfume.middle ? perfume.middle.split(',').map((n) => n.trim()).filter(Boolean) : [];
  const baseNotes = perfume.base ? perfume.base.split(',').map((n) => n.trim()).filter(Boolean) : [];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B4B]/60 hover:shadow-xl hover:shadow-[#C59B4B]/10">
      <div className="relative z-10 flex flex-col justify-between gap-4 h-full">
        <div>
          {/* Header Bar: Rank Badge + Match Score */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C59B4B]/30 bg-[#C59B4B]/10 px-2.5 py-1 text-[11px] font-bold text-[#704C16] uppercase tracking-wider font-mono">
              <Award className="h-3.5 w-3.5 text-[#C59B4B]" />
              Rank #{rank}
            </span>

            <div className="flex items-center gap-1.5 rounded-full bg-stone-50 border border-stone-200/80 px-2.5 py-1 shadow-inner">
              <Flame className="h-3.5 w-3.5 text-[#C59B4B]" />
              <span className="text-xs font-bold text-stone-900 font-mono">{perfume.matchScore}% Match</span>
            </div>
          </div>

          {/* Perfume Title & Brand */}
          <h4 className="font-serif text-lg font-bold text-stone-900 line-clamp-1">
            {perfume.perfume}
          </h4>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-3">
            {perfume.brand} • <span className="capitalize">{perfume.gender || 'Unisex'}</span>
          </p>

          {/* AI Match Explanation Quote */}
          {perfume.aiExplanation && (
            <div className="relative mb-4 rounded-xl border border-[#C59B4B]/20 bg-[#FAF7F2] p-3 text-xs leading-relaxed text-stone-700 italic">
              <span className="text-[#C59B4B] font-serif font-bold text-sm mr-1">“</span>
              {perfume.aiExplanation}
              <span className="text-[#C59B4B] font-serif font-bold text-sm ml-1">”</span>
            </div>
          )}

          {/* Olfactory Pyramid Accordion / Tags */}
          <div className="space-y-2 mb-4">
            {topNotes.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest w-12">Top:</span>
                {topNotes.slice(0, 3).map((n, i) => (
                  <NoteChip key={i} name={n} type="top" />
                ))}
              </div>
            )}
            {middleNotes.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest w-12">Heart:</span>
                {middleNotes.slice(0, 3).map((n, i) => (
                  <NoteChip key={i} name={n} type="heart" />
                ))}
              </div>
            )}
            {baseNotes.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest w-12">Base:</span>
                {baseNotes.slice(0, 3).map((n, i) => (
                  <NoteChip key={i} name={n} type="base" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Meta + Store Link */}
        <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            {perfume.rating_value && (
              <div className="flex items-center gap-1 text-[#C59B4B]">
                <Star className="h-3.5 w-3.5 fill-[#C59B4B]" />
                <span className="font-semibold text-stone-900">{perfume.rating_value}</span>
              </div>
            )}
            {perfume.approx_price && (
              <span className="text-stone-600 font-mono font-medium">
                ~${perfume.approx_price}
              </span>
            )}
          </div>

          {perfume.buyUrl ? (
            <a
              href={perfume.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C59B4B]/40 bg-[#C59B4B]/10 px-3 py-1.5 text-xs font-semibold text-[#704C16] transition-all hover:bg-[#C59B4B] hover:text-white hover:scale-105"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Buy Link</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ) : (
            <span className="text-[11px] text-stone-500 italic">Curated Match</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Consultation Prescription Card Component ─────────────────────────────────

function PrescriptionCard({
  item,
  index,
  isDefaultOpen = false,
}: {
  item: RecommendationHistoryItem;
  index: number;
  isDefaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const [copied, setCopied] = useState(false);

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(item.createdAt);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return item.createdAt;
    }
  }, [item.createdAt]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.rawPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FadeIn delay={index * 80}>
      <div className="moving-border-card">
        <div className="relative z-10 w-full rounded-[calc(1.5rem-1.5px)] bg-white/95 p-6 md:p-7 backdrop-blur-xl shadow-md">
          {/* Top Gold Accent Line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#C59B4B]/50 to-transparent" />

          {/* Header Section: Prescription Tag + Date + Interactive Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200/80">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#C59B4B]/30 bg-[#C59B4B]/10 px-3 py-1 text-xs font-semibold text-[#704C16] font-mono">
                  <FlaskConical className="h-3.5 w-3.5 text-[#C59B4B]" />
                  Prescription #{item.id.slice(-6).toUpperCase()}
                </span>

                <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  {formattedDate}
                </span>

                <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-[11px] font-semibold text-stone-700">
                  {item.results.length} Matches Curated
                </span>
              </div>

              {/* Prompt Statement */}
              <div className="flex items-start gap-2 pt-2">
                <Wind className="h-4 w-4 text-[#C59B4B] mt-1 shrink-0" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">User Input Profile</p>
                  <p className="text-sm font-medium text-stone-900 mt-0.5 font-sans leading-relaxed">
                    "{item.rawPrompt}"
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <button
                onClick={handleCopyPrompt}
                title="Copy Scent Prompt"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition-all hover:border-[#C59B4B]/60 hover:text-[#704C16] hover:bg-white shadow-sm"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B]/15 to-[#D4AF37]/20 border border-[#C59B4B]/35 px-4 text-xs font-semibold text-[#704C16] transition-all hover:bg-[#C59B4B]/25 active:scale-95 shadow-sm"
              >
                <span>{isOpen ? 'Collapse Match Vault' : 'Explore 5 Matches'}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#C59B4B] transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Collapsible Vault: Top 5 Perfumes Grid */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isOpen ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
            }`}
          >
            <div className="overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C59B4B]" />
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-stone-900">
                    Curated AI Fragrance Prescription
                  </h3>
                </div>
                <span className="text-xs text-stone-500">Ranked by Gemini AI Resonance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.results.map((perfume, pIndex) => (
                  <HistoryPerfumeCard
                    key={perfume.id || pIndex}
                    perfume={perfume}
                    rank={pIndex + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Main Dashboard Client Component ──────────────────────────────────────────

export function DashboardClient() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string } | null | 'loading'>('loading');
  const [history, setHistory] = useState<RecommendationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'evening' | 'summer' | 'office'>('all');

  // 1. Check user login from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('aura_user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setCurrentUser(userObj);
          fetchHistory(userObj.id);
        } else {
          setCurrentUser(null);
          setIsLoading(false);
        }
      } catch {
        setCurrentUser(null);
        setIsLoading(false);
      }
    }
  }, []);

  // 2. Fetch history from Postgres server action
  async function fetchHistory(userId: string) {
    setIsLoading(true);
    try {
      const response = await getRecommendationHistoryAction(userId);
      if (response.success && response.history) {
        setHistory(response.history);
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Computed stats
  const totalConsultations = history.length;
  const totalPerfumesExplored = useMemo(() => {
    return history.reduce((acc, curr) => acc + (curr.results?.length || 0), 0);
  }, [history]);

  // 4. Filtered & Searched history list
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Search query match (Prompt or Perfume name inside results)
      const q = searchQuery.toLowerCase().trim();
      const matchesPrompt = item.rawPrompt.toLowerCase().includes(q);
      const matchesPerfume = item.results.some(
        (p) =>
          p.perfume.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.top && p.top.toLowerCase().includes(q))
      );
      const matchesSearch = !q || matchesPrompt || matchesPerfume;

      // Filter tags
      if (!matchesSearch) return false;

      if (activeFilter === 'recent') {
        const itemDate = new Date(item.createdAt).getTime();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return itemDate >= oneWeekAgo;
      }
      if (activeFilter === 'evening') {
        return item.rawPrompt.toLowerCase().includes('night') || item.rawPrompt.toLowerCase().includes('date') || item.rawPrompt.toLowerCase().includes('evening') || item.rawPrompt.toLowerCase().includes('party');
      }
      if (activeFilter === 'summer') {
        return item.rawPrompt.toLowerCase().includes('summer') || item.rawPrompt.toLowerCase().includes('fresh') || item.rawPrompt.toLowerCase().includes('citrus') || item.rawPrompt.toLowerCase().includes('spring');
      }
      if (activeFilter === 'office') {
        return item.rawPrompt.toLowerCase().includes('office') || item.rawPrompt.toLowerCase().includes('work') || item.rawPrompt.toLowerCase().includes('formal') || item.rawPrompt.toLowerCase().includes('casual');
      }

      return true;
    });
  }, [history, searchQuery, activeFilter]);

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (currentUser === 'loading') {
    return (
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-32 text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#C59B4B]/30 bg-white/95 px-6 py-3 text-[#704C16] backdrop-blur-xl shadow-md">
          <RefreshCw className="h-5 w-5 animate-spin text-[#C59B4B]" />
          <span className="text-sm font-mono tracking-wider">Accessing Atelier Vault...</span>
        </div>
      </main>
    );
  }

  // ─── Auth Gate State ───────────────────────────────────────────────────────
  if (currentUser === null) {
    return (
      <main className="relative z-10 mx-auto max-w-lg px-4 py-24 sm:px-6">
        <FadeIn>
          <div className="glass-card relative overflow-hidden rounded-3xl p-8 md:p-10 text-center shadow-xl bg-white/95">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B]" />
            
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30">
              <Lock className="h-6 w-6 text-[#C59B4B]" />
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mb-2">
              Sign In to View <span className="golden-text-gradient">Past Curations</span>
            </h1>
            <p className="text-stone-600 text-sm font-light leading-relaxed mb-8">
              Your personalized AI fragrance prescriptions and scent history are securely tied to your Aura account.
            </p>

            <button
              onClick={() => router.push('/login?redirect=/dashboard')}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-[1.02] transition-all"
            >
              <span>Sign In to Access Vault</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ─── Hero / Header Banner ────────────────────────────────────────── */}
      <FadeIn>
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-[#C59B4B]/25 bg-white/95 p-8 md:p-10 backdrop-blur-2xl shadow-xl shadow-[#C59B4B]/5">
          {/* Circulating Background Glow Spots */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C59B4B]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#E6C675]/15 blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B4B]/30 bg-[#C59B4B]/10 px-4 py-1.5 mb-3">
                <Sparkles className="h-4 w-4 text-[#C59B4B] animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
                  Personal Scent Archive
                </span>
              </div>
              <h1 className="font-serif text-3xl font-extrabold sm:text-5xl text-stone-900">
                Fragrance <span className="golden-text-gradient">Prescription History</span>
              </h1>
              <p className="mt-2 text-sm text-stone-600 max-w-xl font-light leading-relaxed">
                Review your bespoke AI olfactory formulas, revisit specific mood requests, and discover store purchase links anytime.
              </p>
            </div>

            {/* Quick Actions & New Scent Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/recommend"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>New Scent Consultation</span>
              </Link>
            </div>
          </div>

          {/* Stat Counters Banner */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200/80">
            <div className="flex items-center gap-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30">
                <FlaskConical className="h-5 w-5 text-[#9A7025]" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Consultations</p>
                <p className="font-mono text-xl font-bold text-stone-900">{totalConsultations}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30">
                <TrendingUp className="h-5 w-5 text-[#9A7025]" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Perfumes Matched</p>
                <p className="font-mono text-xl font-bold text-stone-900">{totalPerfumesExplored}</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Status</p>
                <p className="font-mono text-sm font-semibold text-emerald-700">Vault Synced</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ─── Filter & Search Bar ─────────────────────────────────────────── */}
      <FadeIn delay={50}>
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by prompt, perfume, or note..."
              className="w-full rounded-2xl border border-stone-300 bg-white pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 backdrop-blur-md focus:border-[#C59B4B] focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/50 transition-all shadow-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveFilter('all')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#C59B4B] to-[#B8860B] text-white shadow-md shadow-[#C59B4B]/20'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setActiveFilter('recent')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === 'recent'
                  ? 'bg-gradient-to-r from-[#C59B4B] to-[#B8860B] text-white shadow-md shadow-[#C59B4B]/20'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setActiveFilter('evening')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === 'evening'
                  ? 'bg-gradient-to-r from-[#C59B4B] to-[#B8860B] text-white shadow-md shadow-[#C59B4B]/20'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Date & Evening
            </button>
            <button
              onClick={() => setActiveFilter('summer')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === 'summer'
                  ? 'bg-gradient-to-r from-[#C59B4B] to-[#B8860B] text-white shadow-md shadow-[#C59B4B]/20'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Fresh & Summer
            </button>
            <button
              onClick={() => setActiveFilter('office')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                activeFilter === 'office'
                  ? 'bg-gradient-to-r from-[#C59B4B] to-[#B8860B] text-white shadow-md shadow-[#C59B4B]/20'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              Work / Casual
            </button>
          </div>
        </div>
      </FadeIn>

      {/* ─── List of Prescriptions ───────────────────────────────────────── */}
      {isLoading ? (
        <div className="py-24 text-center">
          <RefreshCw className="h-8 w-8 text-[#C59B4B] animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500 font-mono">Decrypting Scent Vault...</p>
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="space-y-6">
          {filteredHistory.map((item, index) => (
            <PrescriptionCard
              key={item.id}
              item={item}
              index={index}
              isDefaultOpen={index === 0}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <FadeIn>
          <div className="glass-card relative overflow-hidden rounded-3xl p-12 text-center max-w-xl mx-auto bg-white/95 shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30">
              <FlaskConical className="h-8 w-8 text-[#C59B4B] animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              No Scent Prescriptions Found
            </h3>
            <p className="text-stone-600 text-sm font-light leading-relaxed mb-6">
              {searchQuery
                ? `No consultation records match "${searchQuery}". Try clearing your search query.`
                : 'You have not unlocked any custom AI fragrance recommendations yet. Take your first personalized scent consultation now.'}
            </p>

            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-all shadow-sm"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/recommend"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-105 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Begin First Consultation</span>
              </Link>
            )}
          </div>
        </FadeIn>
      )}
    </main>
  );
}
