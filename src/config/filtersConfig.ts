
import { PropertyType } from '@/types/listingType';

export interface FilterOption {
  id: string;
  label: { ru: string; kz: string };
}

export interface FilterConfig {
  id: string;
  type: 'range' | 'select' | 'boolean';
  label: { ru: string; kz: string };
  options?: FilterOption[];
}

export interface PropertyTypeConfig {
  id: string;
  label: { ru: string; kz: string };
}

export interface SegmentConfig {
  segments: Array<{ id: string; label: { ru: string; kz: string } }>;
  propertyTypes: PropertyTypeConfig[];
  filters: FilterConfig[];
  visibility: Record<string, string[]>;
}

export interface DealTypeConfig {
  id: string;
  label: { ru: string; kz: string };
}

export const filtersConfig: {
  dealTypes: DealTypeConfig[];
  [key: string]: any;
} & Record<string, SegmentConfig> = {
  dealTypes: [
    { id: 'sale', label: { ru: 'Купить', kz: 'Сатып алу' } },
    { id: 'rent', label: { ru: 'Снять надолго', kz: 'Ұзақ мерзімге жалға алу' } },
    { id: 'rent_daily', label: { ru: 'Снять посуточно', kz: 'Тәулікке жалға алу' } },
  ],

  sale: {
    segments: [
      { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
      { id: 'commercial', label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
    ],
    propertyTypes: [
      { id: PropertyType.NEW_BUILDING, label: { ru: 'Новостройка', kz: 'Жаңа құрылыс' } },
      { id: PropertyType.SECONDARY, label: { ru: 'Вторичка', kz: 'Екінші нарық' } },
      { id: PropertyType.HOUSE, label: { ru: 'Дом', kz: 'Үй' } },
      { id: PropertyType.LAND, label: { ru: 'Участок', kz: 'Жер телімі' } },
    ],
    filters: [
      {
        id: 'priceRange',
        type: 'range',
        label: { ru: 'Цена', kz: 'Баға' }
      },
      {
        id: 'areaRange',
        type: 'range',
        label: { ru: 'Площадь', kz: 'Ауданы' }
      },
      {
        id: 'floorRange',
        type: 'range',
        label: { ru: 'Этаж', kz: 'Қабат' }
      }
    ],
    visibility: {
      [PropertyType.NEW_BUILDING]: ['priceRange', 'areaRange', 'floorRange'],
      [PropertyType.SECONDARY]: ['priceRange', 'areaRange', 'floorRange'],
      [PropertyType.HOUSE]: ['priceRange', 'areaRange'],
      [PropertyType.LAND]: ['priceRange', 'areaRange'],
    }
  },

  rent: {
    segments: [
      { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
      { id: 'commercial', label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
    ],
    propertyTypes: [
      { id: PropertyType.APARTMENT, label: { ru: 'Квартира', kz: 'Пәтер' } },
      { id: PropertyType.ROOM, label: { ru: 'Комната', kz: 'Бөлме' } },
      { id: PropertyType.HOUSE, label: { ru: 'Дом', kz: 'Үй' } },
    ],
    filters: [
      {
        id: 'priceRange',
        type: 'range',
        label: { ru: 'Цена', kz: 'Баға' }
      },
      {
        id: 'areaRange',
        type: 'range',
        label: { ru: 'Площадь', kz: 'Ауданы' }
      }
    ],
    visibility: {
      [PropertyType.APARTMENT]: ['priceRange', 'areaRange'],
      [PropertyType.ROOM]: ['priceRange'],
      [PropertyType.HOUSE]: ['priceRange', 'areaRange'],
    }
  },

  rent_daily: {
    segments: [
      { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
    ],
    propertyTypes: [
      { id: PropertyType.APARTMENT, label: { ru: 'Квартира', kz: 'Пәтер' } },
      { id: PropertyType.ROOM, label: { ru: 'Комната', kz: 'Бөлме' } },
    ],
    filters: [
      {
        id: 'priceRange',
        type: 'range',
        label: { ru: 'Цена за сутки', kz: 'Тәуліктік баға' }
      }
    ],
    visibility: {
      [PropertyType.APARTMENT]: ['priceRange'],
      [PropertyType.ROOM]: ['priceRange'],
    }
  }
};
