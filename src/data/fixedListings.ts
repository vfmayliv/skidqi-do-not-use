import { cities } from './cities';
import { Listing } from '../types/listingType';

// Генерируем фиксированные ID для отладки
export const generateFixedListings = (): Listing[] => {
  return [
    {
      id: 'listing-1',
      title: {
        ru: 'Смартфон Samsung Galaxy S22',
        kz: 'Samsung Galaxy S22 смартфоны',
      },
      description: {
        ru: 'Новый смартфон Samsung Galaxy S22 с гарантией. Полный комплект, в отличном состоянии. Возможен торг при осмотре.',
        kz: 'Кепілдігі бар жаңа Samsung Galaxy S22 смартфоны. Толық жинағы бар, тамаша жағдайда. Қарау кезінде сауда жасау мүмкін.',
      },
      originalPrice: 450000,
      discountPrice: 380000,
      discount: 16,
      imageUrl: 'https://via.placeholder.com/300x200?text=Samsung',
      category: 'electronics',
      subcategory: 'phones',
      categoryId: 'electronics', // для совместимости
      subcategoryId: 'phones', // для совместимости
      city: cities[0],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      views: 542,
      isFeatured: true,
      userId: 'user-1',
      seller: {
        name: 'Александр',
        phone: '+7 (777) 123-45-67',
        rating: 4.8
      },
    },
    {
      id: 'listing-2',
      title: {
        ru: 'Ноутбук Apple MacBook Pro',
        kz: 'Apple MacBook Pro ноутбугі',
      },
      description: {
        ru: 'Ноутбук Apple MacBook Pro в идеальном состоянии. Практически не использовался. Полный комплект, включая зарядное устройство и оригинальную коробку.',
        kz: 'Тамаша жағдайдағы Apple MacBook Pro ноутбугі. Іс жүзінде пайдаланылмаған. Зарядтау құрылғысы және түпнұсқа қорабы бар толық жиынтық.',
      },
      originalPrice: 950000,
      discountPrice: 800000,
      discount: 16,
      imageUrl: 'https://via.placeholder.com/300x200?text=MacBook',
      category: 'electronics',
      subcategory: 'computers',
      categoryId: 'electronics', // для совместимости
      subcategoryId: 'computers', // для совместимости
      city: cities[1],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      views: 328,
      isFeatured: true,
      userId: 'user-2',
      seller: {
        name: 'Марат',
        phone: '+7 (777) 234-56-78',
        rating: 4.9
      },
    },
    {
      id: 'listing-3',
      title: {
        ru: '2-комнатная квартира в центре',
        kz: 'Орталықта 2 бөлмелі пәтер',
      },
      description: {
        ru: 'Продам 2-комнатную квартиру в центре города. Хороший ремонт, удобное расположение. Рядом школа, детский сад, магазины.',
        kz: 'Қала орталығында 2 бөлмелі пәтер сатылады. Жақсы жөндеу, ыңғайлы орналасу. Жақын жерде мектеп, балабақша, дүкендер бар.',
      },
      originalPrice: 25000000,
      discountPrice: 22000000,
      discount: 12,
      imageUrl: 'https://via.placeholder.com/300x200?text=Apartment',
      category: 'property',
      subcategory: 'apartments',
      categoryId: 'property', // для совместимости
      subcategoryId: 'apartments', // для совместимости
      city: cities[2],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      views: 712,
      isFeatured: false,
      userId: 'user-3',
      seller: {
        name: 'Айгуль',
        phone: '+7 (777) 345-67-89',
        rating: 4.5
      },
    },
    {
      id: 'listing-4',
      title: {
        ru: 'Toyota Camry 2020',
        kz: 'Toyota Camry 2020',
      },
      description: {
        ru: 'Продам автомобиль Toyota Camry 2020 года. Пробег 45000 км, в отличном состоянии. Один владелец, сервисная книжка.',
        kz: '2020 жылғы Toyota Camry автомобилін сатамын. Жүрісі 45000 км, тамаша жағдайда. Бір иесі, сервистік кітапшасы бар.',
      },
      originalPrice: 15000000,
      discountPrice: 13500000,
      discount: 10,
      imageUrl: 'https://via.placeholder.com/300x200?text=Toyota',
      category: 'transport',
      subcategory: 'cars',
      categoryId: 'transport', // для совместимости
      subcategoryId: 'cars', // для совместимости
      city: cities[0],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      views: 492,
      isFeatured: true,
      userId: 'user-4',
      seller: {
        name: 'Дмитрий',
        phone: '+7 (777) 456-78-90',
        rating: 4.7
      },
    },
    {
      id: 'listing-5',
      title: {
        ru: 'Диван угловой',
        kz: 'Бұрыштық диван',
      },
      description: {
        ru: 'Продам угловой диван в отличном состоянии. Механизм трансформации "дельфин". Цвет серый. Самовывоз.',
        kz: 'Жақсы күйдегі бұрыштық диван сатылады. "Дельфин" түрлендіру механизмі. Түсі сұр. Өзі алып кету.',
      },
      originalPrice: 180000,
      discountPrice: 130000,
      discount: 28,
      imageUrl: 'https://via.placeholder.com/300x200?text=Sofa',
      category: 'home',
      subcategory: 'furniture',
      categoryId: 'home', // для совместимости 
      subcategoryId: undefined, // для совместимости
      city: cities[3],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      views: 215,
      isFeatured: false,
      userId: 'user-5',
      seller: {
        name: 'Анна',
        phone: '+7 (777) 567-89-01',
        rating: 4.6
      },
    },
    {
      id: 'listing-6',
      title: {
        ru: 'Корм для собак Royal Canin',
        kz: 'Royal Canin ит азығы',
      },
      description: {
        ru: 'Продам корм для собак Royal Canin. Упаковка 15 кг. Срок годности до 2026 года. Доставка по городу.',
        kz: 'Royal Canin ит азығын сатамын. Қаптамасы 15 кг. Жарамдылық мерзімі 2026 жылға дейін. Қала бойынша жеткізу.',
      },
      originalPrice: 12000,
      discountPrice: 9000,
      discount: 25,
      imageUrl: 'https://via.placeholder.com/300x200?text=DogFood',
      category: 'pets',
      subcategory: 'pet-food',
      categoryId: 'pets', // для совместимости
      subcategoryId: undefined, // для совместимости
      city: cities[1],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      views: 87,
      isFeatured: false,
      userId: 'user-6',
      seller: {
        name: 'Елена',
        phone: '+7 (777) 678-90-12',
        rating: 4.9
      },
    },
    {
      id: 'listing-7',
      title: {
        ru: 'Велосипед горный Scott',
        kz: 'Scott таулы велосипеді',
      },
      description: {
        ru: 'Продам горный велосипед Scott, модель 2023 года. Алюминиевая рама, дисковые тормоза, 27 скоростей. Состояние идеальное.',
        kz: '2023 жылғы Scott таулы велосипедін сатамын. Алюминий жақтауы, дискілік тежегіштер, 27 жылдамдық. Жағдайы мінсіз.',
      },
      originalPrice: 280000,
      discountPrice: 220000,
      discount: 21,
      imageUrl: 'https://via.placeholder.com/300x200?text=Bicycle',
      category: 'hobby',
      subcategory: 'sports',
      categoryId: 'hobby', // для совместимости
      subcategoryId: undefined, // для совместимости
      city: cities[4],
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      views: 342,
      isFeatured: true,
      userId: 'user-7',
      seller: {
        name: 'Тимур',
        phone: '+7 (777) 789-01-23',
        rating: 4.8
      },
    },
    {
      id: 'listing-8',
      title: {
        ru: 'Зимняя куртка Columbia',
        kz: 'Columbia қысқы күртесі',
      },
      description: {
        ru: 'Продам зимнюю куртку Columbia, размер L. Утеплитель - синтепон, водонепроницаемая. Цвет - темно-синий. Носилась один сезон.',
        kz: 'Columbia қысқы күртесін сатамын, өлшемі L. Жылытқыш - синтепон, су өткізбейтін. Түсі - қою көк. Бір маусым киілген.',
      },
      originalPrice: 45000,
      discountPrice: 25000,
      discount: 44,
      imageUrl: 'https://via.placeholder.com/300x200?text=Jacket',
      category: 'fashion',
      subcategory: 'clothing',
      categoryId: 'fashion', // для совместимости
      subcategoryId: undefined, // для совместимости
      city: cities[1],
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      views: 178,
      isFeatured: false,
      userId: 'user-8',
      seller: {
        name: 'Олег',
        phone: '+7 (777) 890-12-34',
        rating: 4.4
      },
    },
  ];
};
