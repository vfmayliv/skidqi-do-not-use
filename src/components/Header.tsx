
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, User, Menu, LogIn, Bell, MessageSquare, ChevronDown, Plus, List, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { useSearchStore } from '@/stores/useSearchStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cities } from '@/data/cities';
import { categories } from '@/data/categories';
import logo from '/logo.png';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function Header() {
  const { language, setLanguage, selectedCity: city, setSelectedCity: setCity, setCityConfirmed, isAuthenticated, logout, t } = useAppWithTranslations();
  const { searchTerm, setSearchTerm, performSearch } = useSearchStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const navigate = useNavigate();

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'kz' : 'ru');
  };

  const openCitySelector = () => {
    setIsCityDialogOpen(true);
  };

  const selectCity = (selectedCity) => {
    setCity(selectedCity);
    setCityConfirmed(true);
    setIsCityDialogOpen(false);
  };

  const clearCity = () => {
    setCity(null);
    setCityConfirmed(true);
    setIsCityDialogOpen(false);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      performSearch();
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Состояние для категорий
  const [categoriesReady, setCategoriesReady] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  
  // Загружаем категории
  useEffect(() => {
    setCategoriesReady(true);
  }, []);
  
  // Закрываем меню категорий при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setShowCategoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Функция переключения меню категорий
  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
  };
  
  return (
    <header className="sticky top-0 bg-background z-10 shadow-sm">
      {/* Верхняя строка хедера - профиль и контролы */}
      <div className="border-b bg-white">
        <div className="container flex items-center justify-end h-14 px-4">
          {/* Правая часть для верхней строки */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Логотип для мобильной версии */}
            <div className="md:hidden flex items-center gap-2 mr-auto">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="SKIDQI" className="h-7" />
              </Link>
            </div>

            {/* Поиск для мобильной версии */}
            <form onSubmit={handleSearch} className="md:hidden relative max-w-[180px] mx-2">
              <Input 
                placeholder={t('search')} 
                className="h-8 pl-7 pr-2 rounded-full text-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </form>
          </div>
          
          {/* Правая часть - для десктопа */}
          <div className="hidden md:flex items-center gap-3">
            {/* Выбор города */}
            <Button variant="ghost" size="sm" onClick={openCitySelector} className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{city ? city[language] : t('allCities')}</span>
            </Button>
            
            {/* Переключение языка в стиле OLX */}
            <div className="flex items-center overflow-hidden rounded-md border">
              <Button 
                variant="ghost"
                size="sm"
                className={`h-7 px-2 rounded-none transition-colors ${language === 'kz' ? 'bg-primary/20 text-primary font-semibold' : 'bg-transparent hover:bg-muted'}`}
                onClick={() => language !== 'kz' && setLanguage('kz')}
              >
                KZ
              </Button>
              <div className="h-5 w-px bg-border" />
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 rounded-none transition-colors ${language === 'ru' ? 'bg-primary/20 text-primary font-semibold' : 'bg-transparent hover:bg-muted'}`}
                onClick={() => language !== 'ru' && setLanguage('ru')}
              >
                RU
              </Button>
            </div>
            
            {/* Кнопки мессенджера и уведомлений */}
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 p-0">
                <MessageSquare className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon" className="relative rounded-full w-9 h-9 p-0">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">2</Badge>
              </Button>
            </div>
            
            {/* Профиль/Вход */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{t('profile')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">{t('profile')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/my-listings" className="w-full">
                      {language === 'ru' ? 'Мои объявления' : 'Менің хабарландыруларым'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/favorites" className="w-full">
                      {language === 'ru' ? 'Избранное' : 'Таңдаулылар'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      {language === 'ru' ? 'Настройки' : 'Параметрлер'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    {language === 'ru' ? 'Выйти' : 'Шығу'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="flex items-center gap-1">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-1" />
                  {t('login')}
                </Link>
              </Button>
            )}
          </div>
          
          {/* Мобильное меню */}
          <div className="md:hidden flex items-center gap-2">
            {/* Переключение языка в стиле OLX для мобильной версии */}
            <div className="flex items-center overflow-hidden rounded-md border">
              <Button 
                variant="ghost"
                size="sm"
                className={`h-7 px-2 rounded-none transition-colors ${language === 'kz' ? 'bg-primary/20 text-primary font-semibold' : 'bg-transparent hover:bg-muted'}`}
                onClick={() => language !== 'kz' && setLanguage('kz')}
              >
                KZ
              </Button>
              <div className="h-5 w-px bg-border" />
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 rounded-none transition-colors ${language === 'ru' ? 'bg-primary/20 text-primary font-semibold' : 'bg-transparent hover:bg-muted'}`}
                onClick={() => language !== 'ru' && setLanguage('ru')}
              >
                RU
              </Button>
            </div>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="space-y-4 py-4">
                  <div className="px-4">
                    <h2 className="text-lg font-semibold">{t('siteName')}</h2>
                    <p className="text-sm text-muted-foreground">{t('tagline')}</p>
                  </div>
                  
                  <div className="px-4 py-2">
                    <Button variant="ghost" onClick={openCitySelector} className="flex items-center gap-2 w-full justify-start">
                      <MapPin className="h-4 w-4" />
                      <span>{city ? city[language] : t('allCities')}</span>
                    </Button>
                  </div>
                  
                  {/* Поиск для мобильной версии */}
                  <form onSubmit={handleSearch} className="relative px-4 py-2">
                    <Search className="absolute left-6 top-4.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={t('search')} 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </form>
                  
                  {/* Кнопки входа и подачи объявления - перемещены вверх перед категориями */}
                  {!isAuthenticated && (
                    <div className="px-4 py-2">
                      <Link 
                        to="/login" 
                        className="block px-4 py-2 mb-2 text-center rounded-md border border-gray-300 hover:bg-accent"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('login')}
                      </Link>
                    </div>
                  )}
                  
                  <div className="px-4 py-2">
                    <Button asChild className="w-full bg-primary">
                      <Link 
                        to={isAuthenticated ? "/create-listing" : "/login"}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t('createAd')}
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Категории в мобильном меню */}
                  <div className="border-t">
                    <div className="px-4 py-2 font-medium">
                      {language === 'ru' ? 'Категории' : 'Санаттар'}
                    </div>
                    {/* Специальные категории с отдельными страницами */}
                    <Link 
                      to="/transport" 
                      className="flex px-4 py-2 hover:bg-accent font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {language === 'ru' ? 'Транспорт' : 'Көлік'}
                    </Link>
                    <Link 
                      to="/electronics" 
                      className="flex px-4 py-2 hover:bg-accent font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {language === 'ru' ? 'Электроника' : 'Электроника'}
                    </Link>
                    <Link 
                      to="/fashion" 
                      className="flex px-4 py-2 hover:bg-accent font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {language === 'ru' ? 'Мода и одежда' : 'Сән және киім'}
                    </Link>
                    <Link 
                      to="/pets" 
                      className="flex px-4 py-2 hover:bg-accent font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {language === 'ru' ? 'Домашние животные' : 'Үй жануарлары'}
                    </Link>
                    
                    {/* Обычные категории */}
                    <div className="mt-2 pt-2 border-t">
                      {categoriesReady && categories.map((category) => (
                        <Link 
                          key={category.id}
                          to={`/category/${category.id}`} 
                          className="flex px-4 py-2 hover:bg-accent"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name[language]}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Профиль и настройки - только для авторизованных */}
                  {isAuthenticated && (
                    <div className="border-t">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-accent">
                        {t('profile')}
                      </Link>
                      <Link to="/my-listings" className="block px-4 py-2 hover:bg-accent">
                        {language === 'ru' ? 'Мои объявления' : 'Менің хабарландыруларым'}
                      </Link>
                      <Link to="/favorites" className="block px-4 py-2 hover:bg-accent">
                        {language === 'ru' ? 'Избранное' : 'Таңдаулылар'}
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 hover:bg-accent">
                        {language === 'ru' ? 'Настройки' : 'Параметрлер'}
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }} 
                        className="block w-full text-left px-4 py-2 hover:bg-accent"
                      >
                        {language === 'ru' ? 'Выйти' : 'Шығу'}
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Вторая строка хедера с лого, категориями, поиском и кнопкой размещения */}
      <div className="bg-gray-100 border-b">
        <div className="container flex items-center justify-between py-2 px-4">
          {/* Левая часть - лого и категории */}
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden md:flex items-center gap-2">
              <img src={logo} alt="SKIDQI" className="h-8" />
            </Link>
            
            {/* Кнопка Все категории */}
            <div className="relative" ref={categoryMenuRef}>
              <Button 
                onClick={toggleCategoryMenu}
                className={cn(
                  "flex items-center gap-2 rounded-full", 
                  showCategoryMenu ? "bg-primary-foreground text-primary" : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
                variant="ghost"
              >
                <List size={18} />
                <span className="font-medium">{language === 'ru' ? 'Все категории' : 'Барлық санаттар'}</span>
              </Button>
              
              {/* Скрытое меню категорий */}
              {showCategoryMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg w-[800px] max-w-[90vw] z-50 grid grid-cols-4 p-4 gap-x-4">
                  {/* Левая колонка с основными категориями */}
                  <div className="col-span-1 border-r pr-4">
                    {categoriesReady && categories.map((category) => (
                      <div 
                        key={category.id}
                        onMouseEnter={() => setActiveCategory(category.id)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                          activeCategory === category.id ? "bg-slate-100" : "hover:bg-slate-50"
                        )}
                      >
                        <span>{category.name[language]}</span>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </div>
                    ))}
                    
                    {/* Специальные категории с отдельными страницами */}
                    <div className="mt-4 pt-4 border-t">
                      <Link
                        to="/transport"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-slate-50"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        {language === 'ru' ? 'Транспорт' : 'Көлік'}
                      </Link>
                      <Link
                        to="/electronics"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-slate-50"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        {language === 'ru' ? 'Электроника' : 'Электроника'}
                      </Link>
                      <Link
                        to="/fashion"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-slate-50"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        {language === 'ru' ? 'Мода и одежда' : 'Сән және киім'}
                      </Link>
                      <Link
                        to="/pets"
                        className="flex items-center px-3 py-2 rounded-md hover:bg-slate-50"
                        onClick={() => setShowCategoryMenu(false)}
                      >
                        {language === 'ru' ? 'Домашние животные' : 'Үй жануарлары'}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Правая колонка с подкатегориями */}
                  <div className="col-span-3 pl-2">
                    {categoriesReady && activeCategory && categories.find(c => c.id === activeCategory)?.subcategories && (
                      <div className="grid grid-cols-3 gap-2">
                        {categories.find(c => c.id === activeCategory)?.subcategories?.map((subCategory) => (
                          <Link 
                            key={subCategory.id}
                            to={`/category/${activeCategory}/${subCategory.id}`}
                            className="px-3 py-2 hover:bg-slate-50 rounded-md"
                            onClick={() => setShowCategoryMenu(false)}
                          >
                            {subCategory.name[language]}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Центральная часть - поисковая строка */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 mx-4 max-w-lg">
            <Input 
              placeholder={t('search')} 
              className="pl-8 pr-20 rounded-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Button type="submit" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 rounded-full">
              {language === 'ru' ? 'Найти' : 'Іздеу'}
            </Button>
          </form>
          
          {/* Яркая кнопка размещения объявления */}
          <Button asChild className="gap-1 rounded-md bg-primary hover:bg-primary/90 text-white py-2 px-4 font-medium">
            <Link to={isAuthenticated ? "/create-listing" : "/login"}>
              <Plus className="h-5 w-5" />
              {language === 'ru' ? 'Разместить объявление' : 'Хабарландыру орналастыру'}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* City Selection Dialog */}
      <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{t('selectCity')}</DialogTitle>
          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={clearCity}
              >
                {t('allCities')}
              </Button>
              
              {cities.map((c, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start ${city && city[language] === c[language] ? 'bg-primary/10' : ''}`}
                  onClick={() => selectCity(c)}
                >
                  {c[language]}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
