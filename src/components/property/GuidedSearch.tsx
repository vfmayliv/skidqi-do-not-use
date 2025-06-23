import { useState } from 'react';
import { useAppStore } from '@/stores/useAppStore';

interface GuidedSearchProps {
  onComplete: (dealType: string, segment: string) => void;
}

export function GuidedSearch({ onComplete }: GuidedSearchProps) {
  const { language } = useAppStore();
  const [step, setStep] = useState(1);
  const [dealType, setDealType] = useState('');

  const dealTypes = [
    { id: 'sale', label: { ru: 'Купить', kz: 'Сатып алу' } },
    { id: 'rent_long', label: { ru: 'Снять надолго', kz: 'Ұзақ мерзімге жалға алу' } },
    { id: 'rent_short', label: { ru: 'Снять посуточно', kz: 'Тәуліктік жалға алу' } },
  ];

  const segments = [
    { id: 'residential', label: { ru: 'Жилая', kz: 'Тұрғын үй' } },
    { id: 'commercial', label: { ru: 'Коммерческая', kz: 'Коммерциялық' } },
  ];

  const handleDealTypeSelect = (selectedDealType: string) => {
    setDealType(selectedDealType);
    setStep(2);
  };

  const handleSegmentSelect = (segment: string) => {
    onComplete(dealType, segment);
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg text-center mb-8">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Что вы хотите сделать?</h2>
          <div className="flex justify-center gap-4">
            {dealTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleDealTypeSelect(type.id)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                {type.label[language]}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Какой тип недвижимости?</h2>
          <div className="flex justify-center gap-4">
            {segments.map((segment) => (
              <button
                key={segment.id}
                onClick={() => handleSegmentSelect(segment.id)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {segment.label[language]}
              </button>
            ))}
          </div>
           <button onClick={() => setStep(1)} className="mt-4 text-sm text-gray-600 hover:underline">Назад</button>
        </div>
      )}
    </div>
  );
}
