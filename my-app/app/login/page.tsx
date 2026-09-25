import type { Metadata } from 'next';
import { LoginForm } from '../components/auth/LoginForm';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Sign In | Aura Scent AI',
  description: 'Sign in to access your saved perfume wishlists, recommendation history, and Pro scent credits.',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />
      <div className="relative z-10 my-auto py-12">
        <LoginForm />
      </div>
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/90 py-6 text-center text-xs text-zinc-600">
        © 2026 Aura Scent AI. Secure Authentication.
      </footer>
    </div>
  );
}
