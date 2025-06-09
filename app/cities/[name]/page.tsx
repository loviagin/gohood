'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { use } from 'react';
import { CityDocument } from '@/models/City';

interface CityPageProps {
  params: Promise<{ name: string }>;
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: any) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => any;
          };
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }
}

export default function CityPage({ params }: CityPageProps) {
  const { name } = use(params);
  const [city, setCity] = useState<CityDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [districtSearch, setDistrictSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<CityDocument['districts'][0] | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filteredDistricts, setFilteredDistricts] = useState<CityDocument['districts']>([]);
  const [isGoogleMapsLoading, setIsGoogleMapsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<Window['google']['maps']['places']['Autocomplete'] | null>(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google?.maps?.places) {
        console.log('Google Maps API already loaded');
        initializeAutocomplete();
        return;
      }

      if (isGoogleMapsLoading) {
        console.log('Google Maps API is already loading');
        return;
      }

      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API key is not defined');
        return;
      }

      console.log('Loading Google Maps API...');
      setIsGoogleMapsLoading(true);

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ru`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        setIsGoogleMapsLoading(false);
        initializeAutocomplete();
      };
      
      script.onerror = (error) => {
        console.error('Error loading Google Maps API:', error);
        setIsGoogleMapsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (window.google?.maps?.places && searchInputRef.current) {
      initializeAutocomplete();
    }
  }, [city?.country]);

  useEffect(() => {
    if (!city) {
      setFilteredDistricts([]);
      return;
    }

    const districts = city.districts;
    if (districtSearch) {
      // Ищем районы, которые содержат введенный адрес
      const filtered = districts.filter(district => 
        district.name.toLowerCase().includes(districtSearch.toLowerCase())
      );
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts);
    }
  }, [city, districtSearch]);

  const analyzeDistrict = async (address: string) => {
    try {
      setIsAnalyzing(true);
      const response = await fetch('/api/analyze-district', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          city: city?.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze district');
      }

      const data = await response.json();
      setSelectedDistrict(data);
    } catch (error) {
      console.error('Error analyzing district:', error);
      setError('Не удалось проанализировать район');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const initializeAutocomplete = () => {
    if (!searchInputRef.current || !window.google?.maps?.places) return;

    const currentAutocomplete = autocompleteRef.current;
    if (currentAutocomplete) {
      window.google.maps.event.clearInstanceListeners(currentAutocomplete);
    }

    const options = {
      componentRestrictions: { country: 'ru' },
      types: ['address'],
      language: 'ru',
      fields: ['address_components', 'formatted_address']
    };

    autocompleteRef.current = new window.google.maps.places.Autocomplete(searchInputRef.current, options);

    const currentRef = autocompleteRef.current;
    if (currentRef) {
      currentRef.addListener('place_changed', () => {
        const place = currentRef.getPlace();
        if (place?.formatted_address) {
          setDistrictSearch(place.formatted_address);
          analyzeDistrict(place.formatted_address);
        }
      });
    }
  };

  const fetchCityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/city/${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch city data');
      }
      const data = await response.json();
      setCity(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Если произошла ошибка и мы еще не достигли максимального количества попыток
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        // Повторяем запрос через 1 секунду
        setTimeout(fetchCityData, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, [name]);

  const handleDistrictSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistrictSearch(e.target.value);
    if (!e.target.value) {
      setSelectedDistrict(null);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !city) {
    return (
      <div className={styles.error}>
        {error || 'Город не найден'}
        <button onClick={fetchCityData} className={styles.retryButton}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          {!imageError ? (
            <Image
              src={city.imageUrl}
              alt={city.name}
              fill
              style={{ objectFit: 'cover' }}
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>{city.name}</span>
            </div>
          )}
        </div>
        <div className={styles.heroContent}>
          <h1>{city.fullName}</h1>
          <p>{city.description}</p>
        </div>
      </section>

      <section className={styles.quickInfo}>
        <div className={styles.infoCard}>
          <h3>Население</h3>
          <p>{city.details?.population?.toLocaleString()}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Язык</h3>
          <p>{city.details?.language}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Валюта</h3>
          <p>{city.details?.currency}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Лучшее время посетить</h3>
          <p>{city.details?.bestTimeToVisit}</p>
        </div>
      </section>

      {city.transportation && (
        <section className={styles.transportation}>
          <h2>Транспорт</h2>
          <p className={styles.generalInfo}>{city.transportation.generalInfo}</p>
          <div className={styles.transportTypes}>
            {city.transportation.types.map((type, index) => (
              <div key={index} className={styles.transportCard}>
                <h3>{type.name}</h3>
                <p>{type.description}</p>
                <div className={styles.paymentMethods}>
                  <h4>Методы оплаты:</h4>
                  <ul>
                    {type.paymentMethods.map((method, i) => (
                      <li key={i}>{method}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.tips}>
                  <h4>Советы:</h4>
                  <p>{type.tips}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {city.mobileOperators && (
        <section className={styles.mobileOperators}>
          <h2>Мобильные операторы</h2>
          <div className={styles.operatorsGrid}>
            {city.mobileOperators.map((operator, index) => (
              <div key={index} className={styles.operatorCard}>
                <h3>{operator.name}</h3>
                {operator.hasESim && (
                  <span className={styles.esimBadge}>eSIM доступен</span>
                )}
                <p>{operator.description}</p>
                <a
                  href={operator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.operatorLink}
                >
                  Посетить сайт
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={styles.districtRating}>
        <h2>Районы города</h2>
        <div className={styles.searchContainer}>
          <input
            ref={searchInputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Введите адрес для поиска района..."
            value={districtSearch}
            onChange={handleDistrictSearch}
          />
        </div>
        <div className={styles.districtInfo}>
          {isAnalyzing ? (
            <div className={styles.loading}>Анализируем район...</div>
          ) : selectedDistrict ? (
            <div className={styles.ratingCard}>
              <h3>{selectedDistrict.name}</h3>
              <div className={styles.ratingScale}>
                <div
                  className={styles.ratingBar}
                  style={{ width: `${selectedDistrict.rating.score}%` }}
                />
              </div>
              <span className={styles.ratingScore}>{Math.round(selectedDistrict.rating.score)}/100</span>
              <div className={styles.ratingFactors}>
                <h4>Факторы рейтинга</h4>
                <ul>
                  {selectedDistrict.rating.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.districtCards}>
              {filteredDistricts.map((district) => (
                <div key={district.name} className={styles.ratingCard}>
                  <h3>{district.name}</h3>
                  <div className={styles.ratingScale}>
                    <div
                      className={styles.ratingBar}
                      style={{ width: `${district.rating.score}%` }}
                    />
                  </div>
                  <span className={styles.ratingScore}>{Math.round(district.rating.score)}/100</span>
                  <div className={styles.ratingFactors}>
                    <h4>Факторы рейтинга</h4>
                    <ul>
                      {district.rating.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
