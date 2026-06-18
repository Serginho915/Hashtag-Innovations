import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TextbookItem } from '../../../../Types/textbook.ts';
import { getMaterialAnchorHref } from '../materialAnchors.ts';
import styles from './TrendingMaterials.module.scss';

interface TrendingMaterialsProps {
  materials: TextbookItem[];
  lang: string;
  title: string;
}

export const TrendingMaterials: React.FC<TrendingMaterialsProps> = ({ materials, lang, title }) => {
  const items = materials.filter((material) => material.isTrending).slice(0, 5);
  const visibleItems = items.length ? items : materials.slice(0, 5);

  if (!visibleItems.length) {
    return null;
  }

  return (
    <aside className={styles.trending} aria-labelledby="learn-trending-title">
      <div className={styles.label} id="learn-trending-title">
        <span className={styles.dot} aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ol className={styles.list}>
        {visibleItems.map((material, index) => (
          <li className={styles.item} key={material.id || material.title}>
            <Link href={getMaterialAnchorHref(material, lang)} className={styles.link}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}/</span>
              <span className={styles.thumb}>
                <Image src={material.imageUrl} alt="" fill className={styles.image} sizes="48px" />
              </span>
              <span className={styles.title}>{material.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
};
