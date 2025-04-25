import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, User, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { useSearchContext } from '@/contexts/SearchContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cities } from '@/data/cities';
import logo from '/logo.png';

export function Header() {
  const { language, setLanguage, t, city, setCity, setCityConfirmed, isAuthenticated, logout } = useAppContext();
  const { searchTerm, setSearchTerm, performSearch } = useSearchContext();
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

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SKIDQI" className="h-8" />
        </Link>

        {/* Search Bar - Hidden on Small Screens */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 mx-4 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('search')} 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={openCitySelector} className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{city ? city[language] : t('allCities')}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            {language === 'ru' ? 'KZ' : 'RU'}
          </Button>

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

          <Button asChild>
            <Link to={isAuthenticated ? "/create-listing" : "/login"}>
              {t('createAd')}
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLanguage}>
            {language === 'ru' ? 'KZ' : 'RU'}
          </Button>

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

                <form onSubmit={handleSearch} className="relative px-4 py-2">
                  <Search className="absolute left-6 top-4.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t('search')} 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>

                <div className="border-t">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 hover:bg-accent">
                        {t('profile')}
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
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      className="block px-4 py-2 hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                  )}
                </div>

                <div className="px-4 py-2">
                  <Button asChild className="w-full">
                    <Link 
                      to={isAuthenticated ? "/create-listing" : "/login"}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('createAd')}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
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
