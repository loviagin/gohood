"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { MapPin, Search, Home, Building2, House, Building, Users, Calendar as CalendarIcon, Star } from "lucide-react";
import styles from "./page.module.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import CityHero from "./components/search/CityHero";

export const dynamic = "force-dynamic";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search parameters from URL
  const location = searchParams.get("location") || "";
  const checkIn = searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")!) : null;
  const checkOut = searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")!) : null;
  const guests = parseInt(searchParams.get("guests") || "1");

  useEffect(() => {
    const fetchResults = async () => {
      if (!location || !checkIn || !checkOut) {
        setError("Необходимо указать все параметры поиска");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Searching with params:', {
          location,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests
        });
      } catch (err) {
        console.error('Search error:', err);
        // Show more specific error message if available
        const errorMessage = err instanceof Error ? err.message : "Произошла ошибка при поиске жилья. Пожалуйста, попробуйте позже.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [location, checkIn, checkOut, guests]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, "d MMMM", { locale: ru });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${styles.starIcon} ${i < stars ? styles.starFilled : styles.starEmpty}`}
        size={16}
      />
    ));
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {location && <CityHero cityName={location} />}

        <div className={styles.searchSummary}>
          <h1 className={styles.title}>Результаты поиска</h1>
          <div className={styles.searchParams}>
            <div className={styles.searchParam}>
              <MapPin className={styles.paramIcon} />
              <span>{location}</span>
            </div>
            {(checkIn || checkOut) && (
              <div className={styles.searchParam}>
                <CalendarIcon className={styles.paramIcon} />
                <span>
                  {checkIn && formatDate(checkIn)}
                  {checkIn && checkOut && " — "}
                  {checkOut && formatDate(checkOut)}
                </span>
              </div>
            )}
            <div className={styles.searchParam}>
              <Users className={styles.paramIcon} />
              <span>{guests} {guests === 1 ? "гость" : guests < 5 ? "гостя" : "гостей"}</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Поиск жилья...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>По вашему запросу ничего не найдено</p>
            <p className={styles.noResultsSubtext}>
              Попробуйте изменить параметры поиска или посмотрите другие варианты
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
