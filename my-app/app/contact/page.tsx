import type { Metadata } from 'next';
import { Navbar } from '../components/Navbar';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { ContactClient } from '../components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact the Atelier | Aura Scent AI',
  description: 'Connect with the master curators and engineering team behind Aura Scent AI.',
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610] flex flex-col justify-between">
      <AmbientFragranceParticles />
      <Navbar />

      <ContactClient />

      <footer className="border-t border-stone-200/80 bg-white/90 py-8 text-center text-xs text-stone-500">
        © 2026 Aura Scent AI. Haute Parfumerie Atelier.
      </footer>
    </div>
  );
}

