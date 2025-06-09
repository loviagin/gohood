"use client"

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CityHero from "./components/hero/CityHero";
import SearchForm from './components/search/SearchForm';
import { SearchResults } from './components/search/SearchResults';
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function SearchPageContent() {
  const searchParams = useSearchParams();

  // Get search parameters from URL
  const city = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined;
  const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined;
  const guests = parseInt(searchParams.get('guests') || '1', 10);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {city && <CityHero cityName={city} />}
        <SearchForm
          initialCity={city}
          initialCheckIn={checkIn}
          initialCheckOut={checkOut}
          initialGuests={guests}
        />
        <Suspense fallback={<div className={styles.loading}>Loading results...</div>}>
          <SearchResults
            city={city}
            checkIn={checkIn?.toISOString() || ''}
            checkOut={checkOut?.toISOString() || ''}
            guests={guests}
          />
        </Suspense>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
