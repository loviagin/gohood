"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { MapPin, Search, Home, Building2, House, Building, Users, Calendar as CalendarIcon, Star } from "lucide-react";
import styles from "./page.module.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { searchHotels, type HotelResult } from "../services/hotellook";
import CityHero from "./components/search/CityHero";
import Script from "next/script";

export const dynamic = "force-dynamic";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<HotelResult[]>([]);
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

        const searchResults = await searchHotels({
          location,
          checkIn,
          checkOut,
          guests,
        });

        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError("Произошла ошибка при поиске жилья. Пожалуйста, попробуйте позже.");
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

        <Script
          async
          src="https://tpwdgt.com/content?currency=rub&trs=422801&shmarker=635726&type=compact&host=search.hotellook.com&locale=ru&limit=10&powered_by=false&nobooking=&id=12153&categories=center&primary=%23ff8e00&special=%23e0e0e0&promo_id=4026&campaign_id=101"
          strategy="afterInteractive"
        />

        {/* {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Поиск жилья...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className={styles.noResults}>
            <p>По вашему запросу ничего не найдено</p>
            <p className={styles.noResultsSubtext}>
              Попробуйте изменить параметры поиска или посмотрите другие варианты
            </p>
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {results.map((hotel) => (
              <article key={hotel.id} className={styles.resultCard}>
                <div className={styles.resultImage}>
                  <img
                    src={hotel.images[0] || '/images/placeholder.jpg'}
                    alt={hotel.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className={styles.resultType}>
                    <Building2 className={styles.resultIcon} />
                    <span>Отель {hotel.stars}★</span>
                  </div>
                </div>
                <div className={styles.resultContent}>
                  <h2 className={styles.resultTitle}>{hotel.name}</h2>
                  <p className={styles.resultLocation}>
                    <MapPin className={styles.locationIcon} />
                    {hotel.location.city}, {hotel.location.address}
                  </p>
                  <div className={styles.resultDetails}>
                    <div className={styles.starsContainer}>
                      {getStars(hotel.stars)}
                    </div>
                    <span>•</span>
                    <span>{hotel.rating.reviews} отзывов</span>
                  </div>
                  <div className={styles.resultFooter}>
                    <div className={styles.resultRating}>
                      <span className={styles.ratingValue}>{hotel.rating.score.toFixed(1)}</span>
                      <span className={styles.ratingLabel}>отлично</span>
                    </div>
                    <div className={styles.resultPrice}>
                      <span className={styles.priceValue}>
                        {formatPrice(hotel.price.amount, hotel.price.currency)}
                      </span>
                      <span className={styles.pricePeriod}>за ночь</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )} */}
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
