import React from 'react';
import Link from 'next/link';
import { CommunitySpeaker } from '../../../../Types/community.ts';
import styles from './EventSpeakersBlock.module.scss';

interface EventSpeakersBlockProps {
  title: string;
  speakers: CommunitySpeaker[];
  lang: string;
}

const SpeakerIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 8a3.33 3.33 0 1 0 0-6.67A3.33 3.33 0 0 0 8 8Zm0 1.33c-2.67 0-5.33 1.34-5.33 3.34V14h10.66v-1.33c0-2-2.66-3.34-5.33-3.34Z" />
  </svg>
);

const SpeakerCard = ({ speaker, lang }: { speaker: CommunitySpeaker; lang: string }) => {
  const content = (
    <>
      <img className={styles.speakerImage} src={speaker.avatarSrc || '/images/avatars/avatar_1.png'} alt={speaker.name} />
      <div className={styles.speakerText}>
        <div className={styles.speakerName}>{lang === 'bg' && speaker.nameBg ? speaker.nameBg : speaker.name}</div>
        {(lang === 'bg' && speaker.roleBg) ? <div className={styles.speakerRole}>{speaker.roleBg}</div> : speaker.role && <div className={styles.speakerRole}>{speaker.role}</div>}
      </div>
    </>
  );

  if (speaker.expertId) {
    return (
      <Link href={`/${lang}/experts/${speaker.expertId}`} className={styles.speakerCard}>
        {content}
      </Link>
    );
  }

  return <div className={styles.speakerCard}>{content}</div>;
};

export const EventSpeakersBlock: React.FC<EventSpeakersBlockProps> = ({ title, speakers, lang }) => {
  if (!speakers.length) {
    return null;
  }

  return (
    <section className={styles.speakersBlock}>
      <div className={styles.speakersHeading}>
        <span className={styles.headingIcon}><SpeakerIcon /></span>
        <h2>{title}</h2>
      </div>
      <ul className={styles.speakersList}>
        {speakers.map((speaker) => (
          <li key={speaker.id}>
            <SpeakerCard speaker={speaker} lang={lang} />
          </li>
        ))}
      </ul>
    </section>
  );
};
