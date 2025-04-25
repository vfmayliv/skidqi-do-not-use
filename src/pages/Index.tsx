
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Управление сайтами</h1>
        <p className="text-xl text-gray-600 mb-6">Перейдите в панель управления для работы с вашими сайтами</p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Перейти в панель управления
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Index;
