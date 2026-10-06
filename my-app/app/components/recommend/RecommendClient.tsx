'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wand2,
  SlidersHorizontal,
  Sun,
  Snowflake,
  Flower2,
  Leaf,
  Briefcase,
  Heart,
  Coffee,
  PartyPopper,
  User,
  Users,
  UserRound,
  DollarSign,
  CheckCircle2,
  Loader2,
  ChevronRight,
  CreditCard,
  Lock,
} from 'lucide-react';

import { useRouter } from 'next/navigation';
import { createCheckoutSessionAction } from '@/app/actions/stripeActions';

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'ai' | 'guided';
type Step = 1 | 2 | 3 | 4;

interface GuidedForm {
  gender: 'MALE' | 'FEMALE' | 'UNISEX' | '';
  season: 'Summer' | 'Winter' | 'Spring' | 'Autumn' | '';
  occasion: 'Office' | 'DateNight' | 'Casual' | 'Party' | '';
  budget: Number | null;
  intensity: number; // 1 to 5
}

const BUDGET_TIERS = [
  {
    key: 45,
    range: 'Under $45',
    title: 'Value & Daily',
    desc: 'Great everyday budget staples & fresh mass-pleasers',
  },
  {
    key: 95,
    range: 'Up to $95',
    title: 'Designer Signature',
    desc: 'Versatile classics from top fragrance houses',
  },
  {
    key: 200,
    range: 'Up to $200',
    title: 'Premium Luxury',
    desc: 'High longevity, complex notes & fine sillage',
  },
  {
    key: 9999,
    range: 'Any / $200+',
    title: 'No Price Limit',
    desc: 'All luxury, niche & master perfumery collections',
  },
] as const;

// ─── Scroll Animation Hook ────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
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

// ─── Fade-In Wrapper ─────────────────────────────────────────────────────────

