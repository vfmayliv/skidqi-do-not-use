export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  COMMERCIAL = 'commercial',
  PARTS = 'parts'
}

// Property related enums
export enum PropertyType {
  APARTMENT = 'apartment',
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
  BLOCK = 'block',
  WOODEN = 'wooden',
  MIXED = 'mixed', // Added missing MIXED type
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
  NO_BATHROOM = 'no_bathroom', // Added missing NO_BATHROOM type
}

export enum SortOption {
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  AREA_ASC = 'area_asc',
  AREA_DESC = 'area_desc',
  VIEWS_DESC = 'views_desc',
  // Adding missing sort options
  YEAR_DESC = 'year_desc',
  YEAR_ASC = 'year_asc',
  MILEAGE_ASC = 'mileage_asc',
  MILEAGE_DESC = 'mileage_desc',
}

export enum DealType {
  SALE = 'sale',
  RENT = 'rent',
  BUY = 'buy', // Added missing BUY type
  RENT_LONG = 'rent_long', // Added missing RENT_LONG type
  RENT_DAILY = 'rent_daily', // Added missing RENT_DAILY type
}

export interface PropertyFilters {
  propertyTypes?: PropertyType[] | null;
  priceRange?: { min: number | null; max: number | null };
  areaRange?: { min: number | null; max: number | null };
  floorRange?: { min: number | null; max: number | null };
  buildingTypes?: BuildingType[] | null;
  rooms?: number[] | null;
  districts?: string[] | null;
  hasPhoto?: boolean | null;
  onlyNewBuilding?: boolean | null;
  furnished?: boolean | null;
  allowPets?: boolean | null;
  hasParking?: boolean | null;
  dealType?: string | null;
  segment?: string | null;
  yearBuiltRange?: { min: number | null; max: number | null };
  ceilingHeightRange?: { min: number | null; max: number | null };
  bathroomTypes?: BathroomType[] | null;
  renovationTypes?: RenovationType[] | null;
  hasBalcony?: boolean | null;
  hasElevator?: boolean | null;
  rentPeriodMin?: number | null;
  isCorner?: boolean | null;
  isStudio?: boolean | null;
  hasSeparateEntrance?: boolean | null;
  securityGuarded?: boolean | null;
  hasPlayground?: boolean | null;
  utilityBillsIncluded?: boolean | null;
  sortBy?: SortOption | null;
  viewTypes?: string[] | null;
  nearbyInfrastructure?: string[] | null;
}

export interface PropertyFilterConfig {
  areaRangeMin: number;
  areaRangeMax: number;
  floorRangeMin: number;
  floorRangeMax: number;
  dealTypes: { id: string; label: { ru: string; kz: string } }[];
  segments: { id: string; label: { ru: string; kz: string }; types: string[] }[];
  propertyTypes: { [key: string]: { ru: string; kz: string } };
  buildingTypes: { [key: string]: { ru: string; kz: string } };
  conditionTypes: { [key: string]: { ru: string; kz: string } };
  sortOptions: { value: string; label: { ru: string; kz: string } }[];
}

export enum ConditionType {
  NEW = 'new',
  USED = 'used',
  DAMAGED = 'damaged',
  GOOD = 'good',
  AVERAGE = 'average',
  NEEDS_REPAIR = 'needs_repair',
}

export enum FuelType {
  GASOLINE = 'gasoline',
  DIESEL = 'diesel',
  GAS = 'gas',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  TIPTRONIC = 'tiptronic',
  VARIATOR = 'variator',
  ROBOT = 'robot',
}

export enum DriveType {
  FWD = 'fwd',
  RWD = 'rwd',
  AWD = 'awd',
}

export enum BodyType {
  SEDAN = 'sedan',
  HATCHBACK = 'hatchback',
  SUV = 'suv',
  MINIVAN = 'minivan',
  COUPE = 'coupe',
  WAGON = 'wagon',
  PICKUP = 'pickup',
  CABRIOLET = 'cabriolet',
  LIMOUSINE = 'limousine',
}

export enum SteeringWheelType {
  LEFT = 'left',
  RIGHT = 'right',
}

export type VehicleFeature = 'abs' | 'air_conditioning' | 'heated_seats' | 'cruise_control' | 'rear_view_camera';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: 'KZT' | 'USD' | 'EUR';
  images: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  isPromoted?: boolean;
  userId: string;
  categoryId: string;
  
  // Vehicle specific fields
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engineVolume?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  driveType?: DriveType;
  bodyType?: BodyType;
  steeringWheel?: SteeringWheelType;
  condition?: ConditionType;
  color?: string;
  features?: VehicleFeature[];

  // Property specific fields
  propertyType?: PropertyType;
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  buildingType?: BuildingType;
  renovationType?: RenovationType;
  bathroom?: BathroomType;
  yearBuilt?: number;
  address?: string;
  districtId?: string;
  regionId?: string;
  cityId?: string;
  microdistrictId?: string;
  hasParking?: boolean;
  hasFurniture?: boolean;
  hasBalcony?: boolean;
  hasElevator?: boolean;
}

export interface Region {
  id: string;
  name_ru: string;
  name_kz: string;
  is_city_level?: boolean; // Поле для определения уровня города (Астана, Алматы, Шымкент)
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
