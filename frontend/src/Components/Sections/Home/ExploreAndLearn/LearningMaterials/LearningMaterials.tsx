"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./LearningMaterials.module.scss";
import Image from "next/image";

import { AuthorLink } from '../../../../UI/AuthorLink/AuthorLink';

import { TextbookItem } from "../../../../../Types/textbook";

interface LearningMaterialsProps {
  materials: TextbookItem[];
  lang: string;
}

export const LearningMaterials: React.FC<LearningMaterialsProps> = ({ materials, lang }) => {
  const listRef = useRef<HTMLDivElement>(null);

  const scrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -200, behavior: "smooth" });
    }
  };

  const scrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 200, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.learningMaterials}>
      <div className={styles.header}>
        <div className={styles.headerGroup}>
          <div className={styles.indexNumber}>03/</div>
          <div className={styles.titleText}>LEARNING MATERIALS</div>
        </div>
      </div>
      
      <div className={styles.boxContainer}>
        <div className={styles.materialsList} ref={listRef}>
          {materials.map((item) => (
            <div key={item.id} className={styles.materialCard}>
              <div className={styles.imageWrapper}>
                <Image src={item.imageUrl} alt={item.title} width={144} height={170} className={styles.coverImage} />
                <div className={styles.pdfBadge}>PDF</div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{item.title}</div>
                <div className={styles.cardExcerpt}>{item.excerpt}</div>
                <div className={styles.authorRow}>
                  <div className={styles.authorLabel}>{item.authorLabel || 'Author:'}</div>
                  <AuthorLink name={item.authorName} expertId={item.authorExpertId} lang={lang} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.boxFooter}>
          <div className={styles.arrowsGroup}>
            <div className={styles.arrowUp} onClick={scrollUp}></div>
            <div className={styles.arrowDown} onClick={scrollDown}></div>
          </div>
          <div className={styles.discoverButton}>
            DISCOVER ALL
          </div>
        </div>
      </div>
    </div>
  );
};
