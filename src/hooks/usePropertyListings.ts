
import { useState, useEffect } from 'react';
import { Listing, PropertyFilters } from '@/types/listingType';
import { mockListings } from '@/data/mockListings';

export function usePropertyListings(filters: PropertyFilters) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter mock listings based on filters
        let filteredListings = mockListings.filter(listing => {
          // Property type filter
          if (filters.propertyTypes && filters.propertyTypes.length > 0) {
            if (!listing.propertyType || !filters.propertyTypes.includes(listing.propertyType)) {
              return false;
            }
          }
          
          // Price range filter
          if (filters.priceRange) {
            const price = listing.discountPrice || listing.originalPrice;
            if (filters.priceRange.min && price < filters.priceRange.min) return false;
            if (filters.priceRange.max && price > filters.priceRange.max) return false;
          }
          
          // Area filter
          if (filters.areaRange && listing.area) {
            if (filters.areaRange.min && listing.area < filters.areaRange.min) return false;
            if (filters.areaRange.max && listing.area > filters.areaRange.max) return false;
          }
          
          // Rooms filter
          if (filters.rooms && filters.rooms.length > 0 && listing.rooms) {
            if (!filters.rooms.includes(listing.rooms)) return false;
          }
          
          // Boolean filters
          if (filters.furnished !== null && listing.furnished !== filters.furnished) return false;
          if (filters.allowPets !== null && listing.allowPets !== filters.allowPets) return false;
          if (filters.hasParking !== null && listing.hasParking !== filters.hasParking) return false;
          if (filters.hasBalcony !== null && listing.hasBalcony !== filters.hasBalcony) return false;
          if (filters.hasElevator !== null && listing.hasElevator !== filters.hasElevator) return false;
          
          return true;
        });
        
        // Sort listings
        if (filters.sortBy) {
          filteredListings.sort((a, b) => {
            switch (filters.sortBy) {
              case 'price_asc':
                return (a.discountPrice || a.originalPrice) - (b.discountPrice || b.originalPrice);
              case 'price_desc':
                return (b.discountPrice || b.originalPrice) - (a.discountPrice || a.originalPrice);
              case 'date_desc':
              default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
          });
        }
        
        setListings(filteredListings);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadListings();
  }, [filters]);

  return { listings, loading, error };
}
