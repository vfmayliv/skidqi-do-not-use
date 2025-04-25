import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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
  }
};

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  selectedCity: CityType | null;
  setSelectedCity: (city: CityType | null) => void;
  cityConfirmed: boolean;
  setCityConfirmed: (confirmed: boolean) => void;
  isAuthenticated: boolean;
  userRole: UserRole;
  login: () => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  t: (key: string) => string;
  city: CityType | null; // Alias for selectedCity
  setCity: (city: CityType | null) => void; // Alias for setSelectedCity
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');
  const [selectedCity, setSelectedCity] = useState<CityType | null>(null);
  const [cityConfirmed, setCityConfirmed] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  // Load stored preferences on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && (storedLanguage === 'ru' || storedLanguage === 'kz')) {
      setLanguage(storedLanguage as Language);
    }
    
    const storedCityConfirmed = localStorage.getItem('cityConfirmed');
    if (storedCityConfirmed === 'true') {
      setCityConfirmed(true);
    }
    
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      try {
        const cityObject = JSON.parse(storedCity);
        setSelectedCity(cityObject);
      } catch (e) {
        console.error('Failed to parse stored city', e);
      }
    }
    
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
      
      // Get user role if authenticated
      const storedRole = localStorage.getItem('userRole');
      if (storedRole && (storedRole === 'user' || storedRole === 'admin')) {
        setUserRole(storedRole as UserRole);
      } else {
        setUserRole('user'); // Default to user if no role stored
      }
    }
  }, []);

  // Update local storage when preferences change
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cityConfirmed', cityConfirmed.toString());
  }, [cityConfirmed]);

  useEffect(() => {
    localStorage.setItem('selectedCity', selectedCity ? JSON.stringify(selectedCity) : '');
  }, [selectedCity]);
  
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);
  
  useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  const login = () => {
    setIsAuthenticated(true);
    setUserRole('user');
    toast({
      title: language === 'ru' ? 'Успешный вход' : 'Сәтті кіру',
      description: language === 'ru' 
        ? 'Вы успешно вошли в систему' 
        : 'Сіз жүйеге сәтті кірдіңіз',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole('guest');
    toast({
      title: language === 'ru' ? 'Выход из системы' : 'Жүйеден шығу',
      description: language === 'ru' 
        ? 'Вы вышли из системы' 
        : 'Сіз жүйеден шықтыңыз',
    });
    navigate('/');
  };

  return (
    <AppContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        selectedCity, 
        setSelectedCity,
        cityConfirmed,
        setCityConfirmed,
        isAuthenticated,
        userRole,
        login,
        logout,
        setUserRole,
        t,
        // Aliases for compatibility
        city: selectedCity,
        setCity: setSelectedCity
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
