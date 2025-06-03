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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBv_h_dBxQzUZH_8ElcCmH0ZyJpsakRG6Q&libraries=places&language=ru&callback=initAutocomplete`;
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