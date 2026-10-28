interface UpcomingEventTranslations {
  eventLabel: string;
  speakerLabel: string;
  discoverMore: string;
  emptyTitle: string;
  emptyDescription: string;
}

export const translations: Record<string, UpcomingEventTranslations> = {
  en: {
    eventLabel: "Upcoming event",
    speakerLabel: "speaker:",
    discoverMore: "Discover more",
    emptyTitle: "More events are coming soon",
    emptyDescription: "New dates and event details will appear here.",
  },
  bg: {
    eventLabel: "Предстоящо събитие",
    speakerLabel: "лектор:",
    discoverMore: "Научете повече",
    emptyTitle: "Очаквайте нови събития",
    emptyDescription: "Новите дати и подробности за събитията ще се появят тук.",
  },
};
