import React from 'react';
import { Breadcrumbs } from '../../../UI/Breadcrumbs/Breadcrumbs.tsx';
import { CommunityEvent } from '../../../../Types/community.ts';
import { NewsItem } from '../../../../Types/news.ts';
import { EventOrganizationsBlock } from '../EventOrganizationsBlock/EventOrganizationsBlock.tsx';
import { EventSpeakersBlock } from '../EventSpeakersBlock/EventSpeakersBlock.tsx';
import { RelatedEventsBlock } from '../RelatedEventsBlock/RelatedEventsBlock.tsx';
import { RelevantArticlesBlock } from '../RelevantArticlesBlock/RelevantArticlesBlock.tsx';
import styles from './EventDetails.module.scss';

interface EventDetailsProps {
  event: CommunityEvent;
  relatedEvents: CommunityEvent[];
  relatedArticles: NewsItem[];
  lang: string;
}

const translations = {
  en: {
    details: 'Event Details',
    speakers: 'Speakers',
    organizers: 'Organizer(s):',
    partners: 'Partners:',
    relatedEvents: 'Related Events',
    relatedArticles: 'Relevant Articles',
    viewAll: 'view all',
    viewDetails: 'View Details',
    register: 'Register',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    price: 'Price',
    read: 'Read',
  },
  bg: {
    details: 'Детайли на събитие',
    speakers: 'Спикери',
    organizers: 'Организатор(и):',
    partners: 'Партньори:',
    relatedEvents: 'Похожи събития',
    relatedArticles: 'Релевантни статии',
    viewAll: 'view all',
    viewDetails: 'Вижте детайли',
    register: 'Зарегистрирайте се',
    date: 'Дата',
    time: 'Време',
    location: 'Локация',
    price: 'Цена',
    read: 'Read',
  },
};

const tagLabels: Record<string, Record<string, string>> = {
  business: { en: 'Business', bg: 'Бизнес' },
  ai: { en: 'Artificial Intelligence', bg: 'Изкуствен интелект' },
  recommended: { en: 'Innovations', bg: 'Иновации' },
  on_site: { en: 'Live', bg: 'На живо' },
  online: { en: 'Online', bg: 'Онлайн' },
};

const CalendarIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.33 1.33h1.34v1.34h6.66V1.33h1.34v1.34h.66c.37 0 .69.13.95.39.26.27.39.58.39.94v9.33c0 .37-.13.69-.39.95-.26.26-.58.39-.95.39H2.67c-.37 0-.69-.13-.95-.39a1.29 1.29 0 0 1-.39-.95V4c0-.36.13-.67.39-.94.26-.26.58-.39.95-.39h.66V1.33Zm-.66 12h10.66V6H2.67v7.33Z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 1.33A4.67 4.67 0 0 0 3.33 6c0 3.5 4.67 8.67 4.67 8.67S12.67 9.5 12.67 6A4.67 4.67 0 0 0 8 1.33Zm0 6.34A1.67 1.67 0 1 1 8 4.33a1.67 1.67 0 0 1 0 3.34Z" />
  </svg>
);

const PriceIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M14 3.33v9.34c0 .36-.13.67-.39.94-.27.26-.58.39-.94.39H3.33c-.36 0-.67-.13-.94-.39-.26-.27-.39-.58-.39-.94V3.33c0-.36.13-.67.39-.94.27-.26.58-.39.94-.39h9.34c.36 0 .67.13.94.39.26.27.39.58.39.94ZM3.33 4.67h9.34V3.33H3.33v1.34Zm0 2.66v5.34h9.34V7.33H3.33Z" />
  </svg>
);

const getEventTitle = (event: CommunityEvent, lang: string) => lang === 'bg' && event.titleBg ? event.titleBg : event.title;
const getEventDescription = (event: CommunityEvent, lang: string) => lang === 'bg' && event.descriptionBg ? event.descriptionBg : event.description;
const getEventDetail = (event: CommunityEvent, lang: string) => lang === 'bg' && event.detailDescriptionBg ? event.detailDescriptionBg : event.detailDescription;
const getEventLocation = (event: CommunityEvent, lang: string) => lang === 'bg' && event.locationBg ? event.locationBg : event.location;
const getEventDate = (event: CommunityEvent, lang: string) => lang === 'bg' && event.displayDateBg ? event.displayDateBg : event.displayDate;

