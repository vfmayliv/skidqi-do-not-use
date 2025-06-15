
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { useAppStore } from '@/stores/useAppStore';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { usePropertyListings } from '@/hooks/usePropertyListings';
import { 
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption,
  PropertyFilterConfig,
} from '@/types/listingType';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface DistrictData {
  id: string;
  name: {
    ru: string;
    kz: string;
  };
}

export const propertyFilterConfig: PropertyFilterConfig = {
  areaRangeMin: 10,
  areaRangeMax: 500,
  floorRangeMin: 1,
  floorRangeMax: 30,
  dealTypes: [
    { id: 'sale', label: { ru: 'Продажа', kz: 'Сату' } },
    { id: 'rent', label: { ru: 'Аренда', kz: 'Жалға алу' } }
  ],
  segments: [
    { 
      id: 'residential', 
      label: { ru: 'Жилая недвижимость', kz: 'Тұрғын үй' },
      types: []
    },
    { 
      id: 'commercial', 
      label: { ru: 'Коммерческая недвижимость', kz: 'Коммерциялық жылжымайтын мүлік' },
      types: []
    }
  ],
  residentialFilters: [],
  commercialFilters: [],
  generalFilters: []
};

export default function PropertyPage() {
  const { language } = useAppStore();
  const { filters, setFilters, resetFilters, activeFiltersCount } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [districts, setDistricts] = useState<DistrictData[]>([]);
  
  // Use the optimized hook for property listings
  const { 
    listings, 
    loading, 
    error, 
    totalCount, 
    getPropertyListings 
  } = usePropertyListings();

  // Load districts (mock data for now)
  useEffect(() => {
    const mockDistricts: DistrictData[] = [
      { id: 'almaty-district', name: { ru: 'Алмалинский район', kz: 'Алмалы ауданы' } },
      { id: 'bostandyk-district', name: { ru: 'Бостандыкский район', kz: 'Бостандық ауданы' } },
      { id: 'alatau-district', name: { ru: 'Алатауский район', kz: 'Алатау ауданы' } },
    ];
    setDistricts(mockDistricts);
  }, []);

  // Load property listings when filters change
  useEffect(() => {
    console.log('🔄 Loading property listings with filters:', filters);
    getPropertyListings(filters, filters.sortBy || 'newest', 50, 0);
  }, [filters, getPropertyListings]);

  // Initialize filters from URL
  useEffect(() => {
    const initialPropertyType = searchParams.get('type') as PropertyType || null;
    if (initialPropertyType) {
      setFilters({ 
        propertyTypes: initialPropertyType ? [initialPropertyType] : null 
      });
    }
  }, [searchParams, setFilters]);

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.propertyTypes && newFilters.propertyTypes.length > 0) {
      params.set('type', newFilters.propertyTypes[0]);
    } else {
      params.delete('type');
    }
    
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateUrlParams({...filters, ...newFilters});
  };

  const handleReset = () => {
    resetFilters();
    setSearchParams({});
  };

  const handleSearch = () => {
    console.log('🔍 Search triggered with filters:', filters);
    getPropertyListings(filters, filters.sortBy || 'newest', 50, 0);
  };

  // Process listings to ensure compatibility with PropertyCard
  const processedListings = useMemo(() => {
    return listings.map(listing => ({
      ...listing,
      // Ensure proper data mapping for PropertyCard component
      imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg',
      originalPrice: listing.regular_price || listing.discount_price || 0,
      discountPrice: listing.discount_price || listing.regular_price || 0,
      discount: listing.discount_percent || 0,
      city: {
        ru: 'Алматы', // Can be enhanced to load from cities table
        kz: 'Алматы'
      },
      categoryId: 'property',
      createdAt: listing.created_at,
      isFeatured: listing.is_premium || false,
      views: listing.views || 0,
    }));
  }, [listings]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <PropertyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            onSearch={handleSearch}
            districts={districts}
            activeFiltersCount={activeFiltersCount}
            config={propertyFilterConfig}
          />
          
          {/* Show error messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {language === 'ru' ? 'Ошибка загрузки:' : 'Жүктеу қатесі:'} {error}
            </div>
          )}
          
          {/* Show results count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 
                (language === 'ru' ? 'Загружаем...' : 'Жүктеу...') :
                `${language === 'ru' ? 'Найдено' : 'Табылды'} ${totalCount || processedListings.length} ${language === 'ru' ? 'объявлений' : 'хабарландыру'}`
              }
            </p>
          </div>
          
          {/* Show loading or listings */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {language === 'ru' ? 'Загружаем объявления недвижимости...' : 'Жылжымайтын мүлік хабарландыруларын жүктеп жатырмыз...'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {processedListings.map(listing => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
          
          {/* Show message when no listings found */}
          {!loading && processedListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {language === 'ru' ? 'Объявлений недвижимости не найдено' : 'Жылжымайтын мүлік хабарландырулары табылмады'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {language === 'ru' ? 
                  'Попробуйте изменить фильтры или выбрать другие параметры поиска' : 
                  'Сүзгілерді өзгертіп көріңіз немесе басқа іздеу параметрлерін таңдаңыз'
                }
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
