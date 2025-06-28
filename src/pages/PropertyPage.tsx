import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import { usePropertyFiltersStore } from '@/stores/usePropertyFiltersStore';
import { usePropertyListings } from '@/hooks/usePropertyListings';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { List, Map } from 'lucide-react';
import MapView from '@/components/property/MapView';
import { getFiltersForDeal, SegmentWithPropertyTypes } from '@/lib/filters';

export default function PropertyPage() {
  console.log('🏠 PropertyPage component rendering');
  const { filters, setFilters, setDealType, setSegment } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // We will trigger the search manually
  const [activeFilters, setActiveFilters] = useState(filters);
  const { listings, loading, error, refetch } = usePropertyListings(activeFilters);
  
  const [viewMode, setViewMode] = useState('list');
  const [filtersConfig, setFiltersConfig] = useState<SegmentWithPropertyTypes[]>([]);

  // Effect to sync URL params to state on initial load
  useEffect(() => {
    console.log('🔄 Effect: Syncing URL params to state');
    const urlDealType = searchParams.get('dealType');
    const urlSegment = searchParams.get('segment');

    if (urlDealType) {
      console.log('🔍 URL dealType found:', urlDealType);
      setDealType(urlDealType);
    }
    if (urlSegment) {
      console.log('🔍 URL segment found:', urlSegment);
      setSegment(urlSegment);
    }
  }, [searchParams]);

  // Effect to sync state to URL params
  useEffect(() => {
    console.log('🔄 Effect: Syncing state to URL params');
    const params = new URLSearchParams();
    if (filters.dealType) {
      params.set('dealType', filters.dealType);
    }
    if (filters.segment) {
      params.set('segment', filters.segment);
    }
    setSearchParams(params);
  }, [filters.dealType, filters.segment]);

  // Effect to load filters config when dealType changes
  useEffect(() => {
    console.log('🔄 Effect: Loading filters config for dealType:', filters.dealType);
    async function loadFiltersConfig() {
      if (filters.dealType) {
        console.log('📥 Fetching filters for dealType:', filters.dealType);
        try {
          const filtersForDeal = await getFiltersForDeal(filters.dealType);
          console.log('✅ Filters loaded successfully:', filtersForDeal);
          setFiltersConfig(filtersForDeal);
        } catch (err) {
          console.error('❌ Error loading filters:', err);
        }
      }
    }
    loadFiltersConfig();
  }, [filters.dealType]);

  // Effect to apply filters
  useEffect(() => {
    console.log('🔄 Effect: Setting active filters for search');
    setActiveFilters(filters);
  }, [filters]);

  // Transform listings for display
  const processedListings = useMemo(() => {
    console.log('🔄 Processing listings:', listings?.length || 0);
    return listings;
  }, [listings]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Недвижимость</h1>
        
        {/* Filters */}
        <PropertyFilters filtersConfig={filtersConfig} />
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            {!loading && (
              <span className="text-gray-600">
                {processedListings?.length || 0} объявлений найдено
              </span>
            )}
          </div>
          
          <div>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="list" aria-label="Список">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Карта">
                <Map className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="mt-4">
          <>
            {loading && <div className="text-center py-8">Загрузка объявлений...</div>}
            {error && <div className="text-center text-red-500">Ошибка: {error.message}</div>}
            
            {!loading && viewMode === 'list' && processedListings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
                {processedListings.map(listing => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
            
            {!loading && viewMode === 'map' && (
              <MapView listings={processedListings} />
            )}
            
            {!loading && !error && processedListings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Подходящих объявлений не найдено.</p>
                <p className="text-sm text-gray-400 mt-2">Попробуйте изменить критерии поиска или сбросить фильтры.</p>
              </div>
            )}
          </>
        </div>
      </main>
      <Footer />
    </div>
  );
}