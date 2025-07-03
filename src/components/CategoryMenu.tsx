import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/types/category';

// Простая иконка по умолчанию
const DefaultIcon = ({ className }: { className?: string }) => <HelpCircle className={className} />;

// Компонент для одной кнопки категории
const CategoryButton = ({ category }: { category: Category }) => {
  const { language, t } = useAppWithTranslations();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  // ID категорий, которые являются ссылками, а не выпадающими меню
  const linkCategories = [1, 2]; // Недвижимость и Транспорт
  // Также исключаем "Бесплатно" - найдем его ID по slug
  const excludedSlugs = ['property', 'transport', 'free'];

  // Получаем подкатегории для данной категории
  const { categories: subcategories, loading: subcategoriesLoading } = useSubcategories(category.id);

  // Если это одна из специальных категорий, рендерим как простую ссылку
  if (linkCategories.includes(category.id) || excludedSlugs.includes(category.slug)) {
    return (
      <Link to={`/${category.slug}`} className="text-center">
        <Button variant="ghost" className="flex flex-col items-center w-full h-auto py-2">
          <DefaultIcon className="w-8 h-8 mb-1" />
          <span className="text-xs">{category.name}</span>
        </Button>
      </Link>
    );
  }

  // Для остальных категорий рендерим с выпадающим меню подкатегорий
  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center w-full h-auto py-2"
          onClick={() => setPopoverOpen(true)}
        >
          <DefaultIcon className="w-8 h-8 mb-1" />
          <span className="text-xs">{category.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="center">
        <div className="grid gap-1">
          <h3 className="font-medium mb-2 text-center">{category.name}</h3>
          {subcategoriesLoading ? (
            <div className="text-center py-2">Загрузка...</div>
          ) : subcategories.length > 0 ? (
            subcategories.map((subcategory) => (
              <Link 
                key={subcategory.id} 
                to={`/${category.slug}/${subcategory.slug}`}
                className="block px-2 py-1.5 text-sm hover:bg-gray-100 rounded-md"
                onClick={() => setPopoverOpen(false)}
              >
                {subcategory.name}
              </Link>
            ))
          ) : (
            <div className="text-center py-2 text-gray-500">Нет подкатегорий</div>
          )}
          <Link 
            to={`/${category.slug}`}
            className="mt-2 text-center text-sm text-blue-600 hover:underline"
            onClick={() => setPopoverOpen(false)}
          >
            Все объявления в {category.name}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const CategoryMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Получаем только корневые категории (parent_id = null)
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