'use client';

import { useEffect, useState } from 'react';
import { MapPin, Users, Clock, Globe, Thermometer, Calendar, Star, Utensils } from 'lucide-react';
import styles from './CityHero.module.css';
import type { CityDocument } from '@/models/City';

interface CityHeroProps {
  cityName: string;
}

export default function CityHero({ cityName }: CityHeroProps) {
  const [cityInfo, setCityInfo] = useState<CityDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Функция для получения проксированного URL изображения
  const getProxiedImageUrl = (url: string) => {
    return `/api/cities/${encodeURIComponent(cityName)}/image?url=${encodeURIComponent(url)}`;
  };

  useEffect(() => {
    const fetchCityInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setImageError(false);
        setImageLoaded(false);
        const response = await fetch(`/api/cities/${encodeURIComponent(cityName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch city information');
        }
        const data = await response.json();
        console.log('City image URL:', data.imageUrl);
        setCityInfo(data);
      } catch (err) {
        console.error('Error fetching city info:', err);
        setError('Не удалось загрузить информацию о городе');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityInfo();
  }, [cityName]);

  const imageUrl = imageError ? "/placeholder.webp" : cityInfo?.imageUrl;

  if (isLoading) {
    return (
      <div className={styles.hero}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Загрузка информации о городе...</p>
        </div>
      </div>
    );
  }

  if (error || !cityInfo) {
    return (
      <div className={styles.hero}>
        <div className={styles.error}>
          <p>{error || 'Город не найден'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.hero}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "400px",
      }}
    >
      {/* Скрытый img для отслеживания ошибки загрузки */}
      {cityInfo?.imageUrl && (
        <img
          src={cityInfo.imageUrl}
          alt=""
          style={{ display: "none" }}
          onError={() => setImageError(true)}
        />
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>{cityInfo.fullName}</h1>
        <p className={styles.description}>{cityInfo.description}</p>
        
        <div className={styles.details}>
          {cityInfo.details.population && (
            <div className={styles.detail}>
              <Users className={styles.detailIcon} />
              <span>Население: {cityInfo.details.population.toLocaleString()}</span>
            </div>
          )}
          {cityInfo.details.language && (
            <div className={styles.detail}>
              <Globe className={styles.detailIcon} />
              <span>Язык: {cityInfo.details.language}</span>
            </div>
          )}
          {cityInfo.details.currency && (
            <div className={styles.detail}>
              <span className={styles.detailIcon}>₽</span>
              <span>Валюта: {cityInfo.details.currency}</span>
            </div>
          )}
          {cityInfo.details.timezone && (
            <div className={styles.detail}>
              <Clock className={styles.detailIcon} />
              <span>Часовой пояс: {cityInfo.details.timezone}</span>
            </div>
          )}
          {cityInfo.details.averageTemperature?.summer && (
            <div className={styles.detail}>
              <Thermometer className={styles.detailIcon} />
              <span>Летом: {cityInfo.details.averageTemperature.summer}°C</span>
            </div>
          )}
          {cityInfo.details.averageTemperature?.winter && (
            <div className={styles.detail}>
              <Thermometer className={styles.detailIcon} />
              <span>Зимой: {cityInfo.details.averageTemperature.winter}°C</span>
            </div>
          )}
          {cityInfo.details.bestTimeToVisit && (
            <div className={styles.detail}>
              <Calendar className={styles.detailIcon} />
              <span>Лучшее время: {cityInfo.details.bestTimeToVisit}</span>
            </div>
          )}
        </div>

        {cityInfo.details.attractions && cityInfo.details.attractions.length > 0 && (
          <div className={styles.attractions}>
            <h2 className={styles.attractionsTitle}>Достопримечательности</h2>
            <div className={styles.attractionsList}>
              {cityInfo.details.attractions.map((attraction, index) => (
                <div key={index} className={styles.attraction}>
                  <Star className={styles.detailIcon} />
                  <span>{attraction}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cityInfo.details.localCuisine && cityInfo.details.localCuisine.length > 0 && (
          <div className={styles.cuisine}>
            <h2 className={styles.cuisineTitle}>Местная кухня</h2>
            <div className={styles.cuisineList}>
              {cityInfo.details.localCuisine.map((dish, index) => (
                <div key={index} className={styles.dish}>
                  <Utensils className={styles.detailIcon} />
                  <span>{dish}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 