const getTagLabel = (tag: string, lang: string) => tagLabels[tag]?.[lang] || tagLabels[tag]?.en || tag;

const normalizeLocation = (location: string) => location.replace(/^(LIVE|НА ЖИВО),\s*/i, '');

export const EventDetails: React.FC<EventDetailsProps> = ({ event, relatedEvents, relatedArticles, lang }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const title = getEventTitle(event, lang);
  const description = getEventDescription(event, lang);
  const detailDescription = getEventDetail(event, lang) || description;
  const location = normalizeLocation(getEventLocation(event, lang));
  const eventTags = event.tags.filter((tag) => ['business', 'ai', 'recommended'].includes(tag));
  const speakers = event.speakers?.length ? event.speakers : [event.speaker];
  const organizers = event.organizers || [{ id: 'org-default', name: 'Hashtag Innovations', logoSrc: '/images/Logo.svg' }];
  const partners = event.partners || [];

  return (
    <section className={styles.eventPage}>
      <Breadcrumbs
        lang={lang}
        items={[
          { labelKey: 'home', href: `/${lang}` },
          { labelKey: 'events', href: `/${lang}/events` },
          { labelKey: title },
        ]}
      />

      <header className={styles.header}>
        <div className={styles.titleLine}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <ul className={styles.tagsList}>
          {eventTags.map((tag) => (
            <li key={tag} className={styles.tagItem}>{getTagLabel(tag, lang)}</li>
          ))}
        </ul>
      </header>

      <div className={styles.heroGrid}>
        <img className={styles.heroImage} src={event.heroImageSrc || event.imageSrc || '/images/community/summit_event.png'} alt={title} />

        <aside className={styles.summaryPanel}>
          <p className={styles.lead}>{description}</p>
          <dl className={styles.metaPanel}>
            <div className={styles.metaLine}>
              <dt><span className={styles.metaIcon}><CalendarIcon /></span>{t.date}</dt>
              <dd>{getEventDate(event, lang)}</dd>
            </div>
            <div className={styles.metaLine}>
              <dt><span className={styles.metaIcon}><CalendarIcon /></span>{t.time}</dt>
              <dd>{event.startTime || '11:00'} <span>({event.timezone || 'GMT+3'})</span></dd>
            </div>
            <div className={styles.metaLine}>
              <dt><span className={styles.metaIcon}><LocationIcon /></span>{t.location}</dt>
              <dd>{location}</dd>
            </div>
            <div className={styles.metaLine}>
              <dt><span className={styles.metaIcon}><PriceIcon /></span>{t.price}</dt>
              <dd>{event.price || 'Free'}</dd>
            </div>
          </dl>
          <a className={styles.registerButton} href="#register">{t.register}</a>
        </aside>
      </div>

      <section className={styles.infoGrid}>
        <article className={styles.detailsBlock}>
          <div className={styles.sectionLabel}>{t.details}</div>
          <p>{detailDescription}</p>
        </article>

        <EventSpeakersBlock title={t.speakers} speakers={speakers} lang={lang} />
      </section>

      <EventOrganizationsBlock
        groups={[
          { label: t.organizers, items: organizers },
          { label: t.partners, items: partners },
        ]}
      />

      <section className={styles.relatedGrid}>
        <RelatedEventsBlock
          title={t.relatedEvents}
          viewAllText={t.viewAll}
          events={relatedEvents}
          lang={lang}
        />
        <div className={styles.articlesColumn}>
          <div className={styles.articlesColumnInner}>
            <RelevantArticlesBlock
              title={t.relatedArticles}
              readText={t.read}
              articles={relatedArticles}
              lang={lang}
            />
          </div>
        </div>
      </section>

      <div id="register" className={styles.registerAnchor} aria-hidden="true" />
    </section>
  );
};
