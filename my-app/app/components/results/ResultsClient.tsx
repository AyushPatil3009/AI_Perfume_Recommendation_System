'use client';

import { useState, useRef, useEffect, useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Heart,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Star,
  ArrowLeft,
  Sun,
  Snowflake,
  Flower2,
  Leaf,
  Briefcase,
  PartyPopper,
  Coffee,
  Trophy,
  Droplets,
  Wind,
  Flame,
  Share2,
  RefreshCcw,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Note {
  name: string;
  family: string;
}

interface PerfumeResult {
  id: string;
  rank: number;
  matchScore: number;
  title: string;
  brand: string;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  priceRange: string;
  rating: number;
  imageUrl: string;
  description: string;
  aiExplanation: string;
  topNotes: Note[];
  heartNotes: Note[];
  baseNotes: Note[];
  seasons: { summer: number; winter: number; spring: number; autumn: number };
  occasions: { office: number; dateNight: number; casual: number; party: number };
  amazonUrl?: string;
  flipkartUrl?: string;
  officialUrl?: string;
  accentColor: string;
  glowColor: string;
}

// ─── Mock Data (will be replaced by real DB + AI data in Phase 3 & 4) ─────────

const MOCK_RESULTS: PerfumeResult[] = [
  {
    id: '1',
    rank: 1,
    matchScore: 97,
    title: 'Tobacco Vanille',
    brand: 'Tom Ford',
    gender: 'UNISEX',
    priceRange: '$$$$',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800',
    description: 'Opulent, warm, and iconic. Reminiscent of an English Gentlemen\'s Club with tobacco leaf, aromatic spices, and sweet bourbon vanilla.',
    aiExplanation: 'Your input described a "cozy, warm autumn evening with a hint of vanilla and leather." Tobacco Vanille scores 97% because it leads with cardamom warmth, builds on tonka bean, and anchors deeply in Bourbon Vanilla — exactly the olfactory palette you described. Its winter and evening performance ratings (10/10) align perfectly with your stated occasion.',
    topNotes: [{ name: 'Cardamom', family: 'Spicy' }],
    heartNotes: [{ name: 'Tonka Bean', family: 'Gourmand' }, { name: 'Cognac', family: 'Gourmand' }],
    baseNotes: [{ name: 'Bourbon Vanilla', family: 'Gourmand' }, { name: 'Tobacco', family: 'Woody' }],
    seasons: { summer: 2, winter: 10, spring: 4, autumn: 10 },
    occasions: { office: 4, dateNight: 10, casual: 5, party: 9 },
    amazonUrl: 'https://www.amazon.com/dp/B002ZCDV5S',
    flipkartUrl: 'https://www.flipkart.com/p/itmtf123456',
    officialUrl: 'https://www.tomfordbeauty.com',
    accentColor: 'from-amber-500/20 via-yellow-700/10 to-orange-900/10',
    glowColor: 'shadow-amber-500/20',
  },
  {
    id: '2',
    rank: 2,
    matchScore: 91,
    title: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    gender: 'UNISEX',
    priceRange: '$$$$',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800',
    description: 'A luminous amber-floral breeze. Jasmine saffron accord melting into cedarwood and warm ambroxan.',
    aiExplanation: 'Baccarat Rouge 540 scores 91% because its amber-floral DNA resonates with your warm evening preference. The ambroxan trail is legendary for intimate date-night sillage — projecting beautifully without overwhelming. Its cedarwood base adds the earthy depth you requested.',
    topNotes: [{ name: 'Saffron', family: 'Spicy' }, { name: 'Jasmine', family: 'Floral' }],
    heartNotes: [{ name: 'Amberwood', family: 'Amber' }, { name: 'Ambroxan', family: 'Amber' }],
    baseNotes: [{ name: 'Cedarwood', family: 'Woody' }, { name: 'Fir Resin', family: 'Resinous' }],
    seasons: { summer: 5, winter: 10, spring: 7, autumn: 10 },
    occasions: { office: 6, dateNight: 10, casual: 6, party: 10 },
    amazonUrl: 'https://www.amazon.com/dp/B01BML3JIK',
    officialUrl: 'https://www.franciskurkdjian.com',
    accentColor: 'from-rose-500/15 via-amber-600/10 to-zinc-900/10',
    glowColor: 'shadow-rose-500/20',
  },
  {
    id: '3',
    rank: 3,
    matchScore: 84,
    title: 'Sauvage Eau de Parfum',
    brand: 'Dior',
    gender: 'MALE',
    priceRange: '$$$',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800',
    description: 'Magnetic bergamot, smoky Ambroxan, and warm vanilla — mysterious and effortlessly contemporary.',
    aiExplanation: 'Sauvage EDP ranks 3rd at 84% because while it excels in your season and occasion categories, its fresh-spicy opening in bergamot is slightly removed from the purely warm, cozy character you described. However, the lavender-vanilla-ambroxan heart matches your evening warmth notes closely.',
    topNotes: [{ name: 'Bergamot', family: 'Citrus' }, { name: 'Pepper', family: 'Spicy' }],
    heartNotes: [{ name: 'Lavender', family: 'Floral' }, { name: 'Cardamom', family: 'Spicy' }],
    baseNotes: [{ name: 'Ambroxan', family: 'Amber' }, { name: 'Vanilla', family: 'Gourmand' }, { name: 'Cedarwood', family: 'Woody' }],
    seasons: { summer: 6, winter: 9, spring: 7, autumn: 9 },
    occasions: { office: 7, dateNight: 10, casual: 8, party: 9 },
    amazonUrl: 'https://www.amazon.com/dp/B078WZ6N31',
    flipkartUrl: 'https://www.flipkart.com/p/itm12345678',
    officialUrl: 'https://www.dior.com',
    accentColor: 'from-sky-600/15 via-indigo-800/10 to-zinc-900/10',
    glowColor: 'shadow-sky-500/20',
  },
  {
    id: '4',
    rank: 4,
    matchScore: 79,
    title: 'Parfums de Marly Delina',
    brand: 'Parfums de Marly',
    gender: 'FEMALE',
    priceRange: '$$$$',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800',
    description: 'A charming floral bouquet of damask rose, lychee, and creamy vanilla with an aura of timeless sophistication.',
    aiExplanation: 'Delina scores 79% — strong in the vanilla-warmth base notes you described, but leads with a prominently floral rose accord that partially diverges from your leather-wood request. Excellent pick if you enjoy adding a romantic-feminine angle to a cozy evening scent.',
    topNotes: [{ name: 'Bergamot', family: 'Citrus' }, { name: 'Lychee', family: 'Fruity' }],
    heartNotes: [{ name: 'Damask Rose', family: 'Floral' }, { name: 'Peony', family: 'Floral' }],
    baseNotes: [{ name: 'Bourbon Vanilla', family: 'Gourmand' }, { name: 'Cedarwood', family: 'Woody' }],
    seasons: { summer: 8, winter: 5, spring: 10, autumn: 7 },
    occasions: { office: 8, dateNight: 10, casual: 9, party: 9 },
    flipkartUrl: 'https://www.flipkart.com/p/itmpdm888',
    officialUrl: 'https://parfums-de-marly.com',
    accentColor: 'from-pink-500/15 via-rose-700/10 to-zinc-900/10',
    glowColor: 'shadow-pink-500/20',
  },
  {
    id: '5',
    rank: 5,
    matchScore: 72,
    title: 'Bleu de Chanel EDP',
    brand: 'Chanel',
    gender: 'MALE',
    priceRange: '$$$',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800',
    description: 'An aromatic woody fragrance — captivating grapefruit freshness leads into sandalwood and amber depth.',
    aiExplanation: 'Bleu de Chanel scores 72% — it\'s an exceptional versatile fragrance but leans more toward fresh-woody than the purely warm vanillic character you described. The sandalwood-amber base keeps it in contention, while its office suitability (10/10) means it doubles perfectly if you ever want a daytime option.',
    topNotes: [{ name: 'Grapefruit', family: 'Citrus' }, { name: 'Lemon', family: 'Citrus' }],
    heartNotes: [{ name: 'Jasmine', family: 'Floral' }, { name: 'Nutmeg', family: 'Spicy' }],
    baseNotes: [{ name: 'Sandalwood', family: 'Woody' }, { name: 'Amber', family: 'Amber' }, { name: 'Cedarwood', family: 'Woody' }],
    seasons: { summer: 8, winter: 7, spring: 9, autumn: 8 },
    occasions: { office: 10, dateNight: 9, casual: 9, party: 8 },
    amazonUrl: 'https://www.amazon.com/dp/B00P145H0Y',
    flipkartUrl: 'https://www.flipkart.com/p/itm87654321',
    officialUrl: 'https://www.chanel.com',
    accentColor: 'from-cyan-600/15 via-blue-800/10 to-zinc-900/10',
    glowColor: 'shadow-cyan-500/20',
  },
];

// ─── Helper Utilities ─────────────────────────────────────────────────────────

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

function SeasonBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  const width = `${value * 10}%`;
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
      <span className="text-xs text-zinc-500 w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
        <div className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-1000" style={{ width }} />
      </div>
      <span className="text-xs font-mono text-zinc-500 w-5 text-right">{value}</span>
    </div>
  );
}

