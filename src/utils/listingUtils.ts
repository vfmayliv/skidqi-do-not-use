
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Listing } from '@/types/listingType';

// Загрузка изображения в Supabase Storage
export async function uploadImageToSupabase(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `listings/${fileName}`;
    
    console.log('Загрузка изображения:', filePath);
    
    // Добавляем метаданные для RLS политик
    const { error: uploadError } = await supabase.storage
      .from('listings')
      .upload(filePath, file, {
        metadata: {
          uploader: (await supabase.auth.getUser()).data.user?.id
        }
      });
    
    if (uploadError) {
      console.error('Ошибка загрузки изображения:', uploadError);
      return null;
    }
    
    // Получение публичного URL изображения
    const { data } = supabase.storage
      .from('listings')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    return null;
  }
}

// Загрузка нескольких изображений в Supabase Storage
export async function uploadImagestoSupabase(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImageToSupabase(file));
  const results = await Promise.all(uploadPromises);
  
  // Фильтруем null-результаты (неудачные загрузки)
  return results.filter(url => url !== null) as string[];
}

// Сохранение объявления в Supabase
export async function saveListingToSupabase(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  try {
    // Проверяем аутентификацию
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Пользователь не аутентифицирован');
      return null;
    }

    const { data, error } = await supabase
      .from('listings')
      .insert([{
        ...listing,
        user_id: user.id, // Гарантируем правильный user_id
        latitude: listing.lat, // Правильное соответствие полей
        longitude: listing.lng,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Ошибка сохранения объявления:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Непредвиденная ошибка при сохранении объявления:', error);
    return null;
  }
}

// Обновление объявления в Supabase
export async function updateListingInSupabase(id: string, listing: Partial<Listing>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('listings')
      .update({
        ...listing,
        latitude: listing.lat,
        longitude: listing.lng,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('Ошибка обновления объявления:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Непредвиденная ошибка при обновлении объявления:', error);
    return false;
  }
}

// Функция для сохранения объявлений в localStorage (для совместимости со старой логикой)
export function saveListingToLocalStorage(listing: Listing) {
  try {
    // Получаем текущие объявления пользователя
    const userListingsString = localStorage.getItem('userListings');
    const userListings: Listing[] = userListingsString ? JSON.parse(userListingsString) : [];
    
    // Проверяем, есть ли уже объявление с таким ID
    const existingIndex = userListings.findIndex(item => item.id === listing.id);
    
    if (existingIndex >= 0) {
      // Обновляем существующее объявление
      userListings[existingIndex] = {
        ...listing,
        updated_at: new Date().toISOString()
      };
    } else {
      // Добавляем новое объявление с уникальным ID
      userListings.push({
        ...listing,
        id: listing.id || uuidv4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('userListings', JSON.stringify(userListings));
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении объявления в localStorage:', error);
    return false;
  }
}
