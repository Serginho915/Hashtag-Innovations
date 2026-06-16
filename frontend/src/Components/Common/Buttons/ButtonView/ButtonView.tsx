import React from 'react';
import Image from 'next/image';
import styles from './ButtonView.module.scss';

interface ButtonViewProps {
  className?: string;
}

export const ButtonView: React.FC<ButtonViewProps> = ({ className }) => {
  return (
    <div className={`${styles.buttonView} ${className || ''}`}>
      <Image src="/buttonView.svg" alt="View" width={44} height={32} />
    </div>
  );
};
