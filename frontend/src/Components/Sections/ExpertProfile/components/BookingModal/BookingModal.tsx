import React, { useState, useMemo } from 'react';
import { Expert } from '../../../../../Types/expert';
import { Modal } from '../../../../UI/Modal/Modal';
import styles from './BookingModal.module.scss';

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
  t: Record<string, string>;
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const locale = getLocale(lang);

  // Generate 7 days starting from tomorrow
  const days = useMemo(() => {
    const list = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start tomorrow

    const availableDates = expert.availableDates || [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      const name = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d);
      const number = d.getDate().toString();

      list.push({
        dateStr: isoDate,
        name,
        number,
        disabled: availableDates.length > 0 ? !availableDates.includes(isoDate) : false, // If no availableDates defined, enable all for testing
      });
    }
    return list;
  }, [expert.availableDates, locale]);

  // Current month/year display
  const monthYearDisplay = useMemo(() => {
    return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date());
  }, [locale]);

  const times = expert.availableTimes || ['13:00', '14:00', '15:00'];

  const handleConfirm = () => {
    console.log('Confirmed booking:', {
      expertId: expert.id,
      sessionId: session.id,
      date: selectedDate,
      time: selectedTime,
    });
    onClose();
  };

  const getSelectedDateTimeStr = () => {
    if (!selectedDate || !selectedTime) return t.selectDateTimePrompt || 'Select date and time';
    const d = new Date(selectedDate);
    const dateStr = new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(d);
    return `${dateStr} · ${selectedTime}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        
        {/* Top Content Row */}
        <div className={styles.topSection}>
          
          {/* Left Column: Expert & Session Info */}
          <div className={styles.expertInfoColumn}>
            <div className={styles.expertDetails}>
              <div className={styles.breadcrumbs}>
                <span className={styles.crumbText}>{t.dateTime || 'Date and Time /'}</span>
              </div>
              
              <div className={styles.expertHeader}>
                <div className={styles.expertNameRow}>
                  <div style={{ width: 18, height: 18, background: '#1E1E20' }} />
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

          {/* Right Column: Calendar */}
          <div className={styles.calendarColumn}>
            <div className={styles.calendarHeader}>
              <div className={styles.title}>{t.selectDateTime || 'Select an available time and date'}</div>
              <div className={styles.subtitle}>{t.bookingInfo || 'Booking & cancellation available up to 48 hours before.'}</div>
            </div>
            
            <div className={styles.calendarBody}>
              <div className={styles.monthRow}>
                <div className={styles.monthName} style={{textTransform: 'capitalize'}}>{monthYearDisplay}</div>
                <button className={styles.arrowBtn}>
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 11L6.5 6L1.5 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className={styles.daysGrid}>
                {days.map((day) => (
                  <div 
                    key={day.dateStr}
                    className={`${styles.dayCard} ${day.disabled ? styles.disabled : ''} ${selectedDate === day.dateStr ? styles.selected : ''}`}
                    onClick={() => !day.disabled && setSelectedDate(day.dateStr)}
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
        </div>

        {/* Bottom Selection Bar */}
        <div className={styles.bottomSection}>
          <div className={styles.selectionInfo}>
            <div className={styles.selectionLabel}>{t.selectedTimeLabel || 'selected time'}</div>
            <div className={styles.selectionValueRow}>
              <div className={styles.iconSquare} />
              <div className={styles.selectionText} style={{textTransform: 'uppercase'}}>
                {getSelectedDateTimeStr()}
              </div>
            </div>
          </div>
          <button 
            className={styles.confirmBtn}
            disabled={!selectedDate || !selectedTime}
            onClick={handleConfirm}
          >
            {t.confirm || 'Confirm'}
          </button>
        </div>

      </div>
    </Modal>
  );
};
