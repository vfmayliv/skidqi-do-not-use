import { createClient } from '@supabase/supabase-js';

// Используем актуальные данные проекта из integrations
const supabaseUrl = "https://huzugmkqszfayzhqmbwy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1enVnbWtxc3pmYXl6aHFtYnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjMzMDcsImV4cCI6MjA2NjQzOTMwN30.kJKkKJmwQ_Wbj8dOsB1OJLjQtG6lGqzQ1_eU4smrqFc";

// Создаем клиент Supabase для работы с базой данных
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Тестовый запрос для проверки подключения (асинхронно)
(async () => {
  try {
    // Проверяем подключение - получаем все категории из подключения
    const { error } = await supabase.from('categories').select('*').limit(1);
    if (error) {
      console.error('Ошибка подключения к Supabase:', error);
    } else {
      console.log('Успешное подключение к Supabase');
    }
  } catch (err) {
    console.error('Критическая ошибка при соединении с Supabase:', err);
  }
})();

// Типы для работы с базой данных
export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city_id: number | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string | null;
  parent_id: number | null;
  is_active: boolean;
  created_at: string;
  level: number;
  slug: string;
  ru_name: string;
  kk_name: string;
};

export type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  discount_price: number | null;
  category_id: number;
  city_id: number;
  microdistrict_id: number | null;
  status: 'pending' | 'active' | 'expired' | 'sold' | 'draft';
  condition: string | null;
  images: string[];
  is_premium: boolean;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  views: number;
  discount_percent?: number;
  address?: string;
  coordinates?: { lat: number; lng: number } | null;
};

export type City = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  region_id: number;
  kk_name: string;
  ru_name: string;
  level: number;
  slug: string;
  coordinates?: { lat: number; lng: number } | null;
};

export type Microdistrict = {
  id: number;
  name: string;
  city_id: number;
  is_active: boolean;
  created_at: string;
  kk_name: string;
  ru_name: string;
};

export type Region = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  kk_name: string;
  ru_name: string;
  level: number;
  slug: string;
};

export type Review = {
  id: string;
  user_id: string;
  target_user_id: string;
  listing_id: string | null;
  rating: number;
  comment: string;
  created_at: string;
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

// Вспомогательные функции для работы с Supabase
export const SupabaseHelper = {
  // Проверяем, залогинен ли пользователь
  isLoggedIn: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  // Получаем текущего пользователя
  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // Получаем профиль пользователя
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
