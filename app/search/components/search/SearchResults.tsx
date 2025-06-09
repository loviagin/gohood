import { MapPin, CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './SearchResults.module.css';
import { FilterState } from './SearchFilters';

interface SearchResultsProps {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  filters: FilterState;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return format(date, 'd MMMM', { locale: ru });
}

export function SearchResults({ city, checkIn, checkOut, guests, filters }: SearchResultsProps) {
  return (
    <div className={styles.searchSummary}>
      <h1 className={styles.title}>Результаты поиска</h1>
      <div className={styles.searchParams}>
        {city && (
          <div className={styles.searchParam}>
            <MapPin className={styles.paramIcon} />
            {city}
          </div>
        )}
        {(checkIn || checkOut) && (
          <div className={styles.searchParam}>
            <CalendarIcon className={styles.paramIcon} />
            {checkIn && formatDate(checkIn)}
            {checkOut && ` — ${formatDate(checkOut)}`}
          </div>
        )}
        <div className={styles.searchParam}>
          <Users className={styles.paramIcon} />
          {guests} {guests === 1 ? "гость" : guests < 5 ? "гостя" : "гостей"}
        </div>
      </div>
      
      {/* Active filters display */}
      <div className={styles.activeFilters}>
        {filters.propertyTypes.length > 0 && (
          <div className={styles.filterTag}>
            Тип жилья: {filters.propertyTypes.join(', ')}
          </div>
        )}
        {filters.amenities.length > 0 && (
          <div className={styles.filterTag}>
            Удобства: {filters.amenities.join(', ')}
          </div>
        )}
        {filters.rating && (
          <div className={styles.filterTag}>
            Рейтинг: {filters.rating}+
          </div>
        )}
        {filters.instantBook && (
          <div className={styles.filterTag}>
            Мгновенное бронирование
          </div>
        )}
        {filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? (
          <div className={styles.filterTag}>
            Цена: ${filters.priceRange[0]} — ${filters.priceRange[1]}
          </div>
        ) : null}
      </div>
    </div>
  );
} 