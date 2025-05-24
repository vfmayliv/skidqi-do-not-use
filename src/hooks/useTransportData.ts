
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Brand {
  id: string;
  name: string;
  name_kk: string;
  slug: string;
}

export interface Model {
  id: string;
  name: string;
  name_kk: string;
  slug: string;
  brand_id: string;
}

export interface TransportData {
  brands: Brand[];
  models: Model[];
  loading: boolean;
  error: string | null;
}

// Mapping of vehicle types to their corresponding table names
const TABLE_MAPPING = {
  // Passenger vehicles
  'passenger': { brands: 'vehicle_brands', models: 'vehicle_models' },
  'cars': { brands: 'vehicle_brands', models: 'vehicle_models' },
  'suvs': { brands: 'vehicle_brands', models: 'vehicle_models' },
  'vans': { brands: 'vehicle_brands', models: 'vehicle_models' },
  'electric': { brands: 'vehicle_brands', models: 'vehicle_models' },
  
  // Motorcycles
  'moto': { brands: 'motorcycle_brands', models: 'motorcycle_models' },
  'motorcycles': { brands: 'motorcycle_brands', models: 'motorcycle_models' },
  'scooters': { brands: 'scooter_brands', models: 'scooter_models' },
  'atvs': { brands: 'atv_brands', models: 'atv_models' },
  'snowmobiles': { brands: 'snowmobile_brands', models: 'snowmobile_models' },
  
  // Commercial vehicles
  'commercial': { brands: 'truck_brands', models: 'truck_models' },
  'light-commercial': { brands: 'light_commercial_brands', models: 'light_commercial_models' },
  'trucks': { brands: 'truck_brands', models: 'truck_models' },
  'truck-tractors': { brands: 'truck_tractor_brands', models: 'truck_tractor_models' },
  'buses': { brands: 'bus_brands', models: 'bus_models' },
  'trailers': { brands: 'trailer_brands', models: 'trailer_models' },
  'agricultural': { brands: 'agricultural_brands', models: 'agricultural_models' },
  'construction': { brands: 'construction_brands', models: 'construction_models' },
  'loaders': { brands: 'loader_brands', models: 'loader_models' },
  'cranes': { brands: 'crane_brands', models: 'crane_models' },
  'excavators': { brands: 'excavator_brands', models: 'excavator_models' },
  'bulldozers': { brands: 'bulldozer_brands', models: 'bulldozer_models' },
  'municipal': { brands: 'municipal_brands', models: 'municipal_models' }
};

export const useTransportData = (vehicleType: string = 'passenger'): TransportData => {
  const [data, setData] = useState<TransportData>({
    brands: [],
    models: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        
        const tableConfig = TABLE_MAPPING[vehicleType as keyof typeof TABLE_MAPPING];
        if (!tableConfig) {
          throw new Error(`No table mapping found for vehicle type: ${vehicleType}`);
        }

        // Load brands with proper type assertion
        const { data: brandsData, error: brandsError } = await supabase
          .from(tableConfig.brands as any)
          .select('*')
          .order('name');

        if (brandsError) {
          throw brandsError;
        }

        // Load models with proper type assertion
        const { data: modelsData, error: modelsError } = await supabase
          .from(tableConfig.models as any)
          .select('*')
          .order('name');

        if (modelsError) {
          throw modelsError;
        }

        // Transform the data to match our interfaces
        const transformedBrands: Brand[] = (brandsData || []).map((brand: any) => ({
          id: brand.id?.toString() || brand.id,
          name: brand.name,
          name_kk: brand.name_kk,
          slug: brand.slug
        }));

        const transformedModels: Model[] = (modelsData || []).map((model: any) => ({
          id: model.id?.toString() || model.id,
          name: model.name,
          name_kk: model.name_kk,
          slug: model.slug,
          brand_id: model.brand_id?.toString() || model.brand_id
        }));

        setData({
          brands: transformedBrands,
          models: transformedModels,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error loading transport data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    loadData();
  }, [vehicleType]);

  return data;
};
