import { useState } from 'react';
import { supabase, Listing } from '@/lib/supabase';
import { useSupabase } from '@/contexts/SupabaseContext';

// Типы для параметров фильтрации объявлений
type ListingFilters = {
  categoryId?: number;
  cityId?: number;
  microdistrictId?: number;
  priceMin?: number;
  priceMax?: number;
  priceRange?: { min?: number; max?: number; };
  condition?: string;
  searchQuery?: string;
  isPremium?: boolean;
  isFree?: boolean;
};

// Типы для параметров сортировки
type SortOptions = 'newest' | 'price_asc' | 'price_desc' | 'discount';

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
const cleanFilters = (filters: any): ListingFilters => {
  const cleaned: any = {};
  
  Object.keys(filters).forEach(key => {
    const value = cleanFilterValue(filters[key]);
    if (value !== undefined && value !== null && value !== '') {
      // Особая обработка для priceRange
      if (key === 'priceRange') {
        const priceMin = cleanFilterValue(value.min);
        const priceMax = cleanFilterValue(value.max);
        if (priceMin !== undefined) {
          cleaned['priceMin'] = priceMin;
        }
        if (priceMax !== undefined) {
          cleaned['priceMax'] = priceMax;
        }
      } else {
        cleaned[key] = value;
      }
    }
  });

  return cleaned;
};

// Interface for pagination metadata
type PaginationMeta = {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
};

export function useListings() {
  const { supabaseClient: supabase, user } = useSupabase();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);

  // Get all listings with filtering, sorting, and pagination
  const getListings = async (filters: ListingFilters = {}, sort: SortOptions = 'newest', page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      // Очистить фильтры от вредных Zustand proxy
      const cleanedFilters = cleanFilters(filters);
      console.log('Cleaned Filters:', cleanedFilters);

      let query = supabase.from('listings').select(`
        id,
        title,
        description,
        regular_price,
        discount_price,
        discount_percent,
        is_free,
        user_id,
        city_id,
        microdistrict_id,
        images,
        status,
        created_at,
        updated_at,
        expires_at,
        views,
        phone,
        is_premium,
        category_id,
        source_link,
        address,
        latitude,
        longitude,
        area,
        rooms,
        floor,
        total_floors,
        deal_type,
        property_type,
        building_type,
        renovation_type,
        bathroom_type,
        year_built,
        ceiling_height,
        has_balcony,
        has_elevator,
        has_parking,
        allow_pets,
        furnished,
        utilities_included,
        security_guarded,
        has_playground,
        has_separate_entrance,
        is_corner,
        is_studio,
        region_id,
        district_id
      `, { count: 'exact' });

      // Аппалы фильтров
      if (cleanedFilters.categoryId) {
        query = query.eq('category_id', cleanedFilters.categoryId);
      }
      if (cleanedFilters.cityId) {
        query = query.eq('city_id', cleanedFilters.cityId);
      }
      if (cleanedFilters.microdistrictId) {
        query = query.eq('microdistrict_id', cleanedFilters.microdistrictId);
      }
      if (cleanedFilters.priceMin) {
        query = query.gte('regular_price', cleanedFilters.priceMin);
      }
      if (cleanedFilters.priceMax) {
        query = query.lte('regular_price', cleanedFilters.priceMax);
      }
      if (cleanedFilters.condition) {
        // Поддержим для condition
      }
      if (cleanedFilters.searchQuery) {
        query = query.ilike('title', `%${cleanedFilters.searchQuery}%`);
      }
      if (cleanedFilters.isPremium !== undefined) {
        query = query.eq('is_premium', cleanedFilters.isPremium);
      }
      if (cleanedFilters.isFree !== undefined) {
        query = query.eq('is_free', cleanedFilters.isFree);
      }
      
      // Сортировка
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sort === 'price_asc') {
        query = query.order('regular_price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('regular_price', { ascending: false });
      }
      // TODO: добедите сортировка по диргонта
      
      // Панация
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      setListings(data as Listing[] || []);
      setPaginationMeta({
        totalItems: count || 0,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil((count || 0) / limit),
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get a single listing by ID
  const getListingById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
      
      if (error) {
        throw error;
      }

      return data as Listing | null;
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching listing by ID: ', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new listing
  const createListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from('listings').insert([listingData]).select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setListings(op => [...op, data[0]]);
        return data[0] as Listing;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating listing:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing listing
  const updateListing = async (id: string, listingData: Partial<Listing>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from('listings').update(listingData).eq('id', id).select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setListings(op => op.map(l => (l.id === id ? data[0] : l)));
        return data[0] as Listing;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating listing:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a listing
  const deleteListing = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (err: any) {
      setError(err.message);
      console.error(`Ошибка при удалении объявления ${id}:`, err);
      return false;
    }
  };

  // Получение объявлений текущего пользователя
  const getUserListings = async () => {
    if (!user) {
      setError('Пользователь не авторизован');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке объявлений пользователя:', err);
      return [];
    }
  };

  return {
    listings,
    loading,
    error,
    paginationMeta,
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    getUserListings,
  };
}
