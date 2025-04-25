
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SafetyTipsProps {
  language: string;
}

export const SafetyTips = ({ language }: SafetyTipsProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="font-medium">
            {language === 'ru' ? 'Безопасность' : 'Қауіпсіздік'}
          </h3>
        </div>
        
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'ru' 
                ? 'Не совершайте предоплату' 
                : 'Алдын ала төлем жасамаңыз'}
            </span>
          </li>
          <li className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'ru' 
                ? 'Проверяйте товар при получении' 
                : 'Тауарды алған кезде тексеріңіз'}
            </span>
          </li>
          <li className="flex gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              {language === 'ru' 
                ? 'Встречайтесь в безопасных местах' 
                : 'Қауіпсіз жерлерде кездесіңіз'}
            </span>
          </li>
        </ul>
        
        <Button variant="link" className="text-xs p-0 h-auto mt-2">
          {language === 'ru' ? 'Подробнее о безопасности' : 'Қауіпсіздік туралы толығырақ'}
        </Button>
      </CardContent>
    </Card>
  );
};
