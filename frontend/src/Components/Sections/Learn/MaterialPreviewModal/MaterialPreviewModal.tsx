import React from 'react';
import { Modal } from '../../../UI/Modal/Modal.tsx';
import { ButtonView } from '../../../Common/Buttons/ButtonView/ButtonView.tsx';
import type { TextbookItem } from '../../../../Types/textbook.ts';
import styles from './MaterialPreviewModal.module.scss';

interface MaterialPreviewModalProps {
  material: TextbookItem;
  isOpen: boolean;
  onClose: () => void;
  actionHref: string;
  actionText: string;
  previewText: string;
}

const PDF_PREVIEW_URL = '/test.pdf';
const PREVIEW_PAGES = [1, 2, 3];

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  material,
  isOpen,
  onClose,
  actionHref,
  actionText,
  previewText,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <div className={styles.preview}>
        <div className={styles.document}>
          {PREVIEW_PAGES.map((page) => (
            <div className={styles.pdfPage} key={page}>
              <iframe
                className={styles.frame}
                src={`${PDF_PREVIEW_URL}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title={`${material.title} ${previewText} ${page}`}
                scrolling="no"
                tabIndex={-1}
              />
            </div>
          ))}
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
          <ButtonView href={actionHref} text={actionText} variant="pill" />
        </aside>
      </div>
    </Modal>
  );
};
