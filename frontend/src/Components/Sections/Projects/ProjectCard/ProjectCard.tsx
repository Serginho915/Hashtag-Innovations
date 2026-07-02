import React from 'react';
import Image from 'next/image';
import type { ProjectItem } from '../../../../Types/project.ts';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: ProjectItem;
  showAllText: string;
  lang: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, showAllText, lang }) => {
  const projectHref = `/${lang}/projects/${project.id}`;

  return (
    <article className={styles.projectCard} id={project.id}>
      <div className={styles.cardMain}>
        <a href={projectHref} className={styles.imageWrap} aria-label={project.title}>
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className={styles.image}
            sizes="(max-width: 480px) 448px, (max-width: 1199px) 220px, 252px"
          />
        </a>
        <div className={styles.content}>
          <a href={projectHref} className={styles.titleLink}>
            <h2>{project.title}</h2>
          </a>
          <p>{project.description}</p>
          <a href={projectHref} className={styles.showAll}>
            <span>{showAllText}</span>
          </a>
        </div>
      </div>
      <footer className={styles.meta}>
        <span>{project.code}</span>
        <time>{project.date}</time>
      </footer>
    </article>
  );
};
