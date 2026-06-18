interface LatestNewsTranslations {
  latestNews: string;
  date: string;
  location: string;
}

export const translations: Record<string, LatestNewsTranslations> = {
  en: {
    latestNews: "Latest News",
    date: "thursday, 14 May",
    location: "sofia, bulgaria",
  },
  bg: {
    latestNews: "Последни новини",
    date: "четвъртък, 14 Май",
    location: "софия, българия",
  },
};
