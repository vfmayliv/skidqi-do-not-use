import { createClient } from '@supabase/supabase-js';

// Получаем URL и ключ из переменных окружения
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Проверка наличия переменных окружения
if (!supabaseUrl || !supabaseAnonKey) {
  // ВАЖНО: Не выводить ключи в ошибку в продакшене
  console.error('Supabase URL and/or anon key are not defined in environment variables.');
  // Можно выбросить ошибку, чтобы остановить выполнение, если ключи обязательны
  throw new Error("Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.");
}


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
      console.log('Подключение к Supabase успешно!');
    }
  } catch (error) {
    console.error('Критическая ошибка при подключении к Supabase:', error);
  }
})();

// Типы данных для работы с Supabase
export type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  updated_at: string;
};

export type Category = {
  id: number;
  name_ru: string;
  name_kz: string;
  parent_id: number | null;
  slug: string;
  subcategories?: Category[];
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_price?: number;
  images: string[];
  user_id: string;
  category_id: number;
  created_at: string;
  // Дополнительные поля для недвижимости
  deal_type?: 'sale' | 'rent';
  property_type?: string;
  address?: string;
  // ... другие поля
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