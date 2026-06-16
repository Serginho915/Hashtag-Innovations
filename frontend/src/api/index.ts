import { cache } from 'react';
import { Expert } from '../Types/expert';
import { NewsItem } from '../Types/news';
import { UpcomingEventData } from '../Types/event';
import { TextbookItem } from '../Types/textbook';
import { CommunityEvent } from '../Types/community';

import { MOCK_EXPERTS_EN, MOCK_EXPERTS_BG } from '../mockData/expertsMock';
import { MOCK_NEWS_EN, MOCK_NEWS_BG } from '../mockData/newsMock';
import { MOCK_UPCOMING_EVENTS_EN, MOCK_UPCOMING_EVENTS_BG } from '../mockData/upcomingEventMock';
import { MOCK_EVENTS } from '../mockData/communityMock';
import { MOCK_TEXTBOOKS_EN, MOCK_TEXTBOOKS_BG } from '../mockData/exploreAndLearnMock';

export interface HomePageData {
  experts: Expert[];
  news: NewsItem[];
  upcomingEvents: UpcomingEventData[];
  communityEvents: CommunityEvent[];
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
}

export const getHomePageData = cache(async (lang: string): Promise<HomePageData> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';

  return {
    experts: isBg ? MOCK_EXPERTS_BG as Expert[] : MOCK_EXPERTS_EN as Expert[],
    news: isBg ? MOCK_NEWS_BG as any as NewsItem[] : MOCK_NEWS_EN as any as NewsItem[],
    upcomingEvents: isBg ? MOCK_UPCOMING_EVENTS_BG as UpcomingEventData[] : MOCK_UPCOMING_EVENTS_EN as UpcomingEventData[],
    communityEvents: MOCK_EVENTS as CommunityEvent[],
    textbooks: isBg ? MOCK_TEXTBOOKS_BG as TextbookItem[] : MOCK_TEXTBOOKS_EN as TextbookItem[],
    popularInsights: isBg ? MOCK_NEWS_BG as any as NewsItem[] : MOCK_NEWS_EN as any as NewsItem[]
  };
});

export const getExpertById = cache(async (id: string, lang: string): Promise<Expert | undefined> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const isBg = lang === 'bg';
  const experts = isBg ? MOCK_EXPERTS_BG : MOCK_EXPERTS_EN;
  
  return experts.find(expert => expert.id === id) as Expert | undefined;
});
