
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
import { X } from 'lucide-react';

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

  // Safely access filter properties with defaults
  const safeFilters = {
    propertyTypes: filters?.propertyTypes || null,
    regionId: filters?.regionId || null,
    cityId: filters?.cityId || null,
    microdistrictId: filters?.microdistrictId || null,
    ...filters
  };

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
    if (safeFilters.buildingTypes?.includes(buildingType)) {
      onFilterChange({ buildingTypes: safeFilters.buildingTypes.filter(type => type !== buildingType) });
    } else {
      onFilterChange({ buildingTypes: [...(safeFilters.buildingTypes || []), buildingType] });
    }
  };

  const handlePropertyTypeChange = (propertyType: PropertyType) => {
    if (safeFilters.propertyTypes?.includes(propertyType)) {
      onFilterChange({ propertyTypes: safeFilters.propertyTypes.filter(type => type !== propertyType) });
    } else {
      onFilterChange({ propertyTypes: [...(safeFilters.propertyTypes || []), propertyType] });
    }
  };

  const handleDistrictChange = (districtId: string) => {
    if (safeFilters.districts?.includes(districtId)) {
      onFilterChange({ districts: safeFilters.districts.filter(id => id !== districtId) });
    } else {
      onFilterChange({ districts: [...(safeFilters.districts || []), districtId] });
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

  const handleSortByChange = (sortBy: string) => {
    onFilterChange({ sortBy });
  };

  // Function to handle location changes
  const handleLocationChange = (locationParams: { regionId?: string | null; cityId?: string | null; microdistrictId?: string | null }) => {
    onFilterChange(locationParams);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">
          {t('location', 'Местоположение')}
        </p>
        <LocationFilter 
          regionId={safeFilters.regionId}
          cityId={safeFilters.cityId}
          microdistrictId={safeFilters.microdistrictId}
          onLocationChange={handleLocationChange}
        />
      </div>
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">{t('propertyType', 'Тип недвижимости')}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={safeFilters.propertyTypes?.includes(PropertyType.APARTMENT) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePropertyTypeChange(PropertyType.APARTMENT)}
          >
            {t('apartment', 'Квартира')}
          </Button>
          <Button
            variant={safeFilters.propertyTypes?.includes(PropertyType.HOUSE) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePropertyTypeChange(PropertyType.HOUSE)}
          >
            {t('house', 'Дом')}
          </Button>
          <Button
            variant={safeFilters.propertyTypes?.includes(PropertyType.COMMERCIAL) ? 'default' : 'outline'}
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
