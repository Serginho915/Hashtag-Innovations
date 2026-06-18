import React from 'react';
import { getProjectsPageData } from '../../../api/index.ts';
import { ProjectsPage } from '../../../Components/Sections/Projects/ProjectsPage.tsx';

export default async function ProjectsRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const data = await getProjectsPageData(lang);

  return (
    <main>
      <ProjectsPage lang={lang} projects={data.projects} />
    </main>
  );
}
