
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { useAppContext } from '@/contexts/AppContext';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

export function CategoryMenu() {
  const { language, t } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Helper function to dynamically render icons from Lucide
  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    // Type assertion with a more specific type and a safety check
    const IconComponent = (LucideIcons as any)[name];
    
    // Return the icon if found, otherwise return null
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <h2 className="text-lg font-medium mb-4">{t('categories')}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          // Special handling for property and transport categories
          if (category.id === 'property') {
            return (
              <Link
                key={category.id}
                to="/property"
                className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
                <span className="text-sm text-center">{category.name[language]}</span>
              </Link>
            );
          } else if (category.id === 'transport') {
            return (
              <Link
                key={category.id}
                to="/transport"
                className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
                <span className="text-sm text-center">{category.name[language]}</span>
              </Link>
            );
          }
          
          // Default handling for other categories
          return (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <DynamicIcon name={category.icon} className="h-6 w-6 mb-2" />
              <span className="text-sm text-center">{category.name[language]}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Subcategories (for desktop) */}
      {activeCategory && (
        <div className="hidden md:block mt-4">
          <div className="p-4 border rounded-lg">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories
                .find((c) => c.id === activeCategory)
                ?.subcategories?.map((subcat) => {
                  if (activeCategory === 'property') {
                    return (
                      <Link
                        key={subcat.id}
                        to={`/property?type=${subcat.id}`}
                        className="flex items-center p-2 rounded-md hover:bg-accent"
                      >
                        <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />
                        <span className="text-sm">{subcat.name[language]}</span>
                      </Link>
                    );
                  } else if (activeCategory === 'transport') {
                    return (
                      <Link
                        key={subcat.id}
                        to={`/transport?type=${subcat.id}`}
                        className="flex items-center p-2 rounded-md hover:bg-accent"
                      >
                        <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />
                        <span className="text-sm">{subcat.name[language]}</span>
                      </Link>
                    );
                  }
                  
                  return (
                    <Link
                      key={subcat.id}
                      to={`/category/${activeCategory}/${subcat.id}`}
                      className="flex items-center p-2 rounded-md hover:bg-accent"
                    >
                      <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />
                      <span className="text-sm">{subcat.name[language]}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
