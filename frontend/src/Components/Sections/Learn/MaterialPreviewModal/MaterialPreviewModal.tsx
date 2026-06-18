import React from 'react';
import Image from 'next/image';
import { Modal } from '../../../UI/Modal/Modal.tsx';
import { ButtonView } from '../../../Common/Buttons/ButtonView/ButtonView.tsx';
import type { TextbookItem } from '../../../../Types/textbook.ts';
import styles from './MaterialPreviewModal.module.scss';

interface MaterialPreviewModalProps {
  material: TextbookItem;
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
  actionText: string;
  previewText: string;
}

const PREVIEW_PAGES = [1, 2, 3];

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  material,
  isOpen,
  onClose,
  onAction,
  actionText,
  previewText,
}) => {
  const previewParagraphs = [
    material.excerpt,
    [material.category, material.format].filter(Boolean).join(' · '),
  ].filter(Boolean);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.preview}>
        <div className={styles.document}>
          {material.previewPdfUrl ? (
            PREVIEW_PAGES.map((page) => (
              <div className={styles.pdfPage} key={page}>
                <iframe
                  className={styles.frame}
                  src={`${material.previewPdfUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={`${material.title} ${previewText} ${page}`}
                  scrolling="no"
                  tabIndex={-1}
                />
              </div>
            ))
          ) : (
            <div className={styles.mockPage}>
              <div className={styles.mockHeader}>
                <span>{material.badge || material.format || 'PDF'}</span>
                <span>{previewText}</span>
              </div>
              <div className={styles.cover}>
                <Image src={material.imageUrl} alt="" fill className={styles.coverImage} sizes="(max-width: 767px) 90vw, 58vw" />
              </div>
              <div className={styles.mockContent}>
                <h3>{material.title}</h3>
                {previewParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className={styles.info}>
          <div className={styles.kicker}>{material.format || material.badge || 'PDF'}</div>
          <h2>{material.title}</h2>
          <p>{material.excerpt}</p>
          <div className={styles.meta}>
            <span>{material.authorLabel}</span>
            <strong>{material.authorName}</strong>
          </div>
          {material.price && <div className={styles.price}>{material.price}</div>}
          <ButtonView onClick={onAction} text={actionText} variant="pill" />
        </aside>
      </div>
    </Modal>
  );
};
