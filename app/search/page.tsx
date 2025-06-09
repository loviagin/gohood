"use client"

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import CityHero from "./components/hero/CityHero";
import SearchForm from './components/search/SearchForm';
import SearchFilters, { FilterState } from './components/search/SearchFilters';
import { SearchResults } from './components/search/SearchResults';
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    propertyTypes: [],
    amenities: [],
    rating: null,
    instantBook: false,
    bedTypes: [],
    roomTypes: [],
    cancellationPolicy: [],
    hostLanguage: [],
    accessibility: []
  });

  // Get search parameters from URL
  const city = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : undefined;
  const checkOut = searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : undefined;
  const guests = parseInt(searchParams.get('guests') || '1', 10);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

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
        <SearchFilters onFilterChange={handleFilterChange} />
        <Suspense fallback={<div className={styles.loading}>Loading results...</div>}>
          <SearchResults
            city={city}
            checkIn={checkIn?.toISOString() || ''}
            checkOut={checkOut?.toISOString() || ''}
            guests={guests}
            filters={filters}
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
