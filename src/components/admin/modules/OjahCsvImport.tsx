import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, CheckCircle2, FileSpreadsheet, ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface FieldMapping {
  csvField: string;
  systemField: string;
}

interface ImportSettings {
  categoryId: number | null;
  cityId: number | null;
  expiryDays: number;
}

interface AdminUser {
  id: string;
  email: string;
}

interface Category {
  id: number;
  name_ru: string;
  name_kz: string;
  parent_id: number | null;
  level: number;
  children?: Category[];
}

// Поля CSV файла (только эти 6 полей)
const csvFields = [
  { key: 'title', label: 'Заголовок объявления', required: true },
  { key: 'description', label: 'Описание объявления', required: true },
  { key: 'image', label: 'URL изображения', required: false },
  { key: 'regular_price', label: 'Обычная цена', required: false },
  { key: 'discount_price', label: 'Цена со скидкой', required: false },
  { key: 'source_link', label: 'Ссылка на источник', required: false },
];

// Перечисление системных полей
const systemFields = [
  { key: 'title', label: 'Заголовок объявления', required: true },
  { key: 'description', label: 'Описание объявления', required: true },
  { key: 'image', label: 'URL изображения', required: false },
  { key: 'regular_price', label: 'Обычная цена', required: false },
  { key: 'discount_price', label: 'Цена со скидкой', required: false },
  { key: 'source_link', label: 'Ссылка на источник', required: false },
];

