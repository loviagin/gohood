'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaWifi, FaParking, FaShieldAlt, FaStar } from 'react-icons/fa';
import styles from './page.module.css';

interface Listing {
  _id: string;
  title: string;
  description: string;
  type: string;
  city: string;
  address: string;
  district: string;
  pricePerDay: number;
  currency: string;
  amenities: string[];
  wifiSpeed: number;
  photos: string[];
  selfCheckIn: boolean;
  isVerified: boolean;
  infrastructureScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ListingPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error || 'Listing not found'}</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.gallery}>
          {listing.photos.map((photo, index) => (
            <div key={index} className={styles.photoContainer}>
              <img src={photo} alt={`${listing.title} - Photo ${index + 1}`} className={styles.photo} />
            </div>
          ))}
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>{listing.title}</h1>
              <div className={styles.location}>
                <FaMapMarkerAlt className={styles.locationIcon} />
                <span>{listing.district}, {listing.city}</span>
              </div>
            </div>
            <div className={styles.priceSection}>
              <div className={styles.price}>
                <span className={styles.amount}>{listing.pricePerDay} {listing.currency}</span>
                <span className={styles.period}>per day</span>
              </div>
              {listing.isVerified && (
                <div className={styles.verified}>
                  <FaShieldAlt className={styles.verifiedIcon} />
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <FaBed className={styles.detailIcon} />
              <span>{listing.type}</span>
            </div>
            <div className={styles.detail}>
              <FaWifi className={styles.detailIcon} />
              <span>{listing.wifiSpeed} Mbps</span>
            </div>
            <div className={styles.detail}>
              <FaStar className={styles.detailIcon} />
              <span>{listing.infrastructureScore}/5</span>
            </div>
          </div>

          <div className={styles.description}>
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>

          <div className={styles.amenities}>
            <h2>Amenities</h2>
            <div className={styles.amenitiesGrid}>
              {listing.amenities.map((amenity, index) => (
                <div key={index} className={styles.amenity}>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.booking}>
            <button className={styles.bookButton}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
