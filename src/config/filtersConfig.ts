import { PropertyType } from '@/types/listingType';

// Defines which filters are visible for a given property type
export interface FilterVisibility {
  showPrice?: boolean;
  showArea?: boolean;
  showRooms?: boolean;
  showFloor?: boolean;
  showTotalFloors?: boolean;
  showYearBuilt?: boolean;
  showBuildingType?: boolean;
  showRenovation?: boolean;
  showBathroomType?: boolean;
  showFurnished?: boolean;
  showHasBalcony?: boolean;
  showHasParking?: boolean;
  showAllowPets?: boolean;
  showCeilingHeight?: boolean; // For commercial/industrial
}

// Default visibility for most residential properties
const defaultResidentialFilters: FilterVisibility = {
  showPrice: true,
  showArea: true,
  showRooms: true,
  showFloor: true,
  showTotalFloors: true,
  showYearBuilt: true,
  showBuildingType: true,
  showRenovation: true,
  showBathroomType: true,
  showFurnished: true,
  showHasBalcony: true,
  showHasParking: true,
  showAllowPets: true,
};

// Default visibility for most commercial properties
const defaultCommercialFilters: FilterVisibility = {
  showPrice: true,
  showArea: true,
  showFloor: true,
  showTotalFloors: true,
  showYearBuilt: true,
  showRenovation: true,
  showHasParking: true,
  showCeilingHeight: true,
};

export interface PropertyTypeOption {
  value: PropertyType;
  label: string; // Translation key
  filters: FilterVisibility;
}

export interface SegmentConfig {
  propertyTypes: PropertyTypeOption[];
}

export const filtersConfig: Record<string, Record<string, SegmentConfig>> = {
  buy: {
    residential: {
      propertyTypes: [
        { value: PropertyType.NEW_BUILDING, label: 'property_type_new_building', filters: { ...defaultResidentialFilters } },
        { value: PropertyType.SECONDARY, label: 'property_type_secondary', filters: { ...defaultResidentialFilters } },
        { value: PropertyType.ROOM, label: 'property_type_room', filters: { ...defaultResidentialFilters, showRooms: false } },
        { value: PropertyType.HOUSE, label: 'property_type_house', filters: { ...defaultResidentialFilters, showFloor: false, showTotalFloors: true } },
        { value: PropertyType.TOWNHOUSE, label: 'property_type_townhouse', filters: { ...defaultResidentialFilters, showFloor: false, showTotalFloors: true } },
        { value: PropertyType.LAND, label: 'property_type_land', filters: { showPrice: true, showArea: true } },
        { value: PropertyType.GARAGE, label: 'property_type_garage', filters: { showPrice: true, showArea: true, showCeilingHeight: true } },
      ],
    },
    commercial: {
      propertyTypes: [
        { value: PropertyType.OFFICE, label: 'property_type_office', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.RETAIL, label: 'property_type_retail', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.WAREHOUSE, label: 'property_type_warehouse', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.FREE_PURPOSE, label: 'property_type_free_purpose', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.PUBLIC_CATERING, label: 'property_type_public_catering', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.PRODUCTION, label: 'property_type_production', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.AUTO_SERVICE, label: 'property_type_auto_service', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.BUILDING, label: 'property_type_building', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.READY_BUSINESS, label: 'property_type_ready_business', filters: { showPrice: true } },
        { value: PropertyType.COMMERCIAL_LAND, label: 'property_type_commercial_land', filters: { showPrice: true, showArea: true } },
      ],
    },
  },
  rent: {
    residential: {
      propertyTypes: [
        { value: PropertyType.APARTMENT, label: 'property_type_apartment', filters: { ...defaultResidentialFilters } },
        { value: PropertyType.ROOM, label: 'property_type_room', filters: { ...defaultResidentialFilters, showRooms: false } },
        { value: PropertyType.BED_SPACE, label: 'property_type_bed_space', filters: { showPrice: true, showAllowPets: true, showFurnished: true } },
        { value: PropertyType.HOUSE, label: 'property_type_house', filters: { ...defaultResidentialFilters, showFloor: false, showTotalFloors: true } },
        { value: PropertyType.TOWNHOUSE, label: 'property_type_townhouse', filters: { ...defaultResidentialFilters, showFloor: false, showTotalFloors: true } },
      ],
    },
    commercial: {
      propertyTypes: [
        { value: PropertyType.OFFICE, label: 'property_type_office', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.COWORKING, label: 'property_type_coworking', filters: { showPrice: true, showArea: true } },
        { value: PropertyType.RETAIL, label: 'property_type_retail', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.WAREHOUSE, label: 'property_type_warehouse', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.FREE_PURPOSE, label: 'property_type_free_purpose', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.PUBLIC_CATERING, label: 'property_type_public_catering', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.PRODUCTION, label: 'property_type_production', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.AUTO_SERVICE, label: 'property_type_auto_service', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.BUILDING, label: 'property_type_building', filters: { ...defaultCommercialFilters } },
        { value: PropertyType.COMMERCIAL_LAND, label: 'property_type_commercial_land', filters: { showPrice: true, showArea: true } },
      ],
    },
  },
  rent_daily: {
    residential: {
      propertyTypes: [
        { value: PropertyType.APARTMENT, label: 'property_type_apartment', filters: { ...defaultResidentialFilters, showYearBuilt: false, showBuildingType: false } },
        { value: PropertyType.ROOM, label: 'property_type_room', filters: { ...defaultResidentialFilters, showRooms: false, showYearBuilt: false, showBuildingType: false } },
        { value: PropertyType.BED_SPACE, label: 'property_type_bed_space', filters: { showPrice: true, showAllowPets: true, showFurnished: true } },
        { value: PropertyType.HOUSE, label: 'property_type_house', filters: { ...defaultResidentialFilters, showFloor: false, showTotalFloors: true, showYearBuilt: false, showBuildingType: false } },
      ],
    },
    commercial: {
        propertyTypes: [],
    }
  },
};