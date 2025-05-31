"use client"
import Cities from "../components/cities/Cities";
import Features from "../components/features/Features";
import Hero from "../components/hero/Hero";
import HowItWorks from "../components/howitworks/HowItWorks";
import Stats from "../components/stats/Stats";
import CTA from "../components/cta/CTA";
import { useTranslations } from 'next-intl';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const t = useTranslations('Home');
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
      <Hero 
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        cta={t('hero.cta')}
      />
      <Features 
        title={t('features.title')}
        subtitle={t('features.subtitle')}
      />
      <Cities 
        title={t('cities.title')}
        subtitle={t('cities.subtitle')}
      />
      <HowItWorks 
        title={t('howItWorks.title')}
        subtitle={t('howItWorks.subtitle')}
      />
      <Stats 
        title={t('stats.title')}
        subtitle={t('stats.subtitle')}
      />
      <CTA 
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        button={t('cta.button')}
      />
    </main>
  );
} 