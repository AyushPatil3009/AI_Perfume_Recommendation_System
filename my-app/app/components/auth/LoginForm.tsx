'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

import { useRouter, useSearchParams } from 'next/navigation';
import { loginUserAction } from '@/app/actions/authActions';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/recommend';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'email') formattedErrors.email = issue.message;
        if (issue.path[0] === 'password') formattedErrors.password = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    startTransition(async () => {
      const res = await loginUserAction({ email, password });
      if (res.success) {
        // Save user state & redirect
        if (typeof window !== 'undefined') {
          localStorage.setItem('aura_user', JSON.stringify(res.user));
        }
        router.push(redirectTo);
      } else {
        setServerError(res.message || 'Login failed.');
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md px-4">
      <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden bg-white/95 border border-[#C59B4B]/25">
        {/* Top Glow Accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B]" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C59B4B]/10 border border-[#C59B4B]/30">
            <Sparkles className="h-6 w-6 text-[#C59B4B] animate-pulse" />
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-stone-900">Welcome Back</h1>
          <p className="mt-2 text-xs text-stone-500 font-light">
            Sign in to access your saved scent profile & wishlists
          </p>
        </div>

        {/* Server Error Banner */}
        {serverError && (
          <div className="mb-6 rounded-xl border border-rose-400/40 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full rounded-xl bg-stone-50 border ${
                  errors.email ? 'border-rose-500' : 'border-stone-300 focus:border-[#C59B4B]'
                } pl-10 pr-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 transition-colors shadow-inner`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
                Password
              </label>
              <Link href="#" className="text-xs text-[#9A7025] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl bg-stone-50 border ${
                  errors.password ? 'border-rose-500' : 'border-stone-300 focus:border-[#C59B4B]'
                } pl-10 pr-10 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 transition-colors shadow-inner`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="group w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-stone-200/80 pt-5">
          <p className="text-xs text-stone-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-[#9A7025] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
