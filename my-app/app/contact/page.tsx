import type { Metadata } from 'next';
import { Navbar } from '../components/Navbar';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Sparkles, Mail, MapPin, Send, MessageSquare, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact the Atelier | Aura Scent AI',
  description: 'Connect with the master curators and engineering team behind Aura Scent AI.',
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610] flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C59B4B]/35 bg-[#C59B4B]/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#C59B4B]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
              Concierge & Inquiries
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-stone-900">
            Connect with the <span className="golden-text-gradient">Atelier Curators</span>
          </h1>

          <p className="max-w-xl mx-auto text-stone-600 text-base font-light leading-relaxed">
            Have questions about your olfactory consultation, fragrance database additions, or enterprise integrations? We are at your service.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Info Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 bg-white/95 border border-[#C59B4B]/25 shadow-md space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Direct Concierge Email</h4>
                  <p className="text-xs text-stone-500 mt-0.5">concierge@aurascent.ai</p>
                  <p className="text-xs text-stone-500">support@aurascent.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Haute Parfumerie Lab</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Place Vendôme, Paris & Mumbai Fragrance Quarter</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">Response Commitment</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Our sommelier team answers all inquiries within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="md:col-span-7">
            <div className="glass-card rounded-3xl p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">Send an Inquiry</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Lady / Lord Harrington"
                    className="w-full rounded-xl bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-[#C59B4B] focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="curator@example.com"
                    className="w-full rounded-xl bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-[#C59B4B] focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
                    Message / Special Scent Request
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what you are looking for..."
                    className="w-full rounded-xl bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-[#C59B4B] focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 shadow-inner resize-none"
                  />
                </div>

                <button
                  type="button"
                  className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-[1.02] transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Dispatch Message</span>
                </button>
              </form>
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
