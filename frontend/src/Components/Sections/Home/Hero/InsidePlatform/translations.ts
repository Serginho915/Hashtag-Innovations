interface InsidePlatformTranslations {
  sectionLabel: string;
  desc1: string;
  descBold: string;
  desc2: string;
  trusted: string;
  slideAlt: string;
  slides: Array<{ title: string }>;
}

export const translations: Record<string, InsidePlatformTranslations> = {
  en: {
    sectionLabel: "Inside the platform",
    desc1: "Hashtag Innovations is a modern platform designed for ",
    descBold: "business leaders, entrepreneurs, founders, and ambitious professionals",
    desc2: " seeking expert knowledge, strategic insights, and meaningful industry connections.",
    trusted: "Trusted by 3,000+ ambitious professionals in Bulgaria",
    slideAlt: "Feature slide",
    slides: [
      { title: "Explore upcoming business events." },
      { title: "Connect with industry leaders." },
      { title: "Learn new skills and frameworks." },
      { title: "Discover new job opportunities." },
    ],
  },
  bg: {
    sectionLabel: "Вътре в платформата",
    desc1: "Hashtag Innovations е модерна платформа, предназначена за ",
    descBold: "бизнес лидери, предприемачи, основатели и амбициозни професионалисти",
    desc2: " търсещи експертни знания, стратегически прозрения и значими връзки в индустрията.",
    trusted: "Доверена от 3,000+ амбициозни професионалисти в България",
    slideAlt: "Слайд с функции",
    slides: [
      { title: "Разгледайте предстоящите бизнес събития." },
      { title: "Свържете се с лидери в индустрията." },
      { title: "Научете нови умения и фреймуърци." },
      { title: "Открийте нови възможности за работа." },
    ],
  },
};
