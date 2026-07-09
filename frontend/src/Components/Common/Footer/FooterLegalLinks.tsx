"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Modal } from '../../UI/Modal/Modal.tsx';
import styles from './Footer.module.scss';
import { translations } from './translations.ts';
import { COOKIE_SETTINGS_EVENT } from '../CookieConsent/CookieConsent.tsx';

interface FooterLegalLinksProps {
  lang: string;
}

type FooterModal = 'euProject' | null;

export const FooterLegalLinks: React.FC<FooterLegalLinksProps> = ({ lang }) => {
  const t = translations[lang] || translations.bg;
  const [activeModal, setActiveModal] = useState<FooterModal>(null);

  const legalLinks = [
    { label: t.euProject, href: `/${lang}/eu-project`, modal: 'euProject' as const },
    { label: t.privacy, href: `/${lang}/privacy` },
    { label: t.terms, href: `/${lang}/terms` },
    { label: t.cookies, href: `/${lang}/cookies` },
  ];

  const closeModal = () => setActiveModal(null);
  const openCookieSettings = () => {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
  };

  return (
    <>
      <div className={styles.legalLinks}>
        {legalLinks.map((link) => (
          link.modal ? (
            <a
              key={link.href}
              href={link.href}
              className={styles.legalLink}
              onClick={(event) => {
                event.preventDefault();
                setActiveModal(link.modal);
              }}
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.href} href={link.href} className={styles.legalLink}>
              {link.label}
            </Link>
          )
        ))}
        <button type="button" className={styles.legalLink} onClick={openCookieSettings}>
          {t.cookieSettings}
        </button>
      </div>

      <Modal isOpen={activeModal === 'euProject'} onClose={closeModal} className={styles.euModal} closeButtonClassName={styles.modalClose}>
        <div className={styles.euModalContent}>
          <h2>{t.euProjectTitle}</h2>
          <div className={styles.posterFrame}>
            <Image
              src="/Plakat-Hash-Digi.jpg"
              alt={t.euProjectTitle}
              width={3364}
              height={4735}
              className={styles.posterImage}
              sizes="(max-width: 768px) 92vw, 760px"
            />
          </div>
        </div>
      </Modal>

    </>
  );
};
