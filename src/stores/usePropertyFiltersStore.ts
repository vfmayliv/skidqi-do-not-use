
import { create } from 'zustand';
import {
  PropertyFilters,
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption
} from '@/types/listingType';

type PropertyFiltersState = {
  filters: PropertyFilters;
  activeFiltersCount: number;
  
  // Actions
  setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  calculateActiveFiltersCount: () => number;
};

// Initial filters state
const initialFilters: PropertyFilters = {
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
};

export const usePropertyFiltersStore = create<PropertyFiltersState>()((set, get) => ({
  filters: initialFilters,
  activeFiltersCount: 0,
  
  setFilter: (key, value) => {
    set((state) => {
      const newFilters = {
        ...state.filters,
        [key]: value
      };
      
      return {
        filters: newFilters,
        activeFiltersCount: calculateActiveFiltersCount(newFilters)
      };
    });
  },
  
  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = {
        ...state.filters,
        ...newFilters
      };
      
      return {
        filters: updatedFilters,
        activeFiltersCount: calculateActiveFiltersCount(updatedFilters)
      };
    });
  },
  
  resetFilters: () => {
    set({
      filters: initialFilters,
      activeFiltersCount: 0
    });
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
}
