declare namespace google.maps {
  namespace places {
    interface Autocomplete {
      getPlace(): PlaceResult;
      addListener(event: string, callback: () => void): void;
    }

    interface PlaceResult {
      address_components?: AddressComponent[];
      formatted_address?: string;
      geometry?: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
      name?: string;
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }
  }
}

interface Window {
  google: typeof google;
} 