import type { Metadata } from 'next';
import { RegisterForm } from '../components/auth/RegisterForm';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Create Account | Aura Scent AI',
  description: 'Create your free account to unlock 3 free AI recommendation credits and save perfume wishlists.',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />
      <div className="relative z-10 my-auto py-12">
        <RegisterForm />
      </div>
      <footer className="relative z-10 border-t border-zinc-900 bg-zinc-950/90 py-6 text-center text-xs text-zinc-600">
        © 2026 Aura Scent AI. Free Account Creation.
      </footer>
    </div>
  );
}
