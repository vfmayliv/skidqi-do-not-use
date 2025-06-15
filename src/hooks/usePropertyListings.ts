
import { useState } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { PropertyListingFilters } from '@/utils/filterTypeConverters';

// Sort options for property listings
type PropertySortOptions = 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';

export function usePropertyListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { supabase, user } = useSupabase();

  // Clean filter values from Zustand proxy objects
  const cleanFilterValue = (value: any): any => {
    if (value && typeof value === 'object' && value._type === 'undefined') {
      return undefined;
    }
    if (value && typeof value === 'object' && value.value !== undefined) {
      return value.value;
    }
    return value;
  };

  // Clean filters object
  const cleanFilters = (filters: any): PropertyListingFilters => {
    const cleaned: any = {};
    
    Object.keys(filters).forEach(key => {
      const value = cleanFilterValue(filters[key]);
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'priceRange' && typeof value === 'object') {
          const cleanedRange = {
            min: cleanFilterValue(value.min),
            max: cleanFilterValue(value.max)
          };
          if (cleanedRange.min !== undefined || cleanedRange.max !== undefined) {
            cleaned[key] = cleanedRange;
          }
        } else if (key === 'areaRange' && typeof value === 'object') {
          const cleanedRange = {
            min: cleanFilterValue(value.min),
            max: cleanFilterValue(value.max)
          };
          if (cleanedRange.min !== undefined || cleanedRange.max !== undefined) {
            cleaned[key] = cleanedRange;
          }
        } else if (key === 'floorRange' && typeof value === 'object') {
          const cleanedRange = {
            min: cleanFilterValue(value.min),
            max: cleanFilterValue(value.max)
          };
          if (cleanedRange.min !== undefined || cleanedRange.max !== undefined) {
            cleaned[key] = cleanedRange;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  };

  // Main function to get property listings
  const getPropertyListings = async (
    filters: PropertyListingFilters = {}, 
    sort: PropertySortOptions = 'newest',
    limit: number = 50,
    offset: number = 0
  ) => {
    setLoading(true);
    setError(null);
    
    const cleanedFilters = cleanFilters(filters);
    console.log('🏠 Loading property listings with filters:', cleanedFilters);
    
    try {
      // Prepare parameters for the search function
      const searchParams = {
        p_limit: limit,
        p_offset: offset,
        p_property_types: cleanedFilters.propertyTypes && cleanedFilters.propertyTypes.length > 0 ? cleanedFilters.propertyTypes : null,
        p_deal_type: cleanedFilters.dealType || null,
        p_min_price: cleanedFilters.priceRange?.min || null,
        p_max_price: cleanedFilters.priceRange?.max || null,
        p_min_area: cleanedFilters.areaRange?.min || null,
        p_max_area: cleanedFilters.areaRange?.max || null,
        p_min_rooms: null,
        p_max_rooms: null,
        p_min_floor: cleanedFilters.floorRange?.min || null,
        p_max_floor: cleanedFilters.floorRange?.max || null,
        p_city_id: cleanedFilters.cityId || null,
        p_region_id: cleanedFilters.regionId || null,
        p_microdistrict_id: cleanedFilters.microdistrictId || null,
        p_building_types: cleanedFilters.buildingTypes && cleanedFilters.buildingTypes.length > 0 ? cleanedFilters.buildingTypes : null,
        p_renovation_types: cleanedFilters.renovationTypes && cleanedFilters.renovationTypes.length > 0 ? cleanedFilters.renovationTypes : null,
        p_bathroom_types: cleanedFilters.bathroomTypes && cleanedFilters.bathroomTypes.length > 0 ? cleanedFilters.bathroomTypes : null,
        p_has_photo: cleanedFilters.hasPhoto || null,
        p_furnished: cleanedFilters.furnished || null,
        p_allow_pets: cleanedFilters.allowPets || null,
        p_has_parking: cleanedFilters.hasParking || null,
        p_has_balcony: cleanedFilters.hasBalcony || null,
        p_has_elevator: cleanedFilters.hasElevator || null,
        p_sort_by: mapSortOption(sort),
        p_sort_order: 'desc'
      };

      console.log('📊 Search parameters for property listings:', searchParams);

      // Call the search function
      const { data, error } = await supabase.rpc('search_property_listings', searchParams);

      if (error) {
        console.error('❌ Error loading property listings:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} property listings`);
      
      if (data && data.length > 0) {
        setTotalCount(data[0].total_count || 0);
        console.log(`📊 Total property listings count: ${data[0].total_count}`);
      } else {
        setTotalCount(0);
      }

      setListings(data || []);
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      console.error('💥 Error loading property listings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Map sort options to SQL function parameters
  const mapSortOption = (sort: PropertySortOptions): string => {
    switch (sort) {
      case 'price_asc':
        return 'price_asc';
      case 'price_desc':
        return 'price_desc';
      case 'area_asc':
        return 'area_asc';
      case 'area_desc':
        return 'area_desc';
      case 'newest':
      default:
        return 'created_at';
    }
  };

  // Get property listing by ID
  const getPropertyListingById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          cities(name_ru, name_kz),
          categories(name_ru, name_kz)
        `)
        .eq('id', id)
        .eq('status', 'active')
        .not('property_type', 'is', null) // Only property listings
        .single();

      if (error) {
        throw error;
      }

      // Increment view count
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);

      return data;
    } catch (err: any) {
      console.error(`Error loading property listing ${id}:`, err);
      return null;
    }
  };

  // Create new property listing
  const createPropertyListing = async (listingData: any) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          user_id: user.id,
          views: 0,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating property listing:', err);
      return null;
    }
  };

  return {
    listings,
    loading,
    error,
    totalCount,
    getPropertyListings,
    getPropertyListingById,
    createPropertyListing,
  };
}
