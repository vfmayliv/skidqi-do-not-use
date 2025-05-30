
import { create } from 'zustand';

export interface UniversalFiltersState {
  condition?: 'new' | 'used' | 'any';
  priceRange: {
    min?: number;
    max?: number;
  };
  location: {
    regionId?: number;
    cityId?: number;
  };
}

interface UniversalFiltersStore {
  filters: UniversalFiltersState;
  setFilters: (filters: UniversalFiltersState) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
}

const initialFilters: UniversalFiltersState = {
  condition: undefined,
  priceRange: {
    min: undefined,
    max: undefined,
  },
  location: {
    regionId: undefined,
    cityId: undefined,
  },
};

export const useUniversalFiltersStore = create<UniversalFiltersStore>((set, get) => ({
  filters: initialFilters,
  
  setFilters: (filters) => set({ filters }),
  
  resetFilters: () => set({ filters: initialFilters }),
  
  get activeFiltersCount() {
    const { filters } = get();
    let count = 0;
    
    if (filters.condition && filters.condition !== 'any') count++;
    if (filters.priceRange.min !== undefined) count++;
    if (filters.priceRange.max !== undefined) count++;
    if (filters.location.regionId !== undefined) count++;
    if (filters.location.cityId !== undefined) count++;
    
    return count;
  },
}));
