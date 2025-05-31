"use client"

import { useState, useRef, useCallback, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import styles from "./page.module.css";

interface CitySuggestion {
  cityName: string;
  fullName: string;
  countryName: string;
  countryCode: string;
  id: string;
  hotelsCount: string;
  location: {
    lat: string;
    lon: string;
  };
}

const cities = [
  { name: "Москва", image: "/cities/moscow.webp" },
  { name: "Санкт-Петербург", image: "/cities/spb.webp" },
  { name: "Лондон", image: "/cities/london.webp" },
  { name: "Париж", image: "/cities/paris.webp" },
  { name: "Милан", image: "/cities/milan.webp" },
  { name: "Казань", image: "/cities/kazan.webp" },
  { name: "Ярославль", image: "/cities/yaroslavl.webp" },
  { name: "Сочи", image: "/cities/sochi.webp" },
  { name: "Екатеринбург", image: "/cities/ekb.webp" },
  { name: "Анапа", image: "/cities/anapa.webp" },
  { name: "Краснодар", image: "/cities/krasnodar.webp" },
  { name: "Новосибирск", image: "/cities/novosibirsk.webp" },
];

const SuggestionsPortal = ({
  isOpen,
  onClose,
  suggestions,
  onSelect,
  buttonRef
}: {
  isOpen: boolean;
  onClose: () => void;
  suggestions: CitySuggestion[];
  onSelect: (suggestion: CitySuggestion) => void;
  buttonRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const buttonRect = buttonRef.current?.getBoundingClientRect();
      if (!buttonRect) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      setPosition({
        top: buttonRect.bottom + scrollTop + 8,
        left: buttonRect.left + scrollLeft
      });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, buttonRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || suggestions.length === 0) return null;

  const isMobile = window.innerWidth <= 768;

  const portalContent = (
    <>
      <div
        className={styles.datePickerOverlay}
        onClick={onClose}
      />
      <div
        ref={dropdownRef}
        className={styles.suggestionsDropdown}
        style={!isMobile ? {
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${buttonRef.current?.offsetWidth}px`,
        } : undefined}
      >
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            className={styles.suggestionItem}
            onClick={() => onSelect(suggestion)}
            type="button"
            role="option"
          >
            <div className={styles.suggestionMain}>
              <div className={styles.suggestionCity}>{suggestion.cityName}</div>
              <div className={styles.suggestionCountry}>{suggestion.countryName}</div>
            </div>
            <div className={styles.suggestionHotels}>
              {suggestion.hotelsCount} отелей
            </div>
          </button>
        ))}
      </div>
    </>
  );

  return createPortal(portalContent, document.body);
};

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`/api/cities?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      if (data.status === "ok" && data.results?.locations) {
        setSuggestions(data.results.locations);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchSuggestions]);

  const handleSuggestionSelect = (suggestion: CitySuggestion) => {
    setSearchQuery(suggestion.fullName);
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Пожалуйста, введите город");
      return;
    }
    // TODO: Implement search navigation
    console.log('Searching for:', searchQuery);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Города</h1>
        <p className={styles.subtitle}>
          Исследуйте жильё в разных городах России и мира
        </p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <MapPin className={styles.searchInputIcon} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Введите город"
              className={`${styles.searchInput} ${error ? styles.searchInputError : ""}`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError(null);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              aria-invalid={!!error}
              aria-describedby={error ? "search-error" : undefined}
            />
            {isLoadingSuggestions && (
              <div className={styles.suggestionsLoading} aria-hidden="true">
                <span className={styles.suggestionsSpinner} />
              </div>
            )}
            {error && (
              <div id="search-error" className={styles.searchError} role="alert">
                {error}
              </div>
            )}
            <SuggestionsPortal
              isOpen={showSuggestions}
              onClose={() => setShowSuggestions(false)}
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              buttonRef={searchInputRef}
            />
          </div>
          <button type="submit" className={styles.searchButton}>
            <Search className={styles.searchButtonIcon} aria-hidden="true" />
            Найти
          </button>
        </form>

        <div className={styles.grid}>
          {cities.map((city) => (
            <Link href={`/cities`} key={city.name} className={styles.card}>
              <img
                src={city.image}
                alt={city.name}
                className={styles.image}
              />
              <div className={styles.overlay}>
                <h3 className={styles.name}>{city.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
