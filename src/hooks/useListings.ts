
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
      if (key === 'priceRange' && typeof value === 'object') {
        const cleanedRange = {
          min: cleanFilterValue(value.min),
          max: cleanFilterValue(value.max)
        };
        // Добавляем priceRange только если есть хотя бы одно значение
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

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabase();

  // Получение всех объявлений с возможностью фильтрации и сортировки
  const getListings = async (
    filters: ListingFilters = {}, 
    sort: SortOptions = 'newest',
    limit: number = 100,
    offset: number = 0
  ) => {
    setLoading(true);
    setError(null);
    
    // Очищаем фильтры от Zustand proxy объектов
    const cleanedFilters = cleanFilters(filters);
    console.log('🧹 Очищенные фильтры:', cleanedFilters);
    console.log('📊 Загружаем объявления с фильтрами:', cleanedFilters);
    
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          cities(name_ru, name_kz),
          categories(name_ru, name_kz)
        `)
        .eq('status', 'active'); // Только активные объявления

      // Применение фильтров
      if (cleanedFilters.categoryId) {
        console.log('🎯 Фильтр по категории:', cleanedFilters.categoryId);
        query = query.eq('category_id', cleanedFilters.categoryId);
      }

      if (cleanedFilters.cityId) {
        console.log('🏙️ Фильтр по городу:', cleanedFilters.cityId);
        query = query.eq('city_id', cleanedFilters.cityId);
      }

      if (cleanedFilters.microdistrictId) {
        console.log('🏘️ Фильтр по микрорайону:', cleanedFilters.microdistrictId);
        query = query.eq('microdistrict_id', cleanedFilters.microdistrictId);
      }

      // Handle priceRange filter
      if (cleanedFilters.priceRange) {
        const { min, max } = cleanedFilters.priceRange;
        if (min !== undefined && min > 0) {
          console.log('💰 Фильтр мин. цена:', min);
          query = query.gte('discount_price', min);
        }
        if (max !== undefined && max > 0) {
          console.log('💰 Фильтр макс. цена:', max);
          query = query.lte('discount_price', max);
        }
      } else {
        if (cleanedFilters.priceMin !== undefined) {
          console.log('💰 Фильтр мин. цена (старый):', cleanedFilters.priceMin);
          query = query.gte('discount_price', cleanedFilters.priceMin);
        }

        if (cleanedFilters.priceMax !== undefined) {
          console.log('💰 Фильтр макс. цена (старый):', cleanedFilters.priceMax);
          query = query.lte('discount_price', cleanedFilters.priceMax);
        }
      }

      if (cleanedFilters.searchQuery) {
        console.log('🔍 Поиск по тексту:', cleanedFilters.searchQuery);
        query = query.ilike('title', `%${cleanedFilters.searchQuery}%`);
      }

      if (cleanedFilters.isPremium !== undefined) {
        console.log('⭐ Фильтр премиум:', cleanedFilters.isPremium);
        query = query.eq('is_premium', cleanedFilters.isPremium);
      }

      if (cleanedFilters.isFree !== undefined) {
        console.log('🆓 Фильтр бесплатно:', cleanedFilters.isFree);
        query = query.eq('is_free', cleanedFilters.isFree);
      }

      if (cleanedFilters.condition && cleanedFilters.condition !== 'any') {
        console.log('📦 Фильтр состояние:', cleanedFilters.condition);
        query = query.ilike('description', `%${cleanedFilters.condition}%`);
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

      console.log('🚀 Выполняем запрос к Supabase...');
      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Ошибка Supabase:', error);
        throw error;
      }

      console.log(`✅ Загруженные объявления (${data?.length || 0} из базы данных):`, data);
      
      // Дополнительная проверка: загружаем общее количество объявлений для категории
      if (cleanedFilters.categoryId) {
        const { count: totalCount } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cleanedFilters.categoryId)
          .eq('status', 'active');
        
        console.log(`📊 Общее количество объявлений в категории ${cleanedFilters.categoryId}:`, totalCount);
      }

      // Дополнительная отладочная информация
      if (data && data.length > 0) {
        console.log('📋 Первое объявление:', data[0]);
        console.log('🏷️ Категории объявлений:', data.map(d => d.category_id));
      } else {
        console.warn('⚠️ Объявления не найдены. Проверяем параметры запроса...');
        
        // Дополнительный запрос без фильтров для диагностики
        const { data: allListings } = await supabase
          .from('listings')
          .select('id, title, category_id, status')
          .limit(5);
        
        console.log('🔍 Всего объявлений в базе (первые 5):', allListings);
      }

      setListings(data || []);
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('💥 Ошибка при загрузке объявлений:', err);
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
        .select(`
          *,
          cities(name_ru, name_kz),
          categories(name_ru, name_kz)
        `)
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
