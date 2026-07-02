import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById, getProjectsPageData } from '../../../../api/index.ts';
import { ProjectDetailsPage } from '../../../../Components/Sections/Projects/ProjectDetailsPage/ProjectDetailsPage.tsx';

interface ProjectRouteProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function ProjectRoute({ params }: ProjectRouteProps) {
  const { lang, id } = await params;
  const [project, projectsData] = await Promise.all([
    getProjectById(id, lang),
    getProjectsPageData(lang),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailsPage
      project={project}
      relatedProjects={projectsData.projects.filter((item) => item.id !== project.id)}
      lang={lang}
    />
  );
}
