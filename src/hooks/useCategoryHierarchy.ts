
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

  const buildCategoryTree = (mainCategories: any[], subCategories: any[]): CategoryNode[] => {
    const categoryMap = new Map();
    
    // First pass: create main category objects
    mainCategories.forEach(cat => {
      categoryMap.set(cat.id.toString(), {
        id: cat.id.toString(),
        name: { ru: cat.name_ru, kz: cat.name_kz },
        subcategories: []
      });
    });
    
    // Second pass: create subcategory objects and map them
    const subCategoryMap = new Map();
    subCategories.forEach(cat => {
      const categoryNode = {
        id: cat.id,
        name: { ru: cat.name_ru, kz: cat.name_kz },
        subcategories: []
      };
      subCategoryMap.set(cat.id, categoryNode);
    });
    
    // Third pass: build parent-child relationships for subcategories
    subCategories.forEach(cat => {
      const categoryNode = subCategoryMap.get(cat.id);
      
      if (cat.parent_id) {
        const parent = subCategoryMap.get(cat.parent_id);
        if (parent) {
          parent.subcategories.push(categoryNode);
        }
      }
    });
    
    // Fourth pass: attach top-level subcategories to main categories based on correct mapping
    const mainCategoryNodes = Array.from(categoryMap.values());
    
    // Get root subcategories (those without parent_id) and distribute them
    const rootSubCategories = subCategories.filter(cat => !cat.parent_id);
    rootSubCategories.forEach(subCat => {
      const subCategoryNode = subCategoryMap.get(subCat.id);
      if (subCategoryNode && mainCategoryNodes.length > 0) {
        // Find the correct main category based on name mapping
        const targetMainCategory = mainCategoryNodes.find(main => {
          const mainNameRu = main.name.ru.toLowerCase();
          
          // Mapping based on the provided correspondence
          if (mainNameRu.includes('аптек') && subCat.name_ru.toLowerCase().includes('лекарств')) return true;
          if (mainNameRu.includes('техника') && subCat.name_ru.toLowerCase().includes('электроника')) return true;
          if (mainNameRu.includes('мода') && subCat.name_ru.toLowerCase().includes('одежд')) return true;
          if (mainNameRu.includes('детям') && subCat.name_ru.toLowerCase().includes('детск')) return true;
          if (mainNameRu.includes('продукт') && subCat.name_ru.toLowerCase().includes('продукт')) return true;
          if (mainNameRu.includes('хобби') && subCat.name_ru.toLowerCase().includes('спорт')) return true;
          if (mainNameRu.includes('зоотовар') && subCat.name_ru.toLowerCase().includes('животн')) return true;
          if (mainNameRu.includes('красота') && subCat.name_ru.toLowerCase().includes('красот')) return true;
          if (mainNameRu.includes('услуг') && subCat.name_ru.toLowerCase().includes('услуг')) return true;
          if (mainNameRu.includes('дом') && subCat.name_ru.toLowerCase().includes('дом')) return true;
          
          return false;
        });
        
        if (targetMainCategory) {
          targetMainCategory.subcategories.push(subCategoryNode);
        }
      }
    });
    
    return mainCategoryNodes;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, fetch main categories from the categories table
        const { data: mainCategories, error: mainError } = await supabase
          .from('categories')
          .select('id, name_ru, name_kz')
          .eq('is_active', true)
          .order('sort_order');

        if (mainError) {
          throw mainError;
        }

        // Then fetch subcategories from specialized tables based on correct mapping
        const categoryTableMapping: { [key: string]: CategoryTableName } = {
          'Аптеки': 'pharmacy_categories',
          'Техника и Электроника': 'tech_electronics_categories',
          'Мода и Стиль': 'fashion_style_categories',
          'Детям': 'children_categories',
          'Продукты Питания': 'food_categories',
          'Хобби и Спорт': 'hobbies_categories',
          'Зоотовары': 'pet_categories',
          'Красота и Здоровье': 'beauty_categories',
          'Услуги': 'services_categories',
          'Все для Дома и Дачи': 'home_categories'
        };

        const allSubCategories: any[] = [];

        // Only fetch from tables that have corresponding main categories
        for (const [mainCategoryName, tableName] of Object.entries(categoryTableMapping)) {
          const hasMainCategory = mainCategories?.some(cat => 
            cat.name_ru === mainCategoryName || 
            cat.name_ru.includes(mainCategoryName.split(' ')[0])
          );
          
          if (hasMainCategory) {
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
                allSubCategories.push(...data);
              }
            } catch (err) {
              console.warn(`Failed to fetch from ${tableName}:`, err);
            }
          }
        }

        const categoryTree = buildCategoryTree(mainCategories || [], allSubCategories);
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
