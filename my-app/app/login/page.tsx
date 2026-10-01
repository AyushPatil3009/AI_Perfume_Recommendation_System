import type { Metadata } from 'next';
import { LoginForm } from '../components/auth/LoginForm';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Navbar } from '../components/Navbar';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In | Aura Scent AI',
  description: 'Sign in to access your saved perfume wishlists, recommendation history, and Scent Vault.',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610] flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />
      <div className="relative z-10 my-auto py-12">
        <Suspense fallback={<div className="text-center text-[#9A7025] text-sm font-mono">Loading login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
      <footer className="relative z-10 border-t border-stone-200/80 bg-white/90 py-6 text-center text-xs text-stone-500">
        © 2026 Aura Scent AI. Royal Scent Atelier.
      </footer>
    </div>
  );
}
