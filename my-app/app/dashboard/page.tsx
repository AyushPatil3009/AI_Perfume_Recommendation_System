import { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';
import { Navbar } from '../components/Navbar';
import { AmbientFragranceParticles } from '../components/AmbientFragranceParticles';

export const metadata: Metadata = {
  title: 'My Scent History & Archives | Aura Scent Atelier',
  description: 'View your bespoke AI fragrance prescriptions and past recommendations.',
};

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#1C1610]">
      <AmbientFragranceParticles />
      <Navbar />
      <DashboardClient />
    </div>
  );
}
