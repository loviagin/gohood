'use client';

import { Hero } from './components/hero/Hero';
import Features from './components/features/Features';
import { HowItWorks } from './components/how-it-works/HowItWorks';
import { CTA } from './components/cta/CTA';
import { Stats } from './components/stats/Stats';
import { FAQ } from './components/faq/FAQ';
import { CTA2 } from './components/cta-2/CTA2';

export default function RentersPage() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Stats />
      <FAQ />
      <CTA2 />
    </main>
  );
} 