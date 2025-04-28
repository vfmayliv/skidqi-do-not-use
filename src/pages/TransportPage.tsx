import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import TransportCard from '@/components/transport/TransportCard';
import TransportMap from '@/components/transport/TransportMap';
import TransportFilters from '@/components/transport/TransportFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppStore } from '@/stores/useAppStore';
import { useTransportFiltersStore } from '@/stores/useTransportFiltersStore';
import { carBrands, motorcycleBrands } from '@/data/transportData';
import { mockListings } from '@/data/mockListings';
import { useToast } from '@/hooks/useToast';

const TransportPage = () => {
  const isMobile = useIsMobile();
  const { language } = useAppStore();
  const { filters, setFilters, resetFilters, activeFiltersCount } = useTransportFiltersStore();
  const { toast } = useToast();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [brandsSearchQuery, setBrandsSearchQuery] = useState('');
  const [availableBrands, setAvailableBrands] = useState<Array<string | any>>([]);
  
  useEffect(() => {
    // Combine car brands and motorcycle brands as the available brands
    const allBrands = [...carBrands, ...motorcycleBrands];
    setAvailableBrands(allBrands);
  }, []);
  
  // Filtered brands based on search query
  const filteredBrands = useMemo(() => {
    return availableBrands.filter((brand) => {
      if (!brandsSearchQuery) return true;
      
      // Handle string brands
      if (typeof brand === 'string') {
        return brand.toLowerCase().includes(brandsSearchQuery.toLowerCase());
      }
      
      // Safely handle the BrandData object case with additional type safety
      if (brand && typeof brand === 'object' && brand.name) {
        // Case 1: brand.name is a string
        if (typeof brand.name === 'string') {
          return brand.name.toLowerCase().includes(brandsSearchQuery.toLowerCase());
        }
        // Case 2: brand.name is a LocalizedText object
        else if (typeof brand.name === 'object' && brand.name && 'ru' in brand.name) {
          const ruName = brand.name.ru;
          if (typeof ruName === 'string') {
            return ruName.toLowerCase().includes(brandsSearchQuery.toLowerCase());
          }
        }
      }
      
      // Fallback for any unhandled cases
      return false;
    });
  }, [availableBrands, brandsSearchQuery]);
  
  const handleApplyFilters = () => {
    toast({
      description: language === 'ru' 
        ? 'Результаты обновлены в соответствии с выбранными фильтрами.' 
        : 'Нәтижелер таңдалған фильтрлерге сәйкес жаңартылды.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            {language === 'ru' ? 'Транспорт' : 'Көлік'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search" 
                placeholder={language === 'ru' ? 'Поиск...' : 'Іздеу...'} 
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setGridView(true)}
                className={cn("h-9 w-9", gridView ? "bg-blue-50" : "")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setGridView(false)}
                className={cn("h-9 w-9", !gridView ? "bg-blue-50" : "")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {isMobile ? (
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>
                      {language === 'ru' ? 'Фильтры' : 'Фильтрлер'}
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-4">
                    <TransportFilters 
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={resetFilters}
                      onSearch={handleApplyFilters}
                      brands={availableBrands}
                      activeFiltersCount={activeFiltersCount}
                    />
                  </div>
                  <DrawerFooter>
                    <Button onClick={handleApplyFilters}>
                      {language === 'ru' ? 'Применить' : 'Қолдану'}
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">
                        {language === 'ru' ? 'Отмена' : 'Болдырмау'}
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {language === 'ru' ? 'Фильтры' : 'Фильтрлер'}
                    </DialogTitle>
                  </DialogHeader>
                  <TransportFilters 
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={resetFilters}
                    onSearch={handleApplyFilters}
                    brands={availableBrands}
                    activeFiltersCount={activeFiltersCount}
                  />
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={resetFilters}>
                      {language === 'ru' ? 'Сбросить' : 'Қайтару'}
                    </Button>
                    <Button onClick={handleApplyFilters}>
                      {language === 'ru' ? 'Применить' : 'Қолдану'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setIsMapOpen(!isMapOpen)}
              className={cn("h-9 w-9", isMapOpen ? "bg-blue-50" : "")}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isMapOpen ? (
          <div className="w-full h-[500px] mb-6 rounded-lg overflow-hidden border">
            <TransportMap 
              listings={mockListings} 
              onListingClick={() => {}} 
            />
          </div>
        ) : null}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockListings.map((listing) => (
            <TransportCard 
              key={listing.id} 
              listing={listing} 
              variant="default"
              viewMode={gridView ? 'grid' : 'list'}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TransportPage;
