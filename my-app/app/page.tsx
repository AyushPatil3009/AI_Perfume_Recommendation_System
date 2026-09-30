import { Navbar } from './components/Navbar';
import { AmbientFragranceParticles } from './components/AmbientFragranceParticles';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Flame, ExternalLink, Zap, Award, Crown, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const fragranceFamilies = [
    {
      name: 'Fresh & Mediterranean Citrus',
      notes: 'Calabrian Bergamot, Neroli, Sea Salt, Mandarin',
      vibe: 'Invigorating, Luminous, Sunlit Morning',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
      color: 'from-[#C59B4B]/15 to-[#FAF7F2]',
    },
    {
      name: 'Royal Oud & Rare Woods',
      notes: 'Aged Cambodian Oud, Sandalwood, Cedar, Vetiver',
      vibe: 'Majestic, Opulent, Imperial Palace',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop',
      color: 'from-[#704C16]/15 to-[#FAF7F2]',
    },
    {
      name: 'Warm Amber & Bourbon Vanilla',
      notes: 'Madagascar Vanilla, Tonka Bean, Benzoin, Amber Resin',
      vibe: 'Sensual, Intimate, Velvet Evening',
      image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop',
      color: 'from-[#C59B4B]/20 to-[#FAF7F2]',
    },
    {
      name: 'Opulent Rose & Floral Damascena',
      notes: 'Grasse Rose, Jasmine Sambac, Iris, Peony',
      vibe: 'Sophisticated, Aristocratic, Royal Bloom',
      image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600&auto=format&fit=crop',
      color: 'from-[#C59B4B]/15 to-[#FAF7F2]',
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610] selection:bg-[#C59B4B] selection:text-white">
      {/* Floating Animated Gold Particles & Glow Backdrop */}
      <AmbientFragranceParticles />

      {/* Sticky Header */}
      <Navbar />

      <main className="relative z-10">
        {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
        <section id="hero" className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Royal Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B4B]/35 bg-[#C59B4B]/10 px-4 py-1.5 backdrop-blur-md">
                <Crown className="h-4 w-4 text-[#A87C30] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
                  Haute Parfumerie AI Sommelier
                </span>
              </div>

              {/* Main Hero Headline */}
              <h1 className="font-serif text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-[#1C1610] leading-[1.1]">
                Curate Your <br />
                <span className="golden-text-gradient">Royal Scent Signature</span>
              </h1>

              <p className="max-w-xl text-lg text-stone-600 sm:text-xl font-light leading-relaxed">
                Discover bespoke fragrance formulas crafted with mathematical precision. Describe your mood, occasion, or rare note cravings, and unlock 5 bespoke luxury matches.
              </p>

              {/* Dual Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/recommend"
                  className="group flex h-14 w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] px-8 font-semibold text-white shadow-xl shadow-[#C59B4B]/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#C59B4B]/40"
                >
                  <Sparkles className="h-5 w-5 text-[#FFF5DC]" />
                  <span>Begin Scent Consultation</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#C59B4B]/30 bg-white/90 px-8 font-semibold text-stone-800 backdrop-blur-md transition-all hover:border-[#C59B4B] hover:bg-white hover:text-[#9A7025] hover:shadow-md shadow-sm"
                >
                  <span>How Algorithm Matches</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#C59B4B]" /> 100% Unbiased AI Match
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#C59B4B]" /> Verified Olfactory Notes
                </span>
              </div>
            </div>

            {/* Right Hero Visual Showcase: Ultra-Luxury Flacon Montage */}
            <div className="lg:col-span-5 relative">
              {/* Golden Ambient Radiance Behind Flacon */}
              <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#C59B4B]/20 via-[#E6C675]/20 to-transparent blur-3xl" />

              <div className="moving-border-card group relative">
                <div className="relative z-10 w-full overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
                  {/* Luxury Flacon Image */}
                  <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-2xl bg-stone-100">
                    <img
                      src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
                      alt="Ultra Luxury Perfume Flacon"
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Floating Luxury Tag */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#F7E7C4]">Bespoke Formula</span>
                        <p className="font-serif text-lg font-bold">White Oud & 24K Amber</p>
                      </div>
                      <span className="rounded-full bg-[#C59B4B]/90 backdrop-blur-md px-3 py-1 text-xs font-bold font-mono">
                        99% Resonance
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-stone-200/80 pt-10 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/70 border border-stone-200/70 p-4 shadow-sm">
              <span className="font-serif text-3xl font-bold golden-text-gradient">98.4%</span>
              <span className="block text-xs uppercase text-stone-500 mt-1 font-semibold">Match Accuracy</span>
            </div>
            <div className="rounded-2xl bg-white/70 border border-stone-200/70 p-4 shadow-sm">
              <span className="font-serif text-3xl font-bold text-stone-900">100+</span>
              <span className="block text-xs uppercase text-stone-500 mt-1 font-semibold">Luxury Flacons Mapped</span>
            </div>
            <div className="rounded-2xl bg-white/70 border border-stone-200/70 p-4 shadow-sm">
              <span className="font-serif text-3xl font-bold text-stone-900">100%</span>
              <span className="block text-xs uppercase text-stone-500 mt-1 font-semibold">Independent & Unbiased</span>
            </div>
            <div className="rounded-2xl bg-white/70 border border-stone-200/70 p-4 shadow-sm">
              <span className="font-serif text-3xl font-bold golden-text-gradient">Instant</span>
              <span className="block text-xs uppercase text-stone-500 mt-1 font-semibold">Store Link Redirection</span>
            </div>
          </div>
        </section>

        {/* ─── FRAGRANCE FAMILIES GRID ───────────────────────────────────────── */}
        <section id="families" className="mx-auto max-w-7xl px-6 py-20 border-t border-stone-200/80">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-[#1C1610]">
              Explore Olfactory <span className="golden-text-gradient">Fragrance Families</span>
            </h2>
            <p className="mt-3 text-stone-600 font-light">
              Every master perfume is classified across core note structures. Which accord defines your aura?
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {fragranceFamilies.map((family, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-[#C59B4B]/25 bg-white p-6 shadow-sm transition-all hover:border-[#C59B4B]/60 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#C59B4B]/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${family.color} opacity-30 group-hover:opacity-60 transition-opacity`} />
                <div className="relative z-10">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#9A7025]">
                    {family.vibe}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-stone-900">{family.name}</h3>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed font-sans">
                    <span className="text-[#9A7025] font-semibold">Notes:</span> {family.notes}
                  </p>
                  <Link
                    href="/recommend"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#9A7025] hover:text-[#704C16] transition-colors"
                  >
                    <span>Match this family</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS SECTION ─────────────────────────────────────────── */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 border-t border-stone-200/80">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-[#1C1610]">
              Transparent <span className="golden-text-gradient">AI Recommendation Pipeline</span>
            </h2>
            <p className="mt-3 text-stone-600 max-w-xl mx-auto font-light">
              We separate AI intent parsing from deterministic database matching so you get authentic recommendations without bias.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-card glass-card-hover rounded-2xl p-8 text-left relative bg-white">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/35 text-[#9A7025] font-bold font-mono text-xl shadow-sm">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Natural Vibe Input</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Describe a mood, rainy autumn morning, cozy coffee date, or select preferences via interactive sliders.
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-8 text-left relative bg-white">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/35 text-[#9A7025] font-bold font-mono text-xl shadow-sm">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Note Overlap Scoring</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Our recommendation engine matches accords, season weights, and occasion intensity against our fragrance database.
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-8 text-left relative bg-white">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/35 text-[#9A7025] font-bold font-mono text-xl shadow-sm">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Top 5 + External Buy Links</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Get ranked matches with personalized AI explanations and direct links to Amazon, Flipkart, or Brand official stores.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-stone-200/80 bg-white/90 py-10 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Aura Scent AI. Royal Fragrance Recommendation Atelier.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#9A7025] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#9A7025] transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-[#9A7025] transition-colors">Database API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
