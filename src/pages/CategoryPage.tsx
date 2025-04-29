
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { mockListings } from '@/data/mockListings';
import { cities } from '@/data/cities';
import { getCategoryConfig } from '@/categories/categoryRegistry';
import { CategoryCard } from '@/categories/shared/components';
import { ListingCard } from '@/components/ListingCard';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const { language, t } = useAppWithTranslations();
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setCitiesData(cities);
  }, []);

  useEffect(() => {
    let newListings = mockListings;
    
    // Filter by category ID
    if (categoryId) {
      newListings = newListings.filter(listing => listing.categoryId === categoryId);
    }
    
    // Apply subcategory filter if present in URL params
    const subcategoryId = searchParams.get('subcategory');
    if (subcategoryId) {
      newListings = newListings.filter(listing => listing.subcategoryId === subcategoryId);
    }
    
    setFilteredListings(newListings);
  }, [categoryId, searchParams]);

  useEffect(() => {
    if (selectedCity) {
      // This would be replaced with actual district data fetching
      // For now, we're just using a placeholder
      setDistricts([]);
    } else {
      setDistricts([]);
    }
  }, [selectedCity, citiesData]);

  const config = categoryId ? getCategoryConfig(categoryId) : null;

  // Fall back to default components if no config is found
  const FiltersComponent = config?.filtersComponent || (() => null);
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

  const categoryName = categoryId === 'property'
    ? (language === 'ru' ? 'Недвижимость' : 'Жылжымайтын мүлік')
    : (language === 'ru' ? 'Товары' : 'Тауарлар');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-semibold mb-4">{categoryName}</h1>
          
          {/* Filter component if available */}
          {FiltersComponent && (
            <FiltersComponent
              filters={filters}
              onFilterChange={setFilters}
              onReset={() => {
                setFilters({});
                setSelectedCity(null);
              }}
              onSearch={() => console.log('Search triggered:', filters)}
              districts={districts}
              config={{
                cities: citiesData.map(city => ({
                  id: city.id,
                  label: city[language]
                })),
                onCityChange: setSelectedCity,
                selectedCity
              }}
            />
          )}
          
          {/* Listings grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
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
      </main>
      <Footer />
    </div>
  );
}
