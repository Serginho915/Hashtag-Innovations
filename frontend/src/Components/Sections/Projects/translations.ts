export const translations = {
  en: {
    breadcrumb: 'Projects',
    title: 'Our Projects',
    subtitle: 'Explore sponsored initiatives and social campaigns designed to grow the industry and support meaningful change.',
    showAll: 'show all',
  },
  bg: {
    breadcrumb: 'Проекти',
    title: 'Нашите проекти',
    subtitle: 'Тук са представени спонсорирани инициативи и социални кампании, насочени към развитие на индустрията и подкрепа на значими промени.',
    showAll: 'покажи всички',
  },
};

export const getProjectsTranslations = (lang: string) => {
  return translations[lang as keyof typeof translations] || translations.en;
};
