import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

// Компонент для одной кнопки категории
const CategoryButton = ({ category }: { category: Category }) => {
  const { language, t } = useAppWithTranslations();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  // ID категорий, которые являются ссылками, а не выпадающими меню
  // Также исключаем "Бесплатно" - найдем его ID по slug
  const excludedSlugs = ['property', 'transport', 'free'];

  // Получаем подкатегории для данной категории
  const { categories: subcategories, loading: subcategoriesLoading } = useSubcategories(category.id);

  // Получаем компонент иконки из библиотеки lucide-react
  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName) return LucideIcons.HelpCircle;
    
    // Конвертируем имя иконки в формат PascalCase
    // например 'shopping-cart' -> 'ShoppingCart'
    const formattedIconName = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('');
    
    // @ts-ignore - Динамический доступ к компонентам
    return LucideIcons[formattedIconName] || LucideIcons.HelpCircle;
  };

  const IconComponent = getIconComponent(category.icon_url);

  // Если slug категории в списке исключен, то будет просто ссылка 
  if (excludedSlugs.includes(category.slug)) {
    return (
      <Link to={`/listings/${category.slug}`} className="text-center">
        <Button variant="ghost" className="h-auto p-2 flex flex-col items-center justify-center">
          <IconComponent className="w-8 h-8 mb-2" />
          <span className="text-xs">{category.name}</span>
        </Button>
      </Link>
    );
  }

  // для всея остальных бакслов Поповер
  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 flex flex-col items-center justify-center">
          <IconComponent className="w-8 h-8 mb-2" />
          <span className="text-xs">{category.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2">
        {subcategoriesLoading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="grid gap-2">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/listings/${subcategory.slug}`}
                className="block px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => setPopoverOpen(false)}
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default function CategoryMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Ошибка при загрузке категорий:', error);
          return;
        }

        setCategories(data || []);
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">Загрузка категорий...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-4">
      <div className="container mx-auto px-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-4">
        {categories.map(category => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}