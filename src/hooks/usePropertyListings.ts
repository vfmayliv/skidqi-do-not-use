
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/contexts/SupabaseContext';

// Типы для фильтров недвижимости
type PropertyListingFilters = {
  propertyTypes?: string[];
  dealType?: string;
  priceRange?: { min?: number; max?: number; };
  areaRange?: { min?: number; max?: number; };
  floorRange?: { min?: number; max?: number; };
  cityId?: number;
  regionId?: number;
  microdistrictId?: number;
  buildingTypes?: string[];
  renovationTypes?: string[];
  bathroomTypes?: string[];
  hasPhoto?: boolean;
  furnished?: boolean;
  allowPets?: boolean;
  hasParking?: boolean;
  hasBalcony?: boolean;
  hasElevator?: boolean;
  sortBy?: string;
};

// Типы для параметров сортировки
type PropertySortOptions = 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';

export function usePropertyListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useSupabase();

  // Функция для очистки значений от Zustand proxy объектов
  const cleanFilterValue = (value: any): any => {
    if (value && typeof value === 'object' && value._type === 'undefined') {
      return undefined;
    }
    if (value && typeof value === 'object' && value.value !== undefined) {
      return value.value;
    }
    return value;
  };

  // Функция для очистки объекта фильтров
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

  // Основная функция для получения объявлений недвижимости
  const getPropertyListings = async (
    filters: PropertyListingFilters = {}, 
    sort: PropertySortOptions = 'newest',
    limit: number = 50,
    offset: number = 0
  ) => {
    setLoading(true);
    setError(null);
    
    const cleanedFilters = cleanFilters(filters);
    console.log('🏠 Загружаем объявления недвижимости с фильтрами:', cleanedFilters);
    
    try {
      // Подготавливаем параметры для функции поиска
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

      console.log('📊 Параметры поиска недвижимости:', searchParams);

      // Вызываем функцию поиска
      const { data, error } = await supabase.rpc('search_property_listings', searchParams);

      if (error) {
        console.error('❌ Ошибка при загрузке объявлений недвижимости:', error);
        throw error;
      }

      console.log(`✅ Загружено объявлений недвижимости: ${data?.length || 0}`);
      
      if (data && data.length > 0) {
        setTotalCount(data[0].total_count || 0);
        console.log(`📊 Общее количество объявлений: ${data[0].total_count}`);
      }

      setListings(data || []);
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('💥 Ошибка при загрузке объявлений недвижимости:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Функция для маппинга типов сортировки
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

  // Получение объявления недвижимости по ID
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
        .not('property_type', 'is', null) // Только объявления недвижимости
        .single();

      if (error) {
        throw error;
      }

      // Увеличиваем счётчик просмотров
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);

      return data;
    } catch (err: any) {
      console.error(`Ошибка при загрузке объявления недвижимости ${id}:`, err);
      return null;
    }
  };

  // Создание нового объявления недвижимости
  const createPropertyListing = async (listingData: any) => {
    if (!user) {
      setError('Пользователь не авторизован');
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
      console.error('Ошибка при создании объявления недвижимости:', err);
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
