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

export async function getFiltersForDeal(dealTypeId: string): Promise<SegmentWithPropertyTypes[]> {
  // 1. Fetch all property types associated with the deal type
  const { data: pt_filters, error: ptError } = await supabase
    .from('property_type_filters')
    .select('property_types(*, segments(*)), filters(*, filter_options(*))')
    .eq('deal_type_id', dealTypeId);

  if (ptError) {
    console.error('Error fetching property type filters:', ptError);
    return [];
  }

  // 2. Group by segment and then by property type
  const segmentsMap = new Map<string, SegmentWithPropertyTypes>();

  for (const item of pt_filters) {
    const segment = item.property_types.segments;
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
            type: filter.type,
            meta: filter.meta,
            options: filter.filter_options || [],
        });
    }
  }

  return Array.from(segmentsMap.values());
}
