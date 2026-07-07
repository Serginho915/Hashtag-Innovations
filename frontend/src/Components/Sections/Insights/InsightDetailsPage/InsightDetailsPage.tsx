import React from 'react';
import { Breadcrumbs } from '../../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { AuthorLink } from '../../../UI/AuthorLink/AuthorLink.tsx';
import { ArticleTeaserCard } from '../../../UI/ArticleTeaserCard/ArticleTeaserCard.tsx';
import { NewsItem } from '../../../../Types/news.ts';
import styles from './InsightDetailsPage.module.scss';
import { translations } from './translations.ts';

interface InsightDetailsPageProps {
  insight: NewsItem;
  relatedInsights: NewsItem[];
  lang: string;
}

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

const socialIcons = {
  threads: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M20.6409 12.9775C20.5202 12.9197 20.3977 12.864 20.2736 12.8107C20.0575 8.82849 17.8815 6.54865 14.2278 6.52531C14.2113 6.52521 14.1948 6.52521 14.1782 6.52521C11.9928 6.52521 10.1753 7.45805 9.05658 9.15552L11.066 10.5339C11.9017 9.266 13.2133 8.9957 14.1792 8.9957C14.1904 8.9957 14.2016 8.9957 14.2126 8.9958C15.4156 9.00347 16.3235 9.35325 16.911 10.0354C17.3386 10.532 17.6246 11.2182 17.7662 12.0843C16.6996 11.903 15.546 11.8473 14.3129 11.918C10.8391 12.1181 8.60583 14.1441 8.75582 16.9592C8.83193 18.3872 9.54333 19.6157 10.7589 20.4183C11.7866 21.0967 13.1103 21.4285 14.486 21.3534C16.3027 21.2537 17.728 20.5606 18.7223 19.2932C19.4774 18.3307 19.955 17.0834 20.1659 15.5117C21.0317 16.0342 21.6734 16.7218 22.0277 17.5484C22.6303 18.9535 22.6655 21.2625 20.7814 23.1449C19.1307 24.794 17.1465 25.5074 14.1478 25.5294C10.8215 25.5048 8.3058 24.438 6.67018 22.3587C5.13855 20.4117 4.347 17.5995 4.31747 14C4.347 10.4005 5.13855 7.58823 6.67018 5.64123C8.3058 3.56196 10.8214 2.49521 14.1478 2.47049C17.4983 2.4954 20.0578 3.56729 21.756 5.65658C22.5887 6.68115 23.2166 7.96962 23.6304 9.47192L25.9852 8.84365C25.4835 6.99449 24.6941 5.40104 23.6199 4.07954C21.4428 1.40097 18.2587 0.0284591 14.156 0H14.1396C10.0453 0.0283602 6.89681 1.4061 4.78167 4.0949C2.89948 6.4876 1.9286 9.81687 1.89598 13.9902L1.89587 14L1.89598 14.0098C1.9286 18.1831 2.89948 21.5125 4.78167 23.9051C6.89681 26.5939 10.0453 27.9717 14.1396 28H14.156C17.7961 27.9748 20.3619 27.0217 22.4756 24.9099C25.241 22.1471 25.1577 18.684 24.2463 16.5581C23.5924 15.0335 22.3456 13.7953 20.6409 12.9775ZM14.3559 18.8864C12.8334 18.9722 11.2517 18.2888 11.1737 16.8251C11.1159 15.7398 11.9461 14.5288 14.4494 14.3845C14.7361 14.368 15.0174 14.3599 15.2937 14.3599C16.203 14.3599 17.0536 14.4482 17.827 14.6173C17.5385 18.2197 15.8466 18.8046 14.3559 18.8864Z" fill="black" />
    </svg>
  ),
  x: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <g clipPath="url(#clip0_x_share_icon)">
        <path d="M22.8287 0.894531H27.2577L17.5331 11.9671L28.8945 26.9872H19.9787L12.9982 17.8596L5.00671 26.9872H0.577698L10.88 15.1444L0 0.894531H9.13725L15.4438 9.23263L22.8287 0.894531ZM21.2785 24.3876H23.7337L7.84706 3.39789H5.20891L21.2785 24.3876Z" fill="black" />
      </g>
      <defs>
        <clipPath id="clip0_x_share_icon">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  facebook: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="28" viewBox="0 0 14 28" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.5498 28V15.4H13.3752L14 9.8H9.5498V7.07246C9.5498 5.63046 9.58665 4.2 11.6017 4.2H13.6426V0.196191C13.6426 0.135991 11.8895 0 10.1159 0C6.41199 0 4.09276 2.32007 4.09276 6.58027V9.8H0V15.4H4.09276V28H9.5498Z" fill="black" />
    </svg>
  ),
  telegram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M26.9637 5.24349C27.3345 3.43543 25.5586 1.93289 23.837 2.59809L2.73292 10.7519C0.810275 11.4948 0.724607 14.1833 2.59605 15.047L7.19192 17.1682L9.37824 24.8203C9.49181 25.2178 9.80722 25.5255 10.2074 25.6293C10.6075 25.7329 11.0327 25.6171 11.325 25.3248L14.6928 21.9569L19.4104 25.4952C20.7799 26.5222 22.7522 25.7742 23.0962 24.0973L26.9637 5.24349ZM3.57386 12.9285L24.6779 4.77462L20.8104 23.6285L15.2833 19.4831C14.8189 19.1348 14.1689 19.181 13.7584 19.5915L12.3159 21.034L12.7493 18.6504L21.2416 10.1581C21.655 9.74483 21.6986 9.08949 21.3438 8.62501C20.989 8.16051 20.3454 8.03023 19.8379 8.32022L8.10979 15.0219L3.57386 12.9285ZM9.53978 16.8922L10.2472 19.3683L10.5188 17.8744C10.5613 17.641 10.6739 17.426 10.8417 17.2582L13.4316 14.6684L9.53978 16.8922Z" fill="#0F0F0F" />
    </svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M7.01634 9.34049C7.14965 8.28613 8.5199 6.85316 9.60736 7.01217L9.60562 7.01043C10.6639 7.21154 11.5017 9.03304 11.9741 9.85209C12.3088 10.4464 12.0915 11.0484 11.7793 11.3025C11.3581 11.642 10.6995 12.1103 10.8377 12.5806C11.0833 13.4167 14 16.3333 15.4345 17.1625C15.9775 17.4763 16.3713 16.6486 16.7075 16.2245C16.9518 15.8983 17.5544 15.7033 18.1473 16.0253C19.0328 16.541 19.8669 17.1403 20.6383 17.815C21.0236 18.137 21.114 18.6129 20.8471 19.1158C20.3769 20.0017 19.017 21.1699 18.0299 20.9325C16.3058 20.5179 9.33334 17.815 7.09372 9.98435C6.96777 9.61389 6.99948 9.47385 7.01634 9.34049Z" fill="#0F0F0F" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14 26.8346C12.5724 26.8346 11.7826 26.6815 10.5 26.2513L8.04346 27.4796C6.49202 28.2553 4.66663 27.1271 4.66663 25.3925V22.7513C2.15427 20.4086 1.16663 17.7075 1.16663 14.0013C1.16663 6.91365 6.91231 1.16797 14 1.16797C21.0876 1.16797 26.8333 6.91365 26.8333 14.0013C26.8333 21.0889 21.0876 26.8346 14 26.8346ZM6.99996 21.7367L6.2579 21.0447C4.30597 19.2247 3.49996 17.1899 3.49996 14.0013C3.49996 8.20232 8.20097 3.5013 14 3.5013C19.799 3.5013 24.5 8.20232 24.5 14.0013C24.5 19.8003 19.799 24.5013 14 24.5013C12.85 24.5013 12.3106 24.3975 11.2419 24.0391L10.3232 23.731L6.99996 25.3925V21.7367Z" fill="#0F0F0F" />
    </svg>
  ),
};

