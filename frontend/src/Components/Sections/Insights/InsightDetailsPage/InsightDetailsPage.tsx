import React from 'react';
import { Breadcrumbs } from '../../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { AuthorLink } from '../../../UI/AuthorLink/AuthorLink.tsx';
import { ArticleTeaserCard } from '../../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import { NewsItem } from '../../../../Types/news.ts';
import styles from './InsightDetailsPage.module.scss';

interface InsightDetailsPageProps {
  insight: NewsItem;
  relatedInsights: NewsItem[];
  lang: string;
}

const translations = {
  en: {
    insights: 'Insights',
    share: 'Share',
    relatedArticles: 'Related Articles',
    newsletterTitle: 'Stay Ahead',
    newsletterText: 'Get curated business content, event updates, and expert insights delivered every Monday.',
    emailPlaceholder: 'Enter your email',
    subscribe: 'Subscribe',
    read: 'Read',
  },
  bg: {
    insights: 'Инсайти',
    share: 'Сподели',
    relatedArticles: 'Свързани статии',
    newsletterTitle: 'Бъдете напред',
    newsletterText: 'Получавайте подбрано бизнес съдържание, актуализации за събития и експертни мнения всеки понеделник.',
    emailPlaceholder: 'Въведете вашия email',
    subscribe: 'Абонирай се',
    read: 'Прочети',
  },
};

const formatDate = (date: string, lang: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
};

const SocialIcon = ({ label }: { label: string }) => (
  <span className={styles.socialIcon} aria-hidden="true">
    {label}
  </span>
);

export const InsightDetailsPage: React.FC<InsightDetailsPageProps> = ({ insight, relatedInsights, lang }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const relatedArticles = relatedInsights.slice(0, 3);
  const publishDate = insight.displayDate || formatDate(insight.date, lang);
  const newsletterId = `insight-newsletter-${insight.id}`;
  const shareHref = `/${lang}/insights/${insight.id}`;
  const shareTitle = encodeURIComponent(insight.title);
  const shareUrl = encodeURIComponent(shareHref);
  const bodySections = insight.bodySections?.length
    ? insight.bodySections
    : [{ paragraphs: [insight.excerpt || ''] }];

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <Breadcrumbs
          lang={lang}
          items={[
            { labelKey: 'home', href: `/${lang}` },
            { labelKey: t.insights, href: `/${lang}/insights` },
            { labelKey: insight.title },
          ]}
        />
        <div className={styles.titleLine}>
          <h1>{insight.title}</h1>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroImageWrap}>
          <img src={insight.imageUrl} alt={insight.title} />
        </div>

        <div className={styles.heroContent}>
          <div className={styles.byline}>
            <div className={styles.authorGroup}>
              <span>{insight.authorLabel || (lang === 'bg' ? 'от' : 'by')}</span>
              {insight.authorAvatarUrl && (
                <img className={styles.authorAvatar} src={insight.authorAvatarUrl} alt="" />
              )}
              <AuthorLink
                name={insight.authorName || 'Andrew Nikolov'}
                expertId={insight.authorExpertId}
                lang={lang}
                className={styles.authorName}
              />
            </div>
            <time dateTime={insight.date}>{publishDate}</time>
          </div>
          <p className={styles.lead}>{insight.lead || insight.excerpt}</p>
        </div>
      </section>

      <div className={styles.tagsBlock}>
        <div className={styles.primaryMeta}>
          {insight.promotedLabel && <span>{insight.promotedLabel}</span>}
          {insight.promotedLabel && <span className={styles.dot} aria-hidden="true" />}
          <span>{insight.timeToRead || insight.readTime}</span>
        </div>
        {!!insight.tags?.length && (
          <ul className={styles.tagsList}>
            {insight.tags.map((tag, index) => (
              <li key={tag}>
                <span>{tag}</span>
                {index < (insight.tags?.length || 0) - 1 && <span className={styles.dot} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
      </div>

      <section className={styles.articleGrid}>
        <div className={styles.body}>
          {bodySections.map((section, index) => (
            <section key={`${section.title || 'section'}-${index}`} className={styles.bodySection}>
              {section.title && <h2>{section.title}</h2>}
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.shareBlock}>
            <h2>{t.share}</h2>
            <div className={styles.socialLinks}>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} aria-label="LinkedIn">
                <SocialIcon label="in" />
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} aria-label="X">
                <SocialIcon label="x" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} aria-label="Facebook">
                <SocialIcon label="f" />
              </a>
              <a href={`mailto:?subject=${shareTitle}&body=${shareUrl}`} aria-label="Email">
                <SocialIcon label="@" />
              </a>
              <a href={shareHref} aria-label="Open article link">
                <SocialIcon label="↗" />
              </a>
            </div>
          </div>

          {!!relatedArticles.length && (
            <section className={styles.relatedArticles}>
              <h2>{t.relatedArticles}</h2>
              <ul className={styles.relatedList}>
                {relatedArticles.map((article) => (
                  <ArticleTeaserCard
                    key={article.id}
                    as="li"
                    className={styles.relatedCard}
                    title={article.title}
                    excerpt={article.excerpt || ''}
                    authorLabel={article.authorLabel || (lang === 'bg' ? 'от' : 'by')}
                    authorHref={article.authorExpertId ? `/${lang}/experts/${article.authorExpertId}` : undefined}
                    authorAvatarUrl={article.authorAvatarUrl}
                    readText={t.read}
                    readHref={`/${lang}/insights/${article.id}`}
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
