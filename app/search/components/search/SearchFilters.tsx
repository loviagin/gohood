"use client"

import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  propertyTypes: string[];
  amenities: string[];
  rating: number | null;
  instantBook: boolean;
  bedTypes: string[];
  roomTypes: string[];
  cancellationPolicy: string[];
  hostLanguage: string[];
  accessibility: string[];
}

type ArrayFilterKeys = 'propertyTypes' | 'amenities' | 'bedTypes' | 'roomTypes' | 'cancellationPolicy' | 'hostLanguage' | 'accessibility';
type SingleValueFilterKeys = 'rating' | 'instantBook';
type PriceRangeFilterKey = 'priceRange';

const propertyTypes = [
  { id: 'apartment', label: 'Apartment' },
  { id: 'house', label: 'House' },
  { id: 'villa', label: 'Villa' },
  { id: 'condo', label: 'Condo' },
  { id: 'studio', label: 'Studio' },
  { id: 'loft', label: 'Loft' },
  { id: 'cottage', label: 'Cottage' },
  { id: 'townhouse', label: 'Townhouse' },
];

const bedTypes = [
  { id: 'single', label: 'Single bed' },
  { id: 'double', label: 'Double bed' },
  { id: 'queen', label: 'Queen bed' },
  { id: 'king', label: 'King bed' },
  { id: 'sofa_bed', label: 'Sofa bed' },
  { id: 'bunk_bed', label: 'Bunk bed' },
];

const roomTypes = [
  { id: 'entire_place', label: 'Entire place' },
  { id: 'private_room', label: 'Private room' },
  { id: 'shared_room', label: 'Shared room' },
];

const cancellationPolicies = [
  { id: 'flexible', label: 'Flexible' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'strict', label: 'Strict' },
  { id: 'super_strict', label: 'Super strict' },
];

const hostLanguages = [
  { id: 'english', label: 'English' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'french', label: 'French' },
  { id: 'german', label: 'German' },
  { id: 'italian', label: 'Italian' },
  { id: 'portuguese', label: 'Portuguese' },
  { id: 'russian', label: 'Russian' },
  { id: 'chinese', label: 'Chinese' },
];

const accessibility = [
  { id: 'step_free', label: 'Step-free access' },
  { id: 'wide_doorway', label: 'Wide doorway' },
  { id: 'accessible_bathroom', label: 'Accessible bathroom' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'ground_floor', label: 'Ground floor' },
];

