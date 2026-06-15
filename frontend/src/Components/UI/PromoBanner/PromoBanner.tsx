import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './PromoBanner.module.scss';

export interface PromoBannerProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  content?: React.ReactNode;
  imageUrl?: string;
  href?: string;
  className?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  subtitle,
  content,
  imageUrl,
  href,
  className = '',
}) => {
  const Wrapper = href ? Link : 'div';
  const wrapperProps = href 
    ? { href, className: `${styles.bannerWrapper} ${className}` } 
    : { className: `${styles.bannerWrapper} ${className}` };

  return (
    // @ts-ignore
    <Wrapper {...wrapperProps}>
      {(title || subtitle) && (
        <div className={styles.bannerHeader}>
          {title && <div className={styles.bannerTitle}>{title}</div>}
          {subtitle && <div className={styles.bannerSubtitle}>{subtitle}</div>}
        </div>
      )}
      <div className={styles.bannerContainer}>
        {imageUrl && (
          <Image 
            src={imageUrl} 
            alt="Banner" 
            fill 
            className={styles.bannerImage} 
          />
        )}
        {content && (
          <div className={styles.bannerContent}>
            {content}
          </div>
        )}
      </div>
    </Wrapper>
  );
};
