import React from 'react';
import Image from 'next/image';
import { Breadcrumbs } from '../../UI/Breadcrumbs/Breadcrumbs.tsx';
import type { ProjectItem } from '../../../Types/project.ts';
import { ProjectCard } from './ProjectCard/ProjectCard.tsx';
import { getProjectsTranslations } from './translations.ts';
import styles from './ProjectsPage.module.scss';

interface ProjectsPageProps {
  projects: ProjectItem[];
  lang: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, lang }) => {
  const t = getProjectsTranslations(lang);

  return (
    <section className={styles.projectsPage}>
      <header className={styles.header}>
        <Breadcrumbs
          lang={lang}
          items={[
            { labelKey: 'home', href: `/${lang}` },
            { labelKey: 'projects' },
          ]}
        />
        <div className={styles.hero}>
          <div className={styles.titleLine}>
            <h1>{t.title}</h1>
            <Image
              src="/ProjectImg.png"
              alt=""
              width={76}
              height={68}
              className={styles.titleMark}
              aria-hidden="true"
            />
          </div>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <div className={styles.projectsGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} showAllText={t.showAll} />
        ))}
      </div>
    </section>
  );
};