export const InsightDetailsPage: React.FC<InsightDetailsPageProps> = ({ insight, relatedInsights, lang }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const relatedArticles = relatedInsights.slice(0, 3);
  const publishDate = insight.displayDate || formatDate(insight.date, lang);
  const newsletterId = `insight-newsletter-${insight.id}`;
  const shareHref = `/${lang}/insights/${insight.id}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const absoluteShareUrl = new URL(shareHref, siteUrl).toString();
  const shareTitle = encodeURIComponent(insight.title);
  const shareUrl = encodeURIComponent(absoluteShareUrl);
  const shareText = encodeURIComponent(`${insight.title} ${absoluteShareUrl}`);
  const shareLinks = [
    {
      label: 'Threads',
      href: `https://www.threads.net/intent/post?text=${shareText}`,
      icon: socialIcons.threads,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      icon: socialIcons.x,
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: socialIcons.facebook,
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
      icon: socialIcons.telegram,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${shareText}`,
      icon: socialIcons.whatsapp,
    },
  ];
  const bodySections = insight.bodySections?.length
    ? insight.bodySections
    : [{ paragraphs: [insight.excerpt || ''] }];
  const primaryMetaItems = [
    ...(insight.hashtags?.length ? insight.hashtags : insight.promotedLabel ? [insight.promotedLabel] : []),
    insight.timeToRead || insight.readTime,
  ].filter(Boolean) as string[];

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
                name={insight.authorName || (lang === 'bg' ? 'Автор' : 'Author')}
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
        {!!primaryMetaItems.length && (
          <ul className={styles.primaryMeta}>
            {primaryMetaItems.map((item, index) => (
              <li key={item}>
                <span>{item}</span>
                {index < primaryMetaItems.length - 1 && <span className={styles.dot} aria-hidden="true" />}
              </li>
            ))}
          </ul>
        )}
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
                  {link.icon}
                </a>
              ))}
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
