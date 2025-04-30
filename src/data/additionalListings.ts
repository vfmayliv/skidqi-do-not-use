import { cities } from './cities';
import { Listing } from '../types/listingType';

// Дополнительные фиксированные листинги
export const getAdditionalFixedListings = (): Listing[] => {
  return [
    {
      id: 'listing-9',
      title: {
        ru: 'Детская коляска 2 в 1',
        kz: '2 ішіндегі 1 бала арбасы',
      },
      description: {
        ru: 'Продам детскую коляску 2 в 1 (люлька + прогулочный блок). Фирма Anex, модель Sport. Отличное состояние, полный комплект.',
        kz: '2 ішіндегі 1 бала арбасын сатамын (бесік + серуендеу блогы). Anex фирмасы, Sport моделі. Тамаша жағдай, толық жиынтық.',
      },
      originalPrice: 120000,
      discountPrice: 85000,
      discount: 29,
      imageUrl: 'https://via.placeholder.com/300x200?text=BabyStroller',
      category: 'kids',
      categoryId: 'kids',
      subcategoryId: 'strollers',
      city: cities[0],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      views: 253,
      isFeatured: true,
      seller: {
        name: 'Мария',
        phone: '+7 (777) 901-23-45',
        rating: 4.9
      },
    },
    {
      id: 'listing-10',
      title: {
        ru: 'Стиральная машина LG',
        kz: 'LG кір жуғыш машинасы',
      },
      description: {
        ru: 'Продам стиральную машину LG, загрузка 7 кг. Инверторный двигатель, класс энергопотребления A+++. На гарантии еще 1 год.',
        kz: 'LG кір жуғыш машинасын сатамын, 7 кг жүктеме. Инверторлық қозғалтқыш, A+++ энергия тұтыну класы. Кепілдік тағы 1 жыл.',
      },
      originalPrice: 180000,
      discountPrice: 150000,
      discount: 17,
      imageUrl: 'https://via.placeholder.com/300x200?text=WashingMachine',
      category: 'electronics',
      categoryId: 'electronics',
      subcategoryId: 'appliances',
      city: cities[2],
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      views: 187,
      isFeatured: false,
      seller: {
        name: 'Алихан',
        phone: '+7 (777) 012-34-56',
        rating: 4.7
      },
    },
    {
      id: 'listing-11',
      title: {
        ru: 'Участок 10 соток',
        kz: '10 сотық жер телімі',
      },
      description: {
        ru: 'Продам земельный участок 10 соток в пригороде. Ровный, удобный подъезд, все коммуникации рядом. Документы готовы.',
        kz: 'Қала маңындағы 10 сотық жер телімін сатамын. Тегіс, ыңғайлы кіреберіс, барлық коммуникациялар жақын. Құжаттар дайын.',
      },
      originalPrice: 5000000,
      discountPrice: 4200000,
      discount: 16,
      imageUrl: 'https://via.placeholder.com/300x200?text=Land',
      category: 'property',
      categoryId: 'property',
      subcategoryId: 'land',
      city: cities[0],
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      views: 421,
      isFeatured: true,
      seller: {
        name: 'Сергей',
        phone: '+7 (777) 123-45-67',
        rating: 4.6
      },
    },
    {
      id: 'listing-12',
      title: {
        ru: 'Игровая консоль PlayStation 5',
        kz: 'PlayStation 5 ойын консолі',
      },
      description: {
        ru: 'Продам PlayStation 5 в идеальном состоянии. В комплекте два джойстика, 3 игры. Коробка, документы в наличии.',
        kz: 'Тамаша жағдайдағы PlayStation 5 сатамын. Жиынтықта екі джойстик, 3 ойын бар. Қорап, құжаттар бар.',
      },
      originalPrice: 350000,
      discountPrice: 290000,
      discount: 17,
      imageUrl: 'https://via.placeholder.com/300x200?text=PS5',
      category: 'electronics',
      categoryId: 'electronics',
      subcategoryId: 'gaming',
      city: cities[1],
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      views: 378,
      isFeatured: true,
      seller: {
        name: 'Арман',
        phone: '+7 (777) 234-56-78',
        rating: 4.8
      },
    },
    {
      id: 'listing-13',
      title: {
        ru: 'Кухонный гарнитур',
        kz: 'Ас үй жиһазы',
      },
      description: {
        ru: 'Продам кухонный гарнитур, длина 3 метра. Материал - ЛДСП, фасады - МДФ. Встроенная мойка и столешница из искусственного камня.',
        kz: 'Ас үй жиһазын сатамын, ұзындығы 3 метр. Материалы - ЛДСП, беттері - МДФ. Кіріктірілген жуғыш және жасанды тастан жасалған үстел.',
      },
      originalPrice: 250000,
      discountPrice: 180000,
      discount: 28,
      imageUrl: 'https://via.placeholder.com/300x200?text=Kitchen',
      category: 'home',
      categoryId: 'home',
      subcategoryId: 'furniture',
      city: cities[3],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      views: 215,
      isFeatured: false,
      seller: {
        name: 'Светлана',
        phone: '+7 (777) 345-67-89',
        rating: 4.5
      },
    },
    {
      id: 'listing-14',
      title: {
        ru: 'Свадебное платье',
        kz: 'Үйлену көйлегі',
      },
      description: {
        ru: 'Продам свадебное платье, размер 42-44. Цвет - белый, фасон - рыбка. Ручная вышивка, кружево. Одето один раз.',
        kz: 'Үйлену көйлегін сатамын, өлшемі 42-44. Түсі - ақ, үлгісі - балық. Қолмен кестеленген, шілтер. Бір рет киілген.',
      },
      originalPrice: 200000,
      discountPrice: 90000,
      discount: 55,
      imageUrl: 'https://via.placeholder.com/300x200?text=WeddingDress',
      category: 'fashion',
      categoryId: 'fashion',
      subcategoryId: 'wedding',
      city: cities[2],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      views: 167,
      isFeatured: false,
      seller: {
        name: 'Жанна',
        phone: '+7 (777) 456-78-90',
        rating: 4.9
      },
    },
    {
      id: 'listing-15',
      title: {
        ru: 'Массажное кресло',
        kz: 'Массаж креслосы',
      },
      description: {
        ru: 'Продам массажное кресло Yamaguchi Axiom. Функции: шиацу, разминание, постукивание, вибрация. Подогрев, таймер.',
        kz: 'Yamaguchi Axiom массаж креслосын сатамын. Функциялары: шиацу, илеу, соғу, діріл. Жылыту, таймер.',
      },
      originalPrice: 750000,
      discountPrice: 500000,
      discount: 33,
      imageUrl: 'https://via.placeholder.com/300x200?text=MassageChair',
      category: 'beauty',
      categoryId: 'beauty',
      subcategoryId: 'equipment',
      city: cities[0],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      views: 245,
      isFeatured: true,
      seller: {
        name: 'Николай',
        phone: '+7 (777) 567-89-01',
        rating: 4.7
      },
    },
    {
      id: 'listing-16',
      title: {
        ru: 'Мотоцикл Yamaha R1',
        kz: 'Yamaha R1 мотоциклі',
      },
      description: {
        ru: 'Продам мотоцикл Yamaha R1, 2021 года. Пробег 5000 км. Мощность 200 л.с. Состояние нового мотоцикла.',
        kz: '2021 жылғы Yamaha R1 мотоциклін сатамын. Жүрісі 5000 км. Қуаты 200 а.к. Жаңа мотоцикл жағдайы.',
      },
      originalPrice: 6500000,
      discountPrice: 5900000,
      discount: 9,
      imageUrl: 'https://via.placeholder.com/300x200?text=Motorcycle',
      category: 'transport',
      categoryId: 'transport',
      subcategoryId: 'motorcycles',
      city: cities[1],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      views: 432,
      isFeatured: true,
      seller: {
        name: 'Руслан',
        phone: '+7 (777) 678-90-12',
        rating: 4.8
      },
    },
    {
      id: 'listing-17',
      title: {
        ru: 'Фотоаппарат Canon EOS 5D Mark IV',
        kz: 'Canon EOS 5D Mark IV фотоаппараты',
      },
      description: {
        ru: 'Продам профессиональный фотоаппарат Canon EOS 5D Mark IV. Полный комплект, состояние нового. Пробег затвора всего 5000 кадров.',
        kz: 'Canon EOS 5D Mark IV кәсіби фотоаппаратын сатамын. Толық жиынтық, жаңа жағдайда. Ысырма жүрісі тек 5000 кадр.',
      },
      originalPrice: 1200000,
      discountPrice: 980000,
      discount: 18,
      imageUrl: 'https://via.placeholder.com/300x200?text=Camera',
      category: 'electronics',
      categoryId: 'electronics',
      subcategoryId: undefined,
      city: cities[5],
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      views: 265,
      isFeatured: true,
      seller: {
        name: 'Евгений',
        phone: '+7 (777) 789-01-23',
        rating: 4.6
      },
    },
    {
      id: 'listing-18',
      title: {
        ru: 'Шкаф-купе трехдверный',
        kz: 'Үш есікті шкаф-купе',
      },
      description: {
        ru: 'Продам шкаф-купе трехдверный. Размеры: высота 240 см, ширина 180 см, глубина 60 см. Цвет венге/молочный дуб. Состояние отличное.',
        kz: 'Үш есікті шкаф-купе сатамын. Өлшемдері: биіктігі 240 см, ені 180 см, тереңдігі 60 см. Түсі венге/сүтті емен. Жағдайы тамаша.',
      },
      originalPrice: 150000,
      discountPrice: 120000,
      discount: 20,
      imageUrl: 'https://via.placeholder.com/300x200?text=Wardrobe',
      category: 'home',
      categoryId: 'home',
      subcategoryId: undefined,
      city: cities[6],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      views: 198,
      isFeatured: false,
      seller: {
        name: 'Гульнара',
        phone: '+7 (777) 890-12-34',
        rating: 4.5
      },
    },
    {
      id: 'listing-19',
      title: {
        ru: 'Тренажер эллиптический',
        kz: 'Эллиптикалық тренажер',
      },
      description: {
        ru: 'Продаю эллиптический тренажер Torneo Aero. Компактный, бесшумный. Магнитная система нагрузки, электронный дисплей, пульсометр.',
        kz: 'Torneo Aero эллиптикалық тренажерін сатамын. Ықшам, тыныш. Магниттік жүктеме жүйесі, электрондық дисплей, пульсометр.',
      },
      originalPrice: 90000,
      discountPrice: 65000,
      discount: 28,
      imageUrl: 'https://via.placeholder.com/300x200?text=Elliptical',
      category: 'hobby',
      categoryId: 'hobby',
      subcategoryId: undefined,
      city: cities[7],
      createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      views: 176,
      isFeatured: false,
      seller: {
        name: 'Виталий',
        phone: '+7 (777) 901-23-45',
        rating: 4.7
      },
    },
  ];
};
