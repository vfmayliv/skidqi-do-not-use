
import { supabase } from "@/integrations/supabase/client";
import { Region, City, Microdistrict } from "@/types/listingType";

// Получение всех регионов
export async function getRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name_ru');

  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }

  return data || [];
}

// Получение городов/районов по ID региона
export async function getCitiesByRegion(regionId: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('region_id', regionId)
    .order('name_ru');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  return data || [];
}

// Получение микрорайонов по ID города/района
export async function getMicrodistrictsByCity(cityId: string): Promise<Microdistrict[]> {
  const { data, error } = await supabase
    .from('microdistricts')
    .select('*')
    .eq('city_id', cityId)
    .order('name_ru');

  if (error) {
    console.error('Error fetching microdistricts:', error);
    return [];
  }

  return data || [];
}

// Получение специальных регионов-городов (Алматы, Астана, Шымкент)
export async function getSpecialCityRegions(): Promise<string[]> {
  const { data, error } = await supabase
    .from('regions')
    .select('id')
    .eq('is_city_level', true);

  if (error) {
    console.error('Error fetching special city regions:', error);
    return [];
  }

  return data.map(region => region.id);
}
