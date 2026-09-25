'use client';

import Link from 'next/link';
import { Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-500/10 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-300/30 border border-amber-500/30 group-hover:border-amber-400 transition-colors">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wider golden-text-gradient">
              AURA SCENT
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-zinc-400">
              AI Fragrance Atelier
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#hero"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-300"
          >
            Explore
          </Link>

          <Link
            href="#how-it-works"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-300"
          >
            How It Works
          </Link>

          <Link
            href="#families"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-300"
          >
            Fragrance Families
          </Link>

          <Link
            href="#pricing"
            className="flex items-center gap-1.5 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
          >
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            Pricing / Pro Pass
          </Link>
        </nav>

        {/* Call To Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/recommend"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 p-0.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:shadow-amber-500/30 active:scale-95"
          >
            <span className="flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 transition-all duration-300 group-hover:bg-transparent">
              <Sparkles className="h-4 w-4 text-amber-400 group-hover:text-zinc-950 transition-colors" />
              <span className="golden-text-gradient group-hover:text-zinc-950 group-hover:bg-none font-medium">
                Get Scent Match
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
