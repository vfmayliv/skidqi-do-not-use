
// Функция для транслитерации с русского/казахского на латиницу
export function transliterate(text: string): string {
  const ruMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };

  return text
    .split('')
    .map(char => ruMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove duplicate hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Создание SEO-friendly URL для объявления БЕЗ ID
export function createListingUrl(categorySlug: string, title: string): string {
  const titleSlug = transliterate(title);
  return `/category/${categorySlug}/${titleSlug}`;
}

// Функция для поиска объявления по slug в мок данных
export function findListingBySlug(listings: any[], categorySlug: string, titleSlug: string): any | null {
  return listings.find(listing => {
    if (listing.categoryId !== categorySlug) return false;
    
    const listingTitleSlug = transliterate(
      typeof listing.title === 'string' ? listing.title : listing.title?.ru || listing.title?.kz || ''
    );
    
    return listingTitleSlug === titleSlug;
  });
}

// Парсинг URL объявления 
export function parseListingUrl(url: string): { categorySlug: string; titleSlug: string } | null {
  const match = url.match(/\/category\/([^\/]+)\/(.+)$/);
  if (!match) return null;
  
  return {
    categorySlug: match[1],
    titleSlug: match[2]
  };
}
