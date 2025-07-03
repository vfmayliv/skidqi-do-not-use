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
  // Также исключаем "Бесплатно" - найдем его ID
  const excludedSlugs = ['property', 'transport', 'free'];

  // Если это одна из специальных категорий, рендерим как простую ссылку
  if (linkCategories.includes(category.id) || excludedSlugs.includes(category.slug)) {
    return (
      <Link
        to={`/category/${category.id}`}
        className="flex flex-col items-center p-4 rounded-lg border border-transparent hover:border-primary hover:bg-primary/5 transition-colors h-full justify-center"
      >
        <DefaultIcon className="h-6 w-6 mb-2" />
        <span className="text-sm text-center">{language === 'ru' ? category.name_ru : category.name_kz}</span>
      </Link>
    );
  }

  // Для всех остальных категорий используем Popover с хуком useSubcategories
  return (
    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-full w-full p-4 rounded-lg border border-transparent hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <DefaultIcon className="h-6 w-6 mb-2" />
          <span className="text-sm text-center">{language === 'ru' ? category.name_ru : category.name_kz}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <SubcategoryList categoryId={category.id} onLinkClick={() => setPopoverOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};

// Компонент для отображения списка подкатегорий
const SubcategoryList = ({ categoryId, onLinkClick }: { categoryId: number, onLinkClick: () => void }) => {
  const { language, t } = useAppWithTranslations();
  const { categories: subcategories, loading, error } = useSubcategories(categoryId);

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">{t('loading')}...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{t('error_loading_data')}</div>;
  }

  if (subcategories.length === 0) {
    return <div className="p-4 text-sm text-gray-500">{t('no_subcategories')}</div>;
  }

  return (
    <div className="grid gap-1 p-2">
      {subcategories.map(subcat => (
        <Link
          key={subcat.id}
          to={`/category/${subcat.id}`}
          className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={onLinkClick} // Закрываем popover при клике
        >
          {subcat.icon && <DefaultIcon className="h-4 w-4 mr-2" />}
          <span className="text-sm">{language === 'ru' ? subcat.name_ru : subcat.name_kz}</span>
        </Link>
      ))}
    </div>
  );
};

// Основной компонент меню
export function CategoryMenu() {
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
