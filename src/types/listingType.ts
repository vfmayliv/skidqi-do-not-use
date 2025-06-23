export enum PropertyType {
  APARTMENT = 'flat',
  HOUSE = 'house',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  TOWNHOUSE = 'townhouse',
  DACHA = 'dacha',
  GARAGE = 'garage',
  BUILDING = 'building',
}

export enum BuildingType {
  PANEL = 'panel',
  BRICK = 'brick',
  MONOLITHIC = 'monolithic',
  WOOD = 'wood',
  BLOCK = 'block',
  WOODEN = 'wooden',
}

export enum ConditionType {
  GOOD = 'good',
  AVERAGE = 'average',
  NEEDS_REPAIR = 'needs_repair',
}

export enum RenovationType {
  COSMETIC = 'cosmetic',
  EURO = 'euro',
  DESIGNER = 'designer',
  WITHOUT_RENOVATION = 'without_renovation',
}

export enum BathroomType {
  COMBINED = 'combined',
  SEPARATE = 'separate',
  TWO_OR_MORE = 'two_or_more',
}

export enum EngineType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  GAS = 'gas'
}

export enum BodyType {
  SEDAN = 'sedan',
  HATCHBACK = 'hatchback',
  SUV = 'suv',
  WAGON = 'wagon',
  COUPE = 'coupe',
  CONVERTIBLE = 'convertible',
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  CVT = 'cvt',
}

export enum DriveType {
  FWD = 'fwd',
  RWD = 'rwd',
  AWD = 'awd',
}

export enum VehicleType {
  CAR = 'car',
  TRUCK = 'truck',
  MOTORCYCLE = 'motorcycle',
}

export enum SortOptions {
  DATE_DESC = 'date_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  AREA_ASC = 'area_asc',
  AREA_DESC = 'area_desc',
}

export interface SortOption {
  value: string;
  label: {
    ru: string;
    kz: string;
  };
}

export enum SteeringWheelType {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum VehicleFeature {
  ABS = 'abs',
  ESP = 'esp',
  AIRBAG = 'airbag',
  AIR_CONDITIONING = 'air_conditioning',
  POWER_STEERING = 'power_steering',
  ELECTRIC_WINDOWS = 'electric_windows',
  CENTRAL_LOCKING = 'central_locking',
  ALARM = 'alarm',
  IMMOBILIZER = 'immobilizer',
  GPS = 'gps',
  BLUETOOTH = 'bluetooth',
  USB = 'usb',
  HEATED_SEATS = 'heated_seats',
  LEATHER_SEATS = 'leather_seats',
  SUNROOF = 'sunroof',
  ALLOY_WHEELS = 'alloy_wheels'
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

export interface TransportFilters {
  vehicleType: VehicleType | null;
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
  engineVolumeRange: {
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
  customsCleared: boolean | null;
  inStock: boolean | null;
  exchangePossible: boolean | null;
  withoutAccidents: boolean | null;
  withServiceHistory: boolean | null;
  steeringWheel: SteeringWheelType | null;
  features: VehicleFeature[] | null;
  cities: string[] | null;
  sortBy: string | null;
}

export interface Listing {
  id: string;
  title: string | { ru: string; kz: string };
  description: string | { ru: string; kz: string };
  imageUrl: string;
  images?: string[];
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
