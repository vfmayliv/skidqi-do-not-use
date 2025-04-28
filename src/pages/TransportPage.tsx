import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TransportCard } from '@/components/transport/TransportCard';
import { TransportMap } from '@/components/transport/TransportMap';
import { TransportFilters } from '@/components/transport/TransportFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Car, ArrowUpDown, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';
import { useAppContext } from '@/contexts/AppContext';
import { transportData } from '@/data/transportData';
import { categories } from '@/data/categories';
import {
  CarType,
  TransmissionType,
  DriveType,
  FuelType,
  SteeringWheelType,
  VehicleFeature,
  SortOption,
  BrandData,
  LocalizedText
} from '@/types/listingType';
import { mockListings } from '@/data/mockListings';
import { useToast } from '@/components/ui/use-toast';

const TransportPage = () => {
  const isMobile = useMobile();
  const { language } = useAppContext();
  const { toast } = useToast();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [brandsSearchQuery, setBrandsSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<Array<string | BrandData>>([]);
  const [availableBrands, setAvailableBrands] = useState<Array<string | BrandData>>([]);
  
  const toggleBrand = (brand: string | BrandData) => {
    setSelectedBrands((prevSelectedBrands) => {
      if (prevSelectedBrands.some(selectedBrand => 
        typeof selectedBrand === 'string' ? selectedBrand === brand :
        typeof brand === 'string' ? false :
        selectedBrand.id === brand.id
      )) {
        return prevSelectedBrands.filter(selectedBrand =>
          typeof selectedBrand === 'string' ? selectedBrand !== brand :
          typeof brand === 'string' ? true :
          selectedBrand.id !== brand.id
        );
      } else {
        return [...prevSelectedBrands, brand];
      }
    });
  };
  
  useEffect(() => {
    const allBrands = transportData.map(item => item.brand);
    setAvailableBrands([...new Set(allBrands)]);
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
      title: language === 'ru' ? 'Фильтры применены' : 'Фильтрлер қолданылды',
      description: language === 'ru' 
        ? 'Результаты обновлены в соответствии с выбранными фильтрами.' 
        : 'Нәтижелер таңдалған фильтрлерге сәйкес жаңартылды.',
    });
  };
  
  return (
    
      
        
        
          
            {language === 'ru' ? 'Транспорт' : 'Көлік'}
          
          
            
              
                
                  
                    
                      
                        
                          
                            
                              
                                {language === 'ru' ? 'Марка' : 'Марка'}
