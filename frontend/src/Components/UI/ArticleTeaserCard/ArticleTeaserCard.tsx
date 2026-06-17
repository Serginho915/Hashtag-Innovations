import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ReadButton } from '../../Common/Buttons/ReadButton/ReadButton.tsx';
import styles from './ArticleTeaserCard.module.scss';

interface ArticleTeaserCardProps {
  title: string;
  excerpt: string;
  authorLabel: string;
  readText: string;
  readHref?: string;
  authorHref?: string;
  authorAvatarUrl?: string;
  as?: 'div' | 'li';
  className?: string;
}

export const ArticleTeaserCard: React.FC<ArticleTeaserCardProps> = ({
  title,
  excerpt,
  authorLabel,
  readText,
  readHref,
  authorHref,
  authorAvatarUrl,
  as = 'div',
  className,
}) => {
  const Component = as;
  const classNames = [styles.card, className].filter(Boolean).join(' ');
  const avatar = authorAvatarUrl ? (
    <div className={styles.authorAvatarImageWrapper}>
      <Image src={authorAvatarUrl} alt={authorLabel} fill className={styles.authorAvatarImage} />
    </div>
  ) : (
    <span className={styles.authorAvatar} aria-hidden="true" />
  );

  return (
    <Component className={classNames}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.footer}>
          <div className={styles.authorGroup}>
            <span className={styles.authorLabel}>{authorLabel}</span>
            {authorHref ? (
              <Link href={authorHref} aria-label={authorLabel} className={styles.authorLink}>
                {avatar}
              </Link>
            ) : (
              avatar
            )}
          </div>
          <ReadButton text={readText} href={readHref} />
        </div>
      </div>
    </Component>
  );
};
