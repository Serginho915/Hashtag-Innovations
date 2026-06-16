import React from 'react';
import { Breadcrumbs } from '../../../Components/UI/Breadcrumbs/Breadcrumbs.tsx';
import { EventsCatalog } from '../../../Components/Sections/Events/EventsCatalog/EventsCatalog.tsx';
import { translations } from '../../../Components/Sections/Home/Community/translations.ts';
import { MOCK_EVENTS } from '../../../mockData/communityMock.ts';

export default function EventsPage({ params: { lang } }: { params: { lang: string } }) {
  const t = translations[lang] || translations.bg;
  
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
