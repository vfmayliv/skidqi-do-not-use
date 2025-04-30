import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PropertyType,
  BuildingType,
  ConditionType,
  SortOption,
  PropertyFilters as PropertyFiltersType,
  PropertyFilterConfig,
} from '@/types/listingType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AdvancedPropertyFilters from './AdvancedPropertyFilters';
import { LocationFilter } from './LocationFilter';
import { X } from 'lucide-react'; // Добавить импорт X из lucide-react, если его нет

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
  filters,
  onFilterChange,
  onReset,
  onSearch,
  districts,
  activeFiltersCount = 0,
  config
}) => {
  const { t } = useTranslation();
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  const handlePriceRangeChange = (value: number[]) => {
    onFilterChange({ priceRange: { min: value[0], max: value[1] } });
  };

  const handleAreaRangeChange = (value: number[]) => {
    onFilterChange({ areaRange: { min: value[0], max: value[1] } });
  };

  const handleFloorRangeChange = (value: number[]) => {
    onFilterChange({ floorRange: { min: value[0], max: value[1] } });
  };

  const handleBuildingTypeChange = (buildingType: BuildingType) => {
    if (filters.buildingTypes?.includes(buildingType)) {
      onFilterChange({ buildingTypes: filters.buildingTypes.filter(type => type !== buildingType) });
    } else {
      onFilterChange({ buildingTypes: [...(filters.buildingTypes || []), buildingType] });
    }
  };

  const handlePropertyTypeChange = (propertyType: PropertyType) => {
    if (filters.propertyTypes?.includes(propertyType)) {
      onFilterChange({ propertyTypes: filters.propertyTypes.filter(type => type !== propertyType) });
    } else {
      onFilterChange({ propertyTypes: [...(filters.propertyTypes || []), propertyType] });
    }
  };

  const handleDistrictChange = (districtId: string) => {
    if (filters.districts?.includes(districtId)) {
      onFilterChange({ districts: filters.districts.filter(id => id !== districtId) });
    } else {
      onFilterChange({ districts: [...(filters.districts || []), districtId] });
    }
  };

  const handleHasPhotoChange = (checked: boolean) => {
    onFilterChange({ hasPhoto: checked });
  };

  const handleOnlyNewBuildingChange = (checked: boolean) => {
    onFilterChange({ onlyNewBuilding: checked });
  };

  const handleFurnishedChange = (checked: boolean) => {
    onFilterChange({ furnished: checked });
  };

  const handleSortByChange = (sortBy: SortOption) => {
    onFilterChange({ sortBy });
  };

  // Функция для обработки изменений местоположения
  const handleLocationChange = (locationParams: { regionId?: string | null; cityId?: string | null; microdistrictId?: string | null }) => {
    onFilterChange({
      ...locationParams
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">
          {t('location', 'Местоположение')}
        </p>
        <LocationFilter 
          regionId={filters.regionId}
          cityId={filters.cityId}
          microdistrictId={filters.microdistrictId}
          onLocationChange={handleLocationChange}
        />
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">{t('propertyType', 'Тип недвижимости')}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.propertyTypes?.includes(PropertyType.APARTMENT) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePropertyTypeChange(PropertyType.APARTMENT)}
          >
            {t('apartment', 'Квартира')}
          </Button>
          <Button
            variant={filters.propertyTypes?.includes(PropertyType.HOUSE) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePropertyTypeChange(PropertyType.HOUSE)}
          >
            {t('house', 'Дом')}
          </Button>
          <Button
            variant={filters.propertyTypes?.includes(PropertyType.COMMERCIAL) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePropertyTypeChange(PropertyType.COMMERCIAL)}
          >
            {t('commercial', 'Коммерческая')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
