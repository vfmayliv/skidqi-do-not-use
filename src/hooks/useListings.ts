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
  searchQuery?: string;
  isPremium?: boolean;
  isFree?: boolean;
};

// Типы для параметров сортировки
type SortOptions = 'newest' | 'price_asc' | 'price_desc' | 'discount';

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  // Получение всех объявлений с возможностью фильтрации и сортировки
  const getListings = async (
    filters: ListingFilters = {}, 
    sort: SortOptions = 'newest',
    limit: number = 20,
    offset: number = 0
  ) => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'active'); // Только активные объявления

      // Применение фильтров
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.cityId) {
        query = query.eq('city_id', filters.cityId);
      }

      if (filters.microdistrictId) {
        query = query.eq('microdistrict_id', filters.microdistrictId);
      }

      if (filters.priceMin !== undefined) {
        query = query.gte('discount_price', filters.priceMin);
      }

      if (filters.priceMax !== undefined) {
        query = query.lte('discount_price', filters.priceMax);
      }

      if (filters.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }

      if (filters.isPremium !== undefined) {
        query = query.eq('is_premium', filters.isPremium);
      }

      if (filters.isFree !== undefined) {
        query = query.eq('is_free', filters.isFree);
      }

      // Применение сортировки
      switch (sort) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_asc':
          query = query.order('discount_price', { ascending: true });
          break;
        case 'price_desc':
          query = query.order('discount_price', { ascending: false });
          break;
        case 'discount':
          query = query.order('discount_percent', { ascending: false });
          break;
      }

      // Применение пагинации
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setListings(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при загрузке объявлений:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Получение объявления по ID
  const getListingById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
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
      console.error(`Ошибка при загрузке объявления ${id}:`, err);
      return null;
    }
  };

  // Создание нового объявления
  const createListing = async (listingData: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'views'>) => {
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
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Ошибка при создании объявления:', err);
      return null;
    }
  };

  // Обновление объявления
  const updateListing = async (id: string, listingData: Partial<Listing>) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return null;
    }

    try {
      // Проверяем, что пользователь является владельцем объявления
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (existingListing.user_id !== user.id) {
        setError('У вас нет прав на редактирование этого объявления');
        return null;
      }

      const { data, error } = await supabase
        .from('listings')
        .update({
          ...listingData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error(`Ошибка при обновлении объявления ${id}:`, err);
      return null;
    }
  };

  // Удаление объявления
  const deleteListing = async (id: string) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return false;
    }

    try {
      // Проверяем, что пользователь является владельцем объявления
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (existingListing.user_id !== user.id) {
        setError('У вас нет прав на удаление этого объявления');
        return false;
      }

      const { error } = await supabase
        .from('listings')
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
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
    getUserListings,
  };
}
