import React from 'react';
import { getLearnPageData } from '../../../api/index.ts';
import { LearnPage } from '../../../Components/Sections/Learn/LearnPage.tsx';

export default async function LearnRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const data = await getLearnPageData(lang);

  return (
    <main>
      <LearnPage
        lang={lang}
        textbooks={data.textbooks}
        popularInsights={data.popularInsights}
        experts={data.experts}
      />
    </main>
  );
}
