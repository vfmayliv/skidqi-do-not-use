export enum PropertyType {
  APARTMENT = 'flat',
  HOUSE = 'house',
  COMMERCIAL = 'commercial',
  LAND = 'land',
}

export enum BuildingType {
  PANEL = 'panel',
  BRICK = 'brick',
  MONOLITHIC = 'monolithic',
  WOOD = 'wood',
}

export enum ConditionType {
  GOOD = 'good',
  AVERAGE = 'average',
  NEEDS_REPAIR = 'needs_repair',
}

export interface SortOption {
  value: string;
  label: {
    ru: string;
    kz: string;
  };
}

export interface PropertyFilterConfig {
  areaRangeMin: number;
  areaRangeMax: number;
  floorRangeMin: number;
  floorRangeMax: number;
  dealTypes: { id: string; label: { ru: string; kz: string } }[];
  segments: { 
    id: string; 
    label: { ru: string; kz: string };
    types: []
  }[];
  propertyTypes: { [key: string]: { ru: string; kz: string } };
  buildingTypes: { [key: string]: { ru: string; kz: string } };
  conditionTypes: { [key: string]: { ru: string; kz: string } };
  sortOptions: SortOption[];
}

export interface Region {
  id: string;
  name_ru: string;
  name_kz: string;
}

export interface City {
  id: string;
  name_ru: string;
  name_kz: string;
  region_id: string;
}

export interface Microdistrict {
  id: string;
  name_ru: string;
  name_kz: string;
  city_id: string;
}

export interface PropertyFilters {
  propertyTypes: string[] | null;
  priceRange: {
    min: number | null;
    max: number | null;
  };
  areaRange: {
    min: number | null;
    max: number | null;
  };
  floorRange: {
    min: number | null;
    max: number | null;
  };
  buildingTypes: string[] | null;
  rooms: number[] | null;
  districts: string[] | null;
  hasPhoto: boolean | null;
  onlyNewBuilding: boolean | null;
  furnished: boolean | null;
  allowPets: boolean | null;
  hasParking: boolean | null;
  dealType: string | null;
  segment: string | null;
  yearBuiltRange: {
    min: number | null;
    max: number | null;
  };
  ceilingHeightRange: {
    min: number | null;
    max: number | null;
  };
  bathroomTypes: string[] | null;
  renovationTypes: string[] | null;
  hasBalcony: boolean | null;
  hasElevator: boolean | null;
  rentPeriodMin: number | null;
  isCorner: boolean | null;
  isStudio: boolean | null;
  hasSeparateEntrance: boolean | null;
  securityGuarded: boolean | null;
  hasPlayground: boolean | null;
  utilityBillsIncluded: boolean | null;
  sortBy: string | null;
  viewTypes: string[] | null;
  nearbyInfrastructure: string[] | null;
  
  // Location filters
  regionId: string | null;
  cityId: string | null;
  microdistrictId: string | null;
}

// Transport filters and types that were missing
export interface TransportFilters {
  brandId: string | null;
  modelId: string | null;
  yearRange: {
    min: number | null;
    max: number | null;
  };
  priceRange: {
    min: number | null;
    max: number | null;
  };
  mileageRange: {
    min: number | null;
    max: number | null;
  };
  engineType: string | null;
  transmission: string | null;
  driveType: string | null;
  bodyType: string | null;
  condition: string | null;
  color: string | null;
  fuelType: string | null;
  hasPhoto: boolean | null;
  dealerOnly: boolean | null;
  sortBy: string | null;
}

export enum EngineType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  GAS = 'gas'
}

export interface Listing {
  id: string;
  title: string | { ru: string; kz: string };
  description: string | { ru: string; kz: string };
  imageUrl: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  city: string | { ru: string; kz: string };
  categoryId: string;
  subcategoryId?: string;
  createdAt: string;
  views: number;
  isFeatured?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  
  // Property-specific fields
  propertyType?: PropertyType;
  area?: number;
  rooms?: number;
  floor?: number;
  totalFloors?: number;
  buildingType?: BuildingType;
  conditionType?: ConditionType;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  hasParking?: boolean;
  furnished?: boolean;
  allowPets?: boolean;
  yearBuilt?: number;
  dealType?: string;
  
  // Transport-specific fields
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engineType?: string;
  transmission?: string;
  driveType?: string;
  bodyType?: string;
  condition?: string;
  
  // Administrative division properties
  regionId: string;
  cityId: string;
  microdistrictId: string;
  districtId?: string;
  
  // Seller information
  seller?: {
    name: string;
    phone: string;
    rating: number;
    reviews?: number;
  };
}
