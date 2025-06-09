import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Search, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './SearchForm.module.css';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays, addDays, subMonths, addMonths, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

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

interface SearchFormProps {
  initialCity: string;
  initialCheckIn: Date | undefined;
  initialCheckOut: Date | undefined;
  initialGuests: number;
}

type DateSelection = { type: 'start' | 'end'; date: Date };

const DatePickerCalendar = ({
  selectedDates,
  onDateSelect,
  onClose
}: {
  selectedDates: { start: Date; end: Date | undefined };
  onDateSelect: (selection: DateSelection) => void;
  onClose: () => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDates.start));
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  useEffect(() => {
    setIsSelectingEnd(false);
  }, []);

  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const firstDayOfMonth = startOfMonth(currentMonth);
  const firstDayOfWeek = firstDayOfMonth.getDay() || 7;
  const prevMonthDays = Array.from({ length: firstDayOfWeek - 1 }, (_, i) =>
    subDays(firstDayOfMonth, firstDayOfWeek - 1 - i)
  );

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
      onDateSelect({ type: 'start', date });
      setIsSelectingEnd(true);
    } else {
      if (date < selectedDates.start) {
        onDateSelect({ type: 'start', date });
        setIsSelectingEnd(true);
      } else {
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
        >
          ←
        </button>
        <div className={styles.calendarMonth}>
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </div>
        <button
          type="button"
          className={styles.calendarNavButton}
          onClick={handleNextMonth}
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
        {allDays.map((date, index) => {
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isDisabled = isDateDisabled(date);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

          return (
            <button
              key={index}
              type="button"
              className={`${styles.calendarDay} ${
                isSelected ? styles.calendarDaySelected : ''
              } ${isInRange ? styles.calendarDayRange : ''} ${
                !isCurrentMonth ? styles.calendarDayOtherMonth : ''
              } ${isDisabled ? styles.calendarDayDisabled : ''}`}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
            >
              {format(date, 'd')}
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
  selectedDates: { start: Date; end: Date | undefined };
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
        className={styles.guestPickerDropdown}
        style={!isMobile ? {
          top: `${position.top}px`,
          left: `${position.left}px`,
        } : undefined}
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

  return createPortal(portalContent, document.body);
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

export default function SearchForm({
  initialCity,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: SearchFormProps) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const datePickerButtonRef = useRef<HTMLButtonElement>(null);
  const guestPickerButtonRef = useRef<HTMLButtonElement>(null);

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
      if (city) {
        fetchSuggestions(city);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [city, fetchSuggestions]);

  const handleSuggestionSelect = (suggestion: CitySuggestion) => {
    setCity(suggestion.fullName);
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  const handleGuestChange = (change: number) => {
    setGuests(prev => Math.max(1, Math.min(10, prev + change)));
  };

  const handleDateChange = (selection: DateSelection) => {
    if (selection.type === 'start') {
      setCheckIn(selection.date);
      setCheckOut(undefined);
    } else {
      setCheckOut(selection.date);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Пожалуйста, введите город");
      return;
    }

    const params = new URLSearchParams({
      location: city,
      checkIn: checkIn?.toISOString() || "",
      guests: guests.toString(),
    });

    if (checkOut) {
      params.append('checkOut', checkOut.toISOString());
    }

    router.push(`/search?${params.toString()}`);
  };

  function formatDate(date: Date | undefined) {
    if (!date) return '';
    return format(date, 'd MMMM', { locale: ru });
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <div className={styles.searchInputsGrid}>
        <div className={styles.searchInputWrapper}>
          <MapPin className={styles.searchInputIcon} aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Введите город"
            className={`${styles.searchInput} ${error ? styles.searchInputError : ""}`}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setError(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            aria-invalid={!!error}
            aria-describedby={error ? "search-error" : undefined}
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
          <SuggestionsPortal
            isOpen={showSuggestions}
            onClose={() => setShowSuggestions(false)}
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            buttonRef={searchInputRef}
          />
        </div>

        <div className={styles.datePickerWrapper}>
          <button
            ref={datePickerButtonRef}
            type="button"
            className={styles.datePickerButton}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            aria-expanded={isDatePickerOpen}
          >
            <CalendarIcon className={styles.datePickerIcon} />
            <div className={styles.datePickerText}>
              <span className={styles.datePickerLabel}>Даты</span>
              <span className={styles.datePickerValue}>
                {checkIn ? format(checkIn, 'd MMM', { locale: ru }) : 'Выберите дату'}
                {checkOut ? ` — ${format(checkOut, 'd MMM', { locale: ru })}` : ''}
              </span>
            </div>
          </button>
          <DatePickerPortal
            isOpen={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            selectedDates={{
              start: checkIn || new Date(),
              end: checkOut
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
            <Users className={styles.guestPickerIcon} />
            <div className={styles.guestPickerText}>
              <span className={styles.guestPickerLabel}>Гости</span>
              <span className={styles.guestPickerValue}>
                {guests} {guests === 1 ? "гость" : guests < 5 ? "гостя" : "гостей"}
              </span>
            </div>
          </button>
          <GuestPickerPortal
            isOpen={isGuestPickerOpen}
            onClose={() => setIsGuestPickerOpen(false)}
            guests={guests}
            onGuestChange={handleGuestChange}
            buttonRef={guestPickerButtonRef}
          />
        </div>

        <button type="submit" className={styles.searchButton}>
          <Search className={styles.searchButtonIcon} aria-hidden="true" />
          Найти
        </button>
      </div>
    </form>
  );
} 