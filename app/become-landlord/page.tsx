import { Hero } from "./components/hero/Hero";
import { Benefits } from "./components/benefits/Benefits";
import { HowItWorks } from "./components/howitworks/HowItWorks";
import { FAQ } from "./components/faq/FAQ";
import { CTA } from "./components/cta/CTA";
import Stats from "./components/stats/Stats";
import { CTA2 } from "./components/cta-2/CTA2";

export default function BecomeLandlord() {
  return (
    <main>
      <Hero />
      <Benefits />
      <HowItWorks />
      <CTA />
      <Stats />
      <FAQ />
      <CTA2 />
    </main>
  );
}