import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Expert } from '../../../../Types/expert.ts';
import styles from './TopAuthorsBlock.module.scss';

interface TopAuthorsBlockProps {
  experts: Expert[];
  lang: string;
  title: string;
}

export const TopAuthorsBlock: React.FC<TopAuthorsBlockProps> = ({ experts, lang, title }) => {
  const authors = experts.slice(0, 3);

  if (!authors.length) {
    return null;
  }

  return (
    <aside className={styles.authors} aria-labelledby="learn-authors-title">
      <h2 id="learn-authors-title">{title}</h2>
      <div className={styles.list}>
        {authors.map((expert) => (
          <Link href={`/${lang}/experts/${expert.id}`} className={styles.author} key={expert.id}>
            <span className={styles.avatar}>
              <Image src={expert.imageUrl} alt={expert.name} fill className={styles.image} sizes="56px" />
            </span>
            <span className={styles.info}>
              <span className={styles.name}>{expert.name}</span>
              <span className={styles.role}>{expert.role}</span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
};
