
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  BellPlus, 
  Car,
  Grid3X3, 
  List, 
  MapPin, 
  MessageSquarePlus, 
  Search, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { 
  TransportFilters as TransportFiltersType,
  VehicleType,
  EngineType,
  TransmissionType,
  DriveType,
  BodyType,
  ConditionType,
  SteeringWheelType,
  VehicleFeature,
  SortOption
} from '@/types/listingType';
import { mockListings } from '@/data/mockListings';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransportFiltersComponent from '@/components/transport/TransportFilters';
import TransportCard from '@/components/transport/TransportCard';
import TransportMap from '@/components/transport/TransportMap';
import { carBrands, motorcycleBrands, commercialTypes } from '@/data/transportData';

const TransportPage = () => {
  const { language, city } = useAppContext();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get vehicle type from URL params
  const typeParam = searchParams.get('type');
  
  // Initialize filters with all required properties
  const [filters, setFilters] = useState<TransportFiltersType>({
    vehicleTypes: null, // Add required property
    priceRange: { min: null, max: null },
    vehicleType: typeParam ? VehicleType.CAR : null,
    brands: null,
    models: null,
    yearRange: { min: null, max: null },
    mileageRange: { min: null, max: null },
    engineTypes: null,
    engineVolumeRange: { min: null, max: null },
    transmissions: null,
    driveTypes: null,
    bodyTypes: null,
    colors: null,
    conditions: null, // Add required property
    condition: null,
    hasPhoto: true,
    steeringWheel: null,
    customsCleared: null,
    exchange: null, // Add required property 
    inStock: null,
    exchangePossible: null,
    withoutAccidents: null,
    withServiceHistory: null,
    features: null,
    sortBy: null,
    city: null, // Add required property
    commercialType: null
  });
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<TransportFiltersType>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      vehicleTypes: null, // Add required property
      priceRange: { min: null, max: null },
      vehicleType: filters.vehicleType,
      brands: null,
      models: null,
      yearRange: { min: null, max: null },
      mileageRange: { min: null, max: null },
      engineTypes: null,
      engineVolumeRange: { min: null, max: null },
      transmissions: null,
      driveTypes: null,
      bodyTypes: null,
      colors: null,
      conditions: null, // Add required property
      condition: null,
      hasPhoto: true,
      steeringWheel: null,
      customsCleared: null,
      exchange: null, // Add required property
      inStock: null,
      exchangePossible: null,
      withoutAccidents: null,
      withServiceHistory: null,
      features: null,
      sortBy: null,
      city: null, // Add required property
      commercialType: null
    });
    
    toast({
      title: language === 'ru' ? 'Фильтры сброшены' : 'Сүзгілер тазартылды',
      description: language === 'ru' ? 'Все фильтры были сброшены' : 'Барлық сүзгілер тазартылды',
    });
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = (id: string) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(id);
      const newFavorites = isFavorite
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      toast({
        title: language === 'ru' 
          ? (isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное')
          : (isFavorite ? 'Таңдаулылардан алынды' : 'Таңдаулыларға қосылды'),
      });
      
      return newFavorites;
    });
  };

  
  // Get transport listings from mock data
  const transportListings = mockListings.filter(listing => listing.categoryId === 'transport');
  
  // Extend the transport listings with vehicle data for demonstration
  const listingsWithExtendedData = transportListings.map(listing => {
    // Generate random data for demonstration
    const brand = carBrands[Math.floor(Math.random() * carBrands.length)].id;
    const models = {
      'toyota': ['Camry', 'RAV4', 'Land Cruiser', 'Corolla'],
      'mercedes': ['E-Class', 'S-Class', 'GLC', 'GLE'],
      'bmw': ['3 Series', '5 Series', 'X5', 'X3'],
      'audi': ['A4', 'A6', 'Q5', 'Q7'],
      'volkswagen': ['Golf', 'Passat', 'Tiguan', 'Touareg'],
      'hyundai': ['Sonata', 'Elantra', 'Tucson', 'Santa Fe'],
      'kia': ['Sportage', 'Cerato', 'Rio', 'Sorento'],
      'lada': ['Vesta', 'Granta', 'XRAY', 'Largus'],
      'nissan': ['X-Trail', 'Qashqai', 'Juke', 'Patrol'],
      'ford': ['Focus', 'Mondeo', 'Kuga', 'Explorer'],
      'chevrolet': ['Cruze', 'Aveo', 'Captiva', 'Tahoe'],
      'renault': ['Logan', 'Duster', 'Kaptur', 'Arkana']
    };
    
    const selectedModels = (models as any)[brand] || ['Model S', 'Model 3'];
    const model = selectedModels[Math.floor(Math.random() * selectedModels.length)];
    
    // Vehicle type based on subcategory
    const vehicleType = listing.subcategoryId === 'cars' 
      ? VehicleType.CAR 
      : listing.subcategoryId === 'motorcycles'
        ? VehicleType.MOTORCYCLE
        : VehicleType.CAR;
    
    // Random year between 2000 and 2023
    const year = 2000 + Math.floor(Math.random() * 24);
    
    // Random mileage
    const mileage = Math.floor(Math.random() * 200000);
    
    // Random engine type
    const engineTypes = [
      EngineType.PETROL, 
      EngineType.DIESEL, 
      EngineType.HYBRID, 
      EngineType.ELECTRIC
    ];
    const engineType = engineTypes[Math.floor(Math.random() * engineTypes.length)];
    
    // Random engine volume
    const engineVolume = (1.0 + Math.random() * 4.0).toFixed(1);
    
    // Random transmission
    const transmissions = [
      TransmissionType.MANUAL,
      TransmissionType.AUTOMATIC,
      TransmissionType.ROBOT,
      TransmissionType.VARIATOR
    ];
    const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
    
    // Random drive type
    const driveTypes = [DriveType.FRONT, DriveType.REAR, DriveType.ALL_WHEEL];
    const driveType = driveTypes[Math.floor(Math.random() * driveTypes.length)];
    
    // Random body type for cars
    const bodyTypes = [
      BodyType.SEDAN,
      BodyType.HATCHBACK,
      BodyType.SUV,
      BodyType.WAGON
    ];
    const bodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    
    // Random colors
    const colors = ['white', 'black', 'silver', 'red', 'blue', 'gray'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random condition
    const conditions = [
      ConditionType.EXCELLENT,
      ConditionType.GOOD,
      ConditionType.FAIR
    ];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Random coordinates for map view
    const randomLat = 43.2 + Math.random() * 0.1;  // Примерные координаты Алматы
    const randomLng = 76.85 + Math.random() * 0.2;
    
    return {
      ...listing,
      vehicleType,
      brand,
      model,
      year,
      mileage,
      engineType,
      engineVolume: parseFloat(engineVolume),
      enginePower: Math.floor(Math.random() * 300) + 100,
      transmission,
      driveType,
      bodyType: vehicleType === VehicleType.CAR ? bodyType : undefined,
      color,
      condition,
      owners: Math.floor(Math.random() * 3) + 1,
      inStock: Math.random() > 0.2,
      vin: Math.random().toString(36).substring(2, 12).toUpperCase(),
      registrationPlate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 1000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      steeringWheel: Math.random() > 0.1 ? SteeringWheelType.LEFT : SteeringWheelType.RIGHT,
      customsCleared: Math.random() > 0.2,
      exchangePossible: Math.random() > 0.5,
      technicalInspection: Math.random() > 0.2,
      accidentHistory: Math.random() > 0.7,
      servicingHistory: Math.random() > 0.5,
      features: [
        VehicleFeature.ABS,
        VehicleFeature.AIRBAGS,
        VehicleFeature.CLIMATE_CONTROL,
        VehicleFeature.CRUISE_CONTROL,
        VehicleFeature.ALLOY_WHEELS
      ].filter(() => Math.random() > 0.3),
      coordinates: {
        lat: randomLat,
        lng: randomLng
      },
      address: `${listing.city[language]}, район ${Math.floor(Math.random() * 10) + 1}`
    };
  });
  
  // Apply filters to listings
  const filteredListings = listingsWithExtendedData.filter(listing => {
    
    // Vehicle type filter
    if (filters.vehicleType && listing.vehicleType !== filters.vehicleType) {
      return false;
    }
    
    // Commercial type filter
    if (filters.vehicleType === VehicleType.COMMERCIAL && filters.commercialType && 
        listing.commercialType !== filters.commercialType) {
      return false;
    }
    
    // Search term filter
    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      const titleMatches = listing.title[language].toLowerCase().includes(normalizedSearchTerm);
      const descriptionMatches = listing.description[language].toLowerCase().includes(normalizedSearchTerm);
      const brandModelMatches = `${listing.brand} ${listing.model}`.toLowerCase().includes(normalizedSearchTerm);
      
      if (!(titleMatches || descriptionMatches || brandModelMatches)) {
        return false;
      }
    }
    
    // Basic filters
    if (filters.priceRange.min !== null && listing.discountPrice < filters.priceRange.min) {
      return false;
    }
    
    if (filters.priceRange.max !== null && listing.discountPrice > filters.priceRange.max) {
      return false;
    }
    
    if (filters.brands && filters.brands.length > 0) {
      if (!listing.brand || !filters.brands.includes(listing.brand)) {
        return false;
      }
    }
    
    if (filters.models && filters.models.length > 0) {
      if (!listing.model || !filters.models.includes(listing.model)) {
        return false;
      }
    }
    
    if (filters.yearRange.min !== null && (!listing.year || listing.year < filters.yearRange.min)) {
      return false;
    }
    
    if (filters.yearRange.max !== null && (!listing.year || listing.year > filters.yearRange.max)) {
      return false;
    }
    
    if (filters.mileageRange.min !== null && (!listing.mileage || listing.mileage < filters.mileageRange.min)) {
      return false;
    }
    
    if (filters.mileageRange.max !== null && (!listing.mileage || listing.mileage > filters.mileageRange.max)) {
      return false;
    }
    
    if (filters.engineTypes && filters.engineTypes.length > 0) {
      if (!listing.engineType || !filters.engineTypes.includes(listing.engineType)) {
        return false;
      }
    }
    
    if (filters.engineVolumeRange.min !== null && (!listing.engineVolume || listing.engineVolume < filters.engineVolumeRange.min)) {
      return false;
    }
    
    if (filters.engineVolumeRange.max !== null && (!listing.engineVolume || listing.engineVolume > filters.engineVolumeRange.max)) {
      return false;
    }
    
    if (filters.transmissions && filters.transmissions.length > 0) {
      if (!listing.transmission || !filters.transmissions.includes(listing.transmission)) {
        return false;
      }
    }
    
    if (filters.driveTypes && filters.driveTypes.length > 0) {
      if (!listing.driveType || !filters.driveTypes.includes(listing.driveType)) {
        return false;
      }
    }
    
    if (filters.bodyTypes && filters.bodyTypes.length > 0) {
      if (!listing.bodyType || !filters.bodyTypes.includes(listing.bodyType)) {
        return false;
      }
    }
    
    if (filters.colors && filters.colors.length > 0) {
      if (!listing.color || !filters.colors.includes(listing.color)) {
        return false;
      }
    }
    
    if (filters.condition && filters.condition.length > 0) {
      if (!listing.condition || !filters.condition.includes(listing.condition)) {
        return false;
      }
    }
    
    if (filters.steeringWheel && listing.steeringWheel !== filters.steeringWheel) {
      return false;
    }
    
    if (filters.customsCleared !== null && listing.customsCleared !== filters.customsCleared) {
      return false;
    }
    
    if (filters.inStock !== null && listing.inStock !== filters.inStock) {
      return false;
    }
    
    if (filters.exchangePossible !== null && listing.exchangePossible !== filters.exchangePossible) {
      return false;
    }
    
    if (filters.withoutAccidents !== null && (filters.withoutAccidents && listing.accidentHistory)) {
      return false;
    }
    
    if (filters.withServiceHistory !== null && (filters.withServiceHistory && !listing.servicingHistory)) {
      return false;
    }
    
    if (filters.hasPhoto === true && !listing.imageUrl) {
      return false;
    }
    
    if (filters.features && filters.features.length > 0) {
      if (!listing.features || !listing.features.some(feature => filters.features?.includes(feature))) {
        return false;
      }
    }
    
    return true;
  });
  
  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case SortOption.PRICE_ASC:
          return a.discountPrice - b.discountPrice;
        case SortOption.PRICE_DESC:
          return b.discountPrice - a.discountPrice;
        case SortOption.DATE_DESC:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case SortOption.YEAR_DESC:
          return (b.year || 0) - (a.year || 0);
        case SortOption.YEAR_ASC:
          return (a.year || 0) - (b.year || 0);
        case SortOption.MILEAGE_ASC:
          return (a.mileage || 0) - (b.mileage || 0);
        case SortOption.MILEAGE_DESC:
          return (b.mileage || 0) - (a.mileage || 0);
      }
    }
    
    // Default sorting: featured first, then by date
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.priceRange.min !== null) count++;
    if (filters.priceRange.max !== null) count++;
    if (filters.brands && filters.brands.length > 0) count++;
    if (filters.models && filters.models.length > 0) count++;
    if (filters.yearRange.min !== null) count++;
    if (filters.yearRange.max !== null) count++;
    if (filters.mileageRange.min !== null) count++;
    if (filters.mileageRange.max !== null) count++;
    if (filters.engineTypes && filters.engineTypes.length > 0) count++;
    if (filters.engineVolumeRange.min !== null) count++;
    if (filters.engineVolumeRange.max !== null) count++;
    if (filters.transmissions && filters.transmissions.length > 0) count++;
    if (filters.driveTypes && filters.driveTypes.length > 0) count++;
    if (filters.bodyTypes && filters.bodyTypes.length > 0) count++;
    if (filters.colors && filters.colors.length > 0) count++;
    if (filters.condition && filters.condition.length > 0) count++;
    if (filters.steeringWheel !== null) count++;
    if (filters.customsCleared !== null) count++;
    if (filters.inStock !== null) count++;
    if (filters.exchangePossible !== null) count++;
    if (filters.withoutAccidents !== null) count++;
    if (filters.withServiceHistory !== null) count++;
    if (filters.hasPhoto !== null) count++;
    if (filters.features && filters.features.length > 0) count++;
    
    return count;
  };
  
  
  // Get label for active filter
  const getFilterLabel = (key: string, value: any) => {
    switch(key) {
      case 'vehicleType':
        const vehicleLabels = {
          [VehicleType.CAR]: { ru: 'Автомобиль', kz: 'Автокөлік' },
          [VehicleType.MOTORCYCLE]: { ru: 'Мотоцикл', kz: 'Мотоцикл' },
          [VehicleType.COMMERCIAL]: { ru: 'Коммерческий', kz: 'Коммерциялық' },
        };
        return vehicleLabels[value]?.[language] || '';
      
      case 'commercialType':
        if (value) {
          const commercialTypeObj = commercialTypes.find(t => t.id === value);
          return commercialTypeObj ? commercialTypeObj.name[language] : value;
        }
        return '';
      
      case 'brands':
        if (Array.isArray(value) && value.length > 0) {
          return value.map(brand => {
            const brandObj = carBrands.find(b => b.id === brand);
            return brandObj ? brandObj.name[language] : brand;
          }).join(', ');
        }
        return '';
      
      case 'engineTypes':
        if (Array.isArray(value) && value.length > 0) {
          const engineLabels = {
            [EngineType.PETROL]: { ru: 'Бензин', kz: 'Бензин' },
            [EngineType.DIESEL]: { ru: 'Дизель', kz: 'Дизель' },
            [EngineType.GAS]: { ru: 'Газ', kz: 'Газ' },
            [EngineType.HYBRID]: { ru: 'Гибрид', kz: 'Гибрид' },
            [EngineType.ELECTRIC]: { ru: 'Электро', kz: 'Электр' },
            [EngineType.PETROL_GAS]: { ru: 'Бензин/Газ', kz: 'Бензин/Газ' },
          };
          return value.map(type => engineLabels[type][language]).join(', ');
        }
        return '';
      
      case 'transmissions':
        if (Array.isArray(value) && value.length > 0) {
          const transmissionLabels = {
            [TransmissionType.MANUAL]: { ru: 'Механика', kz: 'Механика' },
            [TransmissionType.AUTOMATIC]: { ru: 'Автомат', kz: 'Автомат' },
            [TransmissionType.ROBOT]: { ru: 'Робот', kz: 'Робот' },
            [TransmissionType.VARIATOR]: { ru: 'Вариатор', kz: 'Вариатор' },
          };
          return value.map(type => transmissionLabels[type][language]).join(', ');
        }
        return '';
      
      case 'driveTypes':
        if (Array.isArray(value) && value.length > 0) {
          const driveLabels = {
            [DriveType.FRONT]: { ru: 'Передний', kz: 'Алдыңғы' },
            [DriveType.REAR]: { ru: 'Задний', kz: 'Артқы' },
            [DriveType.ALL_WHEEL]: { ru: 'Полный', kz: 'Толық' },
            [DriveType.FULL]: { ru: '4WD', kz: '4WD' },
          };
          return value.map(type => driveLabels[type][language]).join(', ');
        }
        return '';
      
      case 'bodyTypes':
        if (Array.isArray(value) && value.length > 0) {
          const bodyLabels = {
            [BodyType.SEDAN]: { ru: 'Седан', kz: 'Седан' },
            [BodyType.HATCHBACK]: { ru: 'Хэтчбек', kz: 'Хэтчбек' },
            [BodyType.SUV]: { ru: 'Внедорожник', kz: 'Жол талғамайтын' },
            [BodyType.PICKUP]: { ru: 'Пикап', kz: 'Пикап' },
            [BodyType.MINIVAN]: { ru: 'Минивэн', kz: 'Минивэн' },
            [BodyType.WAGON]: { ru: 'Универсал', kz: 'Универсал' },
            [BodyType.COUPE]: { ru: 'Купе', kz: 'Купе' },
            [BodyType.CABRIOLET]: { ru: 'Кабриолет', kz: 'Кабриолет' },
          };
          return value.map(type => bodyLabels[type][language]).join(', ');
        }
        return '';
      
      default:
        return '';
    }
  };
  
  // Render active filter badge
  const renderActiveFilter = (key: string, value: any, label: string) => {
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      return null;
    }
    
    let displayValue = '';
    
    // Handle ranges
    if (key.includes('Range') && typeof value === 'object') {
      const min = value.min !== null ? value.min : '';
      const max = value.max !== null ? value.max : '';
      
      if (min === '' && max === '') return null;
      
      displayValue = min !== '' && max !== '' 
        ? `${min} - ${max}` 
        : min !== '' 
          ? `от ${min}` 
          : `до ${max}`;
          
      if (key === 'priceRange') displayValue += ' ₸';
      if (key === 'engineVolumeRange') displayValue += ' л';
      if (key === 'mileageRange') displayValue += ' км';
    } 
    // Handle arrays
    else if (Array.isArray(value)) {
      displayValue = getFilterLabel(key, value);
    }
    // Handle booleans
    else if (typeof value === 'boolean') {
      displayValue = value ? (language === 'ru' ? 'Да' : 'Иә') : '';
    }
    // Handle single values
    else if (value !== null) {
      displayValue = getFilterLabel(key, value);
    }
    
    return (
      <Badge key={key} variant="secondary" className="flex items-center gap-1">
        {label}: {displayValue}
        <X 
          className="h-3 w-3 cursor-pointer ml-1" 
          onClick={() => {
            // Reset filter value based on type
            if (key.includes('Range')) {
              const resetRange = { min: null, max: null };
              handleFilterChange({ [key]: resetRange });
            } else if (Array.isArray(value)) {
              handleFilterChange({ [key]: null });
            } else if (typeof value === 'boolean' || typeof value === 'string') {
              handleFilterChange({ [key]: null });
            }
          }}
        />
      </Badge>
    );
  };
  
  // Tab change handler
  const handleTabChange = (value: string) => {
    switch(value) {
      case 'cars':
        handleFilterChange({ vehicleType: VehicleType.CAR, commercialType: null });
        break;
      case 'motorcycles':
        handleFilterChange({ vehicleType: VehicleType.MOTORCYCLE, commercialType: null });
        break;
      case 'commercial':
        handleFilterChange({ vehicleType: VehicleType.COMMERCIAL, commercialType: null });
        break;
      case 'all':
      default:
        handleFilterChange({ vehicleType: null, commercialType: null });
        break;
    }
  };
  
  // Get current tab value
  const getCurrentTabValue = () => {
    switch(filters.vehicleType) {
      case VehicleType.CAR:
        return 'cars';
      case VehicleType.MOTORCYCLE:
        return 'motorcycles';
      case VehicleType.COMMERCIAL:
        return 'commercial';
      default:
        return 'all';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">
              {language === 'ru' ? 'Автомобили и транспорт' : 'Автомобильдер және көлік'}
            </h1>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {city ? city[language] : (language === 'ru' ? 'Все города' : 'Барлық қалалар')}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <BellPlus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'ru' ? 'Подписаться на обновления' : 'Жаңартуларға жазылу'}
              </span>
              <span className="sm:hidden">
                {language === 'ru' ? 'Подписаться' : 'Жазылу'}
              </span>
            </Button>
            
            <Button size="sm" asChild>
              <Link to="/create-listing">
                <MessageSquarePlus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">
                  {language === 'ru' ? 'Разместить объявление' : 'Хабарландыру орналастыру'}
                </span>
                <span className="sm:hidden">
                  {language === 'ru' ? 'Разместить' : 'Орналастыру'}
                </span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Vehicle type tabs */}
        <Tabs defaultValue={getCurrentTabValue()} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">
              {language === 'ru' ? 'Все' : 'Барлығы'}
            </TabsTrigger>
            <TabsTrigger value="cars">
              {language === 'ru' ? 'Легковые' : 'Жеңіл'}
            </TabsTrigger>
            <TabsTrigger value="motorcycles">
              {language === 'ru' ? 'Мотоциклы' : 'Мотоциклдер'}
            </TabsTrigger>
            <TabsTrigger value="commercial">
              {language === 'ru' ? 'Коммерческие' : 'Коммерциялық'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Desktop Filters */}
        <div className="hidden md:block mb-6">
          <TransportFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            onSearch={() => {
              toast({
                title: language === 'ru' ? 'Фильтры применены' : 'Сүзгілер қолданылды',
                description: `${language === 'ru' ? 'Найдено' : 'Табылды'}: ${filteredListings.length}`,
              });
            }}
            brands={filters.vehicleType === VehicleType.CAR ? carBrands : 
                    filters.vehicleType === VehicleType.MOTORCYCLE ? motorcycleBrands : []}
            activeFiltersCount={getActiveFiltersCount()}
            commercialTypes={commercialTypes}
          />
        </div>
        
        {/* Mobile Filters Button */}
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full flex justify-between items-center">
                <div className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <span>
                    {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
                  </span>
                </div>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] max-h-[90vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
                </SheetTitle>
              </SheetHeader>
              <TransportFiltersComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                onSearch={() => {
                  toast({
                    title: language === 'ru' ? 'Фильтры применены' : 'Сүзгілер қолданылды',
                    description: `${language === 'ru' ? 'Найдено' : 'Табылды'}: ${filteredListings.length}`,
                  });
                }}
                brands={filters.vehicleType === VehicleType.CAR ? carBrands : 
                        filters.vehicleType === VehicleType.MOTORCYCLE ? motorcycleBrands : []}
                activeFiltersCount={getActiveFiltersCount()}
                commercialTypes={commercialTypes}
              />
              <SheetClose asChild>
                <Button className="w-full mt-4">
                  {language === 'ru' ? 'Применить' : 'Қолдану'}
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'ru' ? 'Поиск по марке, модели или описанию' : 'Марка, үлгі немесе сипаттама бойынша іздеу'}
            className="w-full pl-10 pr-4 py-2 rounded-md border"
          />
        </div>
        
        {/* Active filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.vehicleType && renderActiveFilter('vehicleType', filters.vehicleType, language === 'ru' ? 'Тип' : 'Түрі')}
            {filters.priceRange.min !== null || filters.priceRange.max !== null ? renderActiveFilter('priceRange', filters.priceRange, language === 'ru' ? 'Цена' : 'Баға') : null}
            {filters.brands && filters.brands.length > 0 ? renderActiveFilter('brands', filters.brands, language === 'ru' ? 'Марка' : 'Маркасы') : null}
            {filters.models && filters.models.length > 0 ? renderActiveFilter('models', filters.models, language === 'ru' ? 'Модель' : 'Үлгі') : null}
            {filters.yearRange.min !== null || filters.yearRange.max !== null ? renderActiveFilter('yearRange', filters.yearRange, language === 'ru' ? 'Год' : 'Жыл') : null}
            {filters.mileageRange.min !== null || filters.mileageRange.max !== null ? renderActiveFilter('mileageRange', filters.mileageRange, language === 'ru' ? 'Пробег' : 'Жүріс') : null}
            {filters.engineTypes && filters.engineTypes.length > 0 ? renderActiveFilter('engineTypes', filters.engineTypes, language === 'ru' ? 'Двигатель' : 'Қозғалтқыш') : null}
            {filters.engineVolumeRange.min !== null || filters.engineVolumeRange.max !== null ? renderActiveFilter('engineVolumeRange', filters.engineVolumeRange, language === 'ru' ? 'Объем' : 'Көлем') : null}
            {filters.transmissions && filters.transmissions.length > 0 ? renderActiveFilter('transmissions', filters.transmissions, language === 'ru' ? 'КПП' : 'БҚ') : null}
            {filters.driveTypes && filters.driveTypes.length > 0 ? renderActiveFilter('driveTypes', filters.driveTypes, language === 'ru' ? 'Привод' : 'Жетек') : null}
            {filters.bodyTypes && filters.bodyTypes.length > 0 ? renderActiveFilter('bodyTypes', filters.bodyTypes, language === 'ru' ? 'Кузов' : 'Корпус') : null}
            {filters.condition && filters.condition.length > 0 ? renderActiveFilter('condition', filters.condition, language === 'ru' ? 'Состояние' : 'Жағдайы') : null}
            {filters.steeringWheel !== null ? renderActiveFilter('steeringWheel', filters.steeringWheel, language === 'ru' ? 'Руль' : 'Руль') : null}
            
            {filters.customsCleared !== null ? renderActiveFilter('customsCleared', filters.customsCleared, language === 'ru' ? 'Растаможен' : 'Кеден тазартылған') : null}
            {filters.inStock !== null ? renderActiveFilter('inStock', filters.inStock, language === 'ru' ? 'В наличии' : 'Қолда бар') : null}
            {filters.exchangePossible !== null ? renderActiveFilter('exchangePossible', filters.exchangePossible, language === 'ru' ? 'Обмен' : 'Айырбас') : null}
            {filters.withoutAccidents !== null ? renderActiveFilter('withoutAccidents', filters.withoutAccidents, language === 'ru' ? 'Без ДТП' : 'Апатсыз') : null}
            {filters.withServiceHistory !== null ? renderActiveFilter('withServiceHistory', filters.withServiceHistory, language === 'ru' ? 'Сервисная история' : 'Қызмет тарихы') : null}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters} 
              className="text-muted-foreground"
            >
              {language === 'ru' ? 'Сбросить все' : 'Барлығын тазалау'}
            </Button>
          </div>
        )}
        
        {/* Sort and View Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground mr-2">
              {language === 'ru' ? 'Найдено' : 'Табылды'}: {filteredListings.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('map')}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Listings Grid/List */}
        {viewMode !== 'map' && (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {sortedListings.length > 0 ? (
              sortedListings.map(listing => (
                <TransportCard
                  key={listing.id}
                  listing={listing}
                  variant={viewMode === 'list' ? 'horizontal' : 'default'}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={favorites.includes(listing.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <Car className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">
                  {language === 'ru' ? 'Нет объявлений' : 'Хабарландырулар жоқ'}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Попробуйте изменить параметры фильтрации или создайте новое объявление' 
                    : 'Сүзу параметрлерін өзгертіп көріңіз немесе жаңа хабарландыру жасаңыз'}
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/create-listing">
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                    {language === 'ru' ? 'Разместить объявление' : 'Хабарландыру орналастыру'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Map View */}
        {viewMode === 'map' && (
          <div className="h-[600px] rounded-lg overflow-hidden">
            <TransportMap
              listings={sortedListings}
              onListingClick={(listing) => {
                window.location.href = `/listing/${listing.id}`;
              }}
              className="w-full h-full"
              showListToggle
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TransportPage;
