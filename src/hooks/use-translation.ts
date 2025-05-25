
import { useAppStore } from '@/stores/useAppStore';
import ruTranslation from '@/i18n/locales/ru.json';
import kzTranslation from '@/i18n/locales/kz.json';

export interface TranslationKey {
  ru: string;
  kz: string;
}

const translations = {
  ru: ruTranslation,
  kz: kzTranslation
};

export const useTranslation = () => {
  const { language } = useAppStore();
  
  const t = (key: string | TranslationKey): string => {
    if (typeof key === 'string') {
      // Для простых строк, ищем перевод в файлах локализации
      const translation = translations[language as keyof typeof translations];
      const keys = key.split('.');
      let result: any = translation;
      
      for (const k of keys) {
        if (result && typeof result === 'object') {
          result = result[k as keyof typeof result];
        } else {
          return key; // Возвращаем ключ если перевод не найден
        }
      }
      
      return typeof result === 'string' ? result : key;
    }
    
    // Для объектов с языковыми ключами, возвращаем соответствующий перевод
    return key[language as keyof TranslationKey] || '';
  };
  
  return { 
    t,
    currentLang: language 
  };
};
