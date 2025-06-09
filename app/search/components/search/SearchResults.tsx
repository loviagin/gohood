import { MapPin, CalendarIcon, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './SearchResults.module.css';

interface SearchResultsProps {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return format(date, 'd MMMM', { locale: ru });
}

export function SearchResults({ city, checkIn, checkOut, guests }: SearchResultsProps) {
  return (
    <div className={styles.searchSummary}>
      <h1 className={styles.title}>Результаты поиска</h1>
      <div className={styles.searchParams}>
        <div className={styles.searchParam}>
          <MapPin className={styles.paramIcon} />
          <span>{city}</span>
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
  );
} 