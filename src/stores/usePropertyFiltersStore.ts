
import { create } from 'zustand';
import {
  PropertyFilters,
  PropertyType,
  BuildingType,
  SortOptions
} from '@/types/listingType';

type PropertyFiltersState = {
  dealType?: string;
  segment?: string;
  filters: PropertyFilters;
  activeFiltersCount: number;
  
  // Actions
  setDealType: (dealType: string) => void;
  setSegment: (segment: string) => void;
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  calculateActiveFiltersCount: () => number;
};

// Initial filters state
const initialFilters: PropertyFilters = {
  propertyTypes: [],
  priceRange: {
    min: undefined,
    max: undefined
  },
  areaRange: {
    min: undefined,
    max: undefined
  },
  floorRange: {
    min: undefined,
    max: undefined
  },
  buildingType: [],
  rooms: [],
  districts: [],
  hasPhoto: undefined,
  onlyNewBuilding: undefined,
  furnished: undefined,
  allowPets: undefined,
  hasParking: undefined,
  dealType: undefined,
  segment: undefined,
  yearBuiltRange: {
    min: undefined,
    max: undefined
  },
  ceilingHeightRange: {
    min: undefined,
    max: undefined
  },
  bathroomTypes: [],
  renovationTypes: [],
  hasBalcony: undefined,
  hasElevator: undefined,
  rentPeriodMin: undefined,
  isCorner: undefined,
  isStudio: undefined,
  hasSeparateEntrance: undefined,
  securityGuarded: undefined,
  hasPlayground: undefined,
  utilityBillsIncluded: undefined,
  sortBy: undefined,
  viewTypes: [],
  nearbyInfrastructure: [],
  regionId: undefined,
  cityId: undefined,  
  microdistrictId: undefined
};

export const usePropertyFiltersStore = create<PropertyFiltersState>((set, get) => ({
  dealType: undefined,
  segment: undefined,
  filters: initialFilters,
  activeFiltersCount: 0,

  setDealType: (dealType: string) => {
    set({ dealType });
  },

  setSegment: (segment: string) => {
    set({ segment });
  },

  setFilter: (key, value) => {
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    }));
    set({ activeFiltersCount: get().calculateActiveFiltersCount() });
  },

  setFilters: (newFilters) => {
    set(state => ({
      filters: {
        ...state.filters,
        ...newFilters
      }
    }));
    set({ activeFiltersCount: get().calculateActiveFiltersCount() });
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    set({ activeFiltersCount: 0 });
  },

  calculateActiveFiltersCount: () => {
    return calculateActiveFiltersCount(get().filters);
  }
}));

// Helper function to calculate active filters count
function calculateActiveFiltersCount(filters: PropertyFilters): number {
  return Object.keys(filters).reduce((count, key) => {
    const filterKey = key as keyof PropertyFilters;
    const filterValue = filters[filterKey];
    
    if (filterKey === 'priceRange' || filterKey === 'areaRange' || filterKey === 'floorRange' || 
        filterKey === 'yearBuiltRange' || filterKey === 'ceilingHeightRange') {
      const range = filterValue as { min: number | undefined, max: number | undefined } | undefined;
      if (range && ((range.min !== undefined && range.min > 0) || (range.max !== undefined && range.max < 1000000000))) {
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
}
