import { createClient } from '@supabase/supabase-js';

// Конфигурация для проекта skidqi-kz
const getSupabaseConfig = () => {
  // Правильные данные для проекта skidqi-kz
  const urlParts = ['https://', 'huzugmkqszfayzhqmbwy', '.supabase.co'];
  
  // Используем правильный anon key для проекта
  const keyParts = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    '.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1enVnbWtxc3pmYXl6aHFtYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjMzMDcsImV4cCI6MjA2NjQzOTMwN30',
    '.kJKkKJmwQ_Wbj8dOsB1OJLjQtG6lGqzQ1_eU4smrqFc'
  ];
  
  return {
    url: urlParts.join(''),
    anonKey: keyParts.join('')
  };
};

// Публичные константы для использования в приложении
export const supabaseUrl = getSupabaseConfig().url;
export const supabaseAnonKey = getSupabaseConfig().anonKey;

// Создаем клиент Supabase для взаимодействия с базой данных
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Добавляем проверку подключения при загрузке
(async () => {
  try {
    // Простая проверка соединения - используем таблицу categories из вашего проекта
    const { error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (err) {
    console.error('Failed to check Supabase connection:', err);
  }
})();

// Типы данных для таблиц в базе данных
export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  city_id: number | null;
  email: string;
};

export type Category = {
  id: number;
  parent_id: number | null;
  name_ru: string;
  name_kz: string;
  slug: string;
  icon: string | null;
  level: number;
  is_active: boolean;
  sort_order: number;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  regular_price: number | null;
  discount_price: number | null;
  discount_percent: number | null;
  is_free: boolean;
  category_id: number | null;
  user_id: string;
  city_id: number | null;
  microdistrict_id: number | null;
  images: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  views: number;
  favorites_count: number;
  is_premium: boolean;
  premium_until: string | null;
};

export type Favorite = {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
};

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string | null;
  content: string;
  created_at: string;
  read: boolean;
};

// Вспомогательные функции для работы с базой данных
export const SupabaseHelper = {
  // Проверить, авторизован ли пользователь
  isLoggedIn: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  // Получить текущего пользователя
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Получить профиль пользователя
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Ошибка при получении профиля:', error);
      return null;
    }

    return data as Profile;
  }
};
