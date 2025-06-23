
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
    
    // Fourth pass: attach top-level subcategories to main categories
    // This is a simplified mapping - you may need to adjust based on your data structure
    const mainCategoryNodes = Array.from(categoryMap.values());
    
    // Get root subcategories (those without parent_id) and distribute them
    const rootSubCategories = subCategories.filter(cat => !cat.parent_id);
    rootSubCategories.forEach(subCat => {
      const subCategoryNode = subCategoryMap.get(subCat.id);
      if (subCategoryNode && mainCategoryNodes.length > 0) {
        // For now, we'll add subcategories to main categories based on a simple logic
        // You might want to add a mapping field in your database to properly associate them
        const targetMainCategory = mainCategoryNodes.find(main => 
          main.name.ru.toLowerCase().includes('дети') && subCat.name_ru.includes('Детские') ||
          main.name.ru.toLowerCase().includes('красота') && subCat.name_ru.includes('Красота') ||
          main.name.ru.toLowerCase().includes('мода') && subCat.name_ru.includes('Одежда') ||
          main.name.ru.toLowerCase().includes('еда') && subCat.name_ru.includes('Еда') ||
          main.name.ru.toLowerCase().includes('техника') && subCat.name_ru.includes('Техника') ||
          main.name.ru.toLowerCase().includes('дом') && subCat.name_ru.includes('Дом') ||
          main.name.ru.toLowerCase().includes('услуги') && subCat.name_ru.includes('Услуги') ||
          main.name.ru.toLowerCase().includes('животные') && subCat.name_ru.includes('Животные') ||
          main.name.ru.toLowerCase().includes('хобби') && subCat.name_ru.includes('Хобби') ||
          main.name.ru.toLowerCase().includes('аптека') && subCat.name_ru.includes('Аптека')
        ) || mainCategoryNodes[0]; // fallback to first category
        
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

        // Then fetch subcategories from specialized tables
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

        const allSubCategories: any[] = [];

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
              allSubCategories.push(...data);
            }
          } catch (err) {
            console.warn(`Failed to fetch from ${tableName}:`, err);
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
