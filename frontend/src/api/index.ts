import { cache } from 'react';
import { Expert } from '../Types/expert.ts';
import { NewsItem } from '../Types/news.ts';
import { UpcomingEventData } from '../Types/event.ts';
import { TextbookItem } from '../Types/textbook.ts';
import { CommunityEvent } from '../Types/community.ts';

import { MOCK_EXPERTS_EN, MOCK_EXPERTS_BG } from '../mockData/expertsMock.ts';
import { MOCK_NEWS_EN, MOCK_NEWS_BG } from '../mockData/newsMock.ts';
import { MOCK_UPCOMING_EVENTS_EN, MOCK_UPCOMING_EVENTS_BG } from '../mockData/upcomingEventMock.ts';
import { MOCK_EVENTS } from '../mockData/communityMock.ts';
import { MOCK_TEXTBOOKS_EN, MOCK_TEXTBOOKS_BG } from '../mockData/exploreAndLearnMock.ts';

export interface HomePageData {
  experts: Expert[];
  news: NewsItem[];
  upcomingEvents: UpcomingEventData[];
  communityEvents: CommunityEvent[];
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
}

export interface InsightsPageData {
  insights: NewsItem[];
  relatedEvents: CommunityEvent[];
}

const insightImages = [
  '/images/community/ai_event.png',
  '/images/community/summit_event.png',
  '/images/community/tech_event.png',
  '/images/community/finance_event.png',
  '/images/community/summit.png',
  '/images/platform/slide_skills.png',
];

const normalizeInsights = (items: unknown[], lang: string): NewsItem[] => items.map((item, index) => {
  const source = item as Record<string, unknown>;
  const rawTags = Array.isArray(source.tags) ? source.tags : [];
  const rawBodySections = Array.isArray(source.bodySections) ? source.bodySections : [];
  const bodySections = rawBodySections
    .map((section) => {
      const sectionSource = section as Record<string, unknown>;
      const paragraphs = Array.isArray(sectionSource.paragraphs) ? sectionSource.paragraphs.map(String) : [];

      return {
        title: sectionSource.title ? String(sectionSource.title) : undefined,
        paragraphs,
      };
    })
    .filter((section) => section.paragraphs.length > 0);
  const fallbackExcerpt = String(source.excerpt ?? '');

  return {
    id: String(source.id ?? `insight-${index + 1}`),
    category: String(source.category ?? rawTags[0] ?? 'Business'),
    title: String(source.title ?? ''),
    date: String(source.date ?? source.createdAt ?? '2026-06-17T10:00:00Z'),
    displayDate: source.displayDate ? String(source.displayDate) : undefined,
    timeToRead: String(source.timeToRead ?? source.readTime ?? (lang === 'bg' ? '5 мин четене' : '5 min read')),
    readTime: String(source.readTime ?? source.timeToRead ?? (lang === 'bg' ? '5 мин четене' : '5 min read')),
    imageUrl: String(source.imageUrl ?? insightImages[index % insightImages.length]),
    excerpt: fallbackExcerpt,
    lead: String(source.lead ?? fallbackExcerpt),
    bodySections: bodySections.length
      ? bodySections
      : [{ paragraphs: [fallbackExcerpt] }],
    promotedLabel: source.promotedLabel ? String(source.promotedLabel) : undefined,
    authorName: String(source.authorName ?? 'Andrew Nikolov'),
    authorLabel: String(source.authorLabel ?? (lang === 'bg' ? 'от' : 'by')),
    authorId: source.authorId ? String(source.authorId) : undefined,
    authorExpertId: source.authorExpertId ? String(source.authorExpertId) : undefined,
    authorAvatarUrl: source.authorAvatarUrl ? String(source.authorAvatarUrl) : undefined,
    tags: rawTags.map(String),
  };
});

export const getHomePageData = cache(async (lang: string): Promise<HomePageData> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';

  return {
    experts: isBg ? MOCK_EXPERTS_BG as Expert[] : MOCK_EXPERTS_EN as Expert[],
    news: normalizeInsights(isBg ? MOCK_NEWS_BG : MOCK_NEWS_EN, lang),
    upcomingEvents: isBg ? MOCK_UPCOMING_EVENTS_BG as UpcomingEventData[] : MOCK_UPCOMING_EVENTS_EN as UpcomingEventData[],
    communityEvents: MOCK_EVENTS as CommunityEvent[],
    textbooks: isBg ? MOCK_TEXTBOOKS_BG as TextbookItem[] : MOCK_TEXTBOOKS_EN as TextbookItem[],
    popularInsights: normalizeInsights(isBg ? MOCK_NEWS_BG : MOCK_NEWS_EN, lang)
  };
});

export const getExpertById = cache(async (id: string, lang: string): Promise<Expert | undefined> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  const isBg = lang === 'bg';
  const experts = isBg ? MOCK_EXPERTS_BG : MOCK_EXPERTS_EN;
  
  return experts.find(expert => expert.id === id) as Expert | undefined;
});

export const getEventById = cache(async (id: string): Promise<CommunityEvent | undefined> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  return MOCK_EVENTS.find(event => event.id === id) as CommunityEvent | undefined;
});

export const getInsightsPageData = cache(async (lang: string): Promise<InsightsPageData> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';
  const insights = normalizeInsights(isBg ? MOCK_NEWS_BG : MOCK_NEWS_EN, lang);

  return {
    insights,
    relatedEvents: MOCK_EVENTS,
  };
});

export const getInsightById = cache(async (id: string, lang: string): Promise<NewsItem | undefined> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';
  const insights = normalizeInsights(isBg ? MOCK_NEWS_BG : MOCK_NEWS_EN, lang);

  return insights.find((insight) => insight.id === id);
});
