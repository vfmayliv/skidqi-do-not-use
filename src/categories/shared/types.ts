
import { ReactElement } from 'react';

export interface CategoryConfig {
  id: string;
  name: { ru: string; kz: string };
  filtersComponent: React.FC<any>;
  cardComponent: React.FC<any>;
  styles: string; // Путь к CSS-файлу категории
  filterConfig: {
    [key: string]: any; // Специфичные настройки фильтров для категории
  };
}

export interface CategoryComponentProps {
  categoryId: string;
  filters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}
