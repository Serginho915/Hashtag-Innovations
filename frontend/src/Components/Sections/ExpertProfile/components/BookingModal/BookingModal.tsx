import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Expert } from '../../../../../Types/expert.ts';
import { Modal } from '../../../../UI/Modal/Modal.tsx';
import { isValidEmail } from '../../../../../Lib/validation.ts';
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

const getLocale = (lang: string) => {
  if (lang === 'bg') return 'bg-BG';
  if (lang === 'ru') return 'ru-RU';
  return 'en-US';
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  expert,
  session,
  t,
  lang
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [additional, setAdditional] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{ date?: string; time?: string; name?: string; email?: string; terms?: string }>({});

  const locale = getLocale(lang);
  const daysGridRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (daysGridRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = daysGridRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [step]); // Re-check when step changes as display changes

  const scrollDays = (direction: 'left' | 'right') => {
    if (daysGridRef.current) {
      const scrollAmount = daysGridRef.current.offsetWidth;
      daysGridRef.current.scrollBy({ 
        left: direction === 'right' ? scrollAmount : -scrollAmount, 
        behavior: 'smooth' 
      });
      // We rely on onScroll event to update arrows after animation
    }
  };

  // Generate 14 days starting from tomorrow
  const days = useMemo(() => {
    const list = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start tomorrow

    const availableDates = expert.availableDates || [];

    for (let i = 0; i < 14; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const name = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
      const number = d.getDate().toString();

      list.push({
        dateStr: isoDate,
        name,
        number,
        disabled: availableDates.length > 0 ? !availableDates.includes(isoDate) : false,
      });
    }
    return list;
  }, [expert.availableDates, locale]);

  // Current month/year display
  const monthYearDisplay = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date());
  }, [locale]);

  const times = useMemo(() => {
    if (!selectedDate) return [];
    if (expert.availableTimes && !Array.isArray(expert.availableTimes)) {
      return (expert.availableTimes as Record<string, string[]>)[selectedDate] || ['13:00', '14:00', '15:00'];
    }
    return (expert.availableTimes as string[]) || ['13:00', '14:00', '15:00'];
  }, [expert.availableTimes, selectedDate]);

  const handleNextOrConfirm = () => {
    if (step === 1) {
      const newErrors: { date?: string; time?: string } = {};
      if (!selectedDate) newErrors.date = t.errorRequired || 'Required';
      if (!selectedTime) newErrors.time = t.errorRequired || 'Required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setStep(2);
    } else {
      const newErrors: { name?: string; email?: string; terms?: string } = {};
      if (!name.trim()) newErrors.name = t.errorRequired || 'Обязательное поле';
      if (!email.trim() || !isValidEmail(email)) newErrors.email = t.errorEmail || 'Некорректный email';
      if (!termsAccepted) newErrors.terms = t.errorTerms || 'Необходимо согласие';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      console.log('Confirmed booking:', {
        expertId: expert.id,
        sessionId: session.id,
        date: selectedDate,
        time: selectedTime,
        name,
        email,
        additional,
        termsAccepted
      });
      // Reset state & close
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setName('');
      setEmail('');
      setAdditional('');
      setTermsAccepted(false);
      onClose();
    }
  };

  const getSelectedDateTimeStr = () => {
    if (!selectedDate || !selectedTime) return t.selectDateTimePrompt || 'Select date and time';
    const d = new Date(selectedDate);
    const dateStr = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(d);
    return `${dateStr} · ${selectedTime}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {
      // If modal is closed, optionally reset to step 1
      setStep(1);
      setErrors({});
      onClose();
    }}>
      <div className={styles.container}>
        
        {/* Top Content Row */}
        <div className={styles.topSection}>
          
          {/* Left Column: Expert & Session Info */}
          <div className={styles.expertInfoColumn}>
            <div className={styles.expertDetails}>
              <div className={styles.breadcrumbs}>
                <span className={styles.crumbText} style={{ color: step === 2 ? '#0F0FFF' : 'black' }}>
                  {step === 2 ? (
                    <>
                      <span style={{ color: '#0F0FFF' }}>{t.dateTime || 'Date and Time /'}</span>
                      <span style={{ color: 'black', marginLeft: 4 }}>{t.contactDetails || 'Contact Details'}</span>
                    </>
                  ) : (
                    t.dateTime || 'Date and Time /'
                  )}
                </span>
              </div>
              
              <div className={styles.expertHeader}>
                <div className={styles.expertNameRow}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <g clipPath="url(#clip0_666_2485)">
                      <path d="M3 16.5C3 14.9087 3.63214 13.3826 4.75736 12.2574C5.88258 11.1321 7.4087 10.5 9 10.5C10.5913 10.5 12.1174 11.1321 13.2426 12.2574C14.3679 13.3826 15 14.9087 15 16.5H3ZM9 9.75C6.51375 9.75 4.5 7.73625 4.5 5.25C4.5 2.76375 6.51375 0.75 9 0.75C11.4863 0.75 13.5 2.76375 13.5 5.25C13.5 7.73625 11.4863 9.75 9 9.75Z" fill="#1E1E20"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_666_2485">
                        <rect width="18" height="18" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className={styles.nameText}>{expert.name}</span>
                </div>
                <div className={styles.expertRoleRow}>
                  <span className={styles.roleText}>{expert.role}</span>
                  <span className={styles.companyText}>{expert.company}</span>
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
          </div>

          {/* Right Column */}
          {step === 1 ? (
            <div className={styles.calendarColumn}>
              <div className={styles.calendarHeader}>
                <div className={styles.title}>{t.selectDateTime || 'Select an available time and date'}</div>
                <div className={styles.subtitle}>{t.bookingInfo || 'Booking & cancellation available up to 48 hours before.'}</div>
              </div>
              
              <div className={styles.calendarBody}>
                <div className={styles.monthRow}>
                  <div className={styles.monthName} style={{textTransform: 'capitalize'}}>{monthYearDisplay}</div>
                  <div className={styles.arrowsContainer}>
                    {canScrollLeft && (
                      <button 
                        className={styles.arrowBtn} 
                        onClick={() => scrollDays('left')}
                      >
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(180deg)' }}>
                          <path d="M1.5 11L6.5 6L1.5 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                    {canScrollRight && (
                      <button 
                        className={styles.arrowBtn} 
                        onClick={() => scrollDays('right')}
                      >
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.5 11L6.5 6L1.5 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.daysGrid} ref={daysGridRef} onScroll={checkScroll}>
                  {days.map((day) => (
                    <div 
                      key={day.dateStr}
                      className={`${styles.dayCard} ${day.disabled ? styles.disabled : ''} ${selectedDate === day.dateStr ? styles.selected : ''}`}
                      onClick={() => {
                        if (!day.disabled) {
                          setSelectedDate(day.dateStr);
                          setSelectedTime(null);
                        }
                      }}
                    >
                      <span className={styles.dayName} style={{textTransform: 'capitalize'}}>{day.name}</span>
                      <span className={styles.dayNumber}>{day.number}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.timeSection}>
                  <div className={styles.timeHeader}>
                    <span className={styles.timeLabel}>{t.timeLabel || 'Time'}</span>
                    <span className={styles.timeZone}>(UTC +3)</span>
                  </div>
                  <div className={styles.timeSlotsRow}>
                    {times.map((time) => (
                      <div 
                        key={time}
                        className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.formColumn}>
              <div className={styles.formHeader}>
                <div className={styles.title}>{t.contactDetails || 'Contact Details'}</div>
                <div className={styles.subtitle}>{t.contactDetailsDesc || 'Fill in the form below to complete the session booking.'}</div>
              </div>
              
              <div className={styles.formFields}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <div className={styles.label}>{t.nameLabel || 'Name*'}</div>
                    <input 
                      type="text" 
                      className={`${styles.input} ${errors.name ? styles.error : ''}`} 
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
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
                      onChange={(e) => {
                        setEmail(e.target.value);
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
                    onChange={(e) => setAdditional(e.target.value)}
                  />
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
                  {t.termsAgree || 'I agree to the '}
                  <a href="#" onClick={(e) => e.stopPropagation()}>{t.termsLink || 'terms of use'}</a>
                  {t.and || ' and '}
                  <a href="#" onClick={(e) => e.stopPropagation()}>{t.privacyLink || 'privacy policy'}</a>
                </div>
              </div>
              {errors.terms && <div className={styles.errorText} style={{ marginTop: '-12px' }}>{errors.terms}</div>}
            </div>
          )}
        </div>

        {/* Bottom Selection Bar */}
        <div className={styles.bottomSection}>
          <div className={styles.selectionInfo}>
            <div className={styles.selectionLabel}>{t.selectedTimeLabel || 'selected time'}</div>
            <div className={styles.selectionValueRow}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM15 5H9V7H7V5H4V9H20V5H17V7H15V5ZM20 11H4V19H20V11ZM6 14H8V16H6V14ZM10 14H18V16H10V14Z" fill="#1E1E20"/>
              </svg>
              <div className={styles.selectionText} style={{textTransform: 'uppercase'}}>
                {getSelectedDateTimeStr()}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flex: step === 2 ? 1 : 'none', maxWidth: step === 2 ? '681px' : 'none' }}>
            <button 
              className={styles.confirmBtn}
              onClick={handleNextOrConfirm}
              style={{ width: '100%' }}
            >
              {step === 1 ? (t.nextBtn || 'Next') : (t.confirmBtn || 'Confirm')}
            </button>
            {step === 1 && (errors.date || errors.time) && (
              <div className={styles.errorText} style={{ marginTop: '8px' }}>
                {t.selectDateTimePrompt || 'Select an available time and date'}
              </div>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
