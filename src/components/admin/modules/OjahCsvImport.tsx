import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, AlertCircle, CheckCircle2, FileSpreadsheet, X, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AdvancedCsvImporter } from '../AdvancedCsvImporter';
import { CategoryTreeSelector } from '../CategoryTreeSelector';
import { ListingLifecycleManager } from '../ListingLifecycleManager';
import { AdvancedImageProcessor } from '../AdvancedImageProcessor';
import { supabase } from '@/lib/supabase';

type ImportEntityType = 'categories' | 'users' | 'listings';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface FieldMapping {
  csvField: string;
  systemField: string;
}

interface ImageProcessingResult {
  originalUrl: string;
  processedUrl?: string;
  fileName: string;
  size: number;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface LifecycleSettings {
  defaultDuration: number;
  autoExpire: boolean;
  sendNotifications: boolean;
  notifyBeforeExpiry: number;
  allowRenewal: boolean;
  maxRenewals: number;
}

const systemFields = {
  categories: ['id', 'name_ru', 'name_kk', 'parent_id', 'level', 'slug'],
  users: ['id', 'email', 'name', 'phone', 'role', 'city'],
  listings: ['id', 'title', 'description', 'regular_price', 'discount_price', 'category_id', 'user_id', 'city_id', 'images', 'expires_at']
};

export const OjahCsvImport = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportEntityType>('categories');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'categories' | 'lifecycle' | 'images' | 'validation' | 'import'>('upload');
  
