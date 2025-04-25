import { CityType } from '../contexts/AppContext';

export type Listing = {
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
  imageUrl: string;
  categoryId: string;
  subcategoryId?: string;
  city: CityType;
  createdAt: string;
  views: number;
  isFeatured: boolean;
  userId: string;
  
  // Дополнительные поля для недвижимости
  propertyType?: PropertyType;
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  furnishing?: boolean;
  facilities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: string;
  districtId?: string;
  
  // Расширенные поля для недвижимости
  dealType?: DealType;
  buildingType?: BuildingType;
  yearBuilt?: number;
  ceilingHeight?: number;
  balcony?: boolean;
  parking?: boolean;
  elevator?: boolean;
  bathroom?: BathroomType;
  renovationType?: RenovationType;
  pets?: boolean;
  smokingAllowed?: boolean;
  deposit?: number;
  minRentPeriod?: number;
  utilityBills?: boolean;
  security?: boolean;
  playground?: boolean;
  isNewBuilding?: boolean;
  isCorner?: boolean;
  isStudio?: boolean;
  separateEntrance?: boolean;
  propertyDocuments?: DocumentType[];
  viewType?: ViewType[];
  nearbyInfrastructure?: InfrastructureType[];
  
  // Дополнительные поля для транспорта
  vehicleType?: VehicleType;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  engineType?: EngineType;
  engineVolume?: number;
  enginePower?: number;
  transmission?: TransmissionType;
  driveType?: DriveType;
  bodyType?: BodyType;
  color?: string;
  condition?: ConditionType;
  owners?: number;
  inStock?: boolean;
  vin?: string;
  registrationPlate?: string;
  steeringWheel?: SteeringWheelType;
  customsCleared?: boolean;
  exchangePossible?: boolean;
  technicalInspection?: boolean;
  accidentHistory?: boolean;
  servicingHistory?: boolean;
  features?: VehicleFeature[];
  commercialType?: string;
};

// Property types
export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  TOWNHOUSE = 'townhouse',
  DACHA = 'dacha',
  GARAGE = 'garage',
  BUILDING = 'building'
}

export enum DealType {
  BUY = 'buy',
  RENT_LONG = 'rent_long',
  RENT_DAILY = 'rent_daily'
}

export enum BuildingType {
  PANEL = 'panel',
  BRICK = 'brick', 
  MONOLITHIC = 'monolithic',
  BLOCK = 'block',
  WOODEN = 'wooden',
  MIXED = 'mixed'
}

export enum BathroomType {
  COMBINED = 'combined',
  SEPARATE = 'separate',
  TWO_OR_MORE = 'two_or_more',
  NO_BATHROOM = 'no_bathroom'
}

export enum RenovationType {
  COSMETIC = 'cosmetic',
  EURO = 'euro',
  DESIGNER = 'designer',
  WITHOUT_RENOVATION = 'without_renovation'
}

export enum DocumentType {
  OWNERSHIP = 'ownership',
  RENT_CONTRACT = 'rent_contract',
  INHERITANCE = 'inheritance',
  GIFT = 'gift',
  SHARE_OWNERSHIP = 'share_ownership'
}

export enum ViewType {
  CITY = 'city',
  PARK = 'park',
  LAKE = 'lake',
  MOUNTAIN = 'mountain',
  COURTYARD = 'courtyard',
  STREET = 'street'
}

export enum InfrastructureType {
  SCHOOL = 'school',
  KINDERGARTEN = 'kindergarten',
  HOSPITAL = 'hospital',
  SHOPPING_CENTER = 'shopping_center',
  PHARMACY = 'pharmacy',
  PARK = 'park',
  PUBLIC_TRANSPORT = 'public_transport',
  SPORT_COMPLEX = 'sport_complex',
  CAFE = 'cafe',
  BANK = 'bank'
}

// Transport types
export enum VehicleType {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  COMMERCIAL = 'commercial',
  PARTS = 'parts'
}

export enum EngineType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  GAS = 'gas',
  HYBRID = 'hybrid',
  ELECTRIC = 'electric',
  PETROL_GAS = 'petrol_gas'
}

export enum TransmissionType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  ROBOT = 'robot',
  VARIATOR = 'variator'
}

export enum DriveType {
  FRONT = 'front',
  REAR = 'rear',
  ALL_WHEEL = 'all_wheel',
  FULL = 'full'
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
  LIMOUSINE = 'limousine'
}

export enum ConditionType {
  NEW = 'new',
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  SALVAGE = 'salvage'
}

export enum SteeringWheelType {
  LEFT = 'left',
  RIGHT = 'right'
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
  ALLOY_WHEELS = 'alloy_wheels'
}

export interface PropertyFilterConfig {
  priceRangeMin?: number;
  priceRangeMax?: number;
  areaRangeMin?: number;
  areaRangeMax?: number;
  floorRangeMin?: number;
  floorRangeMax?: number;
}

export interface PropertyFilters {
  priceRange: { min: number | null; max: number | null };
  rooms: number[] | null;
  areaRange: { min: number | null; max: number | null };
  floorRange: { min: number | null; max: number | null };
  propertyTypes: PropertyType[] | null;
  districts: string[] | null;
  hasPhoto: boolean | null;
  onlyNewBuilding: boolean | null;
  furnished: boolean | null;
  allowPets: boolean | null;
  hasParking: boolean | null;
  
  // Расширенные фильтры
  dealType: DealType | null;
  buildingTypes: BuildingType[] | null;
  yearBuiltRange: { min: number | null; max: number | null };
  ceilingHeightRange: { min: number | null; max: number | null };
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

export interface TransportFilters {
  priceRange: { min: number | null; max: number | null };
  vehicleType: VehicleType | null;
  brands: string[] | null;
  models: string[] | null;
  yearRange: { min: number | null; max: number | null };
  mileageRange: { min: number | null; max: number | null };
  engineTypes: EngineType[] | null;
  engineVolumeRange: { min: number | null; max: number | null };
  transmissions: TransmissionType[] | null;
  driveTypes: DriveType[] | null;
  bodyTypes: BodyType[] | null;
  colors: string[] | null;
  condition: ConditionType[] | null;
  hasPhoto: boolean | null;
  steeringWheel: SteeringWheelType | null;
  customsCleared: boolean | null;
  inStock: boolean | null;
  exchangePossible: boolean | null;
  withoutAccidents: boolean | null;
  withServiceHistory: boolean | null;
  features: VehicleFeature[] | null;
  sortBy: SortOption | null;
  commercialType?: string | null;
}

export enum SortOption {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  DATE_DESC = 'date_desc',
  AREA_ASC = 'area_asc',
  AREA_DESC = 'area_desc',
  YEAR_DESC = 'year_desc',
  YEAR_ASC = 'year_asc',
  MILEAGE_ASC = 'mileage_asc',
  MILEAGE_DESC = 'mileage_desc'
}
