import { cache } from 'react';
import { Expert } from '../Types/expert.ts';
import { NewsItem } from '../Types/news.ts';
import { UpcomingEventData } from '../Types/event.ts';
import { TextbookItem } from '../Types/textbook.ts';
import { CommunityEvent } from '../Types/community.ts';
import { ProjectItem } from '../Types/project.ts';

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

interface SiteData extends HomePageData, InsightsPageData, LearnPageData, ProjectsPageData {}

const getBackendApiUrl = () =>
  (process.env.BACKEND_INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:8000').replace(/\/$/, '');

const getEmptySiteData = (): SiteData => {
  return {
    experts: [],
    news: [],
    upcomingEvents: [],
    communityEvents: [],
    textbooks: [],
    popularInsights: [],
    insights: [],
    relatedEvents: [],
    projects: [],
  };
};

const getSiteData = cache(async (lang: string): Promise<SiteData> => {
  try {
    const response = await fetch(`${getBackendApiUrl()}/api/site-data/?lang=${lang}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return (await response.json()) as SiteData;
  } catch (error) {
    console.error('Failed to fetch backend site data.', error);
    return getEmptySiteData();
  }
});

export const getHomePageData = cache(async (lang: string): Promise<HomePageData> => {
  const data = await getSiteData(lang);

  return {
    experts: data.experts,
    news: data.news,
    upcomingEvents: data.upcomingEvents,
    communityEvents: data.communityEvents,
    textbooks: data.textbooks,
    popularInsights: data.popularInsights,
  };
});

export const getExpertById = cache(async (id: string, lang: string): Promise<Expert | undefined> => {
  const data = await getSiteData(lang);

  return data.experts.find((expert) => expert.id === id);
});

export const getEventById = cache(async (id: string, lang: string): Promise<CommunityEvent | undefined> => {
  const data = await getSiteData(lang);

  return data.communityEvents.find((event) => event.id === id);
});

export const getInsightsPageData = cache(async (lang: string): Promise<InsightsPageData> => {
  const data = await getSiteData(lang);

  return {
    insights: data.insights,
    relatedEvents: data.relatedEvents,
  };
});

export const getLearnPageData = cache(async (lang: string): Promise<LearnPageData> => {
  const data = await getSiteData(lang);

  return {
    textbooks: data.textbooks,
    popularInsights: data.popularInsights,
    experts: data.experts,
  };
});

export const getProjectsPageData = cache(async (lang: string): Promise<ProjectsPageData> => {
  const data = await getSiteData(lang);

  return {
    projects: data.projects,
  };
});

export const getProjectById = cache(async (id: string, lang: string): Promise<ProjectItem | undefined> => {
  const data = await getSiteData(lang);
  const normalizedId = id
    .replace(/-en-/g, "-")
    .replace(/-bg-/g, "-")
    .replace(/-en$/g, "")
    .replace(/-bg$/g, "");

  return data.projects.find((project) => project.id === id || project.id === normalizedId);
});

export const getInsightById = cache(async (id: string, lang: string): Promise<NewsItem | undefined> => {
  const data = await getSiteData(lang);

  const localizedId = id
    .replace(/-en-/g, `-${lang}-`)
    .replace(/-bg-/g, `-${lang}-`)
    .replace(/-en$/g, `-${lang}`)
    .replace(/-bg$/g, `-${lang}`);

  return data.insights.find((insight) => insight.id === id || insight.id === localizedId);
});
