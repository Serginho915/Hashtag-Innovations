"use client";

import React from "react";
import styles from "./LearningMaterials.module.scss";
import Image from "next/image";
import Link from "next/link";

import { AuthorLink } from '../../../../UI/AuthorLink/AuthorLink.tsx';
import { getMaterialAnchorHref } from '../../../Learn/materialAnchors.ts';
import { useScrollProgress } from '../../../../../Hooks/useScrollProgress.ts';

import { TextbookItem } from "../../../../../Types/textbook.ts";

interface LearningMaterialsProps {
  materials: TextbookItem[];
  lang: string;
}

export const LearningMaterials: React.FC<LearningMaterialsProps> = ({ materials, lang }) => {
  const { scrollRef, scrollPrev, scrollNext } = useScrollProgress<HTMLDivElement>({
    axis: 'vertical',
    scrollAmount: 200,
  });

  return (
    <div className={styles.learningMaterials}>
      <div className={styles.header}>
        <div className={styles.headerGroup}>
          <div className={styles.indexNumber}>03/</div>
          <div className={styles.titleText}>LEARNING MATERIALS</div>
        </div>
      </div>
      
      <div className={styles.boxContainer}>
        <div className={styles.materialsList} ref={scrollRef}>
          {materials.map((item) => {
            const materialHref = getMaterialAnchorHref(item, lang);

            return (
              <div key={item.id || item.title} className={styles.materialCard}>
                <Link href={materialHref} className={styles.imageWrapper}>
                  <Image src={item.imageUrl} alt={item.title} width={144} height={170} className={styles.coverImage} />
                  <div className={styles.pdfBadge}>PDF</div>
                </Link>
                <div className={styles.cardContent}>
                  <Link href={materialHref} className={styles.materialTextLink}>
                    <div className={styles.cardTitle}>{item.title}</div>
                    <div className={styles.cardExcerpt}>{item.excerpt}</div>
                  </Link>
                  <div className={styles.authorRow}>
                    <div className={styles.authorLabel}>{item.authorLabel || 'Author:'}</div>
                    <AuthorLink name={item.authorName} expertId={item.authorExpertId} lang={lang} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.boxFooter}>
          <div className={styles.arrowsGroup}>
            <div className={styles.arrowUp} onClick={scrollPrev}></div>
            <div className={styles.arrowDown} onClick={scrollNext}></div>
          </div>
          <Link href={`/${lang}/learn`} className={styles.discoverButton}>
            DISCOVER ALL
          </Link>
        </div>
      </div>
    </div>
  );
};
