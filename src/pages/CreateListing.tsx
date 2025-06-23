
import { useState, useEffect, useRef, ChangeEvent } from 'react';
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
import { Upload, Camera, X, ChevronRight, ChevronLeft, Save, MapPin } from 'lucide-react';
import { processImageForUpload, createImagePreviewUrl, revokeImagePreviewUrl } from '@/utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { Listing } from '@/types/listingType';
import { useCategoryHierarchy, CategoryNode } from '@/hooks/useCategoryHierarchy';
import { useLocationData } from '@/hooks/useLocationData';

// Ключ для хранения объявлений пользователя в localStorage
const USER_LISTINGS_KEY = 'userListings';

const CreateListing = () => {
  const { language, city: selectedCity, t } = useAppContext();
  const { toast } = useToast();
  const { categories: categoryTree, loading: categoriesLoading } = useCategoryHierarchy();
  const { 
    regions, 
    getCitiesByRegion, 
    getMicrodistrictsByCity, 
    loading: locationLoading 
  } = useLocationData();
  
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Form data states
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  
  // Цена и скидка
  const [price, setPrice] = useState<string>('');
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');

  // Location states
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedMicrodistrictId, setSelectedMicrodistrictId] = useState<number | null>(null);

  // Category states - новая система с реальными данными
  const [categoryPath, setCategoryPath] = useState<CategoryNode[][]>([]);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<CategoryNode[]>([]);
  const [activeCategoryLevel, setActiveCategoryLevel] = useState<number>(0);

  // Initialize category path when categories are loaded
  useEffect(() => {
    if (categoryTree.length > 0 && categoryPath.length === 0) {
      setCategoryPath([categoryTree]);
      setActiveCategoryLevel(0);
    }
  }, [categoryTree, categoryPath.length]);

  // Form validation state
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  // Check form validity
  useEffect(() => {
    const valid = 
      title.trim().length > 0 && 
      selectedCategoryPath.length > 0 &&
      description.trim().length > 0 &&
      price.trim().length > 0 &&
      selectedRegionId !== null &&
      selectedCityId !== null &&
      phone.trim().length > 0;
    
    setIsFormValid(valid);
  }, [title, selectedCategoryPath, description, price, selectedRegionId, selectedCityId, phone]);

  // Выбор категории на определенном уровне
  const selectCategory = (level: number, category: CategoryNode) => {
    // Обновляем путь выбранных категорий
    const newPath = [...selectedCategoryPath.slice(0, level), category];
    setSelectedCategoryPath(newPath);
    
    // Обновляем путь для отображения категорий
    const newCategoryPath = [...categoryPath.slice(0, level + 1)];
    
    // Если у категории есть подкатегории, добавляем их в путь
    if (category.subcategories && category.subcategories.length > 0) {
      newCategoryPath[level + 1] = category.subcategories;
      setActiveCategoryLevel(level + 1);
    }
    
    setCategoryPath(newCategoryPath);
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
    // Open the file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (uploadedImages.length + files.length > 10) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' ? 'Максимум 10 фотографий' : 'Максимум 10 сурет',
        variant: 'destructive',
      });
      return;
    }
    
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const file = files[i];
        // Process the image (convert to WebP)
        const processedFile = await processImageForUpload(file);
        // Create a preview URL
        const imageUrl = createImagePreviewUrl(processedFile);
        newImages.push(imageUrl);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    
    // Clear the file input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages]);
      toast({
        title: language === 'ru' ? 'Фото загружено' : 'Фото жүктелді',
        description: language === 'ru' 
          ? `Добавлено ${newImages.length} фото` 
          : `${newImages.length} фото қосылды`,
      });
    }
  };
  
  const removeImage = (index: number) => {
    const imageUrl = uploadedImages[index];
    // Revoke the URL to free up memory
    revokeImagePreviewUrl(imageUrl);
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };
  
  // Возврат на предыдущий уровень категорий
  const goBackToPreviousLevel = () => {
    if (activeCategoryLevel > 0) {
      const newLevel = activeCategoryLevel - 1;
      setActiveCategoryLevel(newLevel);
      
      // Убираем последний уровень из пути категорий
      setCategoryPath(prev => prev.slice(0, newLevel + 1));
      
      // Обновляем выбранный путь
      setSelectedCategoryPath(prev => prev.slice(0, newLevel));
    }
  };
  
  // Формирование пути категорий для отображения
  const renderCategoryPath = () => {
    return selectedCategoryPath.map((category, index) => (
      <div key={index} className="flex items-center">
        {index > 0 && <ChevronRight className="w-4 h-4 mx-1 text-muted-foreground" />}
        <span 
          className="cursor-pointer hover:text-primary text-sm"
          onClick={() => setActiveCategoryLevel(index)}
        >
          {category.name[language]}
        </span>
      </div>
    ));
  };

  // Handle region selection
  const handleRegionChange = (regionId: string) => {
    const id = parseInt(regionId);
    setSelectedRegionId(id);
    setSelectedCityId(null);
    setSelectedMicrodistrictId(null);
  };

  // Handle city selection
  const handleCityChange = (cityId: string) => {
    const id = parseInt(cityId);
    setSelectedCityId(id);
    setSelectedMicrodistrictId(null);
  };

  // Handle microdistrict selection
  const handleMicrodistrictChange = (microdistrictId: string) => {
    const id = parseInt(microdistrictId);
    setSelectedMicrodistrictId(id);
  };

  // Сохранение черновика и загрузка из localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('currentListingDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setTitle(draftData.title || '');
        setDescription(draftData.description || '');
        setPrice(draftData.price || '');
        setDiscountPrice(draftData.discountPrice || '');
        setDiscount(draftData.discount || '');
        setPhone(draftData.phone || '');
        
        // Восстановление изображений
        if (draftData.images && Array.isArray(draftData.images)) {
          setUploadedImages(draftData.images);
        }
      } catch (error) {
        console.error('Error loading draft data:', error);
      }
    }
  }, []);

  // Генерация уникального ID для нового объявления
  const generateUniqueId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  };

  // Handle form submission and save draft
  const handlePublish = () => {
    if (!isFormValid) {
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Пожалуйста, заполните все обязательные поля' 
          : 'Барлық міндетті өрістерді толтырыңыз',
        variant: 'destructive',
      });
      return;
    }

    // Создаем новое объявление
    const newListing: Listing = {
      id: generateUniqueId(),
      title: {
        ru: language === 'ru' ? title : title,
        kz: language === 'kz' ? title : title
      },
      description: {
        ru: language === 'ru' ? description : description,
        kz: language === 'kz' ? description : description
      },
      categoryId: selectedCategoryPath.length > 0 ? selectedCategoryPath[selectedCategoryPath.length - 1].id : '',
      category: selectedCategoryPath.length > 0 ? selectedCategoryPath[selectedCategoryPath.length - 1].id : '',
      city: {
        ru: selectedCityId ? getCitiesByRegion(selectedRegionId!).find(c => c.id === selectedCityId)?.name_ru || '' : '',
        kz: selectedCityId ? getCitiesByRegion(selectedRegionId!).find(c => c.id === selectedCityId)?.name_kz || '' : ''
      },
      imageUrl: uploadedImages.length > 0 ? uploadedImages[0] : '/placeholder.svg',
      images: uploadedImages,
      originalPrice: parseFloat(price) || 0,
      discountPrice: parseFloat(discountPrice) || parseFloat(price) || 0,
      discount: parseInt(discount) || 0,
      seller: {
        name: 'Пользователь',
        phone: phone,
        rating: 5
      },
      createdAt: new Date().toISOString(),
      views: 0,
      isFeatured: false
    };

    // Сохраняем объявление в localStorage
    const savedListings = JSON.parse(localStorage.getItem(USER_LISTINGS_KEY) || '[]');
    const updatedListings = [newListing, ...savedListings];
    localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(updatedListings));
    
    // Удаляем черновик после публикации
    localStorage.removeItem('currentListingDraft');
    
    toast({
      title: language === 'ru' ? 'Успех' : 'Сәтті',
      description: language === 'ru' 
        ? 'Объявление успешно опубликовано' 
        : 'Хабарландыру сәтті жарияланды',
    });
    
    // Navigate to home page after successful submission
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };
  
  const handleSaveDraft = () => {
    // Сохраняем текущее состояние формы
    const draftData = {
      title,
      description,
      price,
      discountPrice,
      discount,
      selectedRegionId,
      selectedCityId,
      selectedMicrodistrictId,
      phone,
      images: uploadedImages,
      selectedCategoryPath,
      createdAt: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('currentListingDraft', JSON.stringify(draftData));
    
    toast({
      title: language === 'ru' ? 'Черновик сохранен' : 'Жоба сақталды',
      description: language === 'ru' 
        ? 'Объявление сохранено как черновик' 
        : 'Хабарландыру жоба ретінде сақталды',
    });
  };

  if (categoriesLoading || locationLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === 'ru' ? 'Загрузка данных...' : 'Деректерді жүктеу...'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          {language ===  ? 'Создать объявление' : 'Хабарландыру жасау'}
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                {/* Категории с реальными данными из Supabase */}
                <div className="space-y-4">
                  <div>
                    <Label>
                      {language === 'ru' ? 'Категория' : 'Санат'}
                    </Label>
                    
                    {selectedCategoryPath.length > 0 && (
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
                            key={category.id}
                            className={`
                              p-2 rounded border cursor-pointer flex justify-between items-center
                              ${selectedCategoryPath[activeCategoryLevel]?.id === category.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                            `}
                            onClick={() => selectCategory(activeCategoryLevel, category)}
                          >
                            <div className="flex items-center">
                              <span className="text-sm">{category.name[language]}</span>
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*" 
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Вы можете загрузить до 10 фотографий. Изображения будут автоматически конвертированы в формат WebP.'
                    : 'Сіз 10-ға дейін сурет жүктей аласыз. Суреттер автоматты түрде WebP пішіміне түрлендіріледі.'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Location Selection Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-medium mb-2 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {language === 'ru' ? 'Местоположение' : 'Орналасқан жері'}
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="region">
                    {language === 'ru' ? 'Регион' : 'Аймақ'}
                  </Label>
                  <Select onValueChange={handleRegionChange}>
                    <SelectTrigger id="region">
                      <SelectValue 
                        placeholder={language === 'ru' ? 'Выберите регион' : 'Аймақты таңдаңыз'} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id.toString()}>
                          {language === 'ru' ? region.name_ru : region.name_kz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedRegionId && (
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      {language === 'ru' ? 'Город' : 'Қала'}
                    </Label>
                    <Select onValueChange={handleCityChange}>
                      <SelectTrigger id="city">
                        <SelectValue 
                          placeholder={language === 'ru' ? 'Выберите город' : 'Қаланы таңдаңыз'} 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {getCitiesByRegion(selectedRegionId).map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {language === 'ru' ? city.name_ru : city.name_kz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {selectedCityId && (
                  <div className="space-y-2">
                    <Label htmlFor="microdistrict">
                      {language === 'ru' ? 'Микрорайон' : 'Шағынаудан'}
                    </Label>
                    <Select onValueChange={handleMicrodistrictChange}>
                      <SelectTrigger id="microdistrict">
                        <SelectValue 
                          placeholder={language === 'ru' ? 'Выберите микрорайон (необязательно)' : 'Шағынауданды таңдаңыз (міндетті емес)'} 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {getMicrodistrictsByCity(selectedCityId).map((microdistrict) => (
                          <SelectItem key={microdistrict.id} value={microdistrict.id.toString()}>
                            {language === 'ru' ? microdistrict.name_ru : microdistrict.name_kz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-medium mb-2">
                  {language === 'ru' ? 'Контактная информация' : 'Байланыс ақпараты'}
                </h2>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {language === 'ru' ? 'Телефон' : 'Телефон'}
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="+7 (___) ___-__-__" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                <Button 
                  className="w-full mb-4"
                  onClick={handlePublish}
                  disabled={!isFormValid}
                >
                  {language === 'ru' ? 'Опубликовать объявление' : 'Хабарландыруды жариялау'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSaveDraft}
                >
                  <Save className="mr-2 h-4 w-4" />
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
