import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumbs.module.scss';
import { translations } from './translations.ts';

export interface BreadcrumbItem {
  labelKey: string; // Used to look up translation, or fallback to the string itself
  href?: string; // If omitted, this is the current active item
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  lang: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, lang }) => {
  const t = translations[lang] || translations.en;

  return (
    <div className={styles.breadcrumbsWrapper}>
      <div className={styles.breadcrumbsRow}>
        {items.map((item, index) => {
          const label = t[item.labelKey] || item.labelKey;
          const isLast = index === items.length - 1;

          if (!item.href || isLast) {
            return (
              <div key={index} className={styles.currentItem}>
                {label}
              </div>
            );
          }

          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href={item.href} className={styles.linkItem}>
                {label}/
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
