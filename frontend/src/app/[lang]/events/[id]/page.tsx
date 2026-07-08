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
  const event = await getEventById(id, lang);

  if (!event) {
    notFound();
  }

  const homeData = await getHomePageData(lang);
  const currentTags = new Set(event.tags || []);
  const otherEvents = homeData.communityEvents.filter((item) => item.id !== id);
  const eventsWithSameTags = otherEvents.filter((item) => item.tags?.some((tag) => currentTags.has(tag)));
  const relatedEvents = (eventsWithSameTags.length ? eventsWithSameTags : otherEvents).slice(0, 2);

  return (
    <EventDetails
      event={event}
      relatedEvents={relatedEvents}
      lang={lang}
    />
  );
}
