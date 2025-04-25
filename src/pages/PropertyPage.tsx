
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { useAppContext } from '@/contexts/AppContext';
import { mockListings } from '@/data/mockListings';
import { 
  PropertyFilters as PropertyFiltersType,
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption 
} from '@/types/listingType';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface DistrictData {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
}

interface PropertyFilterConfig {
  priceRangeMin: number;
  priceRangeMax: number;
  areaRangeMin: number;
  areaRangeMax: number;
  floorRangeMin: number;
  floorRangeMax: number;
}

export function PropertyPage() {
  const { language } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFiltersType>({
    propertyTypes: searchParams.get('type') ? [searchParams.get('type') as PropertyType] : null,
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
    rooms: null,
    districts: null,
    hasPhoto: null,
    onlyNewBuilding: null,
    furnished: null,
    allowPets: null,
    hasParking: null,
    dealType: null,
    yearBuiltRange: {
      min: null,
      max: null
    },
    ceilingHeightRange: {
      min: null,
      max: null
    },
    bathroomTypes: null,
    renovationTypes: null,
    hasBalcony: null,
    hasElevator: null,
    rentPeriodMin: null,
    isCorner: null,
    isStudio: null,
    hasSeparateEntrance: null,
    securityGuarded: null,
    hasPlayground: null,
    utilityBillsIncluded: null,
    sortBy: null,
    viewTypes: null,
    nearbyInfrastructure: null
  });

  const [filteredListings, setFilteredListings] = useState(
    mockListings.filter(listing => listing.propertyType)
  );
  const [districts, setDistricts] = useState<DistrictData[]>([]);

  useEffect(() => {
    const mockDistricts: DistrictData[] = [
      { id: 'almaty-district', name: { ru: 'Алмалинский район', kz: 'Алмалы ауданы' } },
      { id: 'bostandyk-district', name: { ru: 'Бостандыкский район', kz: 'Бостандық ауданы' } },
      { id: 'alatau-district', name: { ru: 'Алатауский район', kz: 'Алатау ауданы' } },
    ];
    setDistricts(mockDistricts);
  }, []);

  useEffect(() => {
    const initialPropertyType = searchParams.get('type') as PropertyType || null;
    if (initialPropertyType) {
      setFilters(prevFilters => ({ 
        ...prevFilters, 
        propertyTypes: initialPropertyType ? [initialPropertyType] : null 
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    let newListings = [...mockListings.filter(listing => listing.propertyType)];
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      newListings = newListings.filter(listing => listing.propertyType && filters.propertyTypes?.includes(listing.propertyType));
    }
    
    if (filters.priceRange.min) {
      newListings = newListings.filter(listing => listing.discountPrice >= filters.priceRange.min!);
    }
    if (filters.priceRange.max) {
      newListings = newListings.filter(listing => listing.discountPrice <= filters.priceRange.max!);
    }
    
    if (filters.areaRange.min) {
      newListings = newListings.filter(listing => listing.area && listing.area >= filters.areaRange.min!);
    }
    if (filters.areaRange.max) {
      newListings = newListings.filter(listing => listing.area && listing.area <= filters.areaRange.max!);
    }
    
    if (filters.floorRange.min) {
      newListings = newListings.filter(listing => listing.floor && listing.floor >= filters.floorRange.min!);
    }
    if (filters.floorRange.max) {
      newListings = newListings.filter(listing => listing.floor && listing.floor <= filters.floorRange.max!);
    }
    
    if (filters.buildingTypes) {
      newListings = newListings.filter(listing => listing.buildingType && filters.buildingTypes?.includes(listing.buildingType));
    }
    
    if (filters.renovationTypes) {
      newListings = newListings.filter(listing => listing.renovationType && filters.renovationTypes?.includes(listing.renovationType));
    }
    
    if (filters.bathroomTypes) {
      newListings = newListings.filter(listing => listing.bathroom && filters.bathroomTypes?.includes(listing.bathroom));
    }
    
    if (filters.districts && filters.districts.length > 0) {
      newListings = newListings.filter(listing => listing.districtId && filters.districts?.includes(listing.districtId));
    }

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case SortOption.PRICE_ASC:
          newListings.sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case SortOption.PRICE_DESC:
          newListings.sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        case SortOption.AREA_ASC:
          newListings.sort((a, b) => (a.area || 0) - (b.area || 0));
          break;
        case SortOption.AREA_DESC:
          newListings.sort((a, b) => (b.area || 0) - (a.area || 0));
          break;
        default:
          break;
      }
    }
    
    setFilteredListings(newListings);
  }, [filters]);

  const updateUrlParams = (newFilters: PropertyFiltersType) => {
    const params = new URLSearchParams();
    
    if (newFilters.propertyTypes && newFilters.propertyTypes.length > 0) {
      params.set('type', newFilters.propertyTypes[0]);
    } else {
      params.delete('type');
    }
    
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters: Partial<PropertyFiltersType>) => {
    const updatedFilters: PropertyFiltersType = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };

  const handleReset = () => {
    setFilters({
      propertyTypes: null,
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
      rooms: null,
      districts: null,
      hasPhoto: null,
      onlyNewBuilding: null,
      furnished: null,
      allowPets: null,
      hasParking: null,
      dealType: null,
      yearBuiltRange: {
        min: null,
        max: null
      },
      ceilingHeightRange: {
        min: null,
        max: null
      },
      bathroomTypes: null,
      renovationTypes: null,
      hasBalcony: null,
      hasElevator: null,
      rentPeriodMin: null,
      isCorner: null,
      isStudio: null,
      hasSeparateEntrance: null,
      securityGuarded: null,
      hasPlayground: null,
      utilityBillsIncluded: null,
      sortBy: null,
      viewTypes: null,
      nearbyInfrastructure: null
    });
    
    setSearchParams({});
  };

  const handleSearch = () => {
    console.log('Search triggered with filters:', filters);
  };

  const activeFiltersCount = Object.keys(filters).reduce((count, key) => {
    const filterKey = key as keyof PropertyFiltersType;
    const filterValue = filters[filterKey];
    
    if (filterKey === 'priceRange' || filterKey === 'areaRange' || filterKey === 'floorRange' || 
        filterKey === 'yearBuiltRange' || filterKey === 'ceilingHeightRange') {
      const range = filterValue as { min: number | null, max: number | null };
      if ((range.min !== null && range.min > 0) || (range.max !== null && range.max < 1000000000)) {
        return count + 1;
      }
      return count;
    }
    
    if (filterValue !== null && filterValue !== undefined) {
      if (Array.isArray(filterValue) && filterValue.length > 0) {
        return count + 1;
      } else if (!Array.isArray(filterValue) && filterValue !== null) {
        return count + 1;
      }
    }
    
    return count;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}
