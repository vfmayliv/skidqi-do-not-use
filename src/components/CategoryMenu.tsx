import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories as mainCategories } from '@/data/categories';
import { useAppWithTranslations } from '@/stores/useAppStore';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSubcategories } from '@/hooks/useSubcategories';

// Динамический компонент для иконок
const DynamicIcon = ({ name, ...props }: { name: string } & React.ComponentProps<typeof LucideIcons.Icon>) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType;
  if (!IconComponent) return <LucideIcons.HelpCircle {...props} />;
  return <IconComponent {...props} />;
};

// Компонент для одной кнопки категории
const CategoryButton = ({ category }: { category: (typeof mainCategories)[0] }) => {
  const { language, t } = useAppWithTranslations();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  
  // ID категорий, которые являются ссылками, а не выпадающими меню
  const linkCategories = [1, 2]; // Недвижимость и Транспорт

  // Если это одна из специальных категорий, рендерим как простую ссылку
  if (linkCategories.includes(category.id)) {
    return (
      <Link
        to={`/category/${category.id}`}
        className="flex flex-col items-center p-4 rounded-lg border border-transparent hover:border-primary hover:bg-primary/5 transition-colors h-full justify-center"
      >
        <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
        <span className="text-sm text-center">{category.name[language]}</span>
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
          <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
          <span className="text-sm text-center">{category.name[language]}</span>
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
          {subcat.icon && <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />}
          <span className="text-sm">{subcat.name[language]}</span>
        </Link>
      ))}
    </div>
  );
};

// Основной компонент меню
export function CategoryMenu() {
  return (
    <div className="bg-white py-4">
      <div className="container mx-auto px-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-4">
        {mainCategories.map(category => (
          <CategoryButton key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
