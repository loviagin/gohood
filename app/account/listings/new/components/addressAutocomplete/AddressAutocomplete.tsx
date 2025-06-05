import { useEffect, useRef } from 'react';
import styles from './AddressAutocomplete.module.css';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, city: string, district: string) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete?: () => void;
  }
}

export default function AddressAutocomplete({ value, onChange, className }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Define the initialization function
    window.initAutocomplete = () => {
      if (!inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'ru' },
        fields: ['address_components', 'formatted_address'],
      });

      // Add custom styles to Google Places Autocomplete
      const style = document.createElement('style');
      style.textContent = `
        .pac-container {
          border-radius: 8px !important;
          margin-top: 4px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border: 1px solid #e2e8f0 !important;
          font-family: inherit !important;
        }
        .pac-item {
          padding: 8px 12px !important;
          font-size: 14px !important;
          cursor: pointer !important;
          transition: background-color 0.2s !important;
        }
        .pac-item:hover {
          background-color: #f8fafc !important;
        }
        .pac-item-query {
          font-size: 14px !important;
          color: #1e293b !important;
        }
        .pac-matched {
          font-weight: 600 !important;
          color: #3b82f6 !important;
        }
        .pac-icon {
          margin-right: 8px !important;
        }
      `;
      document.head.appendChild(style);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('Selected place:', place);

        if (!place.address_components) {
          console.log('No address components found');
          return;
        }

        const addressComponents = place.address_components;
        let city = '';
        let district = '';

        // Find city
        const cityComponent = addressComponents.find(
          (component: any) => 
            component.types.includes('locality') || 
            component.types.includes('administrative_area_level_1')
        );
        if (cityComponent) {
          city = cityComponent.long_name;
        }

        // Find district
        const districtComponent = addressComponents.find(
          (component: any) => 
            component.types.includes('sublocality_level_1') || 
            component.types.includes('administrative_area_level_2')
        );
        if (districtComponent) {
          district = districtComponent.long_name;
        }

        console.log('Extracted components:', { city, district });

        // Call onChange with the results
        onChange(place.formatted_address, city, district);
      });
    };

    // Load the Google Places API script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ru&callback=initAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
      if (window.initAutocomplete) {
        delete window.initAutocomplete;
      }
    };
  }, [onChange]);

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value, '', '');
        }}
        className={`${styles.input} ${className || ''}`}
        placeholder="Введите адрес"
        autoComplete="off"
      />
    </div>
  );
} 