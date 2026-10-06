'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, User as UserIcon, LogOut } from 'lucide-react';

import { logoutUserAction } from '@/app/actions/authActions';

export function Navbar() {
  const [user, setUser] = useState<{ name: string; email: string; credits: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aura_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse user session', e);
        }
      }
    }
  }, []);

  async function handleSignOut() {
    await logoutUserAction();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_user');
      setUser(null);
      window.location.href = '/';
    }
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && typeof window !== 'undefined') {
      const targetId = href.replace('/#', '');
      if (window.location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#C59B4B]/30 bg-white/90 backdrop-blur-2xl shadow-sm shadow-[#C59B4B]/10 transition-all">
      {/* Bottom Subtle Golden Highlight Beam */}
      <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C59B4B]/50 to-transparent pointer-events-none" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C59B4B]/20 to-[#E6C675]/30 border border-[#C59B4B]/40 group-hover:border-[#C59B4B] group-hover:scale-105 transition-all shadow-sm shadow-[#C59B4B]/10">
            <Sparkles className="h-5 w-5 text-[#C59B4B] animate-pulse" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-wider golden-text-gradient">
              AURA SCENT
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-stone-500 font-medium">
              AI Fragrance Atelier
            </span>
          </div>
        </Link>

        {/* Navigation Links with Smooth Gliding Pill Hover */}
        <nav className="hidden items-center gap-1.5 md:flex bg-stone-100/90 border border-stone-200/90 rounded-full px-3 py-1 shadow-inner">
          <Link
            href="/#hero"
            onClick={(e) => handleNavClick(e, '/#hero')}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition-all duration-300 hover:bg-white hover:text-[#9A7025] hover:shadow-sm hover:scale-105 active:scale-95"
          >
            Explore
          </Link>

          <Link
            href="/#how-it-works"
            onClick={(e) => handleNavClick(e, '/#how-it-works')}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition-all duration-300 hover:bg-white hover:text-[#9A7025] hover:shadow-sm hover:scale-105 active:scale-95"
          >
            How It Works
          </Link>

          <Link
            href="/#about"
            onClick={(e) => handleNavClick(e, '/#about')}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition-all duration-300 hover:bg-white hover:text-[#9A7025] hover:shadow-sm hover:scale-105 active:scale-95"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition-all duration-300 hover:bg-white hover:text-[#9A7025] hover:shadow-sm hover:scale-105 active:scale-95"
          >
            Contact
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-full bg-[#C59B4B]/15 border border-[#C59B4B]/35 px-3.5 py-1.5 text-xs font-bold text-[#9A7025] transition-all hover:bg-[#C59B4B]/25 hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C59B4B]" />
              <span>My Vault</span>
            </Link>
          )}
        </nav>

        {/* Call To Action & Auth Status */}
        <div className="flex items-center gap-3.5">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* User Account Capsule - Clickable to Dashboard */}
              <Link
                href="/dashboard"
                title="View Scent Vault & Profile"
                className="group flex items-center gap-2.5 rounded-full border border-[#C59B4B]/30 bg-stone-100/90 pl-2 pr-3.5 py-1.5 text-xs transition-all hover:border-[#C59B4B]/60 hover:bg-white hover:shadow-md hover:shadow-[#C59B4B]/10"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#C59B4B]/30 to-[#E6C675]/40 border border-[#C59B4B]/40 text-[#9A7025] group-hover:scale-105 transition-transform">
                  <UserIcon className="h-3.5 w-3.5 text-[#9A7025]" />
                </div>
                <span className="font-semibold text-stone-900 group-hover:text-[#9A7025] transition-colors">
                  {user.name || user.email.split('@')[0]}
                </span>
                <span className="rounded-md bg-[#C59B4B]/15 border border-[#C59B4B]/30 px-1.5 py-0.5 text-[10px] font-bold text-[#9A7025] uppercase tracking-wider font-mono">
                  Vault
                </span>
              </Link>

              {/* Distinct High-Visibility Logout Button */}
              <button
                onClick={handleSignOut}
                title="Sign Out of Account"
                className="flex items-center gap-1.5 rounded-full border border-rose-400/40 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 hover:border-rose-400 hover:scale-105 active:scale-95 shadow-sm"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-600" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-800 transition-all hover:border-[#C59B4B]/50 hover:text-[#9A7025] hover:bg-white"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/recommend"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] p-0.5 text-sm font-semibold text-white shadow-lg shadow-[#C59B4B]/25 transition-all hover:scale-105 hover:shadow-[#C59B4B]/35 active:scale-95"
          >
            <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C59B4B] to-[#B8860B] px-5 py-2 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-[#FFF5DC]" />
              <span className="font-semibold text-white">
                Get Scent Match
              </span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
