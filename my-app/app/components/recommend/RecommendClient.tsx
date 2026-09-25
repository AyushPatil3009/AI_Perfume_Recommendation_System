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
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'ai' | 'guided';
type Step = 1 | 2 | 3 | 4 | 5;

interface GuidedForm {
  gender: 'MALE' | 'FEMALE' | 'UNISEX' | '';
  season: 'Summer' | 'Winter' | 'Spring' | 'Autumn' | '';
  occasion: 'Office' | 'DateNight' | 'Casual' | 'Party' | '';
  budget: '$' | '$$' | '$$$' | '$$$$' | '';
  intensity: number; // 1 to 5
}

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
          ? 'border-amber-400/70 bg-amber-500/10 shadow-lg shadow-amber-500/20'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-amber-500/30 hover:bg-zinc-800/60'
      }`}
    >
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-600/5 pointer-events-none" />
      )}
      <div className="relative z-10 flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            selected
              ? 'border-amber-400/50 bg-amber-400/20 text-amber-300'
              : 'border-zinc-700 bg-zinc-800 text-zinc-400 group-hover:border-amber-500/30 group-hover:text-amber-400'
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className={`font-semibold ${selected ? 'text-amber-200' : 'text-zinc-200'}`}>{label}</p>
          {sublabel && <p className="text-xs text-zinc-500 mt-0.5">{sublabel}</p>}
        </div>
        {selected && <CheckCircle2 className="ml-auto h-5 w-5 text-amber-400 shrink-0" />}
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
      <div className="flex justify-between mb-2 text-xs text-zinc-500">
        <span>Very Light</span>
        <span className="text-amber-300 font-semibold">{labels[value - 1]}</span>
        <span>Intense & Bold</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full bg-zinc-800 cursor-pointer accent-amber-400"
      />
      <div className="flex justify-between mt-2">
        {[1, 2, 3, 4, 5].map((v) => (
          <div
            key={v}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              v <= value ? 'bg-amber-400' : 'bg-zinc-700'
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
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i < step ? 'bg-amber-400' : 'bg-zinc-800'
            }`}
          />
          {i === step - 1 && (
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 border-amber-400 bg-zinc-950" />
          )}
        </div>
      ))}
      <span className="text-xs text-zinc-500 ml-2 shrink-0">
        {step}/{total}
      </span>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export function RecommendClient() {
  const [mode, setMode] = useState<Mode>('ai');
  const [isPending, startTransition] = useTransition();

  // AI Mode
  const [aiPrompt, setAiPrompt] = useState('');

  // Guided Mode
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<GuidedForm>({
    gender: '',
    season: '',
    occasion: '',
    budget: '',
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

  function handleExamplePrompt(p: string) {
    setAiPrompt(p.replace(/^[^\s]+\s/, ''));
  }

  function handleGuidedSubmit() {
    startTransition(() => {
      // Will wire to recommendation engine in Phase 3
      console.log('Guided form submitted:', form);
    });
  }

  function handleAiSubmit() {
    startTransition(() => {
      console.log('AI prompt submitted:', aiPrompt);
    });
  }

  function canProceed() {
    if (step === 1) return form.gender !== '';
    if (step === 2) return form.season !== '';
    if (step === 3) return form.occasion !== '';
    if (step === 4) return form.budget !== '';
    return true;
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6">

      {/* Page Header */}
      <FadeIn direction="up">
        <div className="text-center mb-14">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              Personalised AI Engine
            </span>
          </div>
          <h1 className="font-serif text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Find Your <span className="golden-text-gradient">Perfect Scent</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400 text-lg font-light leading-relaxed">
            Describe your vibe in plain English, or walk through our guided questionnaire.
            Our engine will rank the best-matched luxury fragrances for you.
          </p>
        </div>
      </FadeIn>

      {/* Mode Toggle */}
      <FadeIn direction="up" delay={100}>
        <div className="glass-card rounded-2xl p-2 flex gap-2 mb-10">
          <button
            onClick={() => setMode('ai')}
            className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Wand2 className="h-4 w-4" />
            Describe Your Vibe (AI Mode)
          </button>
          <button
            onClick={() => setMode('guided')}
            className={`flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 ${
              mode === 'guided'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'text-zinc-500 hover:text-zinc-300'
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
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <label className="block font-serif text-xl font-bold text-zinc-100 mb-2">
                Tell us your vibe
              </label>
              <p className="text-sm text-zinc-500 mb-4">
                The more descriptive you are, the better our engine can match you. Try a mood, memory, place, or feeling.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={5}
                placeholder="e.g. I want something that smells like a cozy autumn evening in a Parisian cafe — warm, woody, with a hint of coffee and vanilla..."
                className="w-full rounded-xl bg-zinc-800/60 border border-zinc-700 text-zinc-100 placeholder-zinc-600 px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-none transition-colors"
              />
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-zinc-600">{aiPrompt.length} / 500 characters</span>
                <button
                  onClick={() => setAiPrompt('')}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Example Prompt Chips */}
          <FadeIn direction="up" delay={200}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600 mb-3">
                ✦ Quick Vibe Starters
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleExamplePrompt(prompt)}
                    className="rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-xs text-zinc-400 transition-all hover:border-amber-500/40 hover:bg-zinc-800/80 hover:text-amber-300"
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
              className="group w-full flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] hover:shadow-amber-500/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isPending ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Finding your matches...</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Analyse & Find My Scent Matches <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
            {aiPrompt.trim().length < 10 && aiPrompt.length > 0 && (
              <p className="text-center text-xs text-amber-600 mt-2">Please write at least 10 characters for a good match.</p>
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
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Step 1 of 4</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-2 mb-1">Who are you shopping for?</h2>
                <p className="text-sm text-zinc-500 mb-6">This helps us narrow down fragrance profiles and intensity.</p>
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
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Step 2 of 4</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-2 mb-1">What season will you wear it most?</h2>
                <p className="text-sm text-zinc-500 mb-6">Fragrances are formulated to perform differently in heat vs cold air.</p>
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
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Step 3 of 4</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-2 mb-1">What occasion is it for?</h2>
                <p className="text-sm text-zinc-500 mb-6">Projection and sillage requirements change based on setting and social distance.</p>
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
              <div className="glass-card rounded-2xl p-6 md:p-8 space-y-8">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Step 4 of 4</span>
                  <h2 className="font-serif text-2xl font-bold text-white mt-2 mb-1">Budget & Intensity preference</h2>
                  <p className="text-sm text-zinc-500 mb-6">Last step! Set your spend range and how bold you want the scent projection to be.</p>

                  {/* Budget Grid */}
                  <p className="text-sm font-semibold text-zinc-300 mb-3">Budget Range</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {(['$', '$$', '$$$', '$$$$'] as const).map((b) => (
                      <button
                        key={b}
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`rounded-xl border py-3.5 text-center font-mono font-bold text-sm transition-all hover:-translate-y-0.5 ${
                          form.budget === b
                            ? 'border-amber-400/60 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10'
                            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-amber-500/30'
                        }`}
                      >
                        {b}
                        <span className="block text-[10px] font-normal mt-1 text-zinc-600">
                          {b === '$' ? 'Under ₹3K' : b === '$$' ? '₹3K–₹7K' : b === '$$$' ? '₹7K–₹15K' : 'Above ₹15K'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div>
                  <p className="text-sm font-semibold text-zinc-300 mb-4">Scent Intensity / Projection</p>
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
                  className="flex h-12 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 text-sm text-zinc-400 transition-all hover:border-amber-500/30 hover:text-zinc-200"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!canProceed()}
                  className="flex flex-1 h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/80 to-yellow-500/80 font-semibold text-zinc-950 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleGuidedSubmit}
                  disabled={!canProceed() || isPending}
                  className="group flex flex-1 h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 font-semibold text-zinc-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Matching your scent...</>
                  ) : (
                    <><Sparkles className="h-5 w-5" /> Show My Top 5 Matches <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
              )}
            </div>
          </FadeIn>
        </div>
      )}

      {/* ─── How AI Works Info Scroll Section ─────────────────────────────── */}
      <div className="mt-28 border-t border-zinc-900 pt-20 space-y-16">
        <FadeIn direction="up">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Under the hood</p>
            <h2 className="font-serif text-3xl font-bold text-white">What happens after you submit?</h2>
            <p className="text-zinc-500 mt-3 max-w-lg mx-auto text-sm font-light">
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
              <div className="glass-card glass-card-hover rounded-2xl p-6 h-full">
                <div className="font-mono text-3xl font-bold golden-text-gradient mb-4">{s}</div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

    </main>
  );
}
