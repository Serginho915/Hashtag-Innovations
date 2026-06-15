"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './DropdownFilter.module.scss';

interface DropdownFilterProps {
  label: string;
  options: string[];
  onSelect?: (option: string) => void;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.selectBox} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.selectText}>{selected || label}</div>
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

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <div 
              key={index} 
              className={`${styles.optionItem} ${selected === option ? styles.selected : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
