import type { Metadata } from 'next';
import { Navbar } from '../components/Navbar';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Sparkles, Crown, Award, Compass, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About the Atelier | Aura Scent AI',
  description: 'Learn how Aura Scent AI merges mathematical fragrance science with haute parfumerie.',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610] flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B4B]/35 bg-[#C59B4B]/10 px-4 py-1.5 backdrop-blur-md">
            <Crown className="h-4 w-4 text-[#C59B4B]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
              The Haute Parfumerie Philosophy
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight">
            Where Mathematics Meets <br />
            <span className="golden-text-gradient">Royal Olfactory Artistry</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-600 text-lg font-light leading-relaxed">
            Aura Scent was founded on a singular conviction: finding your signature scent shouldn’t be guesswork or marketing deception. It should be a masterwork of algorithmic precision.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="glass-card rounded-3xl p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
            <div className="h-12 w-12 rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] mb-6">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">Deterministic Science</h3>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              We decompose hundreds of luxury flacons into 3-tier olfactory pyramids (top, heart, base accords) and match them via weighted dimensional scoring.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
            <div className="h-12 w-12 rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] mb-6">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">Gemini AI Sommelier</h3>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              Whether you crave "a rainy autumn walk in Kyoto" or "imperial 24K amber warmth", our AI decodes abstract human emotion into rigorous note profiles.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
            <div className="h-12 w-12 rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-3">100% Unbiased</h3>
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              We accept zero sponsored placements from perfume brands. Every recommendation is purely ranked on harmonic resonance with your desires.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="moving-border-card">
          <div className="rounded-[calc(1.5rem-1.5px)] bg-white/95 p-10 text-center space-y-6">
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Ready to Distill Your <span className="golden-text-gradient">Signature Aura</span>?
            </h2>
            <p className="text-stone-600 max-w-xl mx-auto text-sm font-light leading-relaxed">
              Experience the 5-match bespoke sommelier consultation tailored to your chemistry, season, and occasion.
            </p>
            <div>
              <Link
                href="/recommend"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] px-8 py-4 font-semibold text-white shadow-xl shadow-[#C59B4B]/30 hover:scale-105 transition-all"
              >
                <Sparkles className="h-5 w-5" />
                <span>Begin Consultation</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-200/80 bg-white/90 py-8 text-center text-xs text-stone-500">
        © 2026 Aura Scent AI. Haute Parfumerie Atelier.
      </footer>
    </div>
  );
}
