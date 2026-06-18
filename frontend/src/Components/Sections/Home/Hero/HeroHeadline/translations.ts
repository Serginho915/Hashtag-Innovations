interface HeroHeadlineTranslations {
  headline: string;
  tabs: string[];
}

export const translations: Record<string, HeroHeadlineTranslations> = {
  en: {
    headline: "Headline exmpl. Learn, Connect, Grow",
    tabs: ["Find Experts", "Events", "Learn", "Projects", "Insights"],
  },
  bg: {
    headline: "Пример за заглавие. Учете, Свързвайте се, Растете",
    tabs: ["Намери Експерти", "Събития", "Научи", "Проекти", "Инсайти"],
  },
};
