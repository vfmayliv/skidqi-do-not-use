
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
}

export enum DealType {
  SALE = 'sale',
  RENT = 'rent',
  BUY = 'buy', // Added missing BUY type
  RENT_LONG = 'rent_long', // Added missing RENT_LONG type
  RENT_DAILY = 'rent_daily', // Added missing RENT_DAILY type
}

export enum ViewType {
  WINDOW = 'window',
  YARD = 'yard',
  CITY = 'city',
  LANDMARK = 'landmark',
  MOUNTAINS = 'mountains',
  SEA = 'sea',
  PARK = 'park', // Added missing PARK type
  LAKE = 'lake', // Added missing LAKE type
  COURTYARD = 'courtyard', // Added missing COURTYARD type
  STREET = 'street', // Added missing STREET type
}

export enum InfrastructureType {
  SCHOOL = 'school',
  KINDERGARTEN = 'kindergarten',
  HOSPITAL = 'hospital',
  PHARMACY = 'pharmacy',
  SUPERMARKET = 'supermarket',
  PARK = 'park',
  GYM = 'gym',
  CAFE = 'cafe',
  PUBLIC_TRANSPORT = 'public_transport',
  SHOPPING_CENTER = 'shopping_center', // Added missing SHOPPING_CENTER type
  SPORT_COMPLEX = 'sport_complex', // Added missing SPORT_COMPLEX type
  BANK = 'bank', // Added missing BANK type
}

// Transport related enums
export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  ROBOT = 'robot',
  VARIATOR = 'variator',
}

export enum EngineType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  GAS = 'gas',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  PETROL_GAS = 'petrol_gas',
}

export enum DriveType {
  FRONT = 'front',
  REAR = 'rear',
  ALL_WHEEL = 'all_wheel',
  FULL = 'full',
}

export enum BodyType {
  SEDAN = 'sedan',
  HATCHBACK = 'hatchback',
  SUV = 'suv',
  MINIVAN = 'minivan',
  WAGON = 'wagon',
  COUPE = 'coupe',
  PICKUP = 'pickup',
  CABRIOLET = 'cabriolet',
}

export enum ConditionType {
  NEW = 'new',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  SATISFACTORY = 'satisfactory',
  POOR = 'poor',
  FOR_PARTS = 'for_parts',
}

export enum SteeringWheelType {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum VehicleFeature {
  ABS = 'abs',
  ESP = 'esp',
  ALLOY_WHEELS = 'alloy_wheels',
  CLIMATE_CONTROL = 'climate_control',
  CRUISE_CONTROL = 'cruise_control',
  HEATED_SEATS = 'heated_seats',
  LEATHER_INTERIOR = 'leather_interior',
  NAVIGATION = 'navigation',
  PARKING_SENSORS = 'parking_sensors',
  REAR_VIEW_CAMERA = 'rear_view_camera',
  SUNROOF = 'sunroof',
}

// Interface for filters
export interface PropertyFilters {
  propertyTypes?: PropertyType[] | null;
  dealType?: DealType | null;
  priceRange: { min: number | null; max: number | null };
  rooms: (number | string)[];
  areaRange: { min: number | null; max: number | null };
  floor?: { min: number | null; max: number | null }; // Using "floor" for backward compatibility
  floorRange?: { min: number | null; max: number | null }; // Adding floorRange for newer components
  totalFloors?: { min: number | null; max: number | null };
  yearBuilt?: { min: number | null; max: number | null };
  yearBuiltRange?: { min: number | null; max: number | null }; // Adding for newer components
  buildingTypes?: BuildingType[] | null;
  renovationTypes?: RenovationType[] | null;
  bathroomTypes?: BathroomType[] | null;
  districts?: string[] | null;
  viewTypes?: ViewType[] | null; // Added missing viewTypes
  nearbyInfrastructure?: InfrastructureType[] | null; // Added missing nearbyInfrastructure
  hasPhoto?: boolean;
  isNewBuilding?: boolean;
  onlyNewBuilding?: boolean; // Added for compatibility
  hasParking?: boolean;
  hasFurniture?: boolean;
  furnished?: boolean; // Added for compatibility
  hasBalcony?: boolean;
  hasElevator?: boolean;
  isCorner?: boolean;
  onlyTrustedSellers?: boolean;
  mortgageAvailable?: boolean;
  hasVirtualTour?: boolean;
  isStudio?: boolean; // Added missing property
  rentPeriodMin?: number; // Added missing rentPeriodMin
  allowPets?: boolean; // Added missing allowPets
  hasSeparateEntrance?: boolean; // Added missing hasSeparateEntrance
  securityGuarded?: boolean; // Added missing securityGuarded
  hasPlayground?: boolean; // Added missing hasPlayground
  ceilingHeightRange?: { min: number | null; max: number | null }; // Added missing ceilingHeightRange
  sortBy: SortOption;
}

export interface TransportFilters {
  vehicleType: VehicleType;
  priceRange: { min: number | null; max: number | null };
  brands: string[];
  models: string[];
  yearRange: { min: number | null; max: number | null };
  mileageRange: { min: number | null; max: number | null };
  engineTypes?: EngineType[] | null;
  engineVolumeRange: { min: number | null; max: number | null };
  transmissionTypes?: TransmissionType[] | null;
  driveTypes?: DriveType[] | null;
  bodyTypes?: BodyType[] | null;
  steeringWheelTypes?: SteeringWheelType[] | null;
  conditionTypes?: ConditionType[] | null;
  colors?: string[] | null;
  features?: VehicleFeature[] | null;
  cities?: string[] | null;
  hasPhoto?: boolean;
  isCleared?: boolean;
  notBroken?: boolean;
  hasVideo?: boolean;
  onlyTrustedSellers?: boolean;
  exchangePossible?: boolean;
  sortBy: SortOption;
}

export interface PropertyFilterConfig {
  areaRangeMin?: number;
  areaRangeMax?: number;
  floorRangeMin?: number;
  floorRangeMax?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
}

export interface Listing {
  id: string;
  title: {
    ru: string;
    kz: string;
  };
  description: {
    ru: string;
    kz: string;
  };
  originalPrice: number;
  discountPrice: number;
  discount: number;
  city: {
    ru: string;
    kz: string;
  };
  categoryId: string;
  category?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  createdAt: string;
  imageUrl: string;
  images?: string[];
  isFeatured?: boolean;
  views: number;
  seller: {
    name: string;
    phone: string;
    rating: number;
    reviews?: number;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Transport specific fields
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  vehicleType?: VehicleType;
  engineVolume?: number;
  engineType?: EngineType;
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
  hasParking?: boolean;
  hasFurniture?: boolean;
  hasBalcony?: boolean;
  hasElevator?: boolean;
}
