import React from "react";
import styles from "./DiscoverButton.module.scss";

interface DiscoverButtonProps {
  text: string;
  onClick?: () => void;
}

export const DiscoverButton = ({ text, onClick }: DiscoverButtonProps) => {
  return (
    <button className={styles.discoverButton} onClick={onClick}>
      <span className={styles.discoverText}>{text}</span>
      <div className={styles.discoverArrow}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.32131 1.33518C3.14425 1.33518 2.97445 1.26485 2.84925 1.13965C2.72405 1.01445 2.65371 0.844648 2.65371 0.667592C2.65371 0.490535 2.72405 0.320731 2.84925 0.195533C2.97445 0.0703353 3.14425 0 3.32131 0H11.3324C11.5095 0 11.6793 0.0703353 11.8045 0.195533C11.9297 0.320731 12 0.490535 12 0.667592V8.67869C12 8.85575 11.9297 9.02555 11.8045 9.15075C11.6793 9.27595 11.5095 9.34628 11.3324 9.34628C11.1554 9.34628 10.9855 9.27595 10.8603 9.15075C10.7352 9.02555 10.6648 8.85575 10.6648 8.67869V2.27871L1.1227 11.8208C0.996151 11.9388 0.828767 12.0029 0.655815 11.9999C0.482863 11.9968 0.317847 11.9268 0.195533 11.8045C0.0732186 11.6822 0.00315554 11.5171 0.000104008 11.3442C-0.00294752 11.1712 0.0612507 11.0038 0.179174 10.8773L9.72129 1.33518H3.32131Z" fill="white"/>
        </svg>
      </div>
    </button>
  );
};
