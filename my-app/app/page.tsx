import { Navbar } from './components/Navbar';
import { AmbientFragranceParticles } from './components/AmbientFragranceParticles';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Flame, ExternalLink, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const fragranceFamilies = [
    {
      name: 'Fresh & Citrus',
      notes: 'Bergamot, Lemon, Grapefruit, Sea Salt',
      vibe: 'Invigorating, Breezy, Summer Mornings',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=600&auto=format&fit=crop',
      color: 'from-amber-400/20 to-yellow-600/10',
    },
    {
      name: 'Woody & Earthy',
      notes: 'Oud, Sandalwood, Cedar, Patchouli',
      vibe: 'Mysterious, Elegant, Deep Forest',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop',
      color: 'from-amber-700/20 to-orange-950/20',
    },
    {
      name: 'Warm Gourmand Vanilla',
      notes: 'Bourbon Vanilla, Tonka Bean, Rum, Tobacco',
      vibe: 'Cozy, Intimate, Date Nights',
      image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=600&auto=format&fit=crop',
      color: 'from-yellow-500/20 to-amber-900/20',
    },
    {
      name: 'Opulent Floral',
      notes: 'Damask Rose, Jasmine, Lavender, Peony',
      vibe: 'Romantic, Sophisticated, Spring Gardens',
      image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=600&auto=format&fit=crop',
      color: 'from-rose-500/10 to-amber-500/10',
    }
  ];

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-400 selection:text-zinc-950">
      {/* Floating Animated Gold Particles & Glow Backdrop */}
      <AmbientFragranceParticles />

      {/* Sticky Header */}
      <Navbar />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="mx-auto max-w-7xl px-6 pt-20 pb-24 text-center md:pt-32 md:pb-32">
          {/* Subtle Tag Badge */}
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md">
            <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              Next-Gen AI Olfactory Intelligence
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Discover Your <br />
            <span className="golden-text-gradient">Signature Fragrance</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl font-light leading-relaxed">
            Stop guessing scent notes. Tell our AI your exact vibe, season, or memory, and get mathematically matched recommendations with direct luxury store links.
          </p>

          {/* Dual Action CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/recommend"
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-8 font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 hover:shadow-amber-500/30 sm:w-auto"
            >
              <Sparkles className="h-5 w-5 text-zinc-950" />
              <span>Try AI Scent Recommendation</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#how-it-works"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-8 font-medium text-zinc-300 backdrop-blur-md transition-all hover:border-amber-500/30 hover:bg-zinc-800/80 hover:text-white sm:w-auto"
            >
              <span>How Match Algorithm Works</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-zinc-800/60 pt-10 sm:grid-cols-4">
            <div>
              <span className="font-serif text-3xl font-bold golden-text-gradient">98.4%</span>
              <span className="block text-xs uppercase text-zinc-500 mt-1">Match Accuracy</span>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-zinc-200">30+</span>
              <span className="block text-xs uppercase text-zinc-500 mt-1">Curated Luxury Perfumes</span>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold text-zinc-200">100%</span>
              <span className="block text-xs uppercase text-zinc-500 mt-1">Non-Ecommerce / Independent</span>
            </div>
            <div>
              <span className="font-serif text-3xl font-bold golden-text-gradient">Instant</span>
              <span className="block text-xs uppercase text-zinc-500 mt-1">Buy Store Redirection</span>
            </div>
          </div>
        </section>

        {/* FRAGRANCE FAMILIES GRID */}
        <section id="families" className="mx-auto max-w-7xl px-6 py-20 border-t border-zinc-900">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl text-zinc-100">
              Explore Olfactory <span className="golden-text-gradient">Fragrance Families</span>
            </h2>
            <p className="mt-3 text-zinc-400 font-light">
              Every master perfume is classified across core note structures. Which accord defines you?
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {fragranceFamilies.map((family, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-amber-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${family.color} opacity-40 group-hover:opacity-70 transition-opacity`} />
                <div className="relative z-10">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400">
                    {family.vibe}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-bold text-white">{family.name}</h3>
                  <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-mono">
                    <span className="text-amber-300 font-semibold">Notes:</span> {family.notes}
                  </p>
                  <Link
                    href="/recommend"
                    className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200"
                  >
                    <span>Match this family</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 border-t border-zinc-900">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">
              Transparent <span className="golden-text-gradient">AI Recommendation Pipeline</span>
            </h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto font-light">
              We separate AI intent parsing from deterministic database matching so you get authentic recommendations without bias.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="glass-card glass-card-hover rounded-2xl p-8 text-left relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold font-mono text-xl">
                01
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Natural Vibe Input</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Describe a mood, rainy autumn morning, cozy coffee date, or select preferences via interactive sliders.
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-8 text-left relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold font-mono text-xl">
                02
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Note Overlap Scoring</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our recommendation engine matches accords, season weights, and occasion intensity against our fragrance database.
              </p>
            </div>

            <div className="glass-card glass-card-hover rounded-2xl p-8 text-left relative">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold font-mono text-xl">
                03
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Top 5 + External Buy Links</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Get ranked matches with personalized AI explanations and direct links to Amazon, Flipkart, or Brand official stores.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950/90 py-10 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Aura Scent AI. Independent Perfume Recommendation Platform. Not an e-commerce store.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-amber-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-amber-400">Terms of Service</Link>
            <Link href="#" className="hover:text-amber-400">Database API</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
