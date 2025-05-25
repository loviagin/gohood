import Cities from "./components/cities/Cities";
import Features from "./components/features/Features";
import Hero from "./components/hero/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Cities />
    </main>
  );
}
