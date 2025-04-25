
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock } from 'lucide-react';

interface ListingDescriptionProps {
  description: string;
  language: string;
}

export const ListingDescription = ({ description, language }: ListingDescriptionProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">
            {language === 'ru' ? 'Описание' : 'Сипаттама'}
          </TabsTrigger>
          <TabsTrigger value="characteristics">
            {language === 'ru' ? 'Характеристики' : 'Сипаттамалары'}
          </TabsTrigger>
          <TabsTrigger value="delivery">
            {language === 'ru' ? 'Доставка' : 'Жеткізу'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="pt-4">
          <div className="space-y-4">
            <p className="text-sm whitespace-pre-line">
              {description}
            </p>
            
            {/* Additional description content for better resemblance to Avito */}
            <p className="text-sm">
              {language === 'ru' 
                ? 'Товар в наличии. Гарантия качества. Возможен торг при осмотре.'
                : 'Тауар қолда бар. Сапа кепілдігі. Қарау кезінде сауда жасау мүмкін.'}
            </p>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">
                {language === 'ru' ? 'Преимущества товара:' : 'Тауардың артықшылықтары:'}
              </h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{language === 'ru' ? 'Высокое качество' : 'Жоғары сапа'}</li>
                <li>{language === 'ru' ? 'Долгий срок службы' : 'Ұзақ қызмет ету мерзімі'}</li>
                <li>{language === 'ru' ? 'Надежный производитель' : 'Сенімді өндіруші'}</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="characteristics" className="pt-4">
          <dl className="space-y-4">
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {language === 'ru' ? 'Категория' : 'Санат'}
              </dt>
              <dd className="text-sm">{language === 'ru' ? 'Электроника' : 'Электроника'}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {language === 'ru' ? 'Состояние' : 'Жағдайы'}
              </dt>
              <dd className="text-sm">{language === 'ru' ? 'Новый' : 'Жаңа'}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {language === 'ru' ? 'Бренд' : 'Бренд'}
              </dt>
              <dd className="text-sm">Samsung</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {language === 'ru' ? 'Гарантия' : 'Кепілдік'}
              </dt>
              <dd className="text-sm">{language === 'ru' ? '12 месяцев' : '12 ай'}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {language === 'ru' ? 'Наличие' : 'Қолда бар'}
              </dt>
              <dd className="text-sm">{language === 'ru' ? 'В наличии' : 'Қолда бар'}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {language === 'ru' ? 'Цвет' : 'Түсі'}
              </dt>
              <dd className="text-sm">{language === 'ru' ? 'Черный' : 'Қара'}</dd>
            </div>
          </dl>
        </TabsContent>
        
        <TabsContent value="delivery" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  {language === 'ru' ? 'Самовывоз' : 'Өзі алып кету'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Заберите товар по адресу продавца' 
                    : 'Тауарды сатушының мекенжайы бойынша алыңыз'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  {language === 'ru' ? 'Доставка курьером' : 'Курьермен жеткізу'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {language === 'ru' 
                    ? 'Доставка курьером в течение 1-2 дней' 
                    : 'Курьермен 1-2 күн ішінде жеткізу'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
