import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonView } from '../../../Common/Buttons/ButtonView/ButtonView.tsx';
import { TextbookItem } from '../../../../Types/textbook.ts';
import styles from './MaterialCard.module.scss';

interface MaterialCardProps {
  material: TextbookItem;
  lang: string;
  variant?: 'featured' | 'compact';
  getText: string;
  previewText: string;
  anchorId?: string;
}

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3.33 1.33h6.2L12.67 4.47v10.2H3.33V1.33Zm5.54 1.34v2.46h2.46L8.87 2.67ZM4.67 2.67v10.66h6.66V6.47H7.53v-3.8H4.67Z"
      fill="currentColor"
    />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 3.33c3.34 0 5.53 3.08 5.62 3.21l.31.46-.31.46C13.53 7.59 11.34 10.67 8 10.67S2.47 7.59 2.38 7.46L2.07 7l.31-.46C2.47 6.41 4.66 3.33 8 3.33Zm0 1.34C5.95 4.67 4.37 6.15 3.78 7 4.37 7.85 5.95 9.33 8 9.33S11.63 7.85 12.22 7C11.63 6.15 10.05 4.67 8 4.67Zm0 .66A1.67 1.67 0 1 1 8 8.67 1.67 1.67 0 0 1 8 5.33Z"
      fill="currentColor"
    />
  </svg>
);

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  lang,
  variant = 'compact',
  getText,
  previewText,
  anchorId,
}) => {
  const href = material.salesUrl || material.pdfUrl || `/${lang}/learn?material=${material.id || material.title}`;
  const classNames = [styles.card, styles[variant]].join(' ');
  const authorHref = material.authorExpertId ? `/${lang}/experts/${material.authorExpertId}` : undefined;

  return (
    <article id={anchorId} className={classNames}>
      <div className={styles.media}>
        <Image src={material.imageUrl} alt={material.title} fill className={styles.image} sizes="(max-width: 767px) 50vw, 33vw" />
        <div className={styles.badges}>
          <span className={styles.badge}>
            <FileIcon />
            {material.badge || material.format || 'PDF'}
          </span>
          {material.hasPreview && (
            <span className={styles.badge}>
              <EyeIcon />
              {previewText}
            </span>
          )}
        </div>
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{material.title}</h2>
        <p className={styles.excerpt}>{material.excerpt}</p>
        <div className={styles.meta}>
          <div className={styles.authorRow}>
            <span>{material.authorLabel}</span>
            {authorHref ? (
              <Link href={authorHref} className={styles.authorName}>
                {material.authorName}
              </Link>
            ) : (
              <span className={styles.authorName}>{material.authorName}</span>
            )}
          </div>
          {material.price && <div className={styles.price}>{material.price}</div>}
        </div>
        <div className={styles.buttonSlot}>
          <ButtonView href={href} text={getText} variant="pill" />
        </div>
      </div>
    </article>
  );
};
