import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  language: 'ru' | 'kz';
  setLanguage: (lang: 'ru' | 'kz') => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations = {
  ru: {
    tenge: '₸',
    // Add more translations as needed
  },
  kz: {
    tenge: '₸',
    // Add more translations as needed
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'ru' | 'kz'>('ru');

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.ru] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
