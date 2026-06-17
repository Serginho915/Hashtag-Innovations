export interface LearnTranslations {
  title: string;
  subtitle: string;
  search: string;
  topic: string;
  format: string;
  all: string;
  get: string;
  preview: string;
  trending: string;
  showMore: string;
  readAlso: string;
  viewAll: string;
  topAuthors: string;
  newsletterTitle: string;
  newsletterText: string;
  emailPlaceholder: string;
  subscribe: string;
  read: string;
}

export const translations: Record<string, LearnTranslations> = {
  en: {
    title: 'Learning Materials',
    subtitle: 'Explore expert-built reports, business models, papers, guides, and practical learning materials created for ambitious professionals.',
    search: 'Search',
    topic: 'Topic',
    format: 'Format',
    all: 'All',
    get: 'Get',
    preview: 'Preview',
    trending: 'Trending',
    showMore: 'show more',
    readAlso: 'Read Also',
    viewAll: 'VIEW ALL',
    topAuthors: 'Top Authors',
    newsletterTitle: 'Stay Ahead',
    newsletterText: 'Get curated learning materials, event updates, and expert insights delivered every Monday.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    read: 'Read',
  },
  bg: {
    title: 'Учебни материали',
    subtitle: 'Разгледайте експертни доклади, бизнес модели, научни статии, ръководства и практически обучителни материали за амбициозни професионалисти.',
    search: 'Търсене',
    topic: 'Тема',
    format: 'Формат',
    all: 'Всички',
    get: 'Вземи',
    preview: 'Преглед',
    trending: 'Набира популярност',
    showMore: 'покажи повече',
    readAlso: 'Прочетете още',
    viewAll: 'Виж всички',
    topAuthors: 'Топ автори',
    newsletterTitle: 'Бъдете напред',
    newsletterText: 'Получавайте подбрани учебни материали, събития и експертни мнения всяка седмица.',
    emailPlaceholder: 'Въведете вашия email',
    subscribe: 'Абонирай се',
    read: 'Прочети',
  },
};

export const getLearnTranslations = (lang: string) => translations[lang] || translations.en;
