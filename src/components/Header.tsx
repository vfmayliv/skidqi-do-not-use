
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, MessageCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppWithTranslations } from '@/stores/useAppStore';
import { categories } from '@/data/categories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as LucideIcons from 'lucide-react';

export function Header() {
  const { language, setLanguage, selectedCity, t } = useAppWithTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Categories Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-blue-600">{t('siteName')}</span>
            </Link>
            
            {/* Categories Menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  {language === 'ru' ? 'Все категории' : 'Барлық санаттар'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="start">
                <div className="grid grid-cols-1 max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                      {/* Main Category */}
                      <Link
                        to={category.id === 'property' ? '/property' : 
                             category.id === 'transport' ? '/transport' : 
                             `/category/${category.id}`}
                        className="flex items-center p-3 hover:bg-gray-50 transition-colors"
                      >
                        <DynamicIcon name={category.icon} className="h-5 w-5 mr-3 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          {category.name[language]}
                        </span>
                      </Link>
                      
                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="pl-8 pb-2">
                          {category.subcategories.map((subcat) => (
                            <Link
                              key={subcat.id}
                              to={category.id === 'property' ? `/property?type=${subcat.id}` :
                                   category.id === 'transport' ? `/transport?type=${subcat.id}` :
                                   `/category/${category.id}/${subcat.id}`}
                              className="flex items-center p-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <DynamicIcon name={subcat.icon} className="h-4 w-4 mr-2" />
                              {subcat.name[language]}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={language === 'ru' ? 'Поиск товаров...' : 'Тауарларды іздеу...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                {language === 'ru' ? 'Найти' : 'Табу'}
              </Button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* City Selector */}
            <Button variant="ghost" size="sm" className="text-gray-600">
              📍 {selectedCity || (language === 'ru' ? 'Город' : 'Қала')}
            </Button>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {language === 'ru' ? 'РУ' : 'ҚЗ'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('ru')}>
                  Русский
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('kz')}>
                  Қазақша
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild className="ml-2">
                <Link to="/create-listing">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Подать объявление' : 'Хабарландыру беру'}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    to={category.id === 'property' ? '/property' : 
                         category.id === 'transport' ? '/transport' : 
                         `/category/${category.id}`}
                    className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name[language]}
                  </Link>
                  {category.subcategories && category.subcategories.map((subcat) => (
                    <Link
                      key={subcat.id}
                      to={category.id === 'property' ? `/property?type=${subcat.id}` :
                           category.id === 'transport' ? `/transport?type=${subcat.id}` :
                           `/category/${category.id}/${subcat.id}`}
                      className="block px-8 py-1 text-sm text-gray-500 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {subcat.name[language]}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
