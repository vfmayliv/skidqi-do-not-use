
import { supabase } from '@/lib/supabase';
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
  try {
    console.log('Fetching filters for deal type:', dealTypeId);
    
    // 1. Fetch all property types associated with the deal type
    const { data: pt_filters, error: ptError } = await supabase
      .from('property_type_filters')
      .select(`
        property_types!inner(
          id,
          name_ru,
          name_kz,
          segment_id,
          segments!inner(
            id,
            name_ru,
            name_kz
          )
        ),
        filters!inner(
          id,
          name_ru,
          name_kz,
          type,
          meta,
          filter_options(
            id,
            filter_id,
            value,
            name_ru,
            name_kz
          )
        )
      `)
      .eq('deal_type_id', dealTypeId);

    if (ptError) {
      console.error('Error fetching property type filters:', ptError);
      return [];
    }

    if (!pt_filters || !Array.isArray(pt_filters)) {
      console.log('No filters found for deal type:', dealTypeId);
      return [];
    }

    console.log('Found filters:', pt_filters.length);

    // 2. Group by segment and then by property type
    const segmentsMap = new Map<string, SegmentWithPropertyTypes>();

    for (const item of pt_filters as PropertyTypeFilterResult[]) {
      const segment = item.property_types?.segments;
      const propertyType = item.property_types;
      const filter = item.filters;

      if (!segment || !propertyType || !filter) continue;

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
    console.log('Processed segments:', result.length);
    return result;
  } catch (error) {
    console.error('Error in getFiltersForDeal:', error);
    return [];
  }
}
