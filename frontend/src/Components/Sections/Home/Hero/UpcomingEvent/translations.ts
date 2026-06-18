interface UpcomingEventTranslations {
  eventLabel: string;
  speakerLabel: string;
  discoverMore: string;
}

export const translations: Record<string, UpcomingEventTranslations> = {
  en: {
    eventLabel: "Upcoming event",
    speakerLabel: "speaker:",
    discoverMore: "Discover more",
  },
  bg: {
    eventLabel: "Предстоящо събитие",
    speakerLabel: "лектор:",
    discoverMore: "Научете повече",
  },
};
