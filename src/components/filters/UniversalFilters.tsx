
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { supabase } from '@/integrations/supabase/client';

export interface UniversalFiltersData {
  condition?: 'new' | 'used' | 'any';
  priceRange: {
    min?: number;
    max?: number;
  };
  location: {
    regionId?: number;
    cityId?: number;
  };
}

interface UniversalFiltersProps {
  filters: UniversalFiltersData;
  onFilterChange: (filters: UniversalFiltersData) => void;
  onReset: () => void;
  onSearch: () => void;
}

interface Region {
  id: number;
  name_ru: string;
  name_kz: string;
}

interface City {
  id: number;
  name_ru: string;
  name_kz: string;
  region_id: number;
}

export function UniversalFilters({ filters, onFilterChange, onReset, onSearch }: UniversalFiltersProps) {
  const { language } = useAppWithTranslations();
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  
  // Load regions from Supabase
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('*')
          .order('name_ru');
        
        if (error) throw error;
        setRegions(data || []);
      } catch (error) {
        console.error('Error loading regions:', error);
      }
    };
    
    loadRegions();
  }, []);
  
  // Load cities from Supabase
  useEffect(() => {
    const loadCities = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name_ru');
        
        if (error) throw error;
        setCities(data || []);
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };
    
    loadCities();
  }, []);
  
  // Filter cities by selected region
  useEffect(() => {
    if (filters.location.regionId) {
      const regionCities = cities.filter(city => city.region_id === filters.location.regionId);
      setFilteredCities(regionCities);
    } else {
      setFilteredCities(cities);
    }
  }, [filters.location.regionId, cities]);
  
  const handleConditionChange = (value: string) => {
    onFilterChange({
      ...filters,
      condition: value === 'any' ? undefined : value as 'new' | 'used'
    });
  };
  
  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: numValue
      }
    });
  };
  
  const handleRegionChange = (value: string) => {
    const regionId = value ? parseInt(value) : undefined;
    onFilterChange({
      ...filters,
      location: {
        regionId,
        cityId: undefined // Reset city when region changes
      }
    });
  };
  
  const handleCityChange = (value: string) => {
    const cityId = value ? parseInt(value) : undefined;
    onFilterChange({
      ...filters,
      location: {
        ...filters.location,
        cityId
      }
    });
  };
  
  const handleReset = () => {
    onReset();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {language === 'ru' ? 'Фильтры' : 'Сүзгілер'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Condition Filter */}
        <div className="space-y-2">
          <Label>{language === 'ru' ? 'Состояние' : 'Жағдайы'}</Label>
          <Select 
            value={filters.condition || 'any'} 
            onValueChange={handleConditionChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">
                {language === 'ru' ? 'Любое' : 'Кез келген'}
              </SelectItem>
              <SelectItem value="new">
                {language === 'ru' ? 'Новое' : 'Жаңа'}
              </SelectItem>
              <SelectItem value="used">
                {language === 'ru' ? 'Б/у' : 'Қолданылған'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Price Range Filter */}
        <div className="space-y-2">
          <Label>{language === 'ru' ? 'Цена' : 'Бағасы'}</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={language === 'ru' ? 'От' : 'Бастап'}
              value={filters.priceRange.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <Input
              type="number"
              placeholder={language === 'ru' ? 'До' : 'Дейін'}
              value={filters.priceRange.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>
        
        {/* Region Filter */}
        <div className="space-y-2">
          <Label>{language === 'ru' ? 'Регион' : 'Аймақ'}</Label>
          <Select 
            value={filters.location.regionId?.toString() || ''} 
            onValueChange={handleRegionChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={language === 'ru' ? 'Выберите регион' : 'Аймақты таңдаңыз'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {language === 'ru' ? 'Все регионы' : 'Барлық аймақтар'}
              </SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {language === 'ru' ? region.name_ru : region.name_kz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* City Filter */}
        <div className="space-y-2">
          <Label>{language === 'ru' ? 'Город' : 'Қала'}</Label>
          <Select 
            value={filters.location.cityId?.toString() || ''} 
            onValueChange={handleCityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={language === 'ru' ? 'Выберите город' : 'Қаланы таңдаңыз'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {language === 'ru' ? 'Все города' : 'Барлық қалалар'}
              </SelectItem>
              {filteredCities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {language === 'ru' ? city.name_ru : city.name_kz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onSearch} className="flex-1">
            {language === 'ru' ? 'Найти' : 'Табу'}
          </Button>
          <Button onClick={handleReset} variant="outline">
            {language === 'ru' ? 'Сбросить' : 'Тазалау'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
