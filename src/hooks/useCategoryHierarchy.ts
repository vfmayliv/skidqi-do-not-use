
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryNode {
  id: string;
  name: { ru: string; kz: string };
  subcategories?: CategoryNode[];
}

type CategoryTableName = 
  | 'children_categories'
  | 'pharmacy_categories' 
  | 'fashion_style_categories'
  | 'food_categories'
  | 'tech_electronics_categories'
  | 'home_categories'
  | 'services_categories'
  | 'pet_categories'
  | 'hobbies_categories'
  | 'beauty_categories';

export function useCategoryHierarchy() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildCategoryTree = (flatCategories: any[]): CategoryNode[] => {
    const categoryMap = new Map();
    
    // First pass: create all category objects
    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: { ru: cat.name_ru, kz: cat.name_kz },
        subcategories: []
      });
    });
    
    // Second pass: build parent-child relationships
    const rootCategories: CategoryNode[] = [];
    
    flatCategories.forEach(cat => {
      const categoryNode = categoryMap.get(cat.id);
      
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.subcategories.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });
    
    return rootCategories;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // List of category tables to fetch from
        const categoryTables: CategoryTableName[] = [
          'children_categories',
          'pharmacy_categories', 
          'fashion_style_categories',
          'food_categories',
          'tech_electronics_categories',
          'home_categories',
          'services_categories',
          'pet_categories',
          'hobbies_categories',
          'beauty_categories'
        ];

        const allCategories: any[] = [];

        for (const tableName of categoryTables) {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('id, name_ru, name_kz, parent_id, level')
              .order('level', { ascending: true });

            if (error) {
              console.warn(`Error fetching from ${tableName}:`, error);
              continue;
            }

            if (data) {
              allCategories.push(...data);
            }
          } catch (err) {
            console.warn(`Failed to fetch from ${tableName}:`, err);
          }
        }

        const categoryTree = buildCategoryTree(allCategories);
        setCategories(categoryTree);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
