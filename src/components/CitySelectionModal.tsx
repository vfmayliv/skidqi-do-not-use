
import { useState, useEffect } from 'react';
import { X, Check, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cities } from '@/data/cities';
import { useAppStore } from '@/stores/useAppStore';

export function CitySelectionModal() {
  const { language, selectedCity, cityConfirmed, t, setSelectedCity, setCityConfirmed } = useAppStore();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedCity, setSuggestedCity] = useState(cities[0]);

  useEffect(() => {
    // If city is not confirmed, show the confirmation dialog
    if (!cityConfirmed && !selectedCity) {
      // Suggest a popular city like Almaty or Astana
      setSuggestedCity(cities[0]); // Almaty
      setOpen(true);
    }
  }, [cityConfirmed, selectedCity]);

  const confirmCity = (confirm: boolean) => {
    if (confirm) {
      setSelectedCity(suggestedCity);
    }
    setCityConfirmed(true);
    setOpen(false);
  };

  const selectCity = (selectedCity) => {
    setSelectedCity(selectedCity);
    setCityConfirmed(true);
    setOpen(false);
  };

  const filteredCities = searchTerm
    ? cities.filter(c => 
        c[language].toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cities;

  return (
    <>
      {/* City Confirmation Dialog */}
      <Dialog open={open && !cityConfirmed} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Ваш город')} {suggestedCity[language]}?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center space-x-4 mt-4">
            <Button onClick={() => confirmCity(true)} className="w-24">
              {t('yes')}
            </Button>
            <Button variant="outline" onClick={() => setOpen(true)} className="w-24">
              {t('no')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* City Selection Dialog */}
      <Dialog open={open && cityConfirmed} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('selectCity')}</DialogTitle>
          </DialogHeader>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  setSelectedCity(null);
                  setCityConfirmed(true);
                  setOpen(false);
                }}
              >
                {t('allCities')}
              </Button>
              
              {filteredCities.map((c, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`justify-start ${selectedCity && selectedCity[language] === c[language] ? 'bg-primary/10' : ''}`}
                  onClick={() => selectCity(c)}
                >
                  {c[language]}
                  {selectedCity && selectedCity[language] === c[language] && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
