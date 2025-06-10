import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, CheckCircle2, FileSpreadsheet, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CategoryTreeSelector } from '../CategoryTreeSelector';
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

// Поля CSV файла (только эти 6 полей)
const csvFields = [
  { key: 'title', label: 'Заголовок объявления', required: true },
  { key: 'description', label: 'Описание объявления', required: true },
  { key: 'image', label: 'Фото объявления', required: false },
  { key: 'regular_price', label: 'Обычная цена', required: false },
  { key: 'discount_price', label: 'Цена со скидкой', required: false },
  { key: 'source_link', label: 'Ссылка на источник', required: false }
];

export const OjahCsvImport = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    categoryId: null,
    cityId: null,
    expiryDays: 30
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Загрузка городов при монтировании компонента
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name_ru')
        .order('name_ru');

      if (error) throw error;
      setCities(data || []);
    } catch (error: any) {
      console.error('Ошибка загрузки городов:', error);
    }
  };

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
        const matchedField = csvFields.find(field => 
          field.key.toLowerCase() === normalizedHeader || 
          field.key.toLowerCase().includes(normalizedHeader.replace('_', '')) ||
          normalizedHeader.includes(field.key.replace('_', ''))
        );
        
        return {
          csvField: header,
          systemField: matchedField?.key || ''
        };
      });
      
      setFieldMappings(autoMappings);
    };
    
    reader.readAsText(file, 'utf-8');
  };

  const goToNextStep = () => {
    if (currentStep === 1 && csvData) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateSettings()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateMappings()) {
      setCurrentStep(4);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3 | 4);
    }
  };

  const validateSettings = () => {
    if (!importSettings.categoryId) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Выберите категорию для импорта"
      });
      return false;
    }
    return true;
  };

  const validateMappings = () => {
    const requiredFields = csvFields.filter(f => f.required);
    const mappedRequiredFields = requiredFields.filter(field => 
      fieldMappings.some(mapping => mapping.systemField === field.key && mapping.csvField)
    );

    if (mappedRequiredFields.length !== requiredFields.length) {
      toast({
        variant: "destructive",
        title: "Ошибка сопоставления",
        description: "Все обязательные поля должны быть сопоставлены"
      });
      return false;
    }
    return true;
  };

  const startImport = async () => {
    if (!csvData) return;

    setIsImporting(true);
    setImportProgress(0);

    const totalRows = csvData.rows.length;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + importSettings.expiryDays);

    try {
      for (let i = 0; i < totalRows; i++) {
        const row = csvData.rows[i];
        const listingData: any = {
          category_id: importSettings.categoryId,
          city_id: importSettings.cityId,
          expires_at: expiryDate.toISOString(),
          status: 'active'
        };

        // Сопоставление полей из CSV
        fieldMappings.forEach(mapping => {
          if (mapping.systemField && mapping.csvField) {
            const columnIndex = csvData.headers.indexOf(mapping.csvField);
            if (columnIndex !== -1) {
              const value = row[columnIndex];
              
              switch (mapping.systemField) {
                case 'title':
                  listingData.title = value;
                  break;
                case 'description':
                  listingData.description = value;
                  break;
                case 'image':
                  if (value) {
                    listingData.images = [value];
                  }
                  break;
                case 'regular_price':
                  if (value && !isNaN(Number(value))) {
                    listingData.regular_price = parseInt(value);
                  }
                  break;
                case 'discount_price':
                  if (value && !isNaN(Number(value))) {
                    listingData.discount_price = parseInt(value);
                  }
                  break;
                case 'source_link':
                  // Можно сохранить в дополнительных полях или игнорировать
                  break;
              }
            }
          }
        });

        // Создание объявления в базе данных
        const { error } = await supabase
          .from('listings')
          .insert(listingData);

        if (error) {
          console.error(`Ошибка импорта строки ${i + 1}:`, error);
        }

        setImportProgress(((i + 1) / totalRows) * 100);
        
        // Пауза для избежания перегрузки
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Импорт завершен",
        description: `Успешно импортировано ${totalRows} объявлений`
      });

      resetImport();
    } catch (error: any) {
      console.error('Ошибка импорта:', error);
      toast({
        variant: "destructive",
        title: "Ошибка импорта",
        description: error.message
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setCsvData(null);
    setFieldMappings([]);
    setImportSettings({
      categoryId: null,
      cityId: null,
      expiryDays: 30
    });
    setSelectedCategories([]);
    setImportProgress(0);
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

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Шаг 1: Выбор CSV-файла</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Загрузите CSV файл с объявлениями для импорта
        </p>
      </div>

      {!selectedFile ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Загрузите CSV файл</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Файл должен содержать поля: title, desc, image, regularprice, saleprice, link
          </p>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('csv-file-input')?.click()}
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
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-muted rounded-md p-4 flex items-center">
            <File className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-auto"
              onClick={resetImport}
            >
              Выбрать другой файл
            </Button>
          </div>
          
          {csvData && (
            <div className="border rounded-md overflow-x-auto">
              <div className="bg-muted p-2">
                <p className="text-sm font-medium">Предпросмотр (первые 5 строк)</p>
              </div>
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr className="bg-muted/50">
                    {csvData.headers.map((header, index) => (
                      <th 
                        key={index} 
                        className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm">
                          {cell.length > 50 ? `${cell.substring(0, 50)}...` : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-2 bg-muted/25 text-xs text-muted-foreground">
                Всего строк для импорта: {csvData.rows.length}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Шаг 2: Общие настройки</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Настройки применятся ко всем импортируемым объявлениям
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Категория *</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Выберите категорию для всех импортируемых объявлений
          </p>
          <CategoryTreeSelector
            selectedCategories={selectedCategories}
            onCategoriesChange={(categories) => {
              setSelectedCategories(categories);
              setImportSettings(prev => ({
                ...prev,
                categoryId: categories[0] || null
              }));
            }}
            multiSelect={false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Город</Label>
            <Select 
              value={importSettings.cityId?.toString() || ''} 
              onValueChange={(value) => 
                setImportSettings(prev => ({
                  ...prev,
                  cityId: value ? parseInt(value) : null
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name_ru}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiry">Срок действия (дни)</Label>
            <Input
              id="expiry"
              type="number"
              value={importSettings.expiryDays}
              onChange={(e) => 
                setImportSettings(prev => ({
                  ...prev,
                  expiryDays: parseInt(e.target.value) || 30
                }))
              }
              min="1"
              max="365"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Шаг 3: Сопоставление полей</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Сопоставьте поля CSV с полями системы
        </p>
      </div>

      <div className="space-y-3">
        {fieldMappings.map((mapping, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-center p-3 border rounded-lg">
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите поле" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">-- Не импортировать --</SelectItem>
                  {csvFields.map(field => (
                    <SelectItem key={field.key} value={field.key}>
                      {field.label} {field.required && '*'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              {mapping.systemField ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
              )}
            </div>
          </div>
        ))}
      </div>

      <Alert>
        <AlertDescription>
          Поля отмеченные * являются обязательными и должны быть сопоставлены
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep4 = () => {
    const mappedData = csvData?.rows.slice(0, 3).map(row => {
      const mapped: any = {};
      fieldMappings.forEach(mapping => {
        if (mapping.systemField && mapping.csvField) {
          const columnIndex = csvData.headers.indexOf(mapping.csvField);
          if (columnIndex !== -1) {
            mapped[mapping.systemField] = row[columnIndex];
          }
        }
      });
      return mapped;
    });

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Шаг 4: Предпросмотр и подтверждение</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Проверьте настройки и данные перед импортом
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Настройки импорта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Категория:</strong> {selectedCategories[0] ? `ID: ${selectedCategories[0]}` : 'Не выбрана'}</div>
              <div><strong>Город:</strong> {importSettings.cityId ? cities.find(c => c.id === importSettings.cityId)?.name_ru : 'Не выбран'}</div>
              <div><strong>Срок действия:</strong> {importSettings.expiryDays} дней</div>
              <div><strong>Количество записей:</strong> {csvData?.rows.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Предпросмотр данных (первые 3 записи)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mappedData?.map((item, index) => (
                  <div key={index} className="p-3 border rounded text-sm">
                    <div><strong>Заголовок:</strong> {item.title || 'Не указан'}</div>
                    <div><strong>Описание:</strong> {item.description ? `${item.description.substring(0, 100)}...` : 'Не указано'}</div>
                    <div><strong>Цена:</strong> {item.regular_price || 'Не указана'}</div>
                    <div><strong>Скидочная цена:</strong> {item.discount_price || 'Не указана'}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {isImporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Импорт в процессе...</span>
              <span>{Math.round(importProgress)}%</span>
            </div>
            <Progress value={importProgress} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Импорт CSV объявлений</h2>
        <p className="text-muted-foreground">
          Импорт объявлений из CSV файла в 4 простых шага
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Шаг {currentStep} из 4
            </CardTitle>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || isImporting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={goToNextStep}
                disabled={
                  (currentStep === 1 && !csvData) ||
                  (currentStep === 2 && !importSettings.categoryId) ||
                  isImporting
                }
              >
                Далее
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={startImport}
                disabled={isImporting}
              >
                {isImporting ? 'Импорт...' : 'Начать импорт'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
