
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface HomeCategory {
  id: string;
  parent_id: string | null;
  name_ru: string;
  name_kz: string;
  slug: string;
  level: number;
  parent_name_ru?: string;
  created_at?: string;
  updated_at?: string;
}

export function useHomeCategories() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('home_categories')
          .select('*')
          .order('level', { ascending: true })
          .order('name_ru', { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Ошибка при загрузке категорий дома и дачи:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
