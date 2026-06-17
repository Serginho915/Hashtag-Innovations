import React from 'react';
import Link from 'next/link';
import styles from './ViewAllLink.module.scss';

interface ViewAllLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'plain' | 'arrow';
  className?: string;
}

export const ViewAllLink: React.FC<ViewAllLinkProps> = ({
  href,
  children,
  variant = 'plain',
  className,
}) => {
  const classNames = [
    styles.viewAll,
    styles[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <Link href={href} className={classNames}>
      <span>{children}</span>
    </Link>
  );
};
