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

type ImportEntityType = 'categories' | 'users' | 'listings';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface FieldMapping {
  csvField: string;
  systemField: string;
}

const systemFields = {
  categories: ['id', 'name_ru', 'name_kk', 'parent_id', 'level', 'slug'],
  users: ['id', 'email', 'name', 'phone', 'role', 'city'],
  listings: ['id', 'title_ru', 'title_kk', 'description_ru', 'description_kk', 'price', 'discount_price', 'category_id', 'user_id', 'city', 'is_featured']
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
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'validation' | 'import'>('upload');

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
      categories: ['name_ru', 'name_kk'],
      users: ['email'],
      listings: ['title_ru', 'price', 'category_id', 'user_id']
    };

    const missing = requiredFields[importType].filter(field => 
      !mappedSystemFields.includes(field)
    );

    if (missing.length > 0) {
      errors.push(`Отсутствуют обязательные поля: ${missing.join(', ')}`);
    }

    setValidationErrors(errors);
    
    if (errors.length === 0) {
      setCurrentStep('validation');
      return true;
    }
    return false;
  };

  const simulateImport = async () => {
    setIsImporting(true);
    setProgress(0);
    setCurrentStep('import');
    
    // Симуляция процесса импорта
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setIsImporting(false);
    toast({
      title: "Импорт завершен",
      description: `Успешно импортировано ${csvData?.rows.length || 0} записей`
    });
    
    // Сброс состояния
    resetImport();
  };

  const resetImport = () => {
    setSelectedFile(null);
    setCsvData(null);
    setFieldMappings([]);
    setValidationErrors([]);
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
        <p className="text-sm text-green-700 mt-1">
          Готово к импорту {csvData?.rows.length || 0} записей
        </p>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted px-4 py-2">
          <h4 className="text-sm font-medium">Предварительный просмотр данных</h4>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                {fieldMappings
                  .filter(m => m.systemField)
                  .map((mapping, index) => (
                    <th key={index} className="px-4 py-2 text-left text-xs font-medium uppercase">
                      {mapping.systemField}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {csvData?.rows.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {fieldMappings
                    .filter(m => m.systemField)
                    .map((mapping, cellIndex) => {
                      const columnIndex = csvData.headers.indexOf(mapping.csvField);
                      return (
                        <td key={cellIndex} className="px-4 py-2 text-sm">
                          {row[columnIndex] || ''}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
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
          <span>{progress}%</span>
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
          Импортируйте данные из файлов CSV в систему
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
                Пошаговый процесс импорта данных из CSV файлов
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 'upload' && renderUploadStep()}
              {currentStep === 'mapping' && renderMappingStep()}
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
