import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyType, BuildingType, ConditionType, SortOptions, PropertyFilters as PropertyFiltersType, PropertyFilterConfig } from '@/types/listingType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AdvancedPropertyFilters from './AdvancedPropertyFilters';
import { LocationFilter } from './LocationFilter';
import { X } from 'lucide-react';
import { filtersConfig } from '@/config/filtersConfig';

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFilterChange: (filters: Partial<PropertyFiltersType>) => void;
  onReset: () => void;
  onSearch: () => void;
  districts: any[];
  activeFiltersCount?: number;
  config: PropertyFilterConfig;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters = {} as PropertyFiltersType, // Provide default empty object
  onFilterChange,
  onReset,
  onSearch,
  districts,
  activeFiltersCount = 0,
  config
}) => {
  const { t } = useTranslation();
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Safely access nested properties with optional chaining and default values
  const safeFilters = {
    ...filters,
    propertyTypes: filters.propertyTypes || [],
  };

  const handlePropertyTypeChange = (propertyType: PropertyType) => {
    const currentTypes = safeFilters.propertyTypes.slice();
    const index = currentTypes.indexOf(propertyType);

    if (index > -1) {
      currentTypes.splice(index, 1);
    } else {
      currentTypes.push(propertyType);
    }
    onFilterChange({ propertyTypes: currentTypes });
  };

  const currentFilterConfig = useMemo(() => {
    const { dealType, segment } = filters;
    if (dealType && segment && filtersConfig[dealType] && filtersConfig[dealType][segment]) {
        return filtersConfig[dealType][segment];
    }
    return { propertyTypes: [] }; // Return a default empty config
  }, [filters.dealType, filters.segment]);

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm space-y-4">
      {/* Dynamic Property Types */}
      <div>
        <p className="text-sm font-medium mb-2">{t('propertyType', 'Тип недвижимости')}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {currentFilterConfig.propertyTypes.map((typeOption) => (
            <div key={typeOption.value} className="flex items-center space-x-2">
              <Checkbox
                id={typeOption.value}
                checked={safeFilters.propertyTypes.includes(typeOption.value)}
                onCheckedChange={() => handlePropertyTypeChange(typeOption.value)}
              />
              <label
                htmlFor={typeOption.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t(typeOption.label, typeOption.label.replace('property_type_', ''))}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      {config.showPrice && (
        <div>
          <Label htmlFor="price-range">{t('priceRange', 'Цена')}</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="number"
              placeholder={t('from', 'От')}
              value={filters.priceMin || ''}
              onChange={(e) => onFilterChange({ priceMin: Number(e.target.value) })}
              className="w-full"
            />
            <Input
              type="number"
              placeholder={t('to', 'До')}
              value={filters.priceMax || ''}
              onChange={(e) => onFilterChange({ priceMax: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Other filters remain unchanged... */}
      {/* Area, Rooms, Location etc. */}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-4">
        <Button onClick={onSearch} className="w-full sm:w-auto flex-grow">
          {t('search', 'Поиск')}
          {activeFiltersCount > 0 && <span className="ml-2 bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">{activeFiltersCount}</span>}
        </Button>
        <Button variant="outline" onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)} className="w-full sm:w-auto">
          {t('advancedFilters', 'Расширенные фильтры')}
        </Button>
        <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto text-sm">
          <X className="w-4 h-4 mr-1" />
          {t('reset', 'Сбросить')}
        </Button>
      </div>

      {isAdvancedFiltersOpen && (
        <AdvancedPropertyFilters 
          filters={filters} 
          onFilterChange={onFilterChange} 
          config={config} 
        />
      )}
    </div>
  );
};

export default PropertyFilters;
