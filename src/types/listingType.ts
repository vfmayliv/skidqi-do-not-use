export interface LocalizedText {
  ru: string;
  kz: string;
}

export interface Seller {
  name: string;
  phone: string;
  rating: number;
  reviews?: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

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
  WOODEN = 'wooden',
  BLOCK = 'block',
  MIXED = 'mixed',
}

export enum RenovationType {
  DESIGNER = 'designer',
  EURO = 'euro',
  COSMETIC = 'cosmetic',
  NEEDS_RENOVATION = 'needs_renovation',
  WITHOUT_RENOVATION = 'without_renovation',
}

export enum BathroomType {
  COMBINED = 'combined',
  SEPARATE = 'separate',
  TWO_OR_MORE = 'two_or_more',
  NO_BATHROOM = 'no_bathroom',
}

export enum DealType {
  SALE = 'sale',
  RENT = 'rent',
  BUY = 'buy',
  RENT_LONG = 'rent_long',
  RENT_DAILY = 'rent_daily',
}

export enum ViewType {
  YARD = 'yard',
  STREET = 'street',
  PARK = 'park',
  MOUNTAINS = 'mountains',
  LAKE = 'lake',
  SEA = 'sea',
  CITY = 'city',
  COURTYARD = 'courtyard',
}

export enum InfrastructureType {
  SCHOOL = 'school',
  KINDERGARTEN = 'kindergarten',
  HOSPITAL = 'hospital',
  PARK = 'park',
  SUPERMARKET = 'supermarket',
  PUBLIC_TRANSPORT = 'public_transport',
  SHOPPING_CENTER = 'shopping_center',
  PHARMACY = 'pharmacy',
  GYM = 'gym',
  CAFE = 'cafe',
  RESTAURANT = 'restaurant',
  BANK = 'bank',
  SPORT_COMPLEX = 'sport_complex',
}

export enum SortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
  AREA_ASC = 'area_asc',
  AREA_DESC = 'area_desc',
  YEAR_ASC = 'year_asc',
  YEAR_DESC = 'year_desc',
  MILEAGE_ASC = 'mileage_asc',
  MILEAGE_DESC = 'mileage_desc',
}

export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  COMMERCIAL = 'commercial',
  SPECIAL = 'special',
  PARTS = 'parts',
}

export enum EngineType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  GAS = 'gas',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  PETROL_GAS = 'petrol_gas',
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  ROBOT = 'robot',
  VARIATOR = 'variator',
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
  PICKUP = 'pickup',
  MINIVAN = 'minivan',
  VAN = 'van',
  COUPE = 'coupe',
  CABRIOLET = 'cabriolet',
  WAGON = 'wagon',
  LIMOUSINE = 'limousine',
}

export enum ConditionType {
  NEW = 'new',
  USED = 'used',
  DAMAGED = 'damaged',
  FOR_PARTS = 'for_parts',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
}

export enum SteeringWheelType {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum VehicleFeature {
  ABS = 'abs',
  ESP = 'esp',
  AIRBAGS = 'airbags',
  CLIMATE_CONTROL = 'climate_control',
  HEATED_SEATS = 'heated_seats',
  CRUISE_CONTROL = 'cruise_control',
  PARKING_SENSORS = 'parking_sensors',
  REAR_VIEW_CAMERA = 'rear_view_camera',
  NAVIGATION = 'navigation',
  LEATHER_INTERIOR = 'leather_interior',
  SUNROOF = 'sunroof',
  ALLOY_WHEELS = 'alloy_wheels',
}

export interface PropertyFilters {
  propertyTypes: PropertyType[] | null;
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
  buildingTypes: BuildingType[] | null;
  rooms: number[] | null;
  districts: string[] | null;
  hasPhoto: boolean | null;
  onlyNewBuilding: boolean | null;
  furnished: boolean | null;
  allowPets: boolean | null;
  hasParking: boolean | null;
  dealType: DealType | null;
  yearBuiltRange: {
    min: number | null;
    max: number | null;
  };
  ceilingHeightRange: {
    min: number | null;
    max: number | null;
  };
  bathroomTypes: BathroomType[] | null;
  renovationTypes: RenovationType[] | null;
  hasBalcony: boolean | null;
  hasElevator: boolean | null;
  rentPeriodMin: number | null;
  isCorner: boolean | null;
  isStudio: boolean | null;
  hasSeparateEntrance: boolean | null;
  securityGuarded: boolean | null;
  hasPlayground: boolean | null;
  utilityBillsIncluded: boolean | null;
  sortBy: SortOption | null;
  viewTypes: ViewType[] | null;
  nearbyInfrastructure: InfrastructureType[] | null;
}

export interface FilterOption {
  id: string;
  label: LocalizedText;
}

export interface FilterSegment {
  id: string;
  label: LocalizedText;
  types: FilterOption[];
}

export interface TransportFiltersRange {
  min: number | null;
  max: number | null;
}

export interface TransportFilters {
  vehicleType: VehicleType | null;
  vehicleTypes?: VehicleType[] | null; // Added for compatibility
  brands: string[] | null;
  models: string[] | null;
  yearRange: TransportFiltersRange;
  priceRange: TransportFiltersRange;
  mileageRange: TransportFiltersRange;
  engineVolumeRange: TransportFiltersRange;
  engineTypes: EngineType[] | null;
  transmissions: TransmissionType[] | null;
  driveTypes: DriveType[] | null;
  bodyTypes: BodyType[] | null;
  condition: ConditionType | null;
  conditions?: ConditionType[] | null; // Added for compatibility
  steeringWheel: SteeringWheelType | null;
  customsCleared: boolean | null;
  inStock: boolean | null;
  exchangePossible: boolean | null;
  withoutAccidents: boolean | null;
  withServiceHistory: boolean | null;
  hasPhoto: boolean | null;
  features: VehicleFeature[] | null;
  sortBy: SortOption | null;
  commercialType: string | null;
  colors: string[] | null; // For compatibility with TransportPage
  city: string | null;
  exchange: boolean | null; // For compatibility
}

export interface PropertyFilterConfig {
  priceRangeMin?: number;
  priceRangeMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  propertyType?: string | null;
  areaRangeMin?: number;
  areaRangeMax?: number;
  floorRangeMin?: number;
  floorRangeMax?: number;
  dealTypes?: FilterOption[];
  segments?: FilterSegment[];
  residentialFilters?: FilterOption[];
  commercialFilters?: FilterOption[];
  generalFilters?: FilterOption[];
}

export interface Listing {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  subcategory?: string;
  city: LocalizedText;
  imageUrl: string;
  images?: string[];
  originalPrice: number;
  discountPrice: number;
  discount: number;
  isFeatured?: boolean;
  seller: Seller;
  createdAt: string;
  views: number;
  
  // For compatibility with existing code
  categoryId?: string;
  subcategoryId?: string;
  
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
  ceilingHeight?: number;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  dealType?: DealType;
  address?: string;
  coordinates?: Coordinates;
  districtId?: string;
  
  // Vehicle specific fields
  vehicleType?: VehicleType;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engineVolume?: number;
  engineType?: EngineType;
  transmission?: TransmissionType;
  driveType?: DriveType;
  bodyType?: BodyType;
  condition?: ConditionType;
  steeringWheel?: SteeringWheelType;
  customsCleared?: boolean;
  features?: VehicleFeature[];
  enginePower?: number;
  commercialType?: string;
  userId?: string;
}

export type BrandData = {
  id: string;
  name: LocalizedText | string;
  models: string[];
  toLowerCase(): string; // Method for string compatibility
};