const amenities = [
  { id: 'wifi', label: 'WiFi' },
  { id: 'air_conditioning', label: 'Air Conditioning' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'parking', label: 'Parking' },
  { id: 'pool', label: 'Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'washer', label: 'Washer' },
  { id: 'tv', label: 'TV' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'hot_tub', label: 'Hot tub' },
  { id: 'bbq_grill', label: 'BBQ grill' },
  { id: 'fireplace', label: 'Fireplace' },
  { id: 'security_cameras', label: 'Security cameras' },
  { id: 'smoke_alarm', label: 'Smoke alarm' },
  { id: 'first_aid_kit', label: 'First aid kit' },
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [showMore, setShowMore] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    propertyTypes: [],
    amenities: [],
    rating: null,
    instantBook: false,
    bedTypes: [],
    roomTypes: [],
    cancellationPolicy: [],
    hostLanguage: [],
    accessibility: [],
  });

  const handlePriceChange = useCallback((value: [number, number]) => {
    setLocalFilters(prev => ({ ...prev, priceRange: value }));
    setHasChanges(true);
  }, []);

  const handleMultiSelectChange = useCallback((
    category: keyof FilterState,
    value: string | number | boolean,
    isArray: boolean = true
  ) => {
    setLocalFilters(prev => {
      let newValue: FilterState[keyof FilterState];

      if (category === 'rating') {
        newValue = typeof value === 'string' ? parseInt(value, 10) : value;
      } else if (category === 'instantBook') {
        newValue = value === 'true';
      } else if (category === 'priceRange') {
        return prev;
      } else if (isArray && category in prev) {
        const currentArray = prev[category] as string[];
        const stringValue = value.toString();
        newValue = currentArray.includes(stringValue)
          ? currentArray.filter(item => item !== stringValue)
          : [...currentArray, stringValue];
      } else {
        newValue = value as FilterState[keyof FilterState];
      }

      return { ...prev, [category]: newValue };
    });
    setHasChanges(true);
  }, []);

  const handleApplyFilters = useCallback(() => {
    onFilterChange(localFilters);
    setHasChanges(false);
  }, [localFilters, onFilterChange]);

  const isChecked = useCallback((
    category: keyof FilterState,
    itemId: string,
    isArray: boolean
  ): boolean => {
    const value = localFilters[category];
    
    if (isArray && category in localFilters) {
      const arrayValue = value as string[];
      return arrayValue.includes(itemId);
    }
    
    if (category === 'rating') {
      return value === parseInt(itemId, 10);
    }
    
    if (category === 'instantBook') {
      return value === (itemId === 'true');
    }
    
    return false;
  }, [localFilters]);

  const renderFilterSection = (
    title: string,
    items: { id: string; label: string }[],
    category: keyof FilterState,
    isArray: boolean = true
  ) => (
    <div className={styles.filterSection}>
      <h3>{title}</h3>
      <div className={styles.checkboxGroup}>
        {items.map((item) => (
          <label key={item.id} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isChecked(category, item.id, isArray)}
              onChange={() => handleMultiSelectChange(category, item.id, isArray)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterSection}>
        <h3>Price Range</h3>
        <div className={styles.priceRange}>
          <div className={styles.priceSlider}>
            <input
              type="range"
              min="0"
              max="1000"
              value={localFilters.priceRange[0]}
              onChange={(e) => handlePriceChange([parseInt(e.target.value), localFilters.priceRange[1]])}
              className={styles.priceInput}
            />
            <input
              type="range"
              min="0"
              max="1000"
              value={localFilters.priceRange[1]}
              onChange={(e) => handlePriceChange([localFilters.priceRange[0], parseInt(e.target.value)])}
              className={styles.priceInput}
            />
          </div>
          <div className={styles.priceLabels}>
            <span>${localFilters.priceRange[0]}</span>
            <span>${localFilters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {renderFilterSection('Property Type', propertyTypes, 'propertyTypes')}

      {showMore && (
        <>
          {renderFilterSection('Room Type', roomTypes, 'roomTypes')}
          {renderFilterSection('Bed Type', bedTypes, 'bedTypes')}
          {renderFilterSection('Amenities', amenities, 'amenities')}
          {renderFilterSection('Cancellation Policy', cancellationPolicies, 'cancellationPolicy')}
          {renderFilterSection('Host Language', hostLanguages, 'hostLanguage')}
          {renderFilterSection('Accessibility', accessibility, 'accessibility')}
          
          <div className={styles.filterSection}>
            <h3>Rating</h3>
            <div className={styles.ratingGroup}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  className={`${styles.ratingButton} ${localFilters.rating === rating ? styles.active : ''}`}
                  onClick={() => handleMultiSelectChange('rating', rating.toString(), false)}
                >
                  {rating}+
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={localFilters.instantBook}
                onChange={(e) => handleMultiSelectChange('instantBook', e.target.checked.toString(), false)}
              />
              Instant Book
            </label>
          </div>
        </>
      )}

      <button
        className={styles.showMoreButton}
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? (
          <>
            Show less <ChevronUp className={styles.showMoreIcon} />
          </>
        ) : (
          <>
            Show more filters <ChevronDown className={styles.showMoreIcon} />
          </>
        )}
      </button>

      {hasChanges && (
        <button
          className={styles.applyButton}
          onClick={handleApplyFilters}
        >
          Применить фильтры
        </button>
      )}
    </div>
  );
} 