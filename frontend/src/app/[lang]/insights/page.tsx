import React from 'react';
import { getInsightsPageData } from '../../../api/index.ts';
import { InsightsPage } from '../../../Components/Sections/Insights/InsightsPage.tsx';

export default async function InsightsRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const data = await getInsightsPageData(lang);

  return (
    <InsightsPage
      insights={data.insights}
      relatedEvents={data.relatedEvents}
      lang={lang}
    />
  );
}
