import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Expert } from '../../../../Types/expert.ts';
import { ButtonView } from '../../../Common/Buttons/ButtonView/ButtonView.tsx';
import styles from './TopAuthorsBlock.module.scss';

interface TopAuthorsBlockProps {
  experts: Expert[];
  lang: string;
  title: string;
}

export const TopAuthorsBlock: React.FC<TopAuthorsBlockProps> = ({ experts, lang, title }) => {
  const authors = experts.slice(0, 3);
  const resourceCounts = [32, 16, 12];
  const resourcesLabel = lang === 'bg' ? 'ресурса' : 'resources';

  if (!authors.length) {
    return null;
  }

  return (
    <aside className={styles.authors} aria-labelledby="learn-authors-title">
      <h2 id="learn-authors-title">{title}</h2>
      <div className={styles.list}>
        {authors.map((expert, index) => (
          <div className={styles.author} key={expert.id}>
            <span className={styles.avatar}>
              <Image src={expert.imageUrl} alt={expert.name} fill className={styles.image} sizes="56px" />
            </span>
            <span className={styles.info}>
              <span className={styles.top}>
                <Link href={`/${lang}/experts/${expert.id}`} className={styles.name}>{expert.name}</Link>
                <span className={styles.role}>{expert.role} <span>{expert.company}</span></span>
              </span>
              <span className={styles.bottom}>
                <span className={styles.resources}>{resourceCounts[index]} {resourcesLabel}</span>
                <ButtonView href={`/${lang}/experts/${expert.id}`} variant="compact" />
              </span>
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};
