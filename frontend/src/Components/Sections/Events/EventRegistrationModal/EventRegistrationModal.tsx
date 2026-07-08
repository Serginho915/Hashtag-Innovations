"use client";

import React, { useState } from 'react';
import { Modal } from '../../../UI/Modal/Modal.tsx';
import { isValidEmail } from '../../../../Lib/validation.ts';
import styles from './EventRegistrationModal.module.scss';
import { CommunityEvent } from '../../../../Types/community.ts';
import { translations } from './translations.ts';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CommunityEvent;
  lang: string;
  displayTitle: string;
  displayDescription: string;
  displayDate: string;
  displayLocation: string;
}

const CalendarIcon = () => (
  <svg viewBox="0 0 16 16" width="18" height="18" fill="#1E1E20" aria-hidden="true">
    <path d="M3.33 1.33h1.34v1.34h6.66V1.33h1.34v1.34h.66c.37 0 .69.13.95.39.26.27.39.58.39.94v9.33c0 .37-.13.69-.39.95-.26.26-.58.39-.95.39H2.67c-.37 0-.69-.13-.95-.39a1.29 1.29 0 0 1-.39-.95V4c0-.36.13-.67.39-.94.26-.26.58-.39.95-.39h.66V1.33Zm-.66 12h10.66V6H2.67v7.33Z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 16 16" width="20" height="20" fill="#1E1E20" aria-hidden="true">
    <path d="M8 1.33A4.67 4.67 0 0 0 3.33 6c0 3.5 4.67 8.67 4.67 8.67S12.67 9.5 12.67 6A4.67 4.67 0 0 0 8 1.33Zm0 6.34A1.67 1.67 0 1 1 8 4.33a1.67 1.67 0 0 1 0 3.34Z" />
  </svg>
);

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  isOpen,
  onClose,
  event,
  lang,
  displayTitle,
  displayDescription,
  displayDate,
  displayLocation,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; terms?: string }>({});

  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const newErrors: { name?: string; email?: string; terms?: string } = {};
    if (!name.trim()) newErrors.name = t.errorRequired;
    if (!email.trim() || !isValidEmail(email)) newErrors.email = t.errorEmail;
    if (!termsAccepted) newErrors.terms = t.errorTerms;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log('Registered for event:', {
      eventId: event.id,
      name,
      email,
      termsAccepted,
    });
    // Reset state & close
    setName('');
    setEmail('');
    setTermsAccepted(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {
      onClose();
      setErrors({});
    }}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          
          {/* Left Column: Event Info */}
          <div className={styles.eventInfoColumn}>
            <div className={styles.eventDetails}>
              <div className={styles.breadcrumbs}>
                <span className={styles.crumbText}>{t.dateTime}</span>
              </div>
              
              <div className={styles.eventHeader}>
                <div className={styles.eventTitleRow}>
                  <CalendarIcon />
                  <span className={styles.titleText}>{displayTitle}</span>
                </div>
                <div className={styles.eventDescRow}>
                  <span className={styles.descText}>{displayDescription}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.divider} />
            
            <div className={styles.imagePriceContainer}>
              <img 
                className={styles.eventImage} 
                src={event.imageSrc || '/images/community/summit_event.png'} 
                alt={displayTitle} 
              />
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>{t.price}</span>
                <span className={styles.priceValue}>{event.price || 'Free'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className={styles.formColumn}>
            <div className={styles.formHeader}>
              <div className={styles.title}>{t.contactDetails}</div>
              <div className={styles.subtitle}>{t.contactDetailsDesc}</div>
            </div>
            
            <div className={styles.formFields}>
              <div className={styles.formGroup}>
                <div className={styles.label}>{t.nameLabel}</div>
                <input 
                  type="text" 
                  className={`${styles.input} ${errors.name ? styles.error : ''}`} 
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                />
                {errors.name && <div className={styles.errorText}>{errors.name}</div>}
              </div>
              <div className={styles.formGroup}>
                <div className={styles.label}>{t.emailLabel}</div>
                <input 
                  type="email" 
                  className={`${styles.input} ${errors.email ? styles.error : ''}`} 
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                />
                {errors.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>
            </div>
            
            <div className={styles.termsRow}>
              <div className={`${styles.checkbox} ${termsAccepted ? styles.checked : ''} ${errors.terms ? styles.error : ''}`}>
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms) setErrors({ ...errors, terms: undefined });
                  }}
                  style={{ position: 'absolute', opacity: 0, width: '22px', height: '22px', cursor: 'pointer', margin: 0 }}
                />
                {termsAccepted && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className={styles.termsText}>
                {t.termsAgree}
                <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>{t.termsLink}</a>
                {t.and}
                <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>{t.privacyLink}</a>
              </div>
            </div>
            {errors.terms && <div className={styles.errorText} style={{ marginTop: '-12px' }}>{errors.terms}</div>}
          </div>
        </div>

        {/* Bottom Selection Bar */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomInfo}>
            <div className={styles.bottomInfoRow}>
              <CalendarIcon />
              <span className={styles.infoText} style={{textTransform: 'uppercase'}}>{`${displayDate} · ${event.startTime || '11:00'}`}</span>
            </div>
            <div className={styles.bottomInfoRow}>
              <LocationIcon />
              <span className={styles.infoText}>{displayLocation}</span>
            </div>
          </div>
          <button 
            type="button"
            className={styles.confirmBtn}
            onClick={handleRegister}
          >
            {t.registerBtn}
          </button>
        </div>

      </div>
    </Modal>
  );
};
