import React, { useState } from 'react';
import { Expert } from '../../../../../Types/expert.ts';
import { formatExpertRoleCompany } from '../../../../../Lib/expert.ts';
import { Modal } from '../../../../UI/Modal/Modal.tsx';
import { isValidEmail } from '../../../../../Lib/validation.ts';
import { createCheckoutSession } from '../../../../../Lib/payments.ts';
import styles from './BookingModal.module.scss';
import type { ExpertsTranslations } from '../../../../../app/[lang]/experts/translations.ts';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: Expert;
  session: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    price: number;
  };
  t: ExpertsTranslations;
  lang: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  expert,
  session,
  t,
  lang,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [additional, setAdditional] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; terms?: string }>({});
  const [paymentError, setPaymentError] = useState('');
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const roleWithCompany = formatExpertRoleCompany(expert, lang);

  const paymentTitle = lang === 'bg' ? 'Данни за плащане' : lang === 'ru' ? 'Данные для оплаты' : 'Payment details';
  const paymentDescription =
    lang === 'bg'
      ? 'След плащане консултацията ще се появи в админ панела като платена заявка. Експертът ще се свърже с клиента, за да уговори дата и час.'
      : lang === 'ru'
        ? 'После оплаты консультация появится в админ панели как оплаченная заявка. Эксперт свяжется с клиентом, чтобы согласовать дату и время.'
      : 'After payment, the consultation will appear in the admin panel as a paid request. The expert will contact the client to schedule the meeting.';
  const selectedSessionLabel = lang === 'bg' ? 'избрана сесия' : lang === 'ru' ? 'выбранная консультация' : 'selected session';
  const paymentButtonText = lang === 'bg' ? 'Към плащане' : lang === 'ru' ? 'К оплате' : 'Continue to payment';

  const resetAndClose = () => {
    setErrors({});
    setName('');
    setEmail('');
    setAdditional('');
    setTermsAccepted(false);
    setPaymentError('');
    setIsStartingPayment(false);
    onClose();
  };

  const handleContinueToPayment = async () => {
    const newErrors: { name?: string; email?: string; terms?: string } = {};
    if (!name.trim()) newErrors.name = t.errorRequired || 'Required';
    if (!email.trim() || !isValidEmail(email)) newErrors.email = t.errorEmail || 'Invalid email';
    if (!termsAccepted) newErrors.terms = t.errorTerms || 'Agreement is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setPaymentError('');
    setIsStartingPayment(true);

    try {
      const checkoutUrl = await createCheckoutSession({
        purchaseType: 'consultation',
        itemId: expert.id,
        sessionId: session.id,
        customerName: name,
        customerEmail: email,
        additional,
        lang,
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not start payment.');
      setIsStartingPayment(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.expertInfoColumn}>
            <div className={styles.expertDetails}>
              <div className={styles.breadcrumbs}>
                <span className={styles.crumbText}>{paymentTitle}</span>
              </div>

              <div className={styles.expertHeader}>
                <div className={styles.expertNameRow}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <g clipPath="url(#clip0_booking_expert)">
                      <path d="M3 16.5C3 14.9087 3.63214 13.3826 4.75736 12.2574C5.88258 11.1321 7.4087 10.5 9 10.5C10.5913 10.5 12.1174 11.1321 13.2426 12.2574C14.3679 13.3826 15 14.9087 15 16.5H3ZM9 9.75C6.51375 9.75 4.5 7.73625 4.5 5.25C4.5 2.76375 6.51375 0.75 9 0.75C11.4863 0.75 13.5 2.76375 13.5 5.25C13.5 7.73625 11.4863 9.75 9 9.75Z" fill="#1E1E20"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_booking_expert">
                        <rect width="18" height="18" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className={styles.nameText}>{expert.name}</span>
                </div>
                <div className={styles.expertRoleRow}>
                  <span className={styles.roleText}>{roleWithCompany}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.sessionInfoRow}>
                <div className={styles.sessionTextColumn}>
                  <div className={styles.sessionTitle}>{session.title}</div>
                  <div className={styles.sessionDetails}>
                    <div className={styles.subtitle}>{session.subtitle}</div>
                    <div className={styles.description}>{session.description}</div>
                  </div>
                </div>
                <div className={styles.sessionPrice}>€{session.price}</div>
              </div>
            </div>
            <div className={styles.divider} />
            <p className={styles.paymentNotice}>{paymentDescription}</p>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formHeader}>
              <div className={styles.title}>{t.contactDetails || 'Contact Details'}</div>
              <div className={styles.subtitle}>
                {t.contactDetailsDesc || 'Fill in the form below to continue.'}
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <div className={styles.label}>{t.nameLabel || 'Name*'}</div>
                  <input
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.error : ''}`}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                  />
                  {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.label}>{t.emailLabel || 'Email*'}</div>
                  <input
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.error : ''}`}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                  />
                  {errors.email && <div className={styles.errorText}>{errors.email}</div>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.label}>{t.additionalLabel || 'Additional'}</div>
                <textarea
                  className={styles.textarea}
                  placeholder={t.additionalPlaceholder || 'Describe your request or problem...'}
                  value={additional}
                  onChange={(event) => setAdditional(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.termsRow}>
              <div className={`${styles.checkbox} ${termsAccepted ? styles.checked : ''} ${errors.terms ? styles.error : ''}`}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => {
                    setTermsAccepted(event.target.checked);
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
                {t.termsAgree || 'I agree to the '}
                <a href={`/${lang}/terms`} onClick={(event) => event.stopPropagation()}>{t.termsLink || 'terms of use'}</a>
                {t.and || ' and '}
                <a href={`/${lang}/privacy`} onClick={(event) => event.stopPropagation()}>{t.privacyLink || 'privacy policy'}</a>
              </div>
            </div>
            {errors.terms && <div className={styles.errorText} style={{ marginTop: '-12px' }}>{errors.terms}</div>}
            {paymentError && <div className={styles.errorText} style={{ marginTop: '-12px' }}>{paymentError}</div>}
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.selectionInfo}>
            <div className={styles.selectionLabel}>{selectedSessionLabel}</div>
            <div className={styles.selectionValueRow}>
              <div className={styles.selectionText}>
                {session.title} · €{session.price}
              </div>
            </div>
          </div>
          <button className={styles.confirmBtn} onClick={handleContinueToPayment} disabled={isStartingPayment}>
            {paymentButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
