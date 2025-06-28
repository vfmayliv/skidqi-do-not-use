import { supabase } from './supabase';
import { DealType, Segment, PropertyType, Filter, FilterOption } from '@/types/filters';

export interface FullFilterConfig {
  id: string;
  name_ru: string;
  name_kz: string;
  type: 'range' | 'select' | 'boolean';
  meta?: any;
  options?: FilterOption[];
}

export interface PropertyTypeWithFilters {
  id: string;
  name_ru: string;
  name_kz: string;
  filters: FullFilterConfig[];
}

export interface SegmentWithPropertyTypes {
  id: string;
  name_ru: string;
  name_kz: string;
  property_types: PropertyTypeWithFilters[];
}

// Define the expected shape of the Supabase query result
interface PropertyTypeFilterResult {
  property_types: {
    id: string;
    name_ru: string;
    name_kz: string;
    segment_id: string;
    segments: {
      id: string;
      name_ru: string;
      name_kz: string;
    };
  };
  filters: {
    id: string;
    name_ru: string;
    name_kz: string;
    type: string;
    meta?: any;
    filter_options: {
      id: number;
      filter_id: string;
      value: string;
      name_ru: string;
      name_kz: string;
    }[];
  };
}

export async function getFiltersForDeal(dealTypeId: string): Promise<SegmentWithPropertyTypes[]> {
  console.log('🔍 Fetching filters for deal type:', dealTypeId);
  
  try {
    // 1. Fetch all property types associated with the deal type
    console.log('📊 Querying property_type_filters table...');
    const { data: pt_filters, error: ptError } = await supabase
      .from('property_type_filters')
      .select('property_types(*, segments(*)), filters(*, filter_options(*))')
      .eq('deal_type_id', dealTypeId);

    if (ptError) {
      console.error('❌ Error fetching property type filters:', ptError.message);
      return [];
    }

    console.log(`✅ Successfully fetched ${pt_filters?.length || 0} property type filters`);
    console.log('📊 Sample data:', pt_filters && pt_filters.length > 0 ? JSON.stringify(pt_filters[0], null, 2) : 'No data');

    if (!pt_filters || pt_filters.length === 0) {
      console.warn('⚠️ No filters found for deal type:', dealTypeId);
      return [];
    }

    // Process the results
    const segmentsMap = new Map<string, SegmentWithPropertyTypes>();

    // Process each property type filter to build the result structure
    for (const item of pt_filters as PropertyTypeFilterResult[]) {
      const { property_types: propertyType, filters: filter } = item;
      const segment = propertyType.segments;

      // Ensure segment exists in map
      if (!segmentsMap.has(segment.id)) {
        segmentsMap.set(segment.id, {
          id: segment.id,
          name_ru: segment.name_ru,
          name_kz: segment.name_kz,
          property_types: [],
        });
      }

      const currentSegment = segmentsMap.get(segment.id)!;

      // Ensure property type exists in segment
      let currentPropertyType = currentSegment.property_types.find(pt => pt.id === propertyType.id);
      if (!currentPropertyType) {
        currentPropertyType = {
          id: propertyType.id,
          name_ru: propertyType.name_ru,
          name_kz: propertyType.name_kz,
          filters: [],
        };
        currentSegment.property_types.push(currentPropertyType);
      }

      // Add filter to property type
      const existingFilter = currentPropertyType.filters.find(f => f.id === filter.id);
      if (!existingFilter) {
          currentPropertyType.filters.push({
              id: filter.id,
              name_ru: filter.name_ru,
              name_kz: filter.name_kz,
              type: filter.type as 'range' | 'select' | 'boolean',
              meta: filter.meta,
              options: filter.filter_options || [],
          });
      }
    }

    const result = Array.from(segmentsMap.values());
    console.log(`✅ Processed data: ${result.length} segments with filters`);
    return result;
  } catch (err) {
    console.error('❌ Unexpected error in getFiltersForDeal:', err);
    return [];
  }
}