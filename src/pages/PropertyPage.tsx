
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { useAppStore } from '@/stores/useAppStore';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { useListings } from '@/hooks/useListings';
import { 
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption,
  PropertyFilterConfig,
} from '@/types/listingType';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';

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
  const [realEstateListings, setRealEstateListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем районы (моковые данные для примера)
  useEffect(() => {
    const mockDistricts: DistrictData[] = [
      { id: 'almaty-district', name: { ru: 'Алмалинский район', kz: 'Алмалы ауданы' } },
      { id: 'bostandyk-district', name: { ru: 'Бостандыкский район', kz: 'Бостандық ауданы' } },
      { id: 'alatau-district', name: { ru: 'Алатауский район', kz: 'Алатау ауданы' } },
    ];
    setDistricts(mockDistricts);
  }, []);

  // Загружаем объявления недвижимости из Supabase
  const loadPropertyListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏠 Загружаем объявления недвижимости с фильтрами:', filters);

      // Подготавливаем параметры для функции поиска
      const searchParams = {
        p_limit: 50,
        p_offset: 0,
        p_property_types: filters.propertyTypes && filters.propertyTypes.length > 0 ? filters.propertyTypes : null,
        p_deal_type: filters.dealType || null,
        p_min_price: filters.priceRange?.min || null,
        p_max_price: filters.priceRange?.max || null,
        p_min_area: filters.areaRange?.min || null,
        p_max_area: filters.areaRange?.max || null,
        p_min_rooms: null, // Можно добавить позже
        p_max_rooms: null,
        p_min_floor: filters.floorRange?.min || null,
        p_max_floor: filters.floorRange?.max || null,
        p_city_id: filters.cityId || null,
        p_region_id: filters.regionId || null,
        p_microdistrict_id: filters.microdistrictId || null,
        p_building_types: filters.buildingTypes && filters.buildingTypes.length > 0 ? filters.buildingTypes : null,
        p_renovation_types: filters.renovationTypes && filters.renovationTypes.length > 0 ? filters.renovationTypes : null,
        p_bathroom_types: filters.bathroomTypes && filters.bathroomTypes.length > 0 ? filters.bathroomTypes : null,
        p_has_photo: filters.hasPhoto || null,
        p_furnished: filters.furnished || null,
        p_allow_pets: filters.allowPets || null,
        p_has_parking: filters.hasParking || null,
        p_has_balcony: filters.hasBalcony || null,
        p_has_elevator: filters.hasElevator || null,
        p_sort_by: mapSortOption(filters.sortBy),
        p_sort_order: 'desc'
      };

      console.log('📊 Параметры поиска:', searchParams);

      // Вызываем функцию поиска
      const { data, error } = await supabase.rpc('search_property_listings', searchParams);

      if (error) {
        console.error('❌ Ошибка при загрузке объявлений:', error);
        throw error;
      }

      console.log(`✅ Загружено объявлений недвижимости: ${data?.length || 0}`);
      console.log('📋 Первые несколько объявлений:', data?.slice(0, 3));

      // Адаптируем данные для компонента PropertyCard
      const adaptedListings = data?.map(listing => ({
        ...listing,
        // Мappim поля для совместимости с существующим компонентом
        imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : '/placeholder.svg',
        originalPrice: listing.regular_price || listing.discount_price,
        discountPrice: listing.discount_price,
        discount: listing.discount_percent || 0,
        city: {
          ru: 'Алматы', // Можно загрузить из таблицы cities
          kz: 'Алматы'
        },
        categoryId: 'property',
        createdAt: listing.created_at,
        isFeatured: listing.is_premium || false,
        views: listing.views || 0,
        // Недвижимость-специфичные поля уже есть в listing
      })) || [];

      setRealEstateListings(adaptedListings);
    } catch (err: any) {
      console.error('💥 Критическая ошибка:', err);
      setError(err.message || 'Неизвестная ошибка при загрузке объявлений');
    } finally {
      setLoading(false);
    }
  };

  // Функция для маппинга SortOption в строку для SQL функции
  const mapSortOption = (sortBy: SortOption | null): string => {
    switch (sortBy) {
      case SortOption.PRICE_ASC:
        return 'price_asc';
      case SortOption.PRICE_DESC:
        return 'price_desc';
      case SortOption.AREA_ASC:
        return 'area_asc';
      case SortOption.AREA_DESC:
        return 'area_desc';
      default:
        return 'created_at';
    }
  };

  // Загружаем данные при изменении фильтров
  useEffect(() => {
    loadPropertyListings();
  }, [filters]);

  // Инициализация фильтров из URL
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
    console.log('Search triggered with filters:', filters);
    loadPropertyListings();
  };

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
          
          {/* Показываем ошибки */}
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Ошибка загрузки: {error}
            </div>
          )}
          
          {/* Показываем количество найденных объявлений */}
          <div className="mb-6">
            <p className="text-gray-600">
              {loading ? 
                (language === 'ru' ? 'Загружаем...' : 'Жүктеу...') :
                `${language === 'ru' ? 'Найдено' : 'Табылды'} ${realEstateListings.length} ${language === 'ru' ? 'объявлений' : 'хабарландыру'}`
              }
            </p>
          </div>
          
          {/* Показываем лоадер или объявления */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {realEstateListings.map(listing => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
          
          {/* Показываем сообщение если объявлений не найдено */}
          {!loading && realEstateListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {language === 'ru' ? 'Объявлений не найдено' : 'Хабарландырулар табылмады'}
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