export const OjahCsvImport = () => {
  const { toast } = useToast();
  
  // Состояния для всего компонента
  const [currentStep, setCurrentStep] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    categoryId: null,
    cityId: null,
    expiryDays: 30,
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<{id: number, name: string}[]>([]);
  const [selectedRootCategory, setSelectedRootCategory] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<number | null>(null);
  
  // Состояния для импорта
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  // Получение категорий и пользователя при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name_ru', { ascending: true });
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки категорий",
            description: error.message,
          });
          return;
        }
        
        if (data) {
          // Построение древовидной структуры категорий
          const rootCategories: Category[] = [];
          const categoryMap: Record<number, Category> = {};
          
          // Сначала создаем мапу всех категорий по ID
          data.forEach((cat: Category) => {
            categoryMap[cat.id] = { ...cat, children: [] };
          });
          
          // Затем строим дерево категорий
          data.forEach((cat: Category) => {
            if (cat.parent_id === null) {
              rootCategories.push(categoryMap[cat.id]);
            } else if (categoryMap[cat.parent_id]) {
              if (!categoryMap[cat.parent_id].children) {
                categoryMap[cat.parent_id].children = [];
              }
              categoryMap[cat.parent_id].children!.push(categoryMap[cat.id]);
            }
          });
          
          setCategories(rootCategories);
        }
      } catch (err) {
        console.error('Ошибка при загрузке категорий:', err);
      }
    };
    
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Ошибка при получении пользователя:', error);
          return;
        }
        
        if (data && data.user) {
          setAdminUser({
            id: data.user.id,
            email: data.user.email || '',
          });
        }
      } catch (err) {
        console.error('Ошибка при получении пользователя:', err);
      }
    };
    
    const fetchCities = async () => {
      try {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name_ru', { ascending: true });
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки городов",
            description: error.message,
          });
          return;
        }
        
        if (data) {
          setCities(data.map(city => ({ id: city.id, name: city.name_ru })));
        }
      } catch (err) {
        console.error('Ошибка при загрузке городов:', err);
      }
    };
    
    fetchCategories();
    fetchUser();
    fetchCities();
  }, [toast]);

  // Обработка загрузки CSV файла
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setCsvFile(file);
    
    try {
      const text = await file.text();
      const lines = text.split('\n');
      
      // Первая строка - заголовки
      const headers = lines[0].split(',').map(header => header.trim());
      
      // Остальные строки - данные
      const rows = lines.slice(1).filter(line => line.trim() !== '').map(line => {
        return line.split(',').map(cell => cell.trim());
      });
      
      setCsvData({ headers, rows });
      
      // Автоматическое сопоставление полей по названиям
      const mappings: FieldMapping[] = [];
      headers.forEach(header => {
        const normalizedHeader = header.toLowerCase();
        
        // Проверяем совпадения по ключам системных полей
        const matchingSystemField = systemFields.find(field => 
          field.key.toLowerCase() === normalizedHeader || 
          field.label.toLowerCase().includes(normalizedHeader)
        );
        
        if (matchingSystemField) {
          mappings.push({
            csvField: header,
            systemField: matchingSystemField.key,
          });
        }
      });
      
      setFieldMappings(mappings);
      
      toast({
        title: "Файл успешно загружен",
        description: `Обнаружено ${headers.length} колонок и ${rows.length} строк данных`,
      });
    } catch (error) {
      console.error('Ошибка при обработке файла:', error);
      toast({
        variant: "destructive",
        title: "Ошибка обработки файла",
        description: "Не удалось прочитать CSV файл. Проверьте формат файла.",
      });
    }
  };

  // Функция импорта данных из CSV
  const startImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportedCount(0);
    setErrorCount(0);
    
    try {
      // 1. Получаем текущего авторизованного пользователя
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        toast({
          variant: "destructive",
          title: "Ошибка авторизации",
          description: "Необходимо авторизоваться для импорта объявлений"
        });
        setIsImporting(false);
        return;
      }
      const userId = userData.user.id;
      
      // 2. Подготавливаем дату истечения
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + importSettings.expiryDays);
      
      // 3. Импорт объявлений
      if (!csvData || !fieldMappings.length) {
        setIsImporting(false);
        toast({
          variant: "destructive",
          title: "Ошибка импорта",
          description: "Нет данных для импорта или не настроено сопоставление полей"
        });
        return;
      }
      
      const totalRows = csvData.rows.length;
      let importedListings = 0;
      
      for (let i = 0; i < totalRows; i++) {
        const row = csvData.rows[i];
        
        // Создаем объект с данными объявления
        const rowData: Record<string, any> = {};
        
        // Заполняем данные из CSV
        fieldMappings.forEach(mapping => {
          if (mapping.csvField && mapping.systemField) {
            const headerIndex = csvData.headers.indexOf(mapping.csvField);
            if (headerIndex > -1) {
              // Обработка полей в зависимости от типа
              if (mapping.systemField === 'regular_price' || mapping.systemField === 'discount_price') {
                // Конвертация строк с ценами в числа (удаление пробелов, символов валют и т.д.)
                const priceStr = row[headerIndex] || '';
                const numericPrice = parseInt(priceStr.replace(/\D/g, ''), 10);
                rowData[mapping.systemField] = isNaN(numericPrice) ? null : numericPrice;
              } else {
                rowData[mapping.systemField] = row[headerIndex] || '';
              }
            }
          }
        });
        
        // Добавляем обязательные поля и общие настройки
        const listingData = {
          title: rowData.title || '',
          description: rowData.description || '',
          regular_price: rowData.regular_price,
          discount_price: rowData.discount_price,
          source_link: rowData.source_link,
          category_id: importSettings.categoryId,
          city_id: importSettings.cityId,
          expires_at: expiryDate.toISOString(),
          status: 'active',
          views: 0,
          is_premium: false,
          is_free: false,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          images: rowData.image ? [rowData.image] : null
        };
        
        // Удаление null и undefined значений
        Object.keys(listingData).forEach(key => {
          if (listingData[key] === null || listingData[key] === undefined) {
            delete listingData[key];
          }
        });
        
        // Проверка обязательных полей
        if (!listingData.title || !listingData.description) {
          toast({
            variant: "destructive",
            title: `Ошибка в строке ${i + 1}`,
            description: "Отсутствуют обязательные поля: заголовок или описание"
          });
          setErrorCount(prev => prev + 1);
          continue;
        }
        
        try {
          // Вставка объявления в базу данных
          const { data: insertedData, error } = await supabase
            .from('listings')
            .insert(listingData)
            .select();
          
          if (error) {
            console.error("Error importing listing:", error);
            toast({
              variant: "destructive",
              title: `Ошибка в строке ${i + 1}`,
              description: `${error.message || 'Неизвестная ошибка'}`
            });
            setErrorCount(prev => prev + 1);
          } else {
            importedListings++;
            setImportedCount(prev => prev + 1);
          }
        } catch (err) {
          console.error("Exception during import:", err);
          toast({
            variant: "destructive",
            title: `Ошибка в строке ${i + 1}`,
            description: `${err.message || 'Неизвестная ошибка'}`
          });
          setErrorCount(prev => prev + 1);
        }
        
        // Обновление прогресса
        const progress = Math.round(((i + 1) / totalRows) * 100);
        setImportProgress(progress);
      }
      
      // 4. Проверка результатов импорта
      const { data: countData } = await supabase
        .from('listings')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 1000 * 60 * 5).toISOString()); // последние 5 минут
        
      // 5. Финальное уведомление
      if (importedListings > 0) {
        toast({
          title: "Импорт завершен",
          description: `Успешно импортировано ${importedListings} объявлений`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Импорт завершен с ошибками",
          description: "Не удалось импортировать ни одно объявление"
        });
      }
      
    } catch (error) {
      console.error("Import error:", error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: error.message || "Неизвестная ошибка при импорте"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Импорт объявлений из CSV
          </CardTitle>
          <CardDescription>
            Загрузите CSV файл с объявлениями для массового импорта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Шаг 1: Загрузка файла */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <h3 className="text-lg font-semibold">Загрузка CSV файла</h3>
            </div>
            
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Выберите CSV файл с объявлениями
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="max-w-xs"
                />
              </div>
            </div>
            
            {csvFile && (
              <Alert>
                <File className="h-4 w-4" />
                <AlertDescription>
                  Файл загружен: {csvFile.name} ({Math.round(csvFile.size / 1024)} КБ)
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Простой интерфейс для импорта */}
          {csvData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <h3 className="text-lg font-semibold">Настройки импорта</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select 
                    value={importSettings.categoryId ? importSettings.categoryId.toString() : undefined} 
                    onValueChange={(value) => setImportSettings(prev => ({ ...prev, categoryId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name_ru}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Select 
                    value={importSettings.cityId ? importSettings.cityId.toString() : undefined} 
                    onValueChange={(value) => setImportSettings(prev => ({ ...prev, cityId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry">Срок действия (дни)</Label>
                  <Input
                    id="expiry"
                    type="number"
                    value={importSettings.expiryDays}
                    onChange={(e) => setImportSettings(prev => ({ ...prev, expiryDays: parseInt(e.target.value) || 30 }))}
                    min="1"
                    max="365"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Предварительный просмотр данных</h4>
                <div className="text-sm text-muted-foreground">
                  Обнаружено: {csvData.headers.length} колонок, {csvData.rows.length} строк
                </div>
                
                <Button 
                  onClick={startImport}
                  disabled={isImporting || !importSettings.categoryId || !importSettings.cityId}
                  className="w-full"
                >
                  {isImporting ? 'Импортируется...' : 'Начать импорт'}
                </Button>
              </div>
              
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс импорта</span>
                    <span>{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    Импортировано: {importedCount}, Ошибок: {errorCount}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
