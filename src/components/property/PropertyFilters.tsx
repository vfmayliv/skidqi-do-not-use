import React, { useState, useMemo } from 'react';
import { usePropertyFiltersStore } from '@/store/usePropertyFiltersStore';
import { filtersConfig, PropertyTypeOption, FilterVisibility } from '@/config/filtersConfig';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BuildingType, RenovationType, BathroomType } from '@/types/listingType';
import { Filter, Search, X } from 'lucide-react';

const PropertyFilters: React.FC = () => {
  const { dealType, segment, filters, setFilters, resetFilters } = usePropertyFiltersStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const config = filtersConfig[dealType]?.[segment];

  const activeFiltersVisibility = useMemo((): FilterVisibility => {
    if (!config || !filters.propertyType || filters.propertyType.length === 0) {
      // If no property type is selected, show a default set of filters (e.g., for all residential)
      const allResidentialTypes = filtersConfig.buy.residential.propertyTypes;
      const combined = allResidentialTypes.reduce((acc, p) => ({ ...acc, ...p.filters }), {});
      return combined;
    }

    const selectedTypesConfig = config.propertyTypes.filter(p => filters.propertyType.includes(p.value));
    if (selectedTypesConfig.length === 0) return {};

    // Combine visibilities: a filter is shown if it's true for AT LEAST ONE selected type
    const combinedVisibility = selectedTypesConfig.reduce((acc, current) => {
      for (const key in current.filters) {
        if (current.filters[key as keyof FilterVisibility]) {
          acc[key as keyof FilterVisibility] = true;
        }
      }
      return acc;
    }, {} as FilterVisibility);

    return combinedVisibility;
  }, [config, filters.propertyType]);

  const handleCheckboxChange = (propertyType: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(propertyType)
      ? currentTypes.filter(pt => pt !== propertyType)
      : [...currentTypes, propertyType];
    setFilters({ propertyType: newTypes });
  };
  
  const handleRoomsChange = (roomCount: number) => {
    const currentRooms = filters.rooms || [];
    const newRooms = currentRooms.includes(roomCount)
      ? currentRooms.filter(r => r !== roomCount)
      : [...currentRooms, roomCount];
    setFilters({ rooms: newRooms });
  };

  const renderAdvancedFilters = () => (
    <Accordion type="multiple" defaultValue={['price', 'area', 'details']} className="w-full">
      {/* Price */}
      {activeFiltersVisibility.showPrice && (
        <AccordionItem value="price">
          <AccordionTrigger>Цена</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex gap-4">
              <Input placeholder="От" value={filters.price_min || ''} onChange={e => setFilters({ price_min: Number(e.target.value) })} />
              <Input placeholder="До" value={filters.price_max || ''} onChange={e => setFilters({ price_max: Number(e.target.value) })} />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
      {/* Area */}
      {activeFiltersVisibility.showArea && (
        <AccordionItem value="area">
          <AccordionTrigger>Площадь, м²</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="flex gap-4">
              <Input placeholder="От" value={filters.area_total_min || ''} onChange={e => setFilters({ area_total_min: Number(e.target.value) })} />
              <Input placeholder="До" value={filters.area_total_max || ''} onChange={e => setFilters({ area_total_max: Number(e.target.value) })} />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
       {/* Rooms - only for modal, main is outside */}
      {activeFiltersVisibility.showRooms && (
        <AccordionItem value="rooms">
            <AccordionTrigger>Количество комнат</AccordionTrigger>
            <AccordionContent className="flex flex-wrap gap-4">
                {[1, 2, 3, 4, 5].map(r => (
                    <Button key={r} variant={filters.rooms?.includes(r) ? 'default' : 'outline'} onClick={() => handleRoomsChange(r)}>{r}</Button>
                ))}
                 <Button variant={filters.rooms?.includes(6) ? 'default' : 'outline'} onClick={() => handleRoomsChange(6)}>6+</Button>
                 <Button variant={filters.rooms?.includes(0) ? 'default' : 'outline'} onClick={() => handleRoomsChange(0)}>Студия</Button>
            </AccordionContent>
        </AccordionItem>
      )}
      {/* Other details */}
      <AccordionItem value="details">
        <AccordionTrigger>Дополнительные параметры</AccordionTrigger>
        <AccordionContent className="space-y-6">
          {activeFiltersVisibility.showFloor && (
             <div className="flex gap-4">
               <Input placeholder="Этаж от" value={filters.floor_min || ''} onChange={e => setFilters({ floor_min: Number(e.target.value) })} />
               <Input placeholder="Этаж до" value={filters.floor_max || ''} onChange={e => setFilters({ floor_max: Number(e.target.value) })} />
             </div>
          )}
          {activeFiltersVisibility.showYearBuilt && (
             <div className="flex gap-4">
               <Input placeholder="Год постройки от" value={filters.year_built_min || ''} onChange={e => setFilters({ year_built_min: Number(e.target.value) })} />
             </div>
          )}
          {activeFiltersVisibility.showBuildingType && (
            <Select onValueChange={value => setFilters({ building_type: value as BuildingType })}>
                <SelectTrigger><SelectValue placeholder="Тип дома" /></SelectTrigger>
                <SelectContent>
                    {Object.values(BuildingType).map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}
                </SelectContent>
            </Select>
          )}
          {activeFiltersVisibility.showRenovation && (
             <Select onValueChange={value => setFilters({ renovation: value as RenovationType })}>
                <SelectTrigger><SelectValue placeholder="Ремонт" /></SelectTrigger>
                <SelectContent>
                    {Object.values(RenovationType).map(rt => <SelectItem key={rt} value={rt}>{rt}</SelectItem>)}
                </SelectContent>
            </Select>
          )}
          {activeFiltersVisibility.showBathroomType && (
            <Select onValueChange={value => setFilters({ bathroom_type: value as BathroomType })}>
                <SelectTrigger><SelectValue placeholder="Санузел" /></SelectTrigger>
                <SelectContent>
                    {Object.values(BathroomType).map(bmt => <SelectItem key={bmt} value={bmt}>{bmt}</SelectItem>)}
                </SelectContent>
            </Select>
          )}
          {activeFiltersVisibility.showCeilingHeight && (
             <Input placeholder="Высота потолков, м" value={filters.ceiling_height_min || ''} onChange={e => setFilters({ ceiling_height_min: Number(e.target.value) })} />
          )}
          <div className="grid grid-cols-2 gap-4">
            {activeFiltersVisibility.showFurnished && <div className="flex items-center space-x-2"><Checkbox id="furnished" checked={filters.is_furnished} onCheckedChange={c => setFilters({ is_furnished: !!c })} /><label htmlFor="furnished">Меблирована</label></div>}
            {activeFiltersVisibility.showHasBalcony && <div className="flex items-center space-x-2"><Checkbox id="balcony" checked={filters.has_balcony} onCheckedChange={c => setFilters({ has_balcony: !!c })} /><label htmlFor="balcony">Есть балкон</label></div>}
            {activeFiltersVisibility.showHasParking && <div className="flex items-center space-x-2"><Checkbox id="parking" checked={filters.has_parking} onCheckedChange={c => setFilters({ has_parking: !!c })} /><label htmlFor="parking">Есть паркинг</label></div>}
            {activeFiltersVisibility.showAllowPets && <div className="flex items-center space-x-2"><Checkbox id="pets" checked={filters.allow_pets} onCheckedChange={c => setFilters({ allow_pets: !!c })} /><label htmlFor="pets">Можно с животными</label></div>}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  if (!config) return <div>Loading configuration...</div>;

  return (
    <div className="p-4 space-y-4 bg-card rounded-lg shadow">
      {/* Main Horizontal Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-wrap gap-2 flex-grow">
          {config.propertyTypes.slice(0, 5).map(pt => (
            <div key={pt.value} className="flex items-center space-x-2">
              <Checkbox id={pt.value} checked={filters.propertyType?.includes(pt.value)} onCheckedChange={() => handleCheckboxChange(pt.value)} />
              <label htmlFor={pt.value} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{pt.label}</label>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Все фильтры</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader><DialogTitle>Расширенные фильтры</DialogTitle></DialogHeader>
              <div className="py-4 max-h-[70vh] overflow-y-auto">
                {renderAdvancedFilters()}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsModalOpen(false)}>Применить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={() => { /* Logic to apply filters and fetch data */ }}>
            <Search className="mr-2 h-4 w-4" /> Поиск
          </Button>

          <Button variant="ghost" onClick={resetFilters}><X className="mr-2 h-4 w-4"/>Сбросить</Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