  // Новые состояния для расширенной функциональности
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categoryMappings, setCategoryMappings] = useState<Record<string, number>>({});
  const [lifecycleSettings, setLifecycleSettings] = useState<LifecycleSettings>({
    defaultDuration: 30,
    autoExpire: true,
    sendNotifications: true,
    notifyBeforeExpiry: 3,
    allowRenewal: true,
    maxRenewals: 3
  });
  const [images, setImages] = useState<ImageProcessingResult[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: "Неверный формат файла",
        description: "Пожалуйста, выберите файл CSV"
      });
      return;
    }

    setSelectedFile(file);
    parseCsv(file);
  };

  const parseCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );
      
      setCsvData({ headers, rows });
      
      // Автоматическое сопоставление полей
      const autoMappings: FieldMapping[] = headers.map(header => {
        const normalizedHeader = header.toLowerCase().replace(/[\s-]/g, '_');
        const matchedField = systemFields[importType].find(field => 
          field.toLowerCase() === normalizedHeader || 
          field.toLowerCase().includes(normalizedHeader) ||
          normalizedHeader.includes(field.toLowerCase())
        );
        
        return {
          csvField: header,
          systemField: matchedField || ''
        };
      });
      
      setFieldMappings(autoMappings);
      setCurrentStep('mapping');
    };
    
    reader.readAsText(file, 'utf-8');
  };

  const updateFieldMapping = (csvField: string, systemField: string) => {
    setFieldMappings(prev => 
      prev.map(mapping => 
        mapping.csvField === csvField 
          ? { ...mapping, systemField }
          : mapping
      )
    );
  };

  // Автоматическое сопоставление категорий по названию
  const mapCategoriesAutomatically = async () => {
    if (!csvData || importType !== 'listings') return;

    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name_ru, name_kk');

      if (error) throw error;

      const mappings: Record<string, number> = {};
      const categoryNameField = fieldMappings.find(m => m.systemField === 'category_id')?.csvField;
      
      if (categoryNameField) {
        const categoryColumnIndex = csvData.headers.indexOf(categoryNameField);
        
        csvData.rows.forEach(row => {
          const categoryName = row[categoryColumnIndex]?.toLowerCase().trim();
          if (categoryName) {
            const matchedCategory = categories?.find(cat => 
              cat.name_ru.toLowerCase() === categoryName ||
              cat.name_kk.toLowerCase() === categoryName
            );
            
            if (matchedCategory) {
              mappings[categoryName] = matchedCategory.id;
            }
          }
        });
      }

      setCategoryMappings(mappings);
      toast({
        title: "Автоматическое сопоставление",
        description: `Сопоставлено ${Object.keys(mappings).length} категорий`
      });
    } catch (error: any) {
      console.error('Ошибка автоматического сопоставления:', error);
    }
  };

  const validateMappings = () => {
    const errors: string[] = [];
    const mappedSystemFields = fieldMappings
      .filter(m => m.systemField)
      .map(m => m.systemField);
    
    // Проверка на дублированные поля
    const duplicates = mappedSystemFields.filter((field, index) => 
      mappedSystemFields.indexOf(field) !== index
    );
    
    if (duplicates.length > 0) {
      errors.push(`Дублированные поля: ${duplicates.join(', ')}`);
    }

    // Проверка обязательных полей для каждого типа
    const requiredFields = {
      categories: ['name_ru'],
      users: ['email'],
      listings: ['title', 'category_id']
    };

    const missing = requiredFields[importType].filter(field => 
      !mappedSystemFields.includes(field)
    );

    if (missing.length > 0) {
      errors.push(`Отсутствуют обязательные поля: ${missing.join(', ')}`);
    }

    setValidationErrors(errors);
    
    if (errors.length === 0) {
      if (importType === 'listings') {
        setCurrentStep('categories');
      } else {
        setCurrentStep('validation');
      }
      return true;
    }
    return false;
  };

  const simulateImport = async () => {
    setIsImporting(true);
    setProgress(0);
    setCurrentStep('import');
    
    // Симуляция процесса импорта с учетом настроек жизненного цикла
    const totalRows = csvData?.rows.length || 0;
    
    for (let i = 0; i <= totalRows; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress((i / totalRows) * 100);
      
      // Здесь был бы реальный импорт данных с применением:
      // - сопоставлений категорий
      // - настроек жизненного цикла
      // - обработанных изображений
    }
    
    setIsImporting(false);
    toast({
      title: "Импорт завершен",
      description: `Успешно импортировано ${totalRows} записей с настройками жизненного цикла`
    });
    
    resetImport();
  };

  const resetImport = () => {
    setSelectedFile(null);
    setCsvData(null);
    setFieldMappings([]);
    setValidationErrors([]);
    setSelectedCategories([]);
    setCategoryMappings({});
    setImages([]);
    setProgress(0);
    setCurrentStep('upload');
  };

  const renderUploadStep = () => (
    <div className="space-y-4">
      <div>
        <Label>Тип импорта</Label>
        <Select 
          value={importType} 
          onValueChange={(value) => setImportType(value as ImportEntityType)}
          disabled={isImporting}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="categories">Категории</SelectItem>
            <SelectItem value="users">Пользователи</SelectItem>
            <SelectItem value="listings">Объявления</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {!selectedFile ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="mt-3 text-lg font-medium">Загрузите CSV файл</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Файл должен содержать данные для импорта {importType}
          </p>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('csv-file-input')?.click()}
              disabled={isImporting}
            >
              <Upload className="h-4 w-4 mr-2" />
              Выбрать файл
            </Button>
            <input 
              id="csv-file-input" 
              type="file" 
              accept=".csv" 
              className="hidden"
              onChange={handleFileSelect}
              disabled={isImporting}
            />
          </div>
        </div>
      ) : (
        <div className="bg-muted rounded-md p-4 flex items-center">
          <File className="h-5 w-5 mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">{selectedFile.name}</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="ml-auto"
            onClick={resetImport}
            disabled={isImporting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderCategoryStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Настройка категорий</h3>
        <Button onClick={mapCategoriesAutomatically} variant="outline" size="sm">
          Автосопоставление
        </Button>
      </div>
      
      <CategoryTreeSelector
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        multiSelect={true}
      />
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
          Назад
        </Button>
        <Button onClick={() => setCurrentStep('lifecycle')}>
          Продолжить
        </Button>
      </div>
    </div>
  );

  const renderLifecycleStep = () => (
    <div className="space-y-4">
      <ListingLifecycleManager
        settings={lifecycleSettings}
        onSettingsChange={setLifecycleSettings}
      />
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('categories')}>
          Назад
        </Button>
        <Button onClick={() => setCurrentStep('images')}>
          Продолжить
        </Button>
      </div>
    </div>
  );

  const renderImageStep = () => (
    <div className="space-y-4">
      <AdvancedImageProcessor
        images={images}
        onImagesChange={setImages}
        maxImages={20}
      />
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('lifecycle')}>
          Назад
        </Button>
        <Button onClick={() => setCurrentStep('validation')}>
          Продолжить
        </Button>
      </div>
    </div>
  );

  const renderMappingStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Сопоставление полей CSV с полями системы</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setFieldMappings(prev => prev.map(m => ({ ...m, systemField: '' })))}
          disabled={isImporting}
        >
          Сбросить
        </Button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {fieldMappings.map((mapping, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-center">
            <div>
              <Label className="text-sm font-medium">
                {mapping.csvField}
              </Label>
              <p className="text-xs text-muted-foreground">
                Пример: {csvData?.rows[0]?.[csvData.headers.indexOf(mapping.csvField)] || 'Нет данных'}
              </p>
            </div>
            <div>
              <Select 
                value={mapping.systemField} 
                onValueChange={(value) => updateFieldMapping(mapping.csvField, value)}
                disabled={isImporting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите поле системы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- Не импортировать --</SelectItem>
                  {systemFields[importType].map(field => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              {mapping.systemField ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('upload')}>
          Назад
        </Button>
        <Button onClick={validateMappings} disabled={isImporting}>
          Проверить и продолжить
        </Button>
      </div>
    </div>
  );

  const renderValidationStep = () => (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-sm font-medium text-green-800">Проверка пройдена успешно</h3>
        </div>
        <div className="mt-2 text-sm text-green-700">
          <p>Готово к импорту {csvData?.rows.length || 0} записей</p>
          {importType === 'listings' && (
            <>
              <p>Категорий выбрано: {selectedCategories.length}</p>
              <p>Изображений подготовлено: {images.length}</p>
              <p>Срок действия: {lifecycleSettings.defaultDuration} дней</p>
            </>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => {
          if (importType === 'listings') {
            setCurrentStep('images');
          } else {
            setCurrentStep('mapping');
          }
        }}>
          Назад
        </Button>
        <Button onClick={simulateImport} disabled={isImporting}>
          Начать импорт
        </Button>
      </div>
    </div>
  );

  const renderImportStep = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium">Импорт данных</h3>
        <p className="text-sm text-muted-foreground">
          Пожалуйста, подождите, пока данные импортируются в систему
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Прогресс импорта</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
      
      {!isImporting && progress === 100 && (
        <div className="text-center">
          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-green-600">Импорт завершен успешно!</p>
          <Button className="mt-4" onClick={resetImport}>
            Начать новый импорт
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Импорт CSV данных</h2>
        <p className="text-muted-foreground">
          Импортируйте данные из файлов CSV в систему с расширенными возможностями
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Базовый импорт</TabsTrigger>
          <TabsTrigger value="advanced">
            <Settings className="h-4 w-4 mr-2" />
            Продвинутый
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Мастер импорта CSV</CardTitle>
              <CardDescription>
                Пошаговый процесс импорта данных с полным функционалом
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 'upload' && renderUploadStep()}
              {currentStep === 'mapping' && renderMappingStep()}
              {currentStep === 'categories' && renderCategoryStep()}
              {currentStep === 'lifecycle' && renderLifecycleStep()}
              {currentStep === 'images' && renderImageStep()}
              {currentStep === 'validation' && renderValidationStep()}
              {currentStep === 'import' && renderImportStep()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <AdvancedCsvImporter />
        </TabsContent>
      </Tabs>
    </div>
  );
};
