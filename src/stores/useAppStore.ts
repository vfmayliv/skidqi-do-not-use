
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'ru' | 'kz';
export type UserRole = 'guest' | 'user' | 'admin';

export type CityType = {
  ru: string;
  kz: string;
};

// Translation helper type
type TranslationType = {
  [key: string]: {
    ru: string;
    kz: string;
  }
};

// Basic translations
const translations: TranslationType = {
  siteName: {
    ru: 'SKIDQI.COM',
    kz: 'SKIDQI.COM'
  },
  tagline: {
    ru: 'Доска объявлений со скидками в Казахстане',
    kz: 'Қазақстандағы жеңілдіктері бар хабарландыру тақтасы'
  },
  search: {
    ru: 'Поиск',
    kz: 'Іздеу'
  },
  allCities: {
    ru: 'Все города',
    kz: 'Барлық қалалар'
  },
  login: {
    ru: 'Войти',
    kz: 'Кіру'
  },
  register: {
    ru: 'Регистрация',
    kz: 'Тіркелу'
  },
  profile: {
    ru: 'Профиль',
    kz: 'Профиль'
  },
  createAd: {
    ru: 'Подать объявление',
    kz: 'Хабарландыру беру'
  },
  categories: {
    ru: 'Категории',
    kz: 'Санаттар'
  },
  featuredAds: {
    ru: 'Избранные объявления',
    kz: 'Таңдаулы хабарландырулар'
  },
  latestAds: {
    ru: 'Новые объявления',
    kz: 'Жаңа хабарландырулар'
  },
  allAds: {
    ru: 'Все объявления',
    kz: 'Барлық хабарландырулар'
  },
  selectCity: {
    ru: 'Выберите город',
    kz: 'Қаланы таңдаңыз'
  },
  selectCategory: {
    ru: 'Выберите категорию',
    kz: 'Санатты таңдаңыз'
  },
  yes: {
    ru: 'Да',
    kz: 'Иә'
  },
  no: {
    ru: 'Нет',
    kz: 'Жоқ'
  },
  featured: {
    ru: 'Рекомендуемые',
    kz: 'Ұсынылатын'
  },
  tenge: {
    ru: '₸',
    kz: '₸'
  },
  allRights: {
    ru: 'Все права защищены.',
    kz: 'Барлық құқықтар қорғалған.'
  },
  // New category translations
  free: {
    ru: 'Бесплатно',
    kz: 'Тегін'
  },
  pharmacy: {
    ru: 'Аптеки',
    kz: 'Дәріханалар'
  },
  electronics: {
    ru: 'Техника и Электроника',
    kz: 'Техника және Электроника'
  },
  fashion: {
    ru: 'Мода и Стиль',
    kz: 'Сән және Стиль'
  },
  children: {
    ru: 'Детям',
    kz: 'Балаларға'
  },
  food: {
    ru: 'Продукты Питания',
    kz: 'Тамақ өнімдері'
  },
  hobby: {
    ru: 'Хобби и Спорт',
    kz: 'Хобби және Спорт'
  },
  pets: {
    ru: 'Зоотовары',
    kz: 'Зоотауарлар'
  },
  beauty: {
    ru: 'Красота и Здоровье',
    kz: 'Сұлулық және Денсаулық'
  },
  transport: {
    ru: 'Транспорт',
    kz: 'Көлік'
  },
  realestate: {
    ru: 'Недвижимость и строительство',
    kz: 'Жылжымайтын мүлік және құрылыс'
  },
  services: {
    ru: 'Услуги',
    kz: 'Қызметтер'
  },
  home: {
    ru: 'Все для Дома и Дачи',
    kz: 'Үй және Саяжай үшін барлығы'
  },
  listings: {
    ru: 'Объявления',
    kz: 'Хабарландырулар'
  }
};

type AppState = {
  language: Language;
  selectedCity: CityType | null;
  cityConfirmed: boolean;
  isAuthenticated: boolean;
  userRole: UserRole;
  translations: TranslationType;
  
  // Actions
  setLanguage: (language: Language) => void;
  setSelectedCity: (city: CityType | null) => void;
  setCityConfirmed: (confirmed: boolean) => void;
  login: () => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  
  // Utility
  t: (key: string) => string;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'ru',
      selectedCity: null,
      cityConfirmed: false,
      isAuthenticated: false,
      userRole: 'guest',
      translations,
      
      setLanguage: (language: Language) => set({ language }),
      
      setSelectedCity: (city: CityType | null) => set({ selectedCity: city }),
      
      setCityConfirmed: (confirmed: boolean) => set({ cityConfirmed: confirmed }),
      
      login: () => set({ isAuthenticated: true, userRole: 'user' }),
      
      logout: () => set({ isAuthenticated: false, userRole: 'guest' }),
      
      setUserRole: (role: UserRole) => set({ userRole: role }),
      
      t: (key: string) => {
        const { translations, language } = get();
        if (translations[key] && translations[key][language]) {
          return translations[key][language];
        }
        return key;
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Aliases for backward compatibility
export const useLanguage = () => useAppStore(state => state.language);
export const useSelectedCity = () => useAppStore(state => state.selectedCity);
export const useTranslation = () => useAppStore(state => state.t);
