import type { Metadata } from 'next';
import { RecommendClient } from '../components/recommend/RecommendClient';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Find Your Scent | Aura Scent AI',
  description: 'Describe your vibe or answer a few questions. Our AI-powered engine will match you with the perfect luxury fragrance.',
};

export default function RecommendPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <AmbientFragranceParticles />
      <Navbar />
      <RecommendClient />
    </div>
  );
}
