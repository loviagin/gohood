"use client"
import Cities from "./components/cities/Cities";
import Features from "./components/features/Features";
import Hero from "./components/hero/Hero";
import HowItWorks from "./components/howitworks/HowItWorks";
import Stats from "./components/stats/Stats";
import CTA from "./components/cta/CTA";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      if (!session?.user?.profileCompleted) {
        router.replace("/registration?step=details");
      }
    }
  }, [status, session]);

  return (
    <main>
      <Hero />
      <Features />
      <Cities />
      <HowItWorks />
      <Stats />
      <CTA />
    </main>
  );
}
