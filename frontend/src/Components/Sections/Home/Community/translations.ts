interface CommunityTranslations {
  title: string;
  subtitle: string;
  viewAll: string;
  tags: Record<string, string>;
  speaker: string;
  viewDetails: string;
  home: string;
  events: string;
  eventsCalendar: string;
  eventsSubtitle: string;
  location: string;
  priceRange: string;
  format: string;
  upcomingThisMonth: string;
  all: string;
}

export const translations: Record<string, CommunityTranslations> = {
  en: {
    title: "Business Community & Gatherings",
    subtitle: "EVENTS",
    viewAll: "VIEW ALL",
    tags: {
      on_site: "On site",
      recommended: "Recommended",
      top_speakers: "Top Speakers",
      free: "Free",
      online: "Online",
      business: "Business",
      ai: "AI",
      entertainment: "Entertainment"
    },
    speaker: "speaker",
    viewDetails: "View Details",
    home: "Home",
    events: "Events",
    eventsCalendar: "Events Calendar",
    eventsSubtitle: "Discover events that help you grow, learn, and find new opportunities",
    location: "Location",
    priceRange: "Price range",
    format: "Format",
    upcomingThisMonth: "Upcoming this month",
    all: "All"
  },
  bg: {
    title: "Бизнес общност и събития",
    subtitle: "СЪБИТИЯ",
    viewAll: "ВИЖТЕ ВСИЧКИ",
    tags: {
      on_site: "На място",
      recommended: "Препоръчани",
      top_speakers: "Топ Лектори",
      free: "Безплатни",
      online: "Онлайн",
      business: "Бизнес",
      ai: "Изкуствен интелект",
      entertainment: "Развлечение"
    },
    speaker: "лектор",
    viewDetails: "Вижте детайли",
    home: "Начало",
    events: "Събития",
    eventsCalendar: "Календар на събитията",
    eventsSubtitle: "Открийте събития, които ви помагат да растете, да се учите и да намирате нови възможности",
    location: "Локация",
    priceRange: "Ценови диапазон",
    format: "Формат",
    upcomingThisMonth: "Предстоящо този месец",
    all: "Всички"
  },
};
