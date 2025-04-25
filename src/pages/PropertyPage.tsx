import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { useAppContext } from '@/contexts/AppContext';
import { mockProperties } from '@/data/mockProperties';
import { DistrictData } from '@/data/propertyData';
import { 
  PropertyFilters as PropertyFiltersType,
  PropertyType,
  BuildingType,
  ConditionType,
  BalconyType,
  BathroomType,
  SortOption 
} from '@/types/listingType';

export function PropertyPage() {
  const { language } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFiltersType>({
    propertyType: searchParams.get('type') as PropertyType || null,
    priceRange: {
      min: null,
      max: null
    },
    areaRange: {
      min: null,
      max: null
    },
    floorRange: {
      min: null,
      max: null
    },
    buildingTypes: null,
    conditionTypes: null,
    balconyTypes: null,
    bathroomTypes: null,
    district: null,
    sortBy: null
  });
  const [filteredListings, setFilteredListings] = useState(mockProperties);
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  
  // Mock districts data (replace with actual data fetching)
  useEffect(() => {
    // Simulate fetching districts data
    const mockDistricts: DistrictData[] = [
      { id: 'almaty-district', name: { ru: 'Алмалинский район', kk: 'Алмалы ауданы' } },
      { id: 'bostandyk-district', name: { ru: 'Бостандыкский район', kk: 'Бостандық ауданы' } },
      { id: 'alatau-district', name: { ru: 'Алатауский район', kk: 'Алатау ауданы' } },
    ];
    setDistricts(mockDistricts);
  }, []);
  
  // Update filters based on URL params on initial load
  useEffect(() => {
    const initialPropertyType = searchParams.get('type') as PropertyType || null;
    setFilters(prevFilters => ({ ...prevFilters, propertyType: initialPropertyType }));
  }, [searchParams]);
  
  // Apply filters
  useEffect(() => {
    let newListings = [...mockProperties];
    
    if (filters.propertyType) {
      newListings = newListings.filter(listing => listing.propertyType === filters.propertyType);
    }
    
    if (filters.priceRange.min) {
      newListings = newListings.filter(listing => listing.price >= filters.priceRange.min);
    }
    if (filters.priceRange.max) {
      newListings = newListings.filter(listing => listing.price <= filters.priceRange.max);
    }
    
    if (filters.areaRange.min) {
      newListings = newListings.filter(listing => listing.area >= filters.areaRange.min);
    }
    if (filters.areaRange.max) {
      newListings = newListings.filter(listing => listing.area <= filters.areaRange.max);
    }
    
    if (filters.floorRange.min) {
      newListings = newListings.filter(listing => listing.floor >= filters.floorRange.min);
    }
    if (filters.floorRange.max) {
      newListings = newListings.filter(listing => listing.floor <= filters.floorRange.max);
    }
    
    if (filters.buildingTypes) {
      newListings = newListings.filter(listing => filters.buildingTypes!.includes(listing.buildingType));
    }
    
    if (filters.conditionTypes) {
      newListings = newListings.filter(listing => filters.conditionTypes!.includes(listing.condition));
    }
    
    if (filters.balconyTypes) {
      newListings = newListings.filter(listing => filters.balconyTypes!.includes(listing.balcony));
    }
    
    if (filters.bathroomTypes) {
      newListings = newListings.filter(listing => filters.bathroomTypes!.includes(listing.bathroom));
    }
    
    if (filters.district) {
      newListings = newListings.filter(listing => listing.district === filters.district);
    }

    // Sorting logic
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case SortOption.PRICE_ASC:
          newListings.sort((a, b) => a.price - b.price);
          break;
        case SortOption.PRICE_DESC:
          newListings.sort((a, b) => b.price - a.price);
          break;
        case SortOption.AREA_ASC:
          newListings.sort((a, b) => a.area - b.area);
          break;
        case SortOption.AREA_DESC:
          newListings.sort((a, b) => b.area - a.area);
          break;
        default:
          break;
      }
    }
    
    setFilteredListings(newListings);
  }, [filters]);
  
  // Update URL params
  const updateUrlParams = (newFilters: PropertyFiltersType) => {
    const params = new URLSearchParams();
    
    if (newFilters.propertyType) {
      params.set('type', newFilters.propertyType);
    } else {
      params.delete('type');
    }
    
    setSearchParams(params);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: Partial<PropertyFiltersType>) => {
    const updatedFilters: PropertyFiltersType = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };
  
  // Handle reset
  const handleReset = () => {
    setFilters({
      propertyType: null,
      priceRange: {
        min: null,
        max: null
      },
      areaRange: {
        min: null,
        max: null
      },
      floorRange: {
        min: null,
        max: null
      },
      buildingTypes: null,
      conditionTypes: null,
      balconyTypes: null,
      bathroomTypes: null,
      district: null,
      sortBy: null
    });
    
    // Clear URL params
    setSearchParams({});
  };
  
  // Handle search
  const handleSearch = () => {
    // In this mock, the filtering is already done in the useEffect hook
    // In a real application, you might trigger an API call here
    console.log('Search triggered with filters:', filters);
  };
  
  // Count active filters
  const activeFiltersCount = Object.keys(filters).reduce((count, key) => {
    const filterKey = key as keyof PropertyFiltersType;
    const filterValue = filters[filterKey];
    
    if (filterKey === 'priceRange' || filterKey === 'areaRange' || filterKey === 'floorRange') {
      const range = filterValue as { min: number | null, max: number | null };
      if ((range.min !== null && range.min > 0) || (range.max !== null && range.max < 1000000000)) {
        return count + 1;
      }
      return count;
    }
    
    if (filterValue !== null && filterValue !== undefined) {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        return count + 1;
      } else if (!Array.isArray(filterValue)) {
        return count + 1;
      }
    }
    
    return count;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <PropertyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onSearch={handleSearch}
        districts={districts}
        activeFiltersCount={activeFiltersCount}
        config={{
          priceRangeMin: 0,
          priceRangeMax: 1000000000,
          areaRangeMin: 0,
          areaRangeMax: 1000,
          floorRangeMin: 1,
          floorRangeMax: 50,
        }}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {filteredListings.map(listing => (
          <PropertyCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
