import { PropertyType } from '@/types/listingType';

export interface PropertyTypeOption {
  value: PropertyType;
  label: string; // Translation key
}

export interface FilterConfig {
  propertyTypes: PropertyTypeOption[];
}

export const filtersConfig: Record<string, Record<string, FilterConfig>> = {
  buy: {
    residential: {
      propertyTypes: [
        { value: PropertyType.NEW_BUILDING, label: 'property_type_new_building' },
        { value: PropertyType.SECONDARY, label: 'property_type_secondary' },
        { value: PropertyType.ROOM, label: 'property_type_room' },
        { value: PropertyType.HOUSE, label: 'property_type_house' },
        { value: PropertyType.TOWNHOUSE, label: 'property_type_townhouse' },
        { value: PropertyType.LAND, label: 'property_type_land' },
        { value: PropertyType.GARAGE, label: 'property_type_garage' },
      ],
    },
    commercial: {
      propertyTypes: [
        { value: PropertyType.OFFICE, label: 'property_type_office' },
        { value: PropertyType.RETAIL, label: 'property_type_retail' },
        { value: PropertyType.WAREHOUSE, label: 'property_type_warehouse' },
        { value: PropertyType.FREE_PURPOSE, label: 'property_type_free_purpose' },
        { value: PropertyType.PUBLIC_CATERING, label: 'property_type_public_catering' },
        { value: PropertyType.PRODUCTION, label: 'property_type_production' },
        { value: PropertyType.AUTO_SERVICE, label: 'property_type_auto_service' },
        { value: PropertyType.BUILDING, label: 'property_type_building' },
        { value: PropertyType.READY_BUSINESS, label: 'property_type_ready_business' },
        { value: PropertyType.COMMERCIAL_LAND, label: 'property_type_commercial_land' },
      ],
    },
  },
  rent: {
    residential: {
      propertyTypes: [
        { value: PropertyType.APARTMENT, label: 'property_type_apartment' },
        { value: PropertyType.ROOM, label: 'property_type_room' },
        { value: PropertyType.BED_SPACE, label: 'property_type_bed_space' },
        { value: PropertyType.HOUSE, label: 'property_type_house' },
        { value: PropertyType.TOWNHOUSE, label: 'property_type_townhouse' },
      ],
    },
    commercial: {
      propertyTypes: [
        { value: PropertyType.OFFICE, label: 'property_type_office' },
        { value: PropertyType.COWORKING, label: 'property_type_coworking' },
        { value: PropertyType.RETAIL, label: 'property_type_retail' },
        { value: PropertyType.WAREHOUSE, label: 'property_type_warehouse' },
        { value: PropertyType.FREE_PURPOSE, label: 'property_type_free_purpose' },
        { value: PropertyType.PUBLIC_CATERING, label: 'property_type_public_catering' },
        { value: PropertyType.PRODUCTION, label: 'property_type_production' },
        { value: PropertyType.AUTO_SERVICE, label: 'property_type_auto_service' },
        { value: PropertyType.BUILDING, label: 'property_type_building' },
        { value: PropertyType.COMMERCIAL_LAND, label: 'property_type_commercial_land' },
      ],
    },
  },
  rent_daily: {
    residential: {
      propertyTypes: [
        { value: PropertyType.APARTMENT, label: 'property_type_apartment' },
        { value: PropertyType.ROOM, label: 'property_type_room' },
        { value: PropertyType.BED_SPACE, label: 'property_type_bed_space' },
        { value: PropertyType.HOUSE, label: 'property_type_house' },
      ],
    },
    commercial: {
        propertyTypes: [], // Assuming no daily rent for commercial, can be filled if needed
    }
  },
};
