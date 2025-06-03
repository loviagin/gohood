"use client"
import { Wifi, MapPin, Sparkles, ConciergeBell, Map, Search, Home, Building2, House, Building, Users, Calendar as CalendarIcon } from "lucide-react";
import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Hero.module.css";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, subDays } from "date-fns";
import { ru } from "date-fns/locale";
import { useRouter } from "next/navigation";

type SearchTab = "housing" | "districts";

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

interface SearchParams {
  location: string;
  checkIn: Date;
  checkOut: Date | null;
  guests: number;
  selectedCityId?: string;
}

type DateSelection = { type: 'start' | 'end', date: Date };

const DatePickerCalendar = ({
  selectedDates,
  onDateSelect,
  onClose
}: {
  selectedDates: { start: Date; end: Date | null };
  onDateSelect: (selection: DateSelection) => void;
  onClose: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDates.start));
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  // Сбрасываем состояние при открытии календаря
  useEffect(() => {
    setIsSelectingEnd(false);
  }, []);

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Добавляем дни предыдущего месяца для заполнения первой недели
  const firstDayOfMonth = startOfMonth(currentMonth);
  const firstDayOfWeek = firstDayOfMonth.getDay() || 7;
  const prevMonthDays = Array.from({ length: firstDayOfWeek - 1 }, (_, i) =>
    subDays(firstDayOfMonth, firstDayOfWeek - 1 - i)
  );

  // Добавляем дни следующего месяца для заполнения последней недели
  const lastDayOfMonth = endOfMonth(currentMonth);
  const lastDayOfWeek = lastDayOfMonth.getDay() || 7;
  const nextMonthDays = Array.from({ length: 7 - lastDayOfWeek }, (_, i) =>
    addDays(lastDayOfMonth, i + 1)
  );

  const allDays = [...prevMonthDays, ...days, ...nextMonthDays];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (date: Date) => {
    return date < today;
  };

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    if (newMonth >= startOfMonth(today)) {
      setCurrentMonth(newMonth);
    }
  };

  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const isDateSelected = (date: Date) => {
    return isSameDay(date, selectedDates.start) || (selectedDates.end && isSameDay(date, selectedDates.end));
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates.start || !selectedDates.end) return false;
    return date > selectedDates.start && date < selectedDates.end;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!isSelectingEnd) {
      // Если мы не в режиме выбора конечной даты, значит выбираем начальную
      onDateSelect({ type: 'start', date });
      setIsSelectingEnd(true);
    } else {
      // Если мы в режиме выбора конечной даты
      if (date < selectedDates.start) {
        // Если выбранная дата раньше начальной, делаем её новой начальной
        onDateSelect({ type: 'start', date });
        setIsSelectingEnd(true);
      } else {
        // Иначе устанавливаем как конечную и закрываем пикер
        onDateSelect({ type: 'end', date });
        onClose();
      }
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          className={styles.calendarNavButton}
          onClick={handlePrevMonth}
          disabled={currentMonth <= startOfMonth(today)}
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        <span className={styles.calendarMonth}>
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </span>
        <button
          type="button"
          className={styles.calendarNavButton}
          onClick={handleNextMonth}
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>
      <div className={styles.calendarGrid}>
        {weekdays.map(day => (
          <div key={day} className={styles.calendarWeekday}>
            {day}
          </div>
        ))}
        {allDays.map((day, dayIdx) => {
          const isSelected = isDateSelected(day);
          const isInRange = isDateInRange(day);
          const isDisabled = !isSameMonth(day, currentMonth) || isDateDisabled(day);
          const isCurrentDay = isToday(day);
          const isStart = isSameDay(day, selectedDates.start);
          const isEnd = selectedDates.end && isSameDay(day, selectedDates.end);

          return (
            <button
              key={day.toString()}
              type="button"
              className={`
                ${styles.calendarDay}
                ${isSelected ? styles.calendarDaySelected : ''}
                ${isInRange ? styles.calendarDayRange : ''}
                ${isDisabled ? styles.calendarDayDisabled : ''}
                ${isCurrentDay ? styles.calendarDayToday : ''}
                ${isStart ? styles.calendarDayRangeStart : ''}
                ${isEnd ? styles.calendarDayRangeEnd : ''}
              `}
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
              aria-label={format(day, 'd MMMM yyyy', { locale: ru })}
              aria-selected={isSelected || undefined}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DatePickerPortal = ({
  isOpen,
  onClose,
  selectedDates,
  onDateSelect,
  buttonRef
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDates: { start: Date; end: Date | null };
  onDateSelect: (selection: DateSelection) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
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

  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  const portalContent = (
    <>
      <div
        className={styles.datePickerOverlay}
        onClick={onClose}
      />
      <div
        ref={dropdownRef}
        className={styles.datePickerDropdown}
        style={!isMobile ? {
          top: `${position.top}px`,
          left: `${position.left}px`,
        } : undefined}
      >
        <DatePickerCalendar
          selectedDates={selectedDates}
          onDateSelect={onDateSelect}
          onClose={onClose}
        />
      </div>
    </>
  );

  return createPortal(portalContent, document.body);
};

const GuestPickerPortal = ({
  isOpen,
  onClose,
  guests,
  onGuestChange,
  buttonRef
}: {
  isOpen: boolean;
  onClose: () => void;
  guests: number;
  onGuestChange: (change: number) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current?.contains(event.target as Node) ||
        dropdownRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      onClose();
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
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  const portalContent = (
    <>
      {isMobile && (
        <div
          className={styles.datePickerOverlay}
          onClick={onClose}
        />
      )}
      <div
        ref={dropdownRef}
        className={styles.guestPickerDropdown}
      >
        <div className={styles.guestPickerControls}>
          <button
            type="button"
            className={styles.guestPickerControl}
            onClick={() => onGuestChange(-1)}
            disabled={guests <= 1}
          >
            -
          </button>
          <span className={styles.guestPickerCount}>
            {guests}
          </span>
          <button
            type="button"
            className={styles.guestPickerControl}
            onClick={() => onGuestChange(1)}
            disabled={guests >= 10}
          >
            +
          </button>
        </div>
      </div>
    </>
  );

  // На мобильных устройствах рендерим портал в body
  if (isMobile) {
    return createPortal(portalContent, document.body);
  }

  // На десктопе рендерим портал внутри guestPickerWrapper
  return createPortal(portalContent, buttonRef.current?.parentElement || document.body);
};

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
  buttonRef: React.RefObject<HTMLInputElement>;
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

export default function Hero() {
  const [activeTab, setActiveTab] = useState<SearchTab>("housing");
  const [searchParams, setSearchParams] = useState<SearchParams>({
    location: "",
    checkIn: new Date(),
    checkOut: null,
    guests: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null!);
  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null);
  const guestPickerButtonRef = useRef<HTMLButtonElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null!);
  const router = useRouter();

  const handleGuestChange = (change: number) => {
    setSearchParams(prev => ({
      ...prev,
      guests: Math.max(1, Math.min(10, prev.guests + change))
    }));
  };

  const handleDateChange = (selection: DateSelection) => {
    setSearchParams(prev => {
      if (selection.type === 'start') {
        return {
          ...prev,
          checkIn: selection.date,
          checkOut: null
        };
      } else {
        return {
          ...prev,
          checkOut: selection.date
        };
      }
    });
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchParams.location.trim()) {
      setError("Пожалуйста, введите город");
      return;
    }

    if (!searchParams.checkOut) {
      setError("Пожалуйста, выберите дату выезда");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Формируем URL с параметрами поиска
      const queryParams = new URLSearchParams({
        location: searchParams.location,
        checkIn: format(searchParams.checkIn, 'yyyy-MM-dd'),
        checkOut: format(searchParams.checkOut, 'yyyy-MM-dd'),
        guests: searchParams.guests.toString(),
      });

      // Перенаправляем на страницу поиска
      console.log(`/search?${queryParams.toString()}`);
      router.push(`/search?${queryParams.toString()}`);
    } catch (err) {
      console.error('Search error:', err);
      setError("Произошла ошибка при поиске. Пожалуйста, попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    setSearchParams(prev => ({ ...prev, location: "" }));
    setError(null);
  };

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

  // Debounce the search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchParams.location) {
        fetchSuggestions(searchParams.location);
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchParams.location, fetchSuggestions]);

  const handleSuggestionSelect = (suggestion: CitySuggestion) => {
    setSearchParams(prev => ({
      ...prev,
      location: suggestion.fullName,
      selectedCityId: suggestion.id
    }));
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className={styles.hero} aria-label="Поиск жилья">
      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Умный поиск жилья с ИИ
          <br />
          <span className={styles.titleHighlight}>в идеальном районе</span>
        </h1>

        <div className={styles.heroFeatures} role="list" aria-label="Преимущества сервиса">
          <div className={styles.heroFeature} role="listitem">
            <Sparkles className={styles.heroFeatureIcon} aria-hidden="true" />
            <span>ИИ подбирает варианты под ваши предпочтения</span>
          </div>
          <div className={styles.heroFeature} role="listitem">
            <Map className={styles.heroFeatureIcon} aria-hidden="true" />
            <span>Детальная карта районов с оценкой инфраструктуры</span>
          </div>
          <div className={styles.heroFeature} role="listitem">
            <Wifi className={styles.heroFeatureIcon} aria-hidden="true" />
            <span>Реальные спидтесты Wi-Fi и проверка качества жизни</span>
          </div>
        </div>

        <div className={styles.searchContainer} ref={searchContainerRef}>
          <div className={styles.searchTabs} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === "housing"}
              aria-controls="search-form"
              className={`${styles.searchTab} ${activeTab === "housing" ? styles.searchTabActive : ""}`}
              onClick={() => handleTabChange("housing")}
            >
              Поиск жилья
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "districts"}
              aria-controls="search-form"
              className={`${styles.searchTab} ${activeTab === "districts" ? styles.searchTabActive : ""}`}
              onClick={() => handleTabChange("districts")}
            >
              Исследовать районы
            </button>
          </div>

          <form
            className={styles.searchForm}
            onSubmit={handleSearch}
            id="search-form"
            role="search"
            aria-label={`Поиск ${activeTab === "housing" ? "жилья" : "районов"}`}
          >
            <div 
              className={styles.searchInputsGrid}
              data-tab={activeTab}
            >
              <div className={styles.searchInputWrapper}>
                <MapPin className={styles.searchInputIcon} aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Введите город"
                  className={`${styles.searchInput} ${error ? styles.searchInputError : ""}`}
                  value={searchParams.location}
                  onChange={(e) => {
                    setSearchParams(prev => ({ ...prev, location: e.target.value }));
                    setError(null);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "search-error" : undefined}
                  disabled={isLoading}
                  role="combobox"
                  aria-expanded={showSuggestions}
                  aria-controls="suggestions-dropdown"
                  aria-autocomplete="list"
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
                {showSuggestions && (
                  <SuggestionsPortal
                    isOpen={showSuggestions}
                    onClose={() => setShowSuggestions(false)}
                    suggestions={suggestions}
                    onSelect={handleSuggestionSelect}
                    buttonRef={searchInputRef}
                  />
                )}
              </div>

              {activeTab === "housing" && (
                <>
                  <div className={styles.datePickerWrapper}>
                    <button
                      ref={datePickerButtonRef}
                      type="button"
                      className={styles.datePickerButton}
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                      aria-expanded={isDatePickerOpen}
                    >
                      <CalendarIcon className={styles.datePickerIcon} aria-hidden="true" />
                      <div className={styles.datePickerText}>
                        <span className={styles.datePickerLabel}>Даты</span>
                        <span className={styles.datePickerValue}>
                          {format(searchParams.checkIn, 'd MMM', { locale: ru })}
                          {searchParams.checkOut ? ` — ${format(searchParams.checkOut, 'd MMM', { locale: ru })}` : ''}
                        </span>
                      </div>
                    </button>
                    <DatePickerPortal
                      isOpen={isDatePickerOpen}
                      onClose={() => setIsDatePickerOpen(false)}
                      selectedDates={{
                        start: searchParams.checkIn,
                        end: searchParams.checkOut
                      }}
                      onDateSelect={handleDateChange}
                      buttonRef={datePickerButtonRef}
                    />
                  </div>

                  <div className={styles.guestPickerWrapper}>
                    <button
                      ref={guestPickerButtonRef}
                      type="button"
                      className={styles.guestPickerButton}
                      onClick={() => setIsGuestPickerOpen(!isGuestPickerOpen)}
                      aria-expanded={isGuestPickerOpen}
                    >
                      <Users className={styles.guestPickerIcon} aria-hidden="true" />
                      <div className={styles.guestPickerText}>
                        <span className={styles.guestPickerLabel}>Гости</span>
                        <span className={styles.guestPickerValue}>
                          {searchParams.guests}
                        </span>
                      </div>
                    </button>
                    <GuestPickerPortal
                      isOpen={isGuestPickerOpen}
                      onClose={() => setIsGuestPickerOpen(false)}
                      guests={searchParams.guests}
                      onGuestChange={handleGuestChange}
                      buttonRef={guestPickerButtonRef}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className={`${styles.searchButton} ${isLoading ? styles.searchButtonLoading : ""}`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className={styles.searchButtonContent}>
                    <span className={styles.searchButtonSpinner} aria-hidden="true" />
                    Поиск...
                  </span>
                ) : (
                  <span className={styles.searchButtonContent}>
                    <Search className={styles.searchButtonIcon} aria-hidden="true" />
                    Найти отель
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
} 