'use client';

import React, { useState } from 'react';
import { Expert } from '../../../../../Types/expert';
import { BookingModal } from '../BookingModal/BookingModal';
import styles from '../../ExpertProfile.module.scss';

interface Props {
  expert: Expert;
  session: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    price: number;
  };
  t: Record<string, string>;
  lang: string;
}

export const BookSessionButton: React.FC<Props> = ({ expert, session, t, lang }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className={styles.bookBtn} 
        onClick={() => setIsModalOpen(true)}
      >
        {t.bookNow}
      </button>

      {isModalOpen && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          expert={expert}
          session={session}
          t={t}
          lang={lang}
        />
      )}
    </>
  );
};
