"use client";

import React, { useState } from 'react';
import { EventRegistrationModal } from '../EventRegistrationModal/EventRegistrationModal.tsx';
import styles from '../EventDetails/EventDetails.module.scss';
import { CommunityEvent } from '../../../../Types/community.ts';

interface EventRegisterButtonProps {
  event: CommunityEvent;
  lang: string;
  title: string;
  description: string;
  displayDate: string;
  displayLocation: string;
  registerText: string;
}

export const EventRegisterButton: React.FC<EventRegisterButtonProps> = ({
  event, lang, title, description, displayDate, displayLocation, registerText
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className={styles.registerButton} onClick={() => setIsModalOpen(true)}>
        {registerText}
      </button>
      <EventRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        lang={lang}
        displayTitle={title}
        displayDescription={description}
        displayDate={displayDate}
        displayLocation={displayLocation}
      />
    </>
  );
};
