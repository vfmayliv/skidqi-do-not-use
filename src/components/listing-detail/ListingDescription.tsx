
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ListingDescriptionProps {
  description: string; // Changed to string type to ensure we're not passing an object
  language: string;
}

export const ListingDescription = ({ description }: ListingDescriptionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <Tabs defaultValue="description">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">
            {t('description', 'Описание')}
          </TabsTrigger>
          <TabsTrigger value="characteristics">
            {t('characteristics', 'Характеристики')}
          </TabsTrigger>
          <TabsTrigger value="delivery">
            {t('delivery', 'Доставка')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="pt-4">
          <div className="space-y-4">
            <p className="text-sm whitespace-pre-line">
              {description}
            </p>
            
            {/* Additional description content for better resemblance to Avito */}
            <p className="text-sm">
              {t('guaranteeMessage', 'Товар в наличии. Гарантия качества. Возможен торг при осмотре.')}
            </p>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-2">
                {t('advantages', 'Преимущества товара:')}
              </h4>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>{t('highQuality', 'Высокое качество')}</li>
                <li>{t('longLifespan', 'Долгий срок службы')}</li>
                <li>{t('reliableManufacturer', 'Надежный производитель')}</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="characteristics" className="pt-4">
          <dl className="space-y-4">
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {t('category', 'Категория')}
              </dt>
              <dd className="text-sm">{t('electronics', 'Электроника')}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {t('condition', 'Состояние')}
              </dt>
              <dd className="text-sm">{t('new', 'Новый')}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {t('brand', 'Бренд')}
              </dt>
              <dd className="text-sm">Samsung</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {t('warranty', 'Гарантия')}
              </dt>
              <dd className="text-sm">{t('warranty12Months', '12 месяцев')}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {t('availability', 'Наличие')}
              </dt>
              <dd className="text-sm">{t('inStock', 'В наличии')}</dd>
            </div>
            <div className="flex border-b pb-2">
              <dt className="w-40 font-medium text-sm">
                {t('color', 'Цвет')}
              </dt>
              <dd className="text-sm">{t('black', 'Черный')}</dd>
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
                  {t('pickup', 'Самовывоз')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('pickupDesc', 'Заберите товар по адресу продавца')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  {t('courierDelivery', 'Доставка курьером')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('courierDeliveryDesc', 'Доставка курьером в течение 1-2 дней')}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
