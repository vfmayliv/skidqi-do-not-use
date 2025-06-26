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
  const { filters, setFilters, setDealType, setSegment } = usePropertyFiltersStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const { listings, loading, error } = usePropertyListings(filters);
  
  const [viewMode, setViewMode] = useState('list');
  const [filtersConfig, setFiltersConfig] = useState<SegmentWithPropertyTypes[]>([]);

  useEffect(() => {
    const urlDealType = searchParams.get('dealType');
    const urlSegment = searchParams.get('segment');
    if (urlDealType) {
      setDealType(urlDealType);
    } else {
      // Default to 'sale' if not in URL
      setDealType('sale');
    }
    if (urlSegment) {
      setSegment(urlSegment);
    }
  }, []);

  useEffect(() => {
    if (filters.dealType) {
      const loadFilters = async () => {
        console.log(`Loading filters for deal type: ${filters.dealType}`);
        const config = await getFiltersForDeal(filters.dealType);
        console.log('Loaded config:', config);
        setFiltersConfig(config);
      };
      loadFilters();
    }
  }, [filters.dealType]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.dealType) params.set('dealType', newFilters.dealType);
    if (newFilters.segment) params.set('segment', newFilters.segment);
    setSearchParams(params, { replace: true });
  };

  const processedListings = useMemo(() => {
    return listings.map(listing => ({ ...listing, price: Number(listing.price) }));
  }, [listings]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <PropertyFilters config={filtersConfig} onFilterChange={handleFilterChange} />
          
          <div className="flex justify-end items-center">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)} aria-label="View mode">
              <ToggleGroupItem value="list" aria-label="List view"><List className="h-4 w-4 mr-2" />Список</ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Map view"><Map className="h-4 w-4 mr-2" />Карта</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <>
            {loading && <div className="text-center">Загрузка объявлений...</div>}
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
            
            {!loading && processedListings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Подходящих объявлений не найдено.</p>
                <p className="text-sm text-gray-400 mt-2">Попробуйте изменить критерии поиска или сбросьте фильтры.</p>
              </div>
            )}
          </>
        </div>
      </main>
      <Footer />
    </div>
  );
}
