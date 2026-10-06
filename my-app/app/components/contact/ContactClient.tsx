'use client';

import { useState, useTransition } from 'react';
import { Sparkles, Mail, MapPin, Send, MessageSquare, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { sendContactInquiryAction } from '@/app/actions/contactActions';

export function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [emailTouched, setEmailTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Real-time Email Format Verification Regex
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setEmailTouched(true);

    if (!name.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }

    if (!isEmailValid) {
      setErrorMessage('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (message.trim().length < 10) {
      setErrorMessage('Please enter a message of at least 10 characters.');
      return;
    }

    startTransition(async () => {
      const res = await sendContactInquiryAction({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    });
  }

  function handleReset() {
    setName('');
    setEmail('');
    setMessage('');
    setEmailTouched(false);
    setErrorMessage(null);
    setIsSuccess(false);
  }

  return (
    <main className="relative z-10 mx-auto max-w-4xl px-6 py-20">
      {/* Header */}
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
          Have questions about your olfactory consultation, fragrance database additions, or bespoke curations? We are at your service.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        {/* Left Info Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 bg-white/95 border border-[#C59B4B]/25 shadow-md space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] shrink-0 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 text-sm">Direct Concierge Email</h4>
                <p className="text-xs text-stone-500 mt-0.5 font-mono">concierge@aurascent.ai</p>
                <p className="text-xs text-stone-500 font-mono">ayushpatil30905@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] shrink-0 shadow-sm">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 text-sm">Haute Parfumerie Lab</h4>
                <p className="text-xs text-stone-500 mt-0.5">Place Vendôme, Paris & Mumbai Fragrance Quarter</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#C59B4B]/15 border border-[#C59B4B]/30 flex items-center justify-center text-[#9A7025] shrink-0 shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 text-sm">Response Guarantee</h4>
                <p className="text-xs text-stone-500 mt-0.5">Our sommelier team answers all inquiries within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7">
          <div className="glass-card rounded-3xl p-8 bg-white/95 border border-[#C59B4B]/25 shadow-md relative overflow-hidden">
            {/* Top Gold Accent Ribbon */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#C59B4B]/50 to-transparent" />

            {isSuccess ? (
              /* ✨ Luxury Green Checkmark Success Card */
              <div className="text-center py-8 px-4 space-y-6 animate-fadeIn">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-400 shadow-xl shadow-emerald-500/10">
                  <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" style={{ animationDuration: '2.5s' }} />
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 relative z-10" />
                </div>

                <div className="space-y-2">
                  <span className="inline-block rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                    Dispatched Successfully
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Inquiry Received with Distinction
                  </h3>
                  <p className="text-sm text-stone-600 max-w-md mx-auto font-light leading-relaxed">
                    Thank you, <strong className="font-semibold text-stone-900">{name}</strong>. Your message has been routed to Our Team. We will review your inquiry and reply to <span className="font-mono text-xs text-[#9A7025]">{email}</span> within 24 hours.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#C59B4B]/40 bg-[#C59B4B]/10 px-5 py-2.5 text-xs font-semibold text-[#704C16] hover:bg-[#C59B4B] hover:text-white transition-all shadow-sm"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              /* 📝 Interactive Inquiry Form */
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">Send an Inquiry</h3>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Lady / Lord Harrington"
                      required
                      className="w-full rounded-xl bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-[#C59B4B] focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 shadow-inner transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
                        Email Address
                      </label>
                      {emailTouched && (
                        <span className={`text-[11px] font-mono ${isEmailValid ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isEmailValid ? '✓ Valid format' : '✗ Invalid email'}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (!emailTouched) setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="curator@example.com"
                      required
                      className={`w-full rounded-xl bg-stone-50 border px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none shadow-inner transition-colors ${
                        emailTouched && !isEmailValid
                          ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                          : 'border-stone-300 focus:border-[#C59B4B] focus:ring-1 focus:ring-[#C59B4B]/30'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
                      Message / Special Scent Request
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what fragrance family, notes, or consultation guidance you are looking for..."
                      required
                      className="w-full rounded-xl bg-stone-50 border border-stone-300 px-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:border-[#C59B4B] focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 shadow-inner resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Dispatching to Concierge...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Dispatch Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
