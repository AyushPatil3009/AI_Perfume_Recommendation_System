import type { Metadata } from 'next';
import { RegisterForm } from '../components/auth/RegisterForm';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Create Account | Aura Scent AI',
  description: 'Create your account to unlock bespoke fragrance consultations and save your perfume wishlists.',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610] flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />
      <div className="relative z-10 my-auto py-12">
        <RegisterForm />
      </div>
      <footer className="relative z-10 border-t border-stone-200/80 bg-white/90 py-6 text-center text-xs text-stone-500">
        © 2026 Aura Scent AI. Royal Scent Atelier.
      </footer>
    </div>
  );
}
