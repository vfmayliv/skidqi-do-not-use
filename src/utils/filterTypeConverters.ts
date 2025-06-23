
import { PropertyFilters } from '@/types/listingType';

export function convertToPropertyListingFilters(params: Record<string, string | string[]>): Partial<PropertyFilters> {
  const filters: Partial<PropertyFilters> = {};

  // Handle property types
  if (params.propertyTypes) {
    const types = Array.isArray(params.propertyTypes) ? params.propertyTypes : [params.propertyTypes];
    filters.propertyTypes = types.filter(Boolean);
  }

  // Handle price range
  if (params.minPrice || params.maxPrice) {
    filters.priceRange = {
      min: params.minPrice ? parseInt(params.minPrice as string) : null,
      max: params.maxPrice ? parseInt(params.maxPrice as string) : null
    };
  }

  // Handle area range
  if (params.minArea || params.maxArea) {
    filters.areaRange = {
      min: params.minArea ? parseInt(params.minArea as string) : null,
      max: params.maxArea ? parseInt(params.maxArea as string) : null
    };
  }

  // Handle floor range
  if (params.minFloor || params.maxFloor) {
    filters.floorRange = {
      min: params.minFloor ? parseInt(params.minFloor as string) : null,
      max: params.maxFloor ? parseInt(params.maxFloor as string) : null
    };
  }

  // Handle building types
  if (params.buildingTypes) {
    const types = Array.isArray(params.buildingTypes) ? params.buildingTypes : [params.buildingTypes];
    filters.buildingTypes = types.filter(Boolean);
  }

  // Handle rooms
  if (params.rooms) {
    const rooms = Array.isArray(params.rooms) ? params.rooms : [params.rooms];
    filters.rooms = rooms.map(r => parseInt(r)).filter(r => !isNaN(r));
  }

  // Handle districts
  if (params.districts) {
    const districts = Array.isArray(params.districts) ? params.districts : [params.districts];
    filters.districts = districts.filter(Boolean);
  }

  // Handle boolean filters
  if (params.hasPhoto !== undefined) {
    filters.hasPhoto = params.hasPhoto === 'true';
  }

  if (params.onlyNewBuilding !== undefined) {
    filters.onlyNewBuilding = params.onlyNewBuilding === 'true';
  }

  if (params.furnished !== undefined) {
    filters.furnished = params.furnished === 'true';
  }

  if (params.allowPets !== undefined) {
    filters.allowPets = params.allowPets === 'true';
  }

  if (params.hasParking !== undefined) {
    filters.hasParking = params.hasParking === 'true';
  }

  // Handle deal type and segment
  if (params.dealType) {
    filters.dealType = params.dealType as string;
  }

  if (params.segment) {
    filters.segment = params.segment as string;
  }

  // Handle sort
  if (params.sortBy) {
    filters.sortBy = params.sortBy as string;
  }

  // Handle location filters
  if (params.regionId) {
    filters.regionId = params.regionId as string;
  }

  if (params.cityId) {
    filters.cityId = params.cityId as string;
  }

  if (params.microdistrictId) {
    filters.microdistrictId = params.microdistrictId as string;
  }

  return filters;
}
