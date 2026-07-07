import React from 'react';
import { Breadcrumbs } from '../../../Components/UI/Breadcrumbs/Breadcrumbs.tsx';
import { EventsCatalog } from '../../../Components/Sections/Events/EventsCatalog/EventsCatalog.tsx';
import { getHomePageData } from '../../../api/index.ts';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { communityEvents } = await getHomePageData(lang);
  
  const breadcrumbsItems = [
    { labelKey: 'home', href: `/${lang}` },
    { labelKey: 'events', href: `/${lang}/events` }
  ];

  return (
    <main>
      <Breadcrumbs items={breadcrumbsItems} lang={lang} />
      <EventsCatalog events={communityEvents} lang={lang} />
    </main>
  );
}
