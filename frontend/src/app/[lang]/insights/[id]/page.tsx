import React from 'react';
import { notFound } from 'next/navigation';
import { getInsightById, getInsightsPageData } from '../../../../api/index.ts';
import { InsightDetailsPage } from '../../../../Components/Sections/Insights/InsightDetailsPage/InsightDetailsPage.tsx';

interface InsightRouteProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function InsightRoute({ params }: InsightRouteProps) {
  const { lang, id } = await params;
  const [insight, insightsData] = await Promise.all([
    getInsightById(id, lang),
    getInsightsPageData(lang),
  ]);

  if (!insight) {
    notFound();
  }

  return (
    <InsightDetailsPage
      insight={insight}
      relatedInsights={insightsData.insights.filter((item) => item.id !== insight.id)}
      lang={lang}
    />
  );
}
