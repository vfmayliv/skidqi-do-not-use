
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Camera, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { categories, Category } from '@/data/categories';
import { cities } from '@/data/cities';

const CreateListing = () => {
  const { language, city: selectedCity, t } = useAppContext();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Цена и скидка
  const [price, setPrice] = useState<string>('');
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');

  // Структура категорий в стиле Авито (многоуровневая)
  const [categoryPath, setCategoryPath] = useState<Category[][]>([categories]); 
  const [selectedCategoryIndices, setSelectedCategoryIndices] = useState<number[]>([]);
  const [activeCategoryLevel, setActiveCategoryLevel] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  
  // Функция обновления выбранных категорий при изменении индексов
  useEffect(() => {
    const selected: Category[] = [];
    
    selectedCategoryIndices.forEach((index, level) => {
      if (categoryPath[level] && categoryPath[level][index]) {
        selected[level] = categoryPath[level][index];
      }
    });
    
    setSelectedCategories(selected.filter(Boolean));
  }, [selectedCategoryIndices, categoryPath]);

  // Выбор категории на определенном уровне
  const selectCategory = (level: number, index: number) => {
    const selectedCategory = categoryPath[level][index];
    
    // Обновляем выбранный индекс для текущего уровня
    const newIndices = [...selectedCategoryIndices];
    newIndices[level] = index;
    
    // Удаляем все выбранные категории ниже по уровню
    const newPath = [...categoryPath];
    newPath.splice(level + 1);
    
    // Добавляем подкатегории, если они есть
    if (selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
      newPath[level + 1] = selectedCategory.subcategories;
      setActiveCategoryLevel(level + 1);
    }
    
    // Очищаем выбранные индексы ниже текущего уровня
    newIndices.splice(level + 1);
    
    setCategoryPath(newPath);
    setSelectedCategoryIndices(newIndices);
  };
  
  const handlePriceChange = (value: string) => {
    setPrice(value);
    calculateDiscount(value, discountPrice);
  };
  
  const handleDiscountPriceChange = (value: string) => {
    setDiscountPrice(value);
    calculateDiscount(price, value);
  };
  
  const calculateDiscount = (originalPrice: string, discountedPrice: string) => {
    const original = parseFloat(originalPrice);
    const discounted = parseFloat(discountedPrice);
    
    if (original > 0 && discounted > 0 && discounted < original) {
      const discountPercentage = Math.round(((original - discounted) / original) * 100);
      setDiscount(discountPercentage.toString());
    } else {
      setDiscount('');
    }
  };
  
  const handleFileUpload = () => {
    // Имитация загрузки изображения
    const mockImageUrl = 'https://via.placeholder.com/600x400';
    if (uploadedImages.length < 10) {
      setUploadedImages([...uploadedImages, mockImageUrl]);
      
      toast({
        title: language === 'ru' ? 'Фото загружено' : 'Фото жүктелді',
        description: language === 'ru' ? 'Фото успешно добавлено' : 'Фото сәтті қосылды',
      });
    } else {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' ? 'Максимум 10 фотографий' : 'Максимум 10 сурет',
        variant: 'destructive',
      });
    }
  };
  
  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };
  
  // Возврат на предыдущий уровень категорий
  const goBackToPreviousLevel = () => {
    if (activeCategoryLevel > 0) {
      setActiveCategoryLevel(activeCategoryLevel - 1);
    }
  };
  
  // Формирование пути категорий для отображения
  const renderCategoryPath = () => {
    return selectedCategories.map((category, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />}
        <span 
          className="cursor-pointer hover:text-primary"
          onClick={() => setActiveCategoryLevel(index)}
        >
          {category.name[language]}
        </span>
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language === 'ru' ? 'Создать объявление' : 'Хабарландыру жасау'}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-medium mb-2">
                  {language === 'ru' ? 'Основная информация' : 'Негізгі ақпарат'}
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {language === 'ru' ? 'Название объявления' : 'Хабарландыру атауы'}
                  </Label>
                  <Input 
                    id="title" 
                    placeholder={language === 'ru' ? 'Введите название' : 'Атауын енгізіңіз'} 
                  />
                </div>
                
                {/* Категории в стиле Авито */}
                <div className="space-y-4">
                  <div>
                    <Label>
                      {language === 'ru' ? 'Категория' : 'Санат'}
                    </Label>
                    
                    {selectedCategories.length > 0 && (
                      <div className="flex items-center text-sm mt-1 mb-3 flex-wrap">
                        {renderCategoryPath()}
                      </div>
                    )}
                    
                    <div className="border rounded-md p-4">
                      {activeCategoryLevel > 0 && (
                        <Button 
                          variant="ghost" 
                          className="mb-2 px-2 h-8"
                          onClick={goBackToPreviousLevel}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          {language === 'ru' ? 'Назад' : 'Артқа'}
                        </Button>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                        {categoryPath[activeCategoryLevel]?.map((category, index) => (
                          <div 
                            key={index}
                            className={`
                              p-2 rounded border cursor-pointer flex justify-between items-center
                              ${selectedCategoryIndices[activeCategoryLevel] === index ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                            `}
                            onClick={() => selectCategory(activeCategoryLevel, index)}
                          >
                            <div className="flex items-center">
                              <span>{category.name[language]}</span>
                            </div>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {language === 'ru' ? 'Описание' : 'Сипаттама'}
                  </Label>
                  <Textarea 
                    id="description" 
                    rows={6}
                    placeholder={language === 'ru' ? 'Подробно опишите ваш товар или услугу' : 'Тауарыңызды немесе қызметіңізді толық сипаттаңыз'} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-medium mb-2">
                  {language === 'ru' ? 'Цена' : 'Баға'}
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="original-price">
                    {language === 'ru' ? 'Цена без скидки' : 'Жеңілдіксіз баға'} (₸)
                  </Label>
                  <Input 
                    id="original-price" 
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="0" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount-price">
                    {language === 'ru' ? 'Цена со скидкой' : 'Жеңілдікпен баға'} (₸)
                  </Label>
                  <Input 
                    id="discount-price" 
                    type="number"
                    value={discountPrice}
                    onChange={(e) => handleDiscountPriceChange(e.target.value)}
                    placeholder="0" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount">
                    {language === 'ru' ? 'Размер скидки' : 'Жеңілдік мөлшері'} (%)
                  </Label>
                  <Input 
                    id="discount" 
                    readOnly
                    value={discount}
                    placeholder="0" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-medium mb-2">
                  {language === 'ru' ? 'Фотографии' : 'Суреттер'}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Uploaded ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-md border" 
                      />
                      <Button 
                        size="icon"
                        variant="destructive" 
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {uploadedImages.length < 10 && (
                    <div 
                      className="w-full h-24 border border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={handleFileUpload}
                    >
                      <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">
                        {language === 'ru' ? 'Добавить фото' : 'Сурет қосу'}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Вы можете загрузить до 10 фотографий'
                    : 'Сіз 10-ға дейін сурет жүктей аласыз'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-medium mb-2">
                  {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="city">
                    {language === 'ru' ? 'Город' : 'Қала'}
                  </Label>
                  <Select defaultValue={selectedCity ? selectedCity[language] : undefined}>
                    <SelectTrigger id="city">
                      <SelectValue 
                        placeholder={language === 'ru' ? 'Выберите город' : 'Қаланы таңдаңыз'} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((cityOption, index) => (
                        <SelectItem key={index} value={cityOption[language]}>
                          {cityOption[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {language === 'ru' ? 'Телефон' : 'Телефон'}
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="+7 (___) ___-__-__" 
                  />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Контакты будут видны только зарегистрированным пользователям'
                    : 'Байланыс деректері тек тіркелген пайдаланушыларға көрінеді'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Button className="w-full mb-4">
                  {language === 'ru' ? 'Опубликовать объявление' : 'Хабарландыруды жариялау'}
                </Button>
                
                <Button variant="outline" className="w-full">
                  {language === 'ru' ? 'Сохранить черновик' : 'Қолжазбаны сақтау'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateListing;