function FadeIn({
  children,
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const { ref, inView } = useInView();

  const translateMap = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${translateMap[direction]}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Selection Card ───────────────────────────────────────────────────────────

function SelectCard({
  icon: Icon,
  label,
  sublabel,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
        selected
          ? 'border-[#C59B4B] bg-[#C59B4B]/10 shadow-lg shadow-[#C59B4B]/15 ring-1 ring-[#C59B4B]/40'
          : 'border-stone-200 bg-white hover:border-[#C59B4B]/50 hover:bg-stone-50/80 shadow-sm'
      }`}
    >
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#C59B4B]/10 to-[#FAF7F2] pointer-events-none" />
      )}
      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            selected
              ? 'border-[#C59B4B]/60 bg-[#C59B4B]/20 text-[#704C16]'
              : 'border-stone-200 bg-stone-100 text-stone-600 group-hover:border-[#C59B4B]/40 group-hover:text-[#9A7025]'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`font-semibold ${selected ? 'text-[#704C16]' : 'text-stone-900'}`}>{label}</p>
          {sublabel && <p className="text-xs text-stone-500 mt-0.5">{sublabel}</p>}
        </div>
        {selected && <CheckCircle2 className="ml-auto h-5 w-5 text-[#C59B4B] shrink-0" />}
      </div>
    </button>
  );
}

// ─── Intensity Slider ─────────────────────────────────────────────────────────

function IntensitySlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const labels = ['Very Light', 'Light', 'Moderate', 'Strong', 'Intense & Bold'];
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-xs text-stone-500 font-medium">
        <span>Very Light</span>
        <span className="text-[#9A7025] font-bold font-mono text-sm">{labels[value - 1]}</span>
        <span>Intense & Bold</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full bg-stone-200 cursor-pointer accent-[#C59B4B]"
      />
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <div
            key={v}
            className={`h-2 w-2 rounded-full transition-colors ${
              v <= value ? 'bg-[#C59B4B]' : 'bg-stone-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Step Progress Bar ────────────────────────────────────────────────────────

function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="relative flex-1">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              i < step ? 'bg-[#C59B4B]' : 'bg-stone-200'
            }`}
          />
          {i === step - 1 && (
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-4 w-4 rounded-full border-2 border-[#C59B4B] bg-white shadow-md shadow-[#C59B4B]/30" />
          )}
        </div>
      ))}
      <span className="text-xs font-semibold text-stone-500 ml-2 shrink-0 font-mono">
        {step}/{total}
      </span>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function RecommendClient() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string } | null | 'loading'>('loading');
  const [mode, setMode] = useState<Mode>('ai');
  const [isPending, startTransition] = useTransition();

  // Check auth session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aura_user');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  // AI Mode
  const [aiPrompt, setAiPrompt] = useState('');

  // Guided Mode
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<GuidedForm>({
    gender: '',
    season: '',
    occasion: '',
    budget: null,
    intensity: 3,
  });

  const examplePrompts = [
    '🌧️ Cozy rainy coffee shop date night',
    '🌊 Fresh ocean breeze summer morning',
    '🍂 Warm autumn woodland walk',
    '🎉 Glamorous evening party in Paris',
    '🪵 Deep smoky oud for a luxury hotel lobby',
    '🌸 Light floral spring wedding guest',
  ];

  const [aiError, setAiError] = useState<string | null>(null);

  function handleExamplePrompt(p: string) {
    setAiPrompt(p.replace(/^[^\s]+\s/, ''));
    setAiError(null);
  }

  function getUserSession() {
    if (currentUser && currentUser !== 'loading') {
      return { userId: currentUser.id, userEmail: currentUser.email };
    }
    return {};
  }

  function handleGuidedSubmit() {
    setAiError(null);
    startTransition(async () => {
      const inputData = {
        gender: form.gender || 'UNISEX',
        season: form.season || undefined,
        occasion: form.occasion || undefined,
        budget: form.budget ? Number(form.budget) : undefined,
        intensity: form.intensity,
      };

      const { userId, userEmail } = getUserSession();
      const res = await createCheckoutSessionAction({
        userId,
        userEmail,
        preferences: inputData,
      });

      if (res.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        setAiError(res.message || 'Failed to initiate checkout.');
      }
    });
  }

  function handleAiSubmit() {
    setAiError(null);
    startTransition(async () => {
      const { userId, userEmail } = getUserSession();
      const res = await createCheckoutSessionAction({
        userId,
        userEmail,
        preferences: { userPrompt: aiPrompt },
      });

      if (res.success && res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        setAiError(res.message || 'Failed to initiate checkout.');
      }
    });
  }

  function canProceed() {
    if (step === 1) return form.gender !== '';
    if (step === 2) return form.season !== '';
    if (step === 3) return form.occasion !== '';
    if (step === 4) return form.budget !== null && form.budget !== undefined;
    return true;
  }

  if (currentUser === 'loading') {
    return (
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-32 text-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-[#C59B4B]/30 bg-white/95 px-6 py-3 text-[#704C16] backdrop-blur-xl shadow-md">
          <Loader2 className="h-5 w-5 animate-spin text-[#C59B4B]" />
          <span className="text-sm font-mono">Verifying member session...</span>
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
              Members Only <span className="golden-text-gradient">Atelier</span>
            </h1>
            <p className="text-stone-600 text-sm font-light leading-relaxed mb-8">
              Please sign in to access the Gemini AI Fragrance Sommelier and unlock bespoke scent curations.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/login?redirect=/recommend')}
                className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-[1.02] transition-all"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => router.push('/register')}
                className="w-full flex h-12 items-center justify-center rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-700 hover:border-[#C59B4B] hover:text-[#9A7025] hover:bg-stone-50 transition-all shadow-sm"
              >
                Create an Account
              </button>
            </div>
          </div>
        </FadeIn>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6">

      {/* Page Header */}
      <FadeIn direction="up">
        <div className="text-center mb-14">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-[#C59B4B]/35 bg-[#C59B4B]/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#C59B4B] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#704C16] font-mono">
              Personalised AI Engine
            </span>
          </div>
          <h1 className="font-serif text-4xl font-extrabold sm:text-5xl md:text-6xl text-stone-900">
            Find Your <span className="golden-text-gradient">Perfect Scent</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-stone-600 text-lg font-light leading-relaxed">
            Describe your vibe in plain English, or walk through our guided questionnaire.
            Our engine will rank the best-matched luxury fragrances for you.
          </p>
        </div>
      </FadeIn>

      {/* Mode Toggle */}
      <FadeIn direction="up" delay={100}>
        <div className="glass-card rounded-2xl p-2 flex gap-2 mb-10 bg-white/90 shadow-sm border border-[#C59B4B]/20">
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-[#C59B4B]/15 to-[#D4AF37]/25 border border-[#C59B4B]/40 text-[#704C16] shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Wand2 className="h-4 w-4" />
            Describe Your Vibe (AI Mode)
          </button>
          <button
            onClick={() => setMode('guided')}
            className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
              mode === 'guided'
                ? 'bg-gradient-to-r from-[#C59B4B]/15 to-[#D4AF37]/25 border border-[#C59B4B]/40 text-[#704C16] shadow-sm font-bold'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Guided Questionnaire
          </button>
        </div>
      </FadeIn>

      {/* ─── AI MODE ─────────────────────────────────────────────────────── */}
      {mode === 'ai' && (
        <div className="space-y-8">
          <FadeIn direction="up" delay={150}>
            <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
              <label className="block font-serif text-xl font-bold text-stone-900 mb-2">
                Tell us your vibe
              </label>
              <p className="text-sm text-stone-500 mb-4 font-light">
                The more descriptive you are, the better our engine can match you. Try a mood, memory, place, or feeling.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={5}
                placeholder="e.g. I want something that smells like a cozy autumn evening in a Parisian cafe — warm, woody, with a hint of coffee and vanilla..."
                className="w-full rounded-xl bg-stone-50 border border-stone-300 text-stone-900 placeholder-stone-400 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-[#C59B4B] focus:ring-1 focus:ring-[#C59B4B]/40 resize-none transition-colors shadow-inner"
              />
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-stone-400 font-mono">{aiPrompt.length} / 500 characters</span>
                <button
                  onClick={() => setAiPrompt('')}
                  className="text-xs text-stone-500 hover:text-[#9A7025] transition-colors"
                >
                  Clear
                </button>
              </div>

              {aiError && (
                <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-50 p-3.5 text-xs text-rose-700">
                  {aiError}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Example Prompt Chips */}
          <FadeIn direction="up" delay={200}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">
                ✦ Quick Vibe Starters
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleExamplePrompt(prompt)}
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs text-stone-700 transition-all hover:border-[#C59B4B]/60 hover:bg-[#C59B4B]/10 hover:text-[#704C16] shadow-sm hover:scale-105"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Submit */}
          <FadeIn direction="up" delay={250}>
            <button
              onClick={handleAiSubmit}
              disabled={aiPrompt.trim().length < 10 || isPending}
              className="group w-full flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-xl shadow-[#C59B4B]/30 transition-all hover:scale-[1.02] hover:shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isPending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Preparing Secure Checkout...</>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-white" />
                  <span>Unlock AI Scent Sommelier</span>
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">$1.99</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-500">
              <CreditCard className="h-3.5 w-3.5 text-[#C59B4B]" />
              <span>1-Time Scent Pass &bull; Instant Gemini AI Curation &bull; Powered by Stripe</span>
            </div>
            {aiPrompt.trim().length < 10 && aiPrompt.length > 0 && (
              <p className="text-center text-xs text-amber-700 mt-2 font-medium">Please write at least 10 characters for a good match.</p>
            )}
          </FadeIn>
        </div>
      )}

      {/* ─── GUIDED MODE ─────────────────────────────────────────────────── */}
      {mode === 'guided' && (
        <div>
          <FadeIn direction="up" delay={150}>
            <StepProgress step={step} total={4} />
          </FadeIn>

          {/* Step 1 - Gender */}
          {step === 1 && (
            <FadeIn direction="right" delay={100}>
              <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
                <span className="text-xs font-mono text-[#9A7025] uppercase tracking-widest font-bold">Step 1 of 4</span>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2 mb-1">Who are you shopping for?</h2>
                <p className="text-sm text-stone-500 mb-6 font-light">This helps us narrow down fragrance profiles and intensity.</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <SelectCard icon={User} label="For Him" sublabel="Typically bold, woody, spicy" selected={form.gender === 'MALE'} onClick={() => setForm({ ...form, gender: 'MALE' })} />
                  <SelectCard icon={UserRound} label="For Her" sublabel="Floral, fruity, powdery" selected={form.gender === 'FEMALE'} onClick={() => setForm({ ...form, gender: 'FEMALE' })} />
                  <SelectCard icon={Users} label="Unisex" sublabel="Clean, aquatic, gourmand" selected={form.gender === 'UNISEX'} onClick={() => setForm({ ...form, gender: 'UNISEX' })} />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Step 2 - Season */}
          {step === 2 && (
            <FadeIn direction="right" delay={100}>
              <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
                <span className="text-xs font-mono text-[#9A7025] uppercase tracking-widest font-bold">Step 2 of 4</span>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2 mb-1">What season will you wear it most?</h2>
                <p className="text-sm text-stone-500 mb-6 font-light">Fragrances are formulated to perform differently in heat vs cold air.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectCard icon={Sun} label="Summer" sublabel="Fresh, aquatic, citrus-led" selected={form.season === 'Summer'} onClick={() => setForm({ ...form, season: 'Summer' })} />
                  <SelectCard icon={Snowflake} label="Winter" sublabel="Warm, vanilla, amber, oud" selected={form.season === 'Winter'} onClick={() => setForm({ ...form, season: 'Winter' })} />
                  <SelectCard icon={Flower2} label="Spring" sublabel="Floral, clean, soft citrus" selected={form.season === 'Spring'} onClick={() => setForm({ ...form, season: 'Spring' })} />
                  <SelectCard icon={Leaf} label="Autumn" sublabel="Spicy, woody, warm gourmand" selected={form.season === 'Autumn'} onClick={() => setForm({ ...form, season: 'Autumn' })} />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Step 3 - Occasion */}
          {step === 3 && (
            <FadeIn direction="right" delay={100}>
              <div className="glass-card rounded-2xl p-6 md:p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
                <span className="text-xs font-mono text-[#9A7025] uppercase tracking-widest font-bold">Step 3 of 4</span>
                <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2 mb-1">What occasion is it for?</h2>
                <p className="text-sm text-stone-500 mb-6 font-light">Projection and sillage requirements change based on setting and social distance.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectCard icon={Briefcase} label="Office / Work" sublabel="Subtle, clean, professional" selected={form.occasion === 'Office'} onClick={() => setForm({ ...form, occasion: 'Office' })} />
                  <SelectCard icon={Heart} label="Date Night" sublabel="Intimate, sensual, magnetic" selected={form.occasion === 'DateNight'} onClick={() => setForm({ ...form, occasion: 'DateNight' })} />
                  <SelectCard icon={Coffee} label="Casual Daily" sublabel="Effortless, fresh, approachable" selected={form.occasion === 'Casual'} onClick={() => setForm({ ...form, occasion: 'Casual' })} />
                  <SelectCard icon={PartyPopper} label="Party / Night Out" sublabel="Bold, powerful, long-lasting" selected={form.occasion === 'Party'} onClick={() => setForm({ ...form, occasion: 'Party' })} />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Step 4 - Budget + Intensity */}
          {step === 4 && (
            <FadeIn direction="right" delay={100}>
              <div className="glass-card rounded-2xl p-6 md:p-8 space-y-8 bg-white/95 border border-[#C59B4B]/25 shadow-md">
                <div>
                  <span className="text-xs font-mono text-[#9A7025] uppercase tracking-widest font-bold">Step 4 of 4</span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900 mt-2 mb-1">Budget & Scent Projection</h2>
                  <p className="text-sm text-stone-500 mb-6 font-light">Select your target price bracket and the projection sillage you desire.</p>

                  {/* Budget Grid */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-stone-900 mb-3 flex items-center justify-between">
                      <span>Maximum Bottle Budget</span>
                      <span className="text-xs text-[#9A7025] font-mono font-bold">
                        {form.budget ? BUDGET_TIERS.find((b) => b.key === form.budget)?.range : 'Select a range'}
                      </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {BUDGET_TIERS.map((b) => {
                        const isSelected = form.budget === b.key;
                        return (
                          <button
                            key={b.key}
                            type="button"
                            onClick={() => setForm({ ...form, budget: b.key })}
                            className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 ${
                              isSelected
                                ? 'border-[#C59B4B] bg-[#C59B4B]/10 shadow-lg shadow-[#C59B4B]/15 ring-1 ring-[#C59B4B]/40'
                                : 'border-stone-200 bg-white hover:border-[#C59B4B]/40 hover:bg-stone-50/80 shadow-sm'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span
                                  className={`font-mono text-xl font-extrabold tracking-tight transition-colors ${
                                    isSelected ? 'text-[#704C16]' : 'text-stone-900 group-hover:text-[#9A7025]'
                                  }`}
                                >
                                  {b.range}
                                </span>
                                {isSelected ? (
                                  <CheckCircle2 className="h-4 w-4 text-[#C59B4B] shrink-0" />
                                ) : (
                                  <div className="h-3.5 w-3.5 rounded-full border border-stone-300 group-hover:border-[#C59B4B]/60" />
                                )}
                              </div>
                              <p
                                className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                                  isSelected ? 'text-[#704C16]' : 'text-stone-800'
                                }`}
                              >
                                {b.title}
                              </p>
                              <p className="text-xs text-stone-500 leading-relaxed font-light">
                                {b.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="pt-2 border-t border-stone-200/80">
                  <p className="text-sm font-semibold text-stone-900 mb-4">Scent Intensity / Projection Power</p>
                  <IntensitySlider value={form.intensity} onChange={(v) => setForm({ ...form, intensity: v })} />
                </div>
              </div>
            </FadeIn>
          )}

          {/* Navigation Buttons */}
          <FadeIn direction="up" delay={200}>
            <div className="flex items-center gap-3 mt-6">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="flex h-12 items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-700 transition-all hover:border-[#C59B4B] hover:text-[#9A7025] hover:bg-stone-50 shadow-sm"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!canProceed()}
                  className="flex flex-1 h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white transition-all hover:scale-[1.02] shadow-md shadow-[#C59B4B]/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleGuidedSubmit}
                  disabled={!canProceed() || isPending}
                  className="group flex flex-1 h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-xl shadow-[#C59B4B]/30 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Preparing Checkout...</>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 text-white" />
                      <span>Unlock Top 5 Matches</span>
                      <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">$1.99</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </div>

            {step === 4 && aiError && (
              <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-50 p-4 text-xs font-medium text-rose-700 shadow-sm">
                ⚠️ {aiError}
              </div>
            )}
          </FadeIn>
        </div>
      )}

      {/* ─── How AI Works Info Scroll Section ─────────────────────────────── */}
      <div className="mt-28 border-t border-stone-200/80 pt-20 space-y-16">
        <FadeIn direction="up">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9A7025] mb-3 font-mono">Under the hood</p>
            <h2 className="font-serif text-3xl font-bold text-stone-900">What happens after you submit?</h2>
            <p className="text-stone-600 mt-3 max-w-lg mx-auto text-sm font-light leading-relaxed">
              We don't just filter by category. Our algorithm computes a weighted match score across 6 data dimensions.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'AI Structures Your Intent',
              description: 'If you used the vibe prompt, Gemini AI extracts accord families, season, occasion, and intensity into a structured JSON object using Zod validation.',
              delay: 0,
            },
            {
              step: '02',
              title: 'Recommendation Engine Scores',
              description: 'Our deterministic engine compares your structured preferences against every perfume in our database — scoring note overlap, season weight, and occasion fit.',
              delay: 150,
            },
            {
              step: '03',
              title: 'Ranked Results + AI Explanation',
              description: 'Top 5 perfumes are ranked by match %. AI then generates a unique personal explanation of why each one was selected for you specifically.',
              delay: 300,
            },
          ].map(({ step: s, title, description, delay }) => (
            <FadeIn key={s} direction="up" delay={delay}>
              <div className="glass-card glass-card-hover rounded-2xl p-6 h-full bg-white/95 border border-[#C59B4B]/25 shadow-sm">
                <div className="font-mono text-3xl font-bold golden-text-gradient mb-4">{s}</div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">{title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">{description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

    </main>
  );
}
