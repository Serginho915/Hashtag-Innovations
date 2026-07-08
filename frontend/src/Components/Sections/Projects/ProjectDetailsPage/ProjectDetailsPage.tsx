import React from 'react';
import Image from 'next/image';
import { Breadcrumbs } from '../../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { ArticleTeaserCard } from '../../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import type { ProjectItem } from '../../../../Types/project.ts';
import { getProjectsTranslations } from '../translations.ts';
import styles from '../../Insights/InsightDetailsPage/InsightDetailsPage.module.scss';

interface ProjectDetailsPageProps {
  project: ProjectItem;
  relatedProjects: ProjectItem[];
  lang: string;
}

const formatDate = (project: ProjectItem, lang: string) => {
  const dateValue = project.dateIso || project.date;
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return project.date;
  }

  return new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
};

const getProjectParagraphs = (description: string) => {
  const paragraphs = description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.length ? paragraphs : [description];
};

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ project, relatedProjects, lang }) => {
  const t = getProjectsTranslations(lang);
  const publishDate = formatDate(project, lang);
  const shareHref = `/${lang}/projects/${project.id}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const absoluteShareUrl = new URL(shareHref, siteUrl).toString();
  const shareTitle = encodeURIComponent(project.title);
  const shareUrl = encodeURIComponent(absoluteShareUrl);
  const shareText = encodeURIComponent(`${project.title} ${absoluteShareUrl}`);
  const newsletterId = `project-newsletter-${project.id}`;
  const metaItems = [
    ...(project.hashtags?.length ? project.hashtags : []),
    project.code && `${t.projectCode}: ${project.code}`,
    project.organization && `${t.organization}: ${project.organization}`,
    project.category,
  ].filter(Boolean) as string[];
  const bodySections = project.bodySections?.length
    ? project.bodySections
    : [{ title: t.overview, paragraphs: getProjectParagraphs(project.description) }];
  const shareLinks = [
    { label: 'X', text: 'X', href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}` },
    { label: 'Facebook', text: 'f', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { label: 'Telegram', text: 'T', href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}` },
    { label: 'WhatsApp', text: 'W', href: `https://wa.me/?text=${shareText}` },
  ];

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Breadcrumbs
          lang={lang}
          items={[
            { labelKey: 'home', href: `/${lang}` },
            { labelKey: t.breadcrumb, href: `/${lang}/projects` },
            { labelKey: project.title },
          ]}
        />
        <div className={styles.titleLine}>
          <h1>{project.title}</h1>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
          />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.byline}>
            <div className={styles.authorGroup}>
              <span>{project.organization || t.breadcrumb}</span>
            </div>
            <time dateTime={project.dateIso || project.date}>{publishDate}</time>
          </div>
          <p className={styles.lead}>{project.description}</p>
        </div>
      </section>

      <div className={styles.tagsBlock}>
        {!!metaItems.length && (
          <ul className={styles.primaryMeta}>
            {metaItems.map((item, index) => (
              <li key={item}>
                <span>{item}</span>
                {index < metaItems.length - 1 && <span className={styles.dot} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
        {!!project.tags?.length && (
          <ul className={styles.tagsList}>
            {project.tags.map((tag, index) => (
              <li key={tag}>
                <span>{tag}</span>
                {index < (project.tags?.length || 0) - 1 && <span className={styles.dot} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className={styles.articleGrid}>
        <div className={styles.body}>
          {bodySections.map((section, index) => (
            <section key={`${section.title || 'section'}-${index}`} className={styles.bodySection}>
              {section.html ? (
                <div dangerouslySetInnerHTML={{ __html: section.html }} />
              ) : (
                <>
                  {section.title && <h2>{section.title}</h2>}
                  {(section.paragraphs || []).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </>
              )}
            </section>
          ))}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.shareBlock}>
            <h2>{t.share}</h2>
            <div className={styles.socialLinks}>
              {shareLinks.map((link) => (
                <a key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noreferrer">
                  <span aria-hidden="true">{link.text}</span>
                </a>
              ))}
            </div>
          </div>

          {!!relatedProjects.length && (
            <section className={styles.relatedArticles}>
              <h2>{t.relatedProjects}</h2>
              <ul className={styles.relatedList}>
                {relatedProjects.slice(0, 3).map((relatedProject) => (
                  <ArticleTeaserCard
                    key={relatedProject.id}
                    as="li"
                    className={styles.relatedCard}
                    title={relatedProject.title}
                    excerpt={relatedProject.description}
                    authorLabel={relatedProject.code || t.breadcrumb}
                    readText={t.read}
                    readHref={`/${lang}/projects/${relatedProject.id}`}
                  />
                ))}
              </ul>
            </section>
          )}

          <form className={styles.newsletter}>
            <div className={styles.newsletterHeader}>
              <div className={styles.newsletterBrand}>
                <span>#</span>
                <h2>{t.newsletterTitle}</h2>
              </div>
              <p>{t.newsletterText}</p>
            </div>
            <label className={styles.newsletterField} htmlFor={newsletterId}>
              <span className={styles.visuallyHidden}>{t.emailPlaceholder}</span>
              <input id={newsletterId} type="email" placeholder={t.emailPlaceholder} />
              <button type="submit">{t.subscribe}<span aria-hidden="true" /></button>
            </label>
          </form>
        </aside>
      </section>
    </article>
  );
};
