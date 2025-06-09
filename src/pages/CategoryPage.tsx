
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BreadcrumbNavigation } from '@/components/BreadcrumbNavigation';
import { mockListings } from '@/data/mockListings';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { ListingCard } from '@/components/ListingCard';
import { UniversalFilters, UniversalFiltersData } from '@/components/filters/UniversalFilters';
import { CategoryTreeFilter } from '@/components/filters/CategoryTreeFilter';
import { useUniversalFiltersStore } from '@/stores/useUniversalFiltersStore';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const { language, t } = useAppWithTranslations();
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
  const { filters, setFilters, resetFilters } = useUniversalFiltersStore();

  useEffect(() => {
    let newListings = mockListings;
    
    // Filter by category ID
    if (categoryId) {
      newListings = newListings.filter(listing => listing.categoryId === categoryId);
    }
    
    // Apply subcategory filter if present in URL params or selected
    const subcategoryId = searchParams.get('subcategory') || selectedSubcategory;
    if (subcategoryId) {
      newListings = newListings.filter(listing => listing.subcategoryId === subcategoryId);
    }
    
    // Apply universal filters
    if (filters.condition && filters.condition !== 'any') {
      // For mockListings, we'll assume they have a condition property
      // In a real app, this would be based on actual data structure
    }
    
    if (filters.priceRange.min !== undefined) {
      newListings = newListings.filter(listing => 
        listing.discountPrice >= filters.priceRange.min!
      );
    }
    
    if (filters.priceRange.max !== undefined) {
      newListings = newListings.filter(listing => 
        listing.discountPrice <= filters.priceRange.max!
      );
    }
    
    // Location filters would be applied here based on listing location data
    
    setFilteredListings(newListings);
  }, [categoryId, searchParams, selectedSubcategory, filters]);

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
      : categoryId === 'kids'
      ? (language === 'ru' ? 'Детям' : 'Балаларға')
      : categoryId === 'pharmacy'
      ? (language === 'ru' ? 'Аптеки' : 'Дәріханалар')
      : categoryId === 'fashion'
      ? (language === 'ru' ? 'Мода и стиль' : 'Сән және стиль')
      : categoryId === 'food'
      ? (language === 'ru' ? 'Продукты питания' : 'Азық-түлік')
      : categoryId === 'electronics'
      ? (language === 'ru' ? 'Техника и электроника' : 'Техника және электроника')
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
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? undefined : subcategoryId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbNavigation currentPage={categoryName} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-6">{categoryName}</h1>
          
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
                  {language === 'ru' ? 'Найдено' : 'Табылды'} {filteredListings.length} {language === 'ru' ? 'объявлений' : 'хабарландыру'}
                </p>
              </div>
              
              {/* Listings grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredListings.map(listing => (
                  <CardComponent key={listing.id} listing={listing} />
                ))}
              </div>
              
              {filteredListings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('noListingsFound', 'Объявлений не найдено')}</p>
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
