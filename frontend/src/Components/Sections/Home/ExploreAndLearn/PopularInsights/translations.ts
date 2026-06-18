interface PopularInsightsTranslations {
  sectionTitle: string;
  browseTopics: string;
  categories: Record<string, string>;
  newsletterTitle: string;
  newsletterDesc: string;
  enterEmail: string;
  subscribed: string;
  emailRequired: string;
  emailInvalid: string;
  read: string;
  by: string;
}

export const translations: Record<string, PopularInsightsTranslations> = {
  en: {
    sectionTitle: "POPULAR INSIGHTS",
    browseTopics: "Browse Topics",
    categories: {
      "All": "All",
      "Business": "Business",
      "AI": "AI",
      "Entertainment": "Entertainment",
      "Strategy": "Strategy"
    },
    newsletterTitle: "Stay Ahead",
    newsletterDesc: "Get curated business content, event updates, and expert insights delivered every Monday.",
    enterEmail: "Enter your email",
    subscribed: "Subscribed successfully!",
    emailRequired: "Email is required.",
    emailInvalid: "Please enter a valid email address.",
    read: "Read",
    by: "by"
  },
  bg: {
    sectionTitle: "ПОПУЛЯРНИ ИНСАЙТИ",
    browseTopics: "Разгледай Теми",
    categories: {
      "All": "Всички",
      "Business": "Бизнес",
      "AI": "AI",
      "Entertainment": "Развлечения",
      "Strategy": "Стратегия"
    },
    newsletterTitle: "Бъдете Информирани",
    newsletterDesc: "Получавайте подбрано бизнес съдържание, актуализации за събития и експертни анализи всеки понеделник.",
    enterEmail: "Въведете вашия имейл",
    subscribed: "Успешно абониране!",
    emailRequired: "Имейлът е задължителен.",
    emailInvalid: "Моля, въведете валиден имейл адрес.",
    read: "Прочети",
    by: "от"
  }
};
