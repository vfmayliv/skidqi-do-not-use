
import React, { useState, useEffect } from 'react';
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
import { Search, Filter, MapPin, Grid, List, Car, Bike, Truck, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { useTransportFiltersStore } from '@/stores/useTransportFiltersStore';
import { carBrands, motorcycleBrands, commercialTypes } from '@/data/transportData';
import { mockListings } from '@/data/mockListings';
import { useToast } from '@/hooks/useToast';
import { VehicleType } from '@/types/listingType';

const TransportPage = () => {
  const isMobile = useIsMobile();
  const { language } = useAppWithTranslations();
  const { filters, setFilters, resetFilters, activeFiltersCount } = useTransportFiltersStore();
  const { toast } = useToast();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [brandsSearchQuery, setBrandsSearchQuery] = useState('');
  const [transportListings, setTransportListings] = useState([]);
  const [activeTab, setActiveTab] = useState<string>('cars');
  
  useEffect(() => {
    // Filter listings to only show transport category
    const filteredListings = mockListings.filter(listing => 
      listing.categoryId === 'transport' || 
      (listing.category && listing.category === 'transport')
    );
    
    setTransportListings(filteredListings);
  }, []);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Reset filters when changing tabs
    resetFilters();
    
    // Set the vehicle type based on the selected tab
    switch(value) {
      case 'cars':
        setFilters({ vehicleType: VehicleType.CAR });
        break;
      case 'motorcycles':
        setFilters({ vehicleType: VehicleType.MOTORCYCLE });
        break;
      case 'commercial':
        setFilters({ vehicleType: VehicleType.COMMERCIAL });
        break;
      case 'parts':
        setFilters({ vehicleType: VehicleType.PARTS });
        break;
      default:
        setFilters({ vehicleType: null });
    }
  };
  
  const getBrandsForActiveTab = () => {
    switch(activeTab) {
      case 'motorcycles':
        return motorcycleBrands;
      case 'cars':
        return carBrands;
      default:
        return [];
    }
  };
  
  const handleApplyFilters = () => {
    toast({
      title: language === 'ru' ? 'Фильтры применены' : 'Фильтрлер қолданылды',
      description: language === 'ru' 
        ? 'Результаты обновлены в соответствии с выбранными фильтрами.' 
        : 'Нәтижелер таңдалған фильтрлерге сәйкес жаңартылды.'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">
            {language === 'ru' ? 'Транспорт и запчасти' : 'Көлік және бөлшектер'}
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
                  <div className="px-4 pb-4 overflow-y-auto max-h-[70vh]">
                    <TransportFilters 
                      filters={filters}
                      onFilterChange={setFilters}
                      onReset={resetFilters}
                      onSearch={handleApplyFilters}
                      brands={getBrandsForActiveTab()}
                      activeFiltersCount={activeFiltersCount}
                      commercialTypes={activeTab === 'commercial' ? commercialTypes : []}
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
                    brands={getBrandsForActiveTab()}
                    activeFiltersCount={activeFiltersCount}
                    commercialTypes={activeTab === 'commercial' ? commercialTypes : []}
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
        
        {/* Category tabs */}
        <Tabs defaultValue="cars" value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="w-full md:w-auto grid grid-cols-4 md:inline-flex">
            <TabsTrigger value="cars" className="flex flex-col md:flex-row items-center gap-1">
              <Car className="h-4 w-4" />
              <span>{language === 'ru' ? 'Легковые' : 'Жеңіл'}</span>
            </TabsTrigger>
            <TabsTrigger value="motorcycles" className="flex flex-col md:flex-row items-center gap-1">
              <Bike className="h-4 w-4" />
              <span>{language === 'ru' ? 'Мотоциклы' : 'Мотоциклдер'}</span>
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex flex-col md:flex-row items-center gap-1">
              <Truck className="h-4 w-4" />
              <span>{language === 'ru' ? 'Коммерческие' : 'Коммерциялық'}</span>
            </TabsTrigger>
            <TabsTrigger value="parts" className="flex flex-col md:flex-row items-center gap-1">
              <Wrench className="h-4 w-4" />
              <span>{language === 'ru' ? 'Запчасти' : 'Бөлшектер'}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Показываем фильтры на десктопе всегда */}
          {!isMobile && (
            <div className="hidden lg:block">
              <TransportFilters 
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
                onSearch={handleApplyFilters}
                brands={getBrandsForActiveTab()}
                activeFiltersCount={activeFiltersCount}
                commercialTypes={activeTab === 'commercial' ? commercialTypes : []}
              />
            </div>
          )}
          
          <div className="lg:col-span-3">
            {isMapOpen && (
              <div className="w-full h-[400px] mb-6 rounded-lg overflow-hidden border">
                <TransportMap 
                  listings={transportListings} 
                  onListingClick={() => {}} 
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {transportListings.map((listing) => (
                <TransportCard 
                  key={listing.id} 
                  listing={listing} 
                  variant="default"
                  viewMode={gridView ? 'grid' : 'list'}
                />
              ))}
              
              {transportListings.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">
                    {language === 'ru' 
                      ? 'Объявления не найдены' 
                      : 'Хабарландырулар табылмады'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TransportPage;
