import type { Metadata } from 'next';
import { ResultsClient } from '../components/results/ResultsClient';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Your Scent Matches | Aura Scent AI',
  description:
    'Your personalised AI-powered perfume recommendations, ranked by match score with fragrance pyramid breakdown and direct luxury store links.',
};

export default function ResultsPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <AmbientFragranceParticles />
      <Navbar />
      <ResultsClient />
    </div>
  );
}
