import React, { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { Modal } from '../../../UI/Modal/Modal.tsx';
import type { TextbookItem } from '../../../../Types/textbook.ts';
import { isValidEmail } from '../../../../Lib/validation.ts';
import { createCheckoutSession } from '../../../../Lib/payments.ts';
import styles from './MaterialPurchaseModal.module.scss';
import { translations } from './translations.ts';

interface MaterialPurchaseModalProps {
  material: TextbookItem;
  isOpen: boolean;
  onClose: () => void;
  onPreview: () => void;
  lang: string;
  initialStep?: Step;
}

type Step = 'overview' | 'checkout';

type FormState = {
  name: string;
  email: string;
  acceptedTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const PdfIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.33 1.33h6.2L12.67 4.47v10.2H3.33V1.33Zm5.54 1.34v2.46h2.46L8.87 2.67ZM4.67 2.67v10.66h6.66V6.47H7.53v-3.8H4.67Z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M7.95 10.35L6.3375 8.7375C6.2 8.6 6.025 8.53125 5.8125 8.53125C5.6 8.53125 5.425 8.6 5.2875 8.7375C5.15 8.875 5.08125 9.05 5.08125 9.2625C5.08125 9.475 5.15 9.65 5.2875 9.7875L7.425 11.925C7.575 12.075 7.75 12.15 7.95 12.15C8.15 12.15 8.325 12.075 8.475 11.925L12.7125 7.6875C12.85 7.55 12.9188 7.375 12.9188 7.1625C12.9188 6.95 12.85 6.775 12.7125 6.6375C12.575 6.5 12.4 6.43125 12.1875 6.43125C11.975 6.43125 11.8 6.5 11.6625 6.6375L7.95 10.35ZM9 16.5C7.9625 16.5 6.9875 16.303 6.075 15.909C5.1625 15.515 4.36875 14.9808 3.69375 14.3063C3.01875 13.6318 2.4845 12.838 2.091 11.925C1.6975 11.012 1.5005 10.037 1.5 9C1.4995 7.963 1.6965 6.988 2.091 6.075C2.4855 5.162 3.01975 4.36825 3.69375 3.69375C4.36775 3.01925 5.1615 2.485 6.075 2.091C6.9885 1.697 7.9635 1.5 9 1.5C10.0365 1.5 11.0115 1.697 11.925 2.091C12.8385 2.485 13.6323 3.01925 14.3063 3.69375C14.9803 4.36825 15.5148 5.162 15.9098 6.075C16.3048 6.988 16.5015 7.963 16.5 9C16.4985 10.037 16.3015 11.012 15.909 11.925C15.5165 12.838 14.9823 13.6318 14.3063 14.3063C13.6303 14.9808 12.8365 15.5152 11.925 15.9097C11.0135 16.3042 10.0385 16.501 9 16.5Z" fill="#076F7F" />
  </svg>
);

export const MaterialPurchaseModal: React.FC<MaterialPurchaseModalProps> = ({
  material,
  isOpen,
  onClose,
  onPreview,
  lang,
  initialStep = 'overview',
}) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const canPreview = Boolean(material.previewPdfUrl);
  const [step, setStep] = useState<Step>(initialStep);
  const [formValues, setFormValues] = useState<FormState>({
    name: '',
    email: '',
    acceptedTerms: false,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [paymentError, setPaymentError] = useState('');
  const [isStartingPayment, setIsStartingPayment] = useState(false);

  const validateForm = (values: FormState) => {
    const nextErrors: FormErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = t.nameError;
    }

    if (!isValidEmail(values.email)) {
      nextErrors.email = t.emailError;
    }

    if (!values.acceptedTerms) {
      nextErrors.acceptedTerms = t.termsError;
    }

    return nextErrors;
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;
    const nextValues = {
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    } as FormState;

    setFormValues(nextValues);
    setPaymentError('');

    if (Object.keys(formErrors).length > 0) {
      setFormErrors(validateForm(nextValues));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(formValues);
    setFormErrors(nextErrors);
    setPaymentError('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!material.id) {
      setPaymentError('Material cannot be purchased right now.');
      return;
    }

    setIsStartingPayment(true);

    try {
      const checkoutUrl = await createCheckoutSession({
        purchaseType: 'learn_material',
        itemId: material.id,
        customerName: formValues.name,
        customerEmail: formValues.email,
        lang,
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not start payment.');
      setIsStartingPayment(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal} closeButtonClassName={styles.closeButton}>
      <div className={styles.shell}>
        <div className={styles.panel}>
          <nav className={styles.steps} aria-label="Material purchase steps">
            <button
              className={step === 'overview' ? styles.activeStep : undefined}
              type="button"
              onClick={() => setStep('overview')}
            >
              {t.overview}/
            </button>
            {step === 'checkout' && (
              <button className={styles.activeStep} type="button">
                {t.contactDetails}
              </button>
            )}
          </nav>

          {step === 'overview' ? (
            <div className={styles.overview}>
              <div className={styles.heroImage}>
                <Image src={material.imageUrl} alt={material.title} fill className={styles.image} sizes="456px" />
              </div>

              <div className={styles.summary}>
                <h2>{material.title}</h2>
                <p>{material.excerpt}</p>
              </div>

              <section className={styles.contents}>
                <h3>{t.fileContents}</h3>
                <ul>
                  {t.contents.map((item) => (
                    <li key={item}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className={styles.purchaseMeta}>
                <div>
                  <span>{t.author}</span>
                  <strong>{material.authorName}</strong>
                </div>
                <div>
                  <span>{t.price}</span>
                  <strong>{material.price}</strong>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.secondaryAction} type="button" onClick={onPreview} disabled={!canPreview}>
                  {t.preview}
                </button>
                <button className={styles.primaryAction} type="button" onClick={() => setStep('checkout')}>{t.get}</button>
              </div>
            </div>
          ) : (
            <form className={styles.checkout} onSubmit={handleSubmit} noValidate>
              <div className={styles.checkoutTop}>
                <div className={styles.thumb}>
                  <Image src={material.imageUrl} alt={material.title} fill className={styles.image} sizes="225px" />
                  <span className={styles.pdfBadge}>
                    <PdfIcon />
                    {material.badge || 'PDF'}
                  </span>
                </div>
                <div className={styles.checkoutIntro}>
                  <h2>{material.title}</h2>
                  <p>{material.excerpt}</p>
                </div>
              </div>

              <section className={styles.formBlock}>
                <div className={styles.formHeader}>
                  <h3>{t.contactTitle}</h3>
                  <p>{t.contactText}</p>
                </div>

                <label className={styles.field}>
                  <span>{t.name}</span>
                  <input
                    name="name"
                    placeholder={t.namePlaceholder}
                    value={formValues.name}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(formErrors.name)}
                    required
                  />
                  {formErrors.name && <small>{formErrors.name}</small>}
                </label>

                <label className={styles.field}>
                  <span>{t.email}</span>
                  <input
                    name="email"
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={formValues.email}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(formErrors.email)}
                    required
                  />
                  {formErrors.email && <small>{formErrors.email}</small>}
                </label>

                <label className={styles.terms}>
                  <input
                    name="acceptedTerms"
                    type="checkbox"
                    checked={formValues.acceptedTerms}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(formErrors.acceptedTerms)}
                    required
                  />
                  <span>
                    {t.termsStart} <a href={`/${lang}/terms`}>{t.terms}</a> {t.and} <a href={`/${lang}/privacy`}>{t.privacy}</a>
                  </span>
                </label>
                {formErrors.acceptedTerms && <small className={styles.termsError}>{formErrors.acceptedTerms}</small>}
                {paymentError && <small className={styles.termsError}>{paymentError}</small>}
              </section>

              <div className={styles.totalRow}>
                <span>{t.total}</span>
                <strong>{material.price}</strong>
              </div>

              <button className={styles.primaryAction} type="submit" disabled={isStartingPayment}>
                {isStartingPayment ? t.payment : t.payment}
              </button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
};
