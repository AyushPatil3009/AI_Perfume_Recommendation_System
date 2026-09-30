'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyAndFulfillCheckoutAction } from '@/app/actions/stripeActions';
import { Sparkles, Loader2 } from 'lucide-react';

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [statusText, setStatusText] = useState('Verifying your Scent Pass...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg('No checkout session found.');
      return;
    }

    let isMounted = true;

    async function verifyAndFulfill() {
      try {
        setStatusText('Payment Verified! Invoking Gemini AI Sommelier...');
        const response = await verifyAndFulfillCheckoutAction(sessionId!);

        if (!isMounted) return;

        if (response.success && response.results && response.results.length > 0) {
          setStatusText('Distilling bespoke recommendations...');
          // Save results in sessionStorage just like normal flow
          sessionStorage.setItem('aura_results', JSON.stringify(response.results));
          sessionStorage.setItem('aura_prompt', response.vibeSummary || 'Your Bespoke Scent Profile');
          
          // Redirect to results page
          router.push('/results');
        } else {
          setErrorMsg(response.message || 'Failed to curate recommendations. Please contact support.');
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err?.message || 'An unexpected error occurred during fulfillment.');
        }
      }
    }

    verifyAndFulfill();

    return () => {
      isMounted = false;
    };
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1610] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#C59B4B]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6 bg-white/95 border border-[#C59B4B]/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-[#C59B4B]/10">
        {!errorMsg ? (
          <>
            {/* Spinning Golden Compass Ring */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#C59B4B]/20 border-t-[#C59B4B] animate-spin" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C59B4B]/30 to-[#E6C675]/30 flex items-center justify-center text-xl shadow-inner">
                ✨
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-serif text-stone-900 tracking-wide font-bold">
                Unlocking Royal Scent Formula
              </h2>
              <p className="text-sm text-stone-600 transition-all duration-300 font-light">
                {statusText}
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 border border-rose-300 flex items-center justify-center text-2xl text-rose-600">
              ⚠️
            </div>
            <h3 className="text-lg font-serif text-stone-900 font-bold">Checkout Verification Failed</h3>
            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">
              {errorMsg}
            </p>
            <button
              onClick={() => router.push('/recommend')}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C59B4B] to-[#B8860B] hover:scale-105 text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-lg shadow-[#C59B4B]/30"
            >
              Return to Sommelier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
