import Cities from "./components/cities/Cities";
import Features from "./components/features/Features";
import Hero from "./components/hero/Hero";
import HowItWorks from "./components/howitworks/HowItWorks";
import Stats from "./components/stats/Stats";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Cities />
      <HowItWorks />      
      <Stats />
    </main>
  );
}
