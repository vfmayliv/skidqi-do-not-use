
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { useListings } from '@/hooks/useListings';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { ListingCard } from '@/components/ListingCard';
import { UniversalFilters, UniversalFiltersData } from '@/components/filters/UniversalFilters';
import { CategoryTreeFilter } from '@/components/filters/CategoryTreeFilter';
import { useUniversalFiltersStore } from '@/stores/useUniversalFiltersStore';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const { language, t } = useAppWithTranslations();
  const { getListings, listings, loading, error } = useListings();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
  const { filters, setFilters, resetFilters } = useUniversalFiltersStore();

  // Маппинг ID категорий от строковых к числовым
  const getCategoryIdNumber = (categoryStr: string): number | undefined => {
    const categoryMap: Record<string, number> = {
      'electronics': 1, // ID категории "Техника и электроника" в базе
      'fashion': 2,
      'home': 3,
      'transport': 4,
      'property': 5,
      'kids': 6,
      'pharmacy': 7,
      'food': 8,
      'services': 9,
      'pets': 10,
      'hobby': 11,
      'beauty': 12
    };
    return categoryMap[categoryStr];
  };

  useEffect(() => {
    if (categoryId) {
      const numericCategoryId = getCategoryIdNumber(categoryId);
      console.log(`Загружаем объявления для категории: ${categoryId} (ID: ${numericCategoryId})`);
      
      if (numericCategoryId) {
        const filterParams = {
          categoryId: numericCategoryId,
          priceRange: filters.priceRange,
          condition: filters.condition !== 'any' ? filters.condition : undefined
        };
        
        getListings(filterParams);
      } else {
        console.warn(`Неизвестная категория: ${categoryId}`);
      }
    }
  }, [categoryId, filters, getListings]);

  const config = categoryId ? getCategoryConfig(categoryId) : null;

  // Show category tree for categories with Supabase subcategories
  const shouldShowCategoryTree = categoryId === 'kids' || 
    categoryId === 'pharmacy' || 
    categoryId === 'fashion' || 
    categoryId === 'food' || 
    categoryId === 'electronics' ||
    categoryId === 'home' ||
    categoryId === 'services' ||
    categoryId === 'pets' ||
    categoryId === 'hobby' ||
    categoryId === 'beauty';

  // Skip universal filters for transport and property categories
  const shouldShowUniversalFilters = categoryId && 
    categoryId !== 'transport' && 
    categoryId !== 'property';

  // Fall back to default components if no config is found
  const FiltersComponent = config?.filtersComponent;
  const CardComponent = config?.cardComponent || ListingCard;

  if (!categoryId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div>{language === 'ru' ? 'Категория не найдена' : 'Санат табылмады'}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryName = config?.name?.[language] || 
    (categoryId === 'property'
      ? (language === 'ru' ? 'Недвижимость' : 'Жылжымайтын мүлік')
      : categoryId === 'transport'
      ? (language === 'ru' ? 'Транспорт' : 'Көлік')
      : categoryId === 'electronics'
      ? (language === 'ru' ? 'Техника и электроника' : 'Техника және электроника')
      : categoryId === 'kids'
      ? (language === 'ru' ? 'Детям' : 'Балаларға')
      : categoryId === 'pharmacy'
      ? (language === 'ru' ? 'Аптеки' : 'Дәріханалар')
      : categoryId === 'fashion'
      ? (language === 'ru' ? 'Мода и стиль' : 'Сән және стиль')
      : categoryId === 'food'
      ? (language === 'ru' ? 'Продукты питания' : 'Азық-түлік')
      : categoryId === 'home'
      ? (language === 'ru' ? 'Все для дома и дачи' : 'Үй мен дача үшін бәрі')
      : categoryId === 'services'
      ? (language === 'ru' ? 'Услуги' : 'Қызметтер')
      : categoryId === 'pets'
      ? (language === 'ru' ? 'Зоотовары' : 'Жануарлар тауарлары')
      : categoryId === 'hobby'
      ? (language === 'ru' ? 'Хобби и спорт' : 'Хобби және спорт')
      : categoryId === 'beauty'
      ? (language === 'ru' ? 'Красота и здоровье' : 'Сұлулық және денсаулық')
      : (language === 'ru' ? 'Товары' : 'Тауарлар'));

  const handleSearch = () => {
    console.log('Search triggered with filters:', filters, 'subcategory:', selectedSubcategory);
    if (categoryId) {
      const numericCategoryId = getCategoryIdNumber(categoryId);
      if (numericCategoryId) {
        getListings({
          categoryId: numericCategoryId,
          priceRange: filters.priceRange,
          condition: filters.condition !== 'any' ? filters.condition : undefined
        });
      }
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? undefined : subcategoryId);
  };

  // Адаптируем данные из Supabase к интерфейсу ListingCard
  const adaptedListings = listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    imageUrl: listing.images?.[0] || '/placeholder.svg',
    originalPrice: listing.regular_price || 0,
    discountPrice: listing.discount_price || listing.regular_price || 0,
    discount: listing.discount_percent || 0,
    city: (listing as any).cities?.name_ru || 'Не указан',
    categoryId: categoryId || '',
    subcategoryId: '',
    isFeatured: listing.is_premium || false,
    createdAt: listing.created_at,
    views: listing.views || 0
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbNavigation currentPage={categoryName} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-6">{categoryName}</h1>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Ошибка загрузки: {error}
            </div>
          )}
          
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-80 flex-shrink-0 space-y-6">
              {/* Category Tree Filter */}
              {shouldShowCategoryTree && (
                <CategoryTreeFilter
                  categoryId={categoryId}
                  onCategorySelect={handleSubcategorySelect}
                  selectedCategoryId={selectedSubcategory}
                />
              )}
              
              {/* Universal Filters */}
              {shouldShowUniversalFilters && (
                <UniversalFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={resetFilters}
                  onSearch={handleSearch}
                />
              )}
              
              {/* Custom Category Filters */}
              {FiltersComponent && (
                <FiltersComponent
                  filters={{}}
                  onFilterChange={() => {}}
                  onReset={() => {}}
                  onSearch={handleSearch}
                  districts={[]}
                  config={{
                    cities: [],
                    onCityChange: () => {},
                    selectedCity: null
                  }}
                  brands={[]}
                  activeFiltersCount={0}
                />
              )}
            </div>
            
            {/* Listings Content */}
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-gray-600">
                  {loading ? 
                    (language === 'ru' ? 'Загружаем...' : 'Жүктеу...') :
                    `${language === 'ru' ? 'Найдено' : 'Табылды'} ${adaptedListings.length} ${language === 'ru' ? 'объявлений' : 'хабарландыру'}`
                  }
                </p>
              </div>
              
              {/* Listings grid */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {adaptedListings.map(listing => (
                    <CardComponent key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
              
              {!loading && adaptedListings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('noListingsFound', 'Объявлений не найдено')}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {language === 'ru' ? 
                      'Попробуйте изменить фильтры или выбрать другую категорию' : 
                      'Сүзгілерді өзгертіп көріңіз немесе басқа санатты таңдаңыз'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
