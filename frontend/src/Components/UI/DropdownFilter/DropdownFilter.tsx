"use client";

import React, { ReactNode, useState, useRef, useEffect } from 'react';
import styles from './DropdownFilter.module.scss';

export interface DropdownOption {
  label: string;
  value: string | null;
}

interface DropdownFilterProps {
  label: string;
  options?: Array<string | DropdownOption>;
  value?: string | null;
  variant?: 'compact' | 'events';
  children?: ReactNode;
  onSelect?: (value: string | null, label: string) => void;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({ label, options = [], value, variant = 'compact', children, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentValue = value !== undefined ? value : selected;
  const normalizedOptions = options.map((option) => (
    typeof option === 'string' ? { label: option, value: option } : option
  ));
  const selectedOption = normalizedOptions.find((option) => option.value === currentValue);
  const displayValue = selectedOption?.label || currentValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option.value);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.value, option.label);
    }
  };

  return (
    <div className={`${styles.dropdownContainer} ${styles[variant]}`} ref={dropdownRef}>
      <div className={styles.selectBox} onClick={() => setIsOpen(!isOpen)}>
        <div className={`${styles.selectText} ${isOpen ? styles.hasValue : ''}`}>{displayValue || label}</div>
        <div className={styles.arrowIconWrapper}>
          <svg
            className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1.5L6 6.5L11 1.5" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {isOpen && normalizedOptions.length > 0 && (
        <ul className={styles.dropdownMenu}>
          {normalizedOptions.map((option, index) => {
            const isSelected = option.value === currentValue;
            return (
            <li
              key={index} 
              className={`${styles.optionItem} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleSelect(option)}
            >
              {isSelected && <div className={styles.activeDot}></div>}
              {option.label}
            </li>
            );
          })}
        </ul>
      )}

      {isOpen && children && (
        <div className={styles.dropdownMenu}>
          {children}
        </div>
      )}
    </div>
  );
};
