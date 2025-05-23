
import { useAppStore } from '@/stores/useAppStore';

export interface TranslationKey {
  ru: string;
  kz: string;
}

export const useTranslation = () => {
  const { language } = useAppStore();
  
  const t = (key: string | TranslationKey): string => {
    if (typeof key === 'string') {
      // For simple strings, just return the string
      return key;
    }
    
    // For objects with language keys, return the appropriate translation
    return key[language as keyof TranslationKey] || '';
  };
  
  return { 
    t,
    currentLang: language 
  };
};