function NoteChip({ name, family }: { name: string; family: string }) {
  const familyColors: Record<string, string> = {
    Citrus: 'border-yellow-400/40 text-yellow-300 bg-yellow-400/10',
    Floral: 'border-pink-400/40 text-pink-300 bg-pink-400/10',
    Woody: 'border-orange-500/40 text-orange-300 bg-orange-500/10',
    Gourmand: 'border-amber-400/40 text-amber-300 bg-amber-400/10',
    Amber: 'border-amber-600/40 text-amber-400 bg-amber-600/10',
    Spicy: 'border-red-400/40 text-red-300 bg-red-400/10',
    Aquatic: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10',
    Resinous: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
    Fruity: 'border-violet-400/40 text-violet-300 bg-violet-400/10',
  };
  const cls = familyColors[family] || 'border-zinc-600 text-zinc-400 bg-zinc-800/50';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      <Droplets className="h-2.5 w-2.5" />
      {name}
    </span>
  );
}

// ─── Main Result Card ─────────────────────────────────────────────────────────

function ResultCard({ perfume, delay }: { perfume: PerfumeResult; delay: number }) {
  const [expanded, setExpanded] = useState(perfume.rank === 1);
  const [isWishlisted, setIsWishlisted] = useOptimistic(false);
  const [, startTransition] = useTransition();

  function toggleWishlist() {
    startTransition(() => {
      setIsWishlisted((prev) => !prev);
    });
  }

  return (
    <FadeIn direction="up" delay={delay}>
      <div className={`relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md transition-all duration-500 hover:border-zinc-700/80 hover:shadow-2xl hover:${perfume.glowColor} ${perfume.rank === 1 ? 'border-amber-500/30 shadow-lg shadow-amber-500/10' : ''}`}>
        {/* Gradient accent top strip */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${perfume.accentColor.replace('from-', 'from-').replace('/10', '/60').replace('/15', '/80')}`} />

        {/* Background family accent glow */}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${perfume.accentColor} opacity-50`} />

        <div className="relative z-10 p-6 md:p-8">
          {/* Top Row: Image + Info + Score */}
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Perfume Image */}
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-800 self-start">
              <img
                src={perfume.imageUrl}
                alt={perfume.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${perfume.accentColor} opacity-40`} />
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <RankBadge rank={perfume.rank} />
                <span className="rounded-full bg-zinc-800/80 border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400 font-mono">
                  {perfume.gender === 'MALE' ? '♂ Men' : perfume.gender === 'FEMALE' ? '♀ Women' : '⚥ Unisex'}
                </span>
                <span className="rounded-full bg-zinc-800/80 border border-zinc-700 px-2.5 py-0.5 text-xs font-mono text-amber-300">
                  {perfume.priceRange}
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-white leading-tight">{perfume.title}</h2>
              <p className="text-sm text-zinc-500 font-medium mt-0.5">{perfume.brand}</p>

              <div className="flex items-center gap-1.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(perfume.rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                ))}
                <span className="text-xs text-zinc-500 ml-1">{perfume.rating}</span>
              </div>

              <p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-2">{perfume.description}</p>
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
              {expanded ? 'Hide' : 'Show'} Fragrance Details & AI Explanation
            </span>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Expanded Content */}
          {expanded && (
            <div className="mt-6 space-y-8">
              {/* AI Explanation */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                    Why we matched this for you
                  </span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">{perfume.aiExplanation}</p>
              </div>

              {/* Fragrance Pyramid */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                  Fragrance Note Pyramid
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Top Notes</span>
                      <span className="text-xs text-zinc-600">(First 15 min)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perfume.topNotes.map((n) => <NoteChip key={n.name} {...n} />)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Heart Notes</span>
                      <span className="text-xs text-zinc-600">(30 min – 4 hrs)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perfume.heartNotes.map((n) => <NoteChip key={n.name} {...n} />)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Base Notes</span>
                      <span className="text-xs text-zinc-600">(4 hrs – 12 hrs)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perfume.baseNotes.map((n) => <NoteChip key={n.name} {...n} />)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Season & Occasion Bars */}
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Season Suitability</h3>
                  <div className="space-y-2.5">
                    <SeasonBar label="Summer" value={perfume.seasons.summer} icon={Sun} />
                    <SeasonBar label="Winter" value={perfume.seasons.winter} icon={Snowflake} />
                    <SeasonBar label="Spring" value={perfume.seasons.spring} icon={Flower2} />
                    <SeasonBar label="Autumn" value={perfume.seasons.autumn} icon={Leaf} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Occasion Fit</h3>
                  <div className="space-y-2.5">
                    <SeasonBar label="Office" value={perfume.occasions.office} icon={Briefcase} />
                    <SeasonBar label="Date Night" value={perfume.occasions.dateNight} icon={Heart} />
                    <SeasonBar label="Casual" value={perfume.occasions.casual} icon={Coffee} />
                    <SeasonBar label="Party" value={perfume.occasions.party} icon={PartyPopper} />
                  </div>
                </div>
              </div>

              {/* Buy Buttons */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                  Buy From Official Sources
                </h3>
                <div className="flex flex-wrap gap-3">
                  {perfume.amazonUrl && (
                    <a
                      href={perfume.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-300 transition-all hover:bg-orange-500/20 hover:border-orange-400/50 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Amazon
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </a>
                  )}
                  {perfume.flipkartUrl && (
                    <a
                      href={perfume.flipkartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-300 transition-all hover:bg-blue-500/20 hover:border-blue-400/50 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Flipkart
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </a>
                  )}
                  {perfume.officialUrl && (
                    <a
                      href={perfume.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-400/50 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <Flame className="h-4 w-4" />
                      Official Brand Store
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Results Client Main Component ───────────────────────────────────────────

export function ResultsClient() {
  const promptSummary = 'Cozy rainy autumn evening, warm vanilla leather, date night intensity';

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
                  AI Matched — {MOCK_RESULTS.length} Results
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
              <button className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-zinc-400 hover:border-amber-500/30 hover:text-amber-300 transition-colors">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <Link href="/recommend" className="flex h-10 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-zinc-400 hover:border-amber-500/30 hover:text-amber-300 transition-colors">
                <RefreshCcw className="h-4 w-4" /> New Search
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Match Score Summary Strip */}
      <FadeIn direction="up" delay={100}>
        <div className="glass-card rounded-2xl p-5 mb-10 grid grid-cols-2 sm:grid-cols-5 gap-4">
          {MOCK_RESULTS.map((p) => (
            <div key={p.id} className="flex flex-col items-center text-center">
              <div className={`font-mono text-xl font-black ${p.matchScore >= 90 ? 'text-emerald-400' : p.matchScore >= 75 ? 'text-amber-400' : 'text-zinc-400'}`}>
                {p.matchScore}%
              </div>
              <div className="text-[10px] text-zinc-600 mt-0.5 leading-tight line-clamp-2">{p.title}</div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Result Cards */}
      <div className="space-y-6">
        {MOCK_RESULTS.map((perfume, i) => (
          <ResultCard key={perfume.id} perfume={perfume} delay={i * 100} />
        ))}
      </div>

      {/* Bottom CTA */}
      <FadeIn direction="up" delay={200}>
        <div className="mt-16 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-zinc-900/60 to-yellow-700/10 p-8 text-center backdrop-blur-md">
          <Sparkles className="mx-auto h-8 w-8 text-amber-400 mb-4 animate-pulse" />
          <h2 className="font-serif text-2xl font-bold text-white">
            Not quite right? Refine your preferences.
          </h2>
          <p className="text-zinc-400 text-sm mt-2 mb-6 max-w-md mx-auto">
            Our engine uses 6 weighted parameters. A small change in season or occasion can dramatically shift your top matches.
          </p>
          <Link
            href="/recommend"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-7 py-3 font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <RefreshCcw className="h-4 w-4" /> Refine & Re-Match
          </Link>
        </div>
      </FadeIn>
    </main>
  );
}
