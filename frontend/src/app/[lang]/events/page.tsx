import React from 'react';
import { Breadcrumbs } from '../../../Components/UI/Breadcrumbs/Breadcrumbs.tsx';
import { EventsCatalog } from '../../../Components/Sections/Events/EventsCatalog/EventsCatalog.tsx';
import { MOCK_EVENTS } from '../../../mockData/communityMock.ts';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  const breadcrumbsItems = [
    { labelKey: 'home', href: `/${lang}` },
    { labelKey: 'events', href: `/${lang}/events` }
  ];

  return (
    <main>
      <Breadcrumbs items={breadcrumbsItems} lang={lang} />
      <EventsCatalog events={MOCK_EVENTS} lang={lang} />
    </main>
  );
}
