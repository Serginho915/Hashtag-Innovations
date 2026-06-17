import React from 'react';
import { EventOrganization } from '../../../../Types/community.ts';
import styles from './EventOrganizationsBlock.module.scss';

interface EventOrganizationGroup {
  label: string;
  items: EventOrganization[];
}

interface EventOrganizationsBlockProps {
  groups: EventOrganizationGroup[];
}

export const EventOrganizationsBlock: React.FC<EventOrganizationsBlockProps> = ({ groups }) => {
  const visibleGroups = groups.filter((group) => group.items.length > 0);

  if (!visibleGroups.length) {
    return null;
  }

  return (
    <section className={styles.organizations}>
      {visibleGroups.map((group) => (
        <div key={group.label} className={styles.organizationRow}>
          <div className={styles.organizationLabel}>{group.label}</div>
          <ul className={styles.organizationList}>
            {group.items.map((item) => (
              <li key={item.id} className={styles.organizationItem}>
                {item.logoSrc ? (
                  <img className={styles.organizationLogo} src={item.logoSrc} alt="" />
                ) : (
                  <span className={styles.organizationLogo} aria-hidden="true" />
                )}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
