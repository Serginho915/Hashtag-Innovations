export const translations = {
  en: {
    breadcrumb: 'Projects',
    title: 'Our Projects',
    subtitle: 'Explore sponsored initiatives and social campaigns designed to grow the industry and support meaningful change.',
    showAll: 'show all',
    share: 'Share',
    overview: 'Project Overview',
    projectCode: 'Project code',
    organization: 'Organization',
    relatedProjects: 'Related Projects',
    read: 'Open',
    newsletterTitle: 'Stay Ahead',
    newsletterText: 'Get project updates, event news, and expert insights delivered every Monday.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
  },
  bg: {
    breadcrumb: 'Проекти',
    title: 'Нашите проекти',
    subtitle: 'Тук са представени спонсорирани инициативи и социални кампании, насочени към развитие на индустрията и подкрепа на значими промени.',
    showAll: 'покажи всички',
    share: 'Сподели',
    overview: 'Обзор на проекта',
    projectCode: 'Код на проекта',
    organization: 'Организация',
    relatedProjects: 'Свързани проекти',
    read: 'Отвори',
    newsletterTitle: 'Бъдете напред',
    newsletterText: 'Получавайте актуализации за проекти, събития и експертни мнения всеки понеделник.',
    emailPlaceholder: 'Въведете вашия email',
    subscribe: 'Абонирай се',
  },
};

export const getProjectsTranslations = (lang: string) => {
  return translations[lang as keyof typeof translations] || translations.en;
};
