import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { useAppStore } from '@/stores/useAppStore';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { usePropertyListings } from '@/hooks/usePropertyListings';
import { convertToPropertyListingFilters } from '@/utils/filterTypeConverters';
import {
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption,
  PropertyFilterConfig,
} from '@/types/listingType';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GuidedSearch } from '@/components/property/GuidedSearch';

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
    { id: 'sale', label: { ru: 'Купить', kz: 'Сатып алу' } },
    { id: 'rent', label: { ru: 'Снять', kz: 'Жалға алу' } }
  ],
  segments: [
    { 
      id: 'residential', 
      label: { ru: 'Жилая недвижимость', kz: 'Тұрғын үй' },
      types: []
    },
    { 
      id: 'commercial', 
      label: { ru: 'Коммерческая недвижимость', kz: 'Коммерциялық' },
      types: []
    }
  ],
  propertyTypes: {
    flat: { ru: 'Квартира', kz: 'Пәтер' },
    house: { ru: 'Дом', kz: 'Үй' },
    dacha: { ru: 'Дача', kz: 'Саяжай' },
    garage: { ru: 'Гараж', kz: 'Гараж' },
    land: { ru: 'Участок', kz: 'Жер учаскесі' },
    office: { ru: 'Офис', kz: 'Кеңсе' },
    building: { ru: 'Здание', kz: 'Ғимарат' },
    warehouse: { ru: 'Склад', kz: 'Қойма' },
    shop: { ru: 'Магазин', kz: 'Дүкен' },
  },
  buildingTypes: {
    panel: { ru: 'Панельный', kz: 'Панельді' },
    brick: { ru: 'Кирпичный', kz: 'Кірпіш' },
    monolithic: { ru: 'Монолитный', kz: 'Монолитті' },
    wood: { ru: 'Деревянный', kz: 'Ағаш' },
  },
  conditionTypes: {
    good: { ru: 'Хорошее', kz: 'Жақсы' },
    average: { ru: 'Среднее', kz: 'Орташа' },
    needs_repair: { ru: 'Требует ремонта', kz: 'Жөндеуді қажет етеді' },
  },
  sortOptions: [
    { value: 'date_desc', label: { ru: 'Сначала новые', kz: 'Алдымен жаңа' } },
    { value: 'price_asc', label: { ru: 'Сначала дешевые', kz: 'Алдымен арзан' } },
    { value: 'price_desc', label: { ru: 'Сначала дорогие', kz: 'Алдымен қымбат' } },
  ],
};

export default function PropertyPage() {
  const { language } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters, setFilter, resetFilters, activeFiltersCount } = usePropertyFiltersStore();
  const [guidedSearchCompleted, setGuidedSearchCompleted] = useState(false);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const newFilters = convertToPropertyListingFilters(params);
    const dealType = searchParams.get('dealType');
    const segment = searchParams.get('segment');

    if (dealType && segment) {
      setFilters({ ...newFilters, dealType, segment });
      setGuidedSearchCompleted(true);
    } else {
      setFilters(newFilters);
      setGuidedSearchCompleted(false);
    }
  }, [searchParams, setFilters]);

  const { listings, loading, error } = usePropertyListings(filters);

  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        if (Array.isArray(value)) {
          value.forEach(item => newSearchParams.append(key, item.toString()));
        } else {
          newSearchParams.set(key, value.toString());
        }
      }
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  const processedListings = useMemo(() => {
    return listings || [];
  }, [listings]);

  const handleGuidedSearchComplete = (dealType: string, segment: string) => {
    setFilters({ ...filters, dealType, segment });
    setGuidedSearchCompleted(true);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Search is handled automatically by the useEffect that updates URL params
    console.log('Search triggered with filters:', filters);
  };

  // Mock districts data
  const districts = [
    { id: '1', name: { ru: 'Алмалинский', kz: 'Алмалы' } },
    { id: '2', name: { ru: 'Медеуский', kz: 'Медеу' } },
    { id: '3', name: { ru: 'Бостандыкский', kz: 'Бостандық' } },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'ru' ? 'Недвижимость' : 'Жылжымайтын мүлік'}
          </h1>
          <p className="text-gray-600 mb-8">
            {language === 'ru' ? 'Найдите лучшие предложения по недвижимости в вашем городе.' : 'Қалаңыздағы жылжымайтын мүлік бойынша ең жақсы ұсыныстарды табыңыз.'}
          </p>

          {!guidedSearchCompleted ? (
            <GuidedSearch onComplete={handleGuidedSearchComplete} />
          ) : (
            <>
              <PropertyFilters 
                config={propertyFilterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
                onSearch={handleSearch}
                districts={districts}
                activeFiltersCount={activeFiltersCount}
              />
              
              {loading && (
                <div className="text-center py-8">
                  <p>Загрузка объявлений...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500">Ошибка при загрузке: {error.message}</p>
                </div>
              )}

              {!loading && processedListings.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
                  {processedListings.map(listing => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
              
              {!loading && processedListings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {language === 'ru' ? 'Подходящих объявлений не найдено' : 'Сәйкес хабарландырулар табылмады'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {language === 'ru' ? 'Попробуйте изменить параметры фильтра или расширить область поиска' : 'Сүзгі параметрлерін өзгертіп көріңіз немесе іздеу аймағын кеңейтіңіз'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
