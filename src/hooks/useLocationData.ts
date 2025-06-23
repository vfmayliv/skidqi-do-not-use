
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Region {
  id: number;
  name_ru: string;
  name_kz: string;
}

export interface City {
  id: number;
  name_ru: string;
  name_kz: string;
  region_id: number;
}

export interface Microdistrict {
  id: number;
  name_ru: string;
  name_kz: string;
  city_id: number;
}

export function useLocationData() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [microdistricts, setMicrodistricts] = useState<Microdistrict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch regions
        const { data: regionsData, error: regionsError } = await supabase
          .from('regions')
          .select('id, name_ru, name_kz')
          .order('name_ru');

        if (regionsError) throw regionsError;

        // Fetch cities
        const { data: citiesData, error: citiesError } = await supabase
          .from('cities')
          .select('id, name_ru, name_kz, region_id')
          .order('name_ru');

        if (citiesError) throw citiesError;

        // Fetch microdistricts
        const { data: microdistrictsData, error: microdistrictsError } = await supabase
          .from('microdistricts')
          .select('id, name_ru, name_kz, city_id')
          .order('name_ru');

        if (microdistrictsError) throw microdistrictsError;

        setRegions(regionsData || []);
        setCities(citiesData || []);
        setMicrodistricts(microdistrictsData || []);
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, []);

  const getCitiesByRegion = (regionId: number): City[] => {
    return cities.filter(city => city.region_id === regionId);
  };

  const getMicrodistrictsByCity = (cityId: number): Microdistrict[] => {
    return microdistricts.filter(md => md.city_id === cityId);
  };

  return {
    regions,
    cities,
    microdistricts,
    loading,
    error,
    getCitiesByRegion,
    getMicrodistrictsByCity
  };
}
