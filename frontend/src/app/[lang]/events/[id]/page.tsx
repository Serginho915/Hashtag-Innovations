import React from 'react';
import { notFound } from 'next/navigation';
import { getEventById, getHomePageData } from '../../../../api/index.ts';
import { EventDetails } from '../../../../Components/Sections/Events/EventDetails/EventDetails.tsx';

export default async function EventPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const homeData = await getHomePageData(lang);
  const relatedEvents = homeData.communityEvents
    .filter((item) => item.id !== id)
    .slice(0, 2);
  const relatedArticles = homeData.popularInsights.slice(0, 6);

  return (
    <EventDetails
      event={event}
      relatedEvents={relatedEvents}
      relatedArticles={relatedArticles}
      lang={lang}
    />
  );
}
