
import { PropertyFilters } from '@/types/listingType';

// Types for property listing filters used by usePropertyListings hook
export type PropertyListingFilters = {
  propertyTypes?: string[];
  dealType?: string;
  priceRange?: { min?: number; max?: number; };
  areaRange?: { min?: number; max?: number; };
  floorRange?: { min?: number; max?: number; };
  cityId?: number;
  regionId?: number;
  microdistrictId?: number;
  buildingTypes?: string[];
  renovationTypes?: string[];
  bathroomTypes?: string[];
  hasPhoto?: boolean;
  furnished?: boolean;
  allowPets?: boolean;
  hasParking?: boolean;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  sortBy?: string;
};

// Convert PropertyFilters to PropertyListingFilters
export function convertToPropertyListingFilters(filters: PropertyFilters): PropertyListingFilters {
  return {
    propertyTypes: filters.propertyTypes || undefined,
    dealType: filters.dealType || undefined,
    priceRange: filters.priceRange,
    areaRange: filters.areaRange,
    floorRange: filters.floorRange || filters.floor,
    cityId: filters.cityId ? parseInt(filters.cityId, 10) : undefined,
    regionId: filters.regionId ? parseInt(filters.regionId, 10) : undefined,
    microdistrictId: filters.microdistrictId ? parseInt(filters.microdistrictId, 10) : undefined,
    buildingTypes: filters.buildingTypes || undefined,
    renovationTypes: filters.renovationTypes || undefined,
    bathroomTypes: filters.bathroomTypes || undefined,
    hasPhoto: filters.hasPhoto || undefined,
    furnished: filters.furnished || undefined,
    allowPets: filters.allowPets || undefined,
    hasParking: filters.hasParking || undefined,
    hasBalcony: filters.hasBalcony || undefined,
    hasElevator: filters.hasElevator || undefined,
    sortBy: filters.sortBy || undefined,
  };
}
