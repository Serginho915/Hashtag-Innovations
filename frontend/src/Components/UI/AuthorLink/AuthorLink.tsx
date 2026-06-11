import React from 'react';
import Link from 'next/link';
import styles from './AuthorLink.module.scss';

interface AuthorLinkProps {
  /** Display name of the author / speaker / lecturer */
  name: string;
  /** If present, renders as a blue <Link> to the expert page */
  expertId?: string;
  /** Current language for URL construction */
  lang: string;
  /** Additional CSS class for size / font overrides */
  className?: string;
}

/**
 * Reusable component that renders a person's name.
 * - If `expertId` is provided → blue clickable link to `/lang/experts/expertId`.
 * - Otherwise → plain black text.
 */
export const AuthorLink: React.FC<AuthorLinkProps> = ({
  name,
  expertId,
  lang,
  className,
}) => {
  if (expertId) {
    return (
      <Link
        href={`/${lang}/experts/${expertId}`}
        className={`${styles.authorLink}${className ? ` ${className}` : ''}`}
      >
        {name}
      </Link>
    );
  }

  return (
    <span className={`${styles.authorText}${className ? ` ${className}` : ''}`}>
      {name}
    </span>
  );
};
