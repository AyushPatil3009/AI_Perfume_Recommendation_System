'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerUserAction } from '@/app/actions/authActions';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address (e.g. name@domain.com)'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must include at least one letter (A-Z or a-z)')
    .regex(/[0-9]/, 'Password must include at least one number (0-9)')
    .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character (!@#$%^&*)'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/recommend';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGoogleSignUp() {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`;
  }

  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  // Password Requirements Check
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  function getPasswordStrength(pass: string) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-zA-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  }

  const strength = getPasswordStrength(password);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerMessage(null);
    setEmailTouched(true);

    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    startTransition(async () => {
      const res = await registerUserAction({ name, email, password });
      if (res.success) {
        setServerMessage({ type: 'success', text: res.message || 'Success! Redirecting to login...' });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setServerMessage({ type: 'error', text: res.message || 'Registration failed.' });
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
          <h1 className="font-serif text-3xl font-extrabold text-stone-900">Create Account</h1>
          <p className="mt-2 text-xs text-stone-500 font-light">
            Join the Royal Scent Atelier & access personalized fragrance history
          </p>
        </div>

        {/* Server Feedback Banner */}
        {serverMessage && (
          <div
            className={`mb-6 rounded-xl border p-4 text-xs font-medium ${
              serverMessage.type === 'success'
                ? 'border-emerald-400/40 bg-emerald-50 text-emerald-700'
                : 'border-rose-400/40 bg-rose-50 text-rose-700'
            }`}
          >
            {serverMessage.text}
          </div>
        )}

        {/* 1-Click Google Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full flex h-12 items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white text-stone-800 font-semibold text-sm shadow-sm hover:border-[#C59B4B] hover:bg-stone-50/90 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <GoogleIcon />
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-stone-400 font-mono">Or register with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`w-full rounded-xl bg-stone-50 border ${
                  errors.name ? 'border-rose-500' : 'border-stone-300 focus:border-[#C59B4B]'
                } pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 transition-colors shadow-inner`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>}
          </div>

          {/* Email Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
                Email Address
              </label>
              {emailTouched && (
                <span className={`text-[11px] font-mono ${isEmailValid ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}`}>
                  {isEmailValid ? '✓ Valid format' : '✗ Enter valid email (e.g. name@domain.com)'}
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!emailTouched) setEmailTouched(true);
                }}
                onBlur={() => setEmailTouched(true)}
                placeholder="name@example.com"
                className={`w-full rounded-xl bg-stone-50 border ${
                  errors.email || (emailTouched && !isEmailValid) ? 'border-rose-500' : 'border-stone-300 focus:border-[#C59B4B]'
                } pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 transition-colors shadow-inner`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={`w-full rounded-xl bg-stone-50 border ${
                  errors.password ? 'border-rose-500' : 'border-stone-300 focus:border-[#C59B4B]'
                } pl-10 pr-10 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C59B4B]/30 transition-colors shadow-inner`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Complexity Checklist */}
            <div className="mt-2.5 rounded-xl border border-stone-200/90 bg-stone-50/90 p-3 space-y-1.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider font-mono">
                  Password Strength:
                </span>
                <span className="text-[10px] font-mono font-bold text-[#9A7025]">
                  {strength <= 1 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong & Secure'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-stone-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span>8+ Characters</span>
                </div>
                <div className={`flex items-center gap-1.5 transition-colors ${hasLetter ? 'text-emerald-700 font-semibold' : 'text-stone-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hasLetter ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span>1+ Letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-stone-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span>1+ Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 transition-colors ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-stone-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${hasSpecial ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span>1+ Special (!@#$)</span>
                </div>
              </div>
            </div>

            {errors.password && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
                Confirm Password
              </label>
              {confirmPassword.length > 0 && (
                <span
                  className={`text-[11px] font-mono font-semibold ${
                    password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full rounded-xl bg-stone-50 border ${
                  errors.confirmPassword || (confirmPassword.length > 0 && password !== confirmPassword)
                    ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                    : confirmPassword.length > 0 && password === confirmPassword
                    ? 'border-emerald-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200'
                    : 'border-stone-300 focus:border-[#C59B4B] focus:ring-1 focus:ring-[#C59B4B]/30'
                } pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-colors shadow-inner`}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="group w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C59B4B] via-[#D4AF37] to-[#B8860B] font-semibold text-white shadow-lg shadow-[#C59B4B]/30 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 mt-4"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#9A7025] hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
