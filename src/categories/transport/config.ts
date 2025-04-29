
import { CategoryConfig } from '../shared/types';
import { TransportCard } from '@/components/transport/TransportCard';
import { TransportFilters } from '@/components/transport/TransportFilters';

export const transportConfig: CategoryConfig = {
  id: 'transport',
  name: { 
    ru: 'Транспорт', 
    kz: 'Көлік' 
  },
  filtersComponent: TransportFilters,
  cardComponent: TransportCard,
  styles: '/src/categories/transport/styles/style.css',
  filterConfig: {
    vehicleTypes: [
      { id: 'car', label: { ru: 'Легковые', kz: 'Жеңіл автокөліктер' } },
      { id: 'truck', label: { ru: 'Грузовые', kz: 'Жүк көліктері' } },
      { id: 'moto', label: { ru: 'Мотоциклы', kz: 'Мотоциклдер' } }
    ],
    // Add other transport specific filter configurations
  },
};

// Register this configuration
import { registerCategoryConfig } from '../categoryRegistry';
registerCategoryConfig(transportConfig);
