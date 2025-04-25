
// Basic property filter config
export interface PropertyFilterConfig {
  priceRangeMin?: number;
  priceRangeMax?: number;
  areaRangeMin?: number;
  areaRangeMax?: number;
  floorRangeMin?: number;
  floorRangeMax?: number;
}

// Common types for listings
export interface LocalizedText {
  ru: string;
  kz: string;
}

// Common Coordinates interface
export interface Coordinates {
  lat: number;
  lng: number;
}

// Main listing interface
export interface Listing {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  imageUrl: string;
  categoryId: string;
  subcategoryId?: string;
  city: LocalizedText;
  address?: string;
  createdAt: string;
  views: number;
  isFeatured: boolean;
  userId: string;
  
  // Property specific
  propertyType?: PropertyType;
  rooms?: number;
  area?: number;
  floor?: number;
  totalFloors?: number;
  renovationType?: RenovationType;
  buildingType?: BuildingType;
  bathroom?: BathroomType;
  districtId?: string;
  coordinates?: Coordinates;
  
  // Vehicle specific
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
  commercialType?: string;
  inStock?: boolean;
  exchangePossible?: boolean;
  accidentHistory?: boolean;
  servicingHistory?: boolean;
  customsCleared?: boolean;
  features?: VehicleFeature[];
  color?: string;
  enginePower?: number;
  owners?: number;
  vin?: string;
  registrationPlate?: string;
  technicalInspection?: boolean;
  withoutAccidents?: boolean;
  withServiceHistory?: boolean;
}

// Property types
export enum PropertyType {
  APARTMENT = "apartment",
  HOUSE = "house",
  COMMERCIAL = "commercial",
  LAND = "land",
  TOWNHOUSE = "townhouse",
  DACHA = "dacha",
  GARAGE = "garage",
  BUILDING = "building"
}

export enum BuildingType {
  PANEL = "panel",
  BRICK = "brick",
  MONOLITHIC = "monolithic",
  BLOCK = "block",
  WOODEN = "wooden",
  MIXED = "mixed"
}

export enum RenovationType {
  COSMETIC = "cosmetic",
  EURO = "euro",
  DESIGNER = "designer",
  WITHOUT_RENOVATION = "without_renovation"
}

export enum BathroomType {
  COMBINED = "combined",
  SEPARATE = "separate",
  TWO_OR_MORE = "two_or_more",
  NO_BATHROOM = "no_bathroom"
}

export enum DealType {
  SALE = "sale",
  RENT = "rent",
  BUY = "buy",
  RENT_LONG = "rent_long",
  RENT_DAILY = "rent_daily"
}

export enum ViewType {
  YARD = "yard",
  STREET = "street",
  CITY = "city",
  MOUNTAINS = "mountains",
  LAKE = "lake",
  PARK = "park",
  MOUNTAIN = "mountain",
  COURTYARD = "courtyard"
}

export enum InfrastructureType {
  SCHOOL = "school",
  KINDERGARTEN = "kindergarten",
  HOSPITAL = "hospital",
  PARK = "park",
  SHOPPING_CENTER = "shopping_center",
  PUBLIC_TRANSPORT = "public_transport",
  PHARMACY = "pharmacy",
  RESTAURANT = "restaurant",
  FITNESS_CENTER = "fitness_center",
  SPORT_COMPLEX = "sport_complex",
  CAFE = "cafe",
  BANK = "bank"
}

// Vehicle types
export enum VehicleType {
  CAR = "car",
  MOTORCYCLE = "motorcycle",
  TRUCK = "truck",
  BUS = "bus",
  SPECIAL_EQUIPMENT = "special_equipment",
  COMMERCIAL = "commercial"
}

export enum EngineType {
  PETROL = "petrol",
  DIESEL = "diesel",
  GAS = "gas",
  HYBRID = "hybrid",
  ELECTRIC = "electric",
  PETROL_GAS = "petrol_gas"
}

export enum TransmissionType {
  MANUAL = "manual",
  AUTOMATIC = "automatic",
  ROBOT = "robot",
  VARIATOR = "variator"
}

export enum DriveType {
  FRONT = "front",
  REAR = "rear",
  ALL_WHEEL = "all_wheel",
  FULL = "full"
}

export enum BodyType {
  SEDAN = "sedan",
  HATCHBACK = "hatchback",
  SUV = "suv",
  WAGON = "wagon",
  COUPE = "coupe",
  CONVERTIBLE = "convertible",
  PICKUP = "pickup",
  VAN = "van",
  MINIVAN = "minivan",
  CABRIOLET = "cabriolet",
  LIMOUSINE = "limousine"
}

export enum ConditionType {
  NEW = "new",
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor"
}

export enum SteeringWheelType {
  LEFT = "left",
  RIGHT = "right"
}

export enum VehicleFeature {
  ABS = "abs",
  ESP = "esp",
  AIR_CONDITIONING = "air_conditioning",
  CLIMATE_CONTROL = "climate_control",
  LEATHER_INTERIOR = "leather_interior",
  HEATED_SEATS = "heated_seats",
  SUNROOF = "sunroof",
  NAVIGATION = "navigation",
  PARKING_SENSORS = "parking_sensors",
  REAR_VIEW_CAMERA = "rear_view_camera",
  AIRBAGS = "airbags",
  CRUISE_CONTROL = "cruise_control",
  ALLOY_WHEELS = "alloy_wheels"
}

// Common enums
export enum SortOption {
  DATE_DESC = "date_desc",
  DATE_ASC = "date_asc",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  AREA_ASC = "area_asc",
  AREA_DESC = "area_desc",
  VIEWS_DESC = "views_desc",
  YEAR_DESC = "year_desc",
  YEAR_ASC = "year_asc",
  MILEAGE_ASC = "mileage_asc",
  MILEAGE_DESC = "mileage_desc"
}

// Filter interfaces
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
  rooms: (number | 'studio')[] | null;
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

export interface TransportFilters {
  vehicleTypes: VehicleType[] | null;
  vehicleType?: VehicleType | null; // Additional property used in TransportPage
  priceRange: {
    min: number | null;
    max: number | null;
  };
  brands: string[] | null;
  models: string[] | null;
  yearRange: {
    min: number | null;
    max: number | null;
  };
  engineVolumeRange: {
    min: number | null;
    max: number | null;
  };
  mileageRange: {
    min: number | null;
    max: number | null;
  };
  engineTypes: EngineType[] | null;
  transmissions: TransmissionType[] | null;
  driveTypes: DriveType[] | null;
  bodyTypes: BodyType[] | null;
  colors: string[] | null;
  conditions: ConditionType[] | null;
  condition?: ConditionType[] | null; // Additional property used in TransportPage
  steeringWheel: SteeringWheelType | null;
  hasPhoto: boolean | null;
  customsCleared: boolean | null;
  exchange: boolean | null;
  features: VehicleFeature[] | null;
  sortBy: SortOption | null;
  city: string | null;
  commercialType?: string | null; // Added for commercial type support
  inStock?: boolean | null; // Added for in stock filter
  exchangePossible?: boolean | null; // Added for exchange possibility
  withoutAccidents?: boolean | null; // Added for accident history
  withServiceHistory?: boolean | null; // Added for service history 
}
