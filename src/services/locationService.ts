
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

  // Convert number ids to strings to match our interfaces
  return (data || []).map(item => ({
    ...item,
    id: String(item.id),
    name_kz: item.name_kz || '',
  }));
}

// Получение городов/районов по ID региона
export async function getCitiesByRegion(regionId: string): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('region_id', parseInt(regionId, 10)) // Convert string to number for the query
    .order('name_ru');

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  // Convert number ids to strings to match our interfaces
  return (data || []).map(item => ({
    ...item,
    id: String(item.id),
    region_id: String(item.region_id),
    name_kz: item.name_kz || '',
  }));
}

// Получение микрорайонов по ID города/района
export async function getMicrodistrictsByCity(cityId: string): Promise<Microdistrict[]> {
  const { data, error } = await supabase
    .from('microdistricts')
    .select('*')
    .eq('city_id', parseInt(cityId, 10)) // Convert string to number for the query
    .order('name_ru');

  if (error) {
    console.error('Error fetching microdistricts:', error);
    return [];
  }

  // Convert number ids to strings to match our interfaces
  return (data || []).map(item => ({
    ...item,
    id: String(item.id),
    city_id: String(item.city_id),
    name_kz: item.name_kz || '',
  }));
}

// Получение специальных регионов-городов (Алматы, Астана, Шымкент)
export async function getSpecialCityRegions(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id')
      .eq('is_city_level', true);

    if (error) {
      console.error('Error fetching special city regions:', error);
      return [];
    }

    // Fixed: Convert number ids to strings without recursive type instantiation
    return (data || []).map(region => String(region.id));
  } catch (error) {
    console.error('Error fetching special city regions:', error);
    return [];
  }
}
