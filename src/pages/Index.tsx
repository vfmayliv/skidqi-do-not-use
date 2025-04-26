
import { CitySelectionModal } from '@/components/CitySelectionModal';
import { Header } from '@/components/Header';
import { CategoryMenu } from '@/components/CategoryMenu';
import { EnhancedFeaturedListings } from '@/components/EnhancedFeaturedListings';
import { Footer } from '@/components/Footer';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAppContext } from '@/contexts/AppContext';

const Banner = () => {
  const { t, language } = useAppContext();
  
  return (
    <div className="bg-blue-50 py-6">
      <div className="container mx-auto px-4">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="h-[200px] md:h-[300px] bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{t('siteName')}</h2>
                <p className="text-lg md:text-xl mb-4 text-center">{t('tagline')}</p>
                <p className="text-sm md:text-base text-center max-w-lg">
                  {language === 'ru' 
                    ? 'Находите товары со скидками у продавцов в вашем городе'
                    : 'Өз қалаңыздағы сатушылардан жеңілдіктері бар тауарларды табыңыз'}
                </p>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="h-[200px] md:h-[300px] bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex flex-col items-center justify-center text-white p-6">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">
                  {language === 'ru' ? 'Скидки до 70%' : 'Жеңілдіктер 70% дейін'}
                </h2>
                <p className="text-lg md:text-xl mb-4 text-center">
                  {language === 'ru' ? 'Отличные предложения каждый день' : 'Күн сайын тамаша ұсыныстар'}
                </p>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <CitySelectionModal />
      <Header />
      <Banner />
      <CategoryMenu />
      <main className="flex-1">
        <EnhancedFeaturedListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
