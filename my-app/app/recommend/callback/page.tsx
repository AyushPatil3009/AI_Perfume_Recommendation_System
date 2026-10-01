import React, { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export const metadata = {
  title: 'Verifying Scent Pass | Aura Scent Atelier',
};

export default function StripeCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#9A7025] font-mono">
          Loading payment status...
        </div>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}
