import { cache } from 'react';
import { Expert } from '../Types/expert.ts';
import { NewsItem } from '../Types/news.ts';
import { UpcomingEventData } from '../Types/event.ts';
import { TextbookItem } from '../Types/textbook.ts';
import { CommunityEvent } from '../Types/community.ts';
import { ProjectItem } from '../Types/project.ts';

import { MOCK_EXPERTS_EN, MOCK_EXPERTS_BG } from '../mockData/expertsMock.ts';
import { MOCK_NEWS_EN, MOCK_NEWS_BG } from '../mockData/newsMock.ts';
import { MOCK_UPCOMING_EVENTS_EN, MOCK_UPCOMING_EVENTS_BG } from '../mockData/upcomingEventMock.ts';
import { MOCK_EVENTS } from '../mockData/communityMock.ts';
import { MOCK_TEXTBOOKS_EN, MOCK_TEXTBOOKS_BG } from '../mockData/exploreAndLearnMock.ts';
import { MOCK_PROJECTS_EN, MOCK_PROJECTS_BG } from '../mockData/projectsMock.ts';

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

export interface LearnPageData {
  textbooks: TextbookItem[];
  popularInsights: NewsItem[];
  experts: Expert[];
}

export interface ProjectsPageData {
  projects: ProjectItem[];
}

const insightImages = [
  '/images/community/ai_event.png',
  '/images/community/summit_event.png',
  '/images/community/tech_event.png',
  '/images/community/finance_event.png',
  '/images/community/summit.png',
  '/images/platform/slide_skills.png',
];

const toHashtag = (value: string) => {
  const normalized = value.trim();

  if (!normalized) {
    return '';
  }

  return normalized.startsWith('#') ? normalized : `#${normalized.replace(/\s+/g, '')}`;
};

const normalizeAuthorName = (value?: string) => value?.trim().toLowerCase().replace(/\s+/g, ' ');

const normalizeInsights = (items: unknown[], lang: string): NewsItem[] => items.map((item, index) => {
  const source = item as Record<string, unknown>;
  const expertsForLang = lang === 'bg' ? MOCK_EXPERTS_BG : MOCK_EXPERTS_EN;
  const allExperts = [...MOCK_EXPERTS_EN, ...MOCK_EXPERTS_BG];
  const rawAuthorName = source.authorName ? String(source.authorName) : undefined;
  const rawAuthorExpertId = source.authorExpertId ? String(source.authorExpertId) : undefined;
  const rawAuthorAvatarUrl = source.authorAvatarUrl ? String(source.authorAvatarUrl) : undefined;
  const authorById = rawAuthorExpertId
    ? expertsForLang.find((expert) => expert.id === rawAuthorExpertId) ?? allExperts.find((expert) => expert.id === rawAuthorExpertId)
    : undefined;
  const normalizedRawAuthorName = normalizeAuthorName(rawAuthorName);
  const authorByName = normalizedRawAuthorName
    ? expertsForLang.find((expert) => normalizeAuthorName(expert.name) === normalizedRawAuthorName)
      ?? allExperts.find((expert) => normalizeAuthorName(expert.name) === normalizedRawAuthorName)
    : undefined;
  const author = authorById ?? authorByName;
  const rawTags = Array.isArray(source.tags) ? source.tags : [];
  const rawHashtags = Array.isArray(source.hashtags) ? source.hashtags : [];
  const rawBodySections = Array.isArray(source.bodySections) ? source.bodySections : [];
  const tags = rawTags.map(String);
  const category = String(source.category ?? tags[0] ?? 'Business');
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
  const hashtagSource = rawHashtags.length
    ? rawHashtags.map(String)
    : source.promotedLabel
      ? [String(source.promotedLabel), ...tags]
      : tags.length
        ? tags
        : [category];
  const hashtags = Array.from(new Set(hashtagSource.map(toHashtag).filter(Boolean)));

  return {
    id: String(source.id ?? `insight-${index + 1}`),
    category,
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
    hashtags,
    authorName: rawAuthorName ?? author?.name,
    authorLabel: String(source.authorLabel ?? (lang === 'bg' ? 'от' : 'by')),
    authorId: source.authorId ? String(source.authorId) : undefined,
    authorExpertId: rawAuthorExpertId ?? author?.id,
    authorAvatarUrl: rawAuthorAvatarUrl ?? author?.imageUrl,
    tags,
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

export const getLearnPageData = cache(async (lang: string): Promise<LearnPageData> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';

  return {
    textbooks: isBg ? MOCK_TEXTBOOKS_BG as TextbookItem[] : MOCK_TEXTBOOKS_EN as TextbookItem[],
    popularInsights: normalizeInsights(isBg ? MOCK_NEWS_BG : MOCK_NEWS_EN, lang),
    experts: isBg ? MOCK_EXPERTS_BG as Expert[] : MOCK_EXPERTS_EN as Expert[],
  };
});

export const getProjectsPageData = cache(async (lang: string): Promise<ProjectsPageData> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';

  return {
    projects: isBg ? MOCK_PROJECTS_BG : MOCK_PROJECTS_EN,
  };
});

export const getInsightById = cache(async (id: string, lang: string): Promise<NewsItem | undefined> => {
  // Simulate network delay to mimic real API
  await new Promise((resolve) => setTimeout(resolve, 50));

  const isBg = lang === 'bg';
  const insights = normalizeInsights(isBg ? MOCK_NEWS_BG : MOCK_NEWS_EN, lang);

  return insights.find((insight) => insight.id === id);
});
