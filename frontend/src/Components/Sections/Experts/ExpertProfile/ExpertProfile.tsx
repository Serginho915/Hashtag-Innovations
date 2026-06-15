import React from 'react';
import Image from 'next/image';
import { Expert } from '../../../../Types/expert';
import styles from './ExpertProfile.module.scss';
import Link from 'next/link';
import { CatalogExpertCard } from '../CatalogExpertCard/CatalogExpertCard';

interface ExpertProfileProps {
  expert: Expert;
  similarExperts: Expert[];
  t: Record<string, string>;
  lang: string;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ expert, similarExperts, t, lang }) => {
  return (
    <div className={styles.profileWrapper}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link href={`/${lang}`} className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.separator}>/</span>
        <Link href={`/${lang}/experts`} className={styles.breadcrumbLink}>Experts</Link>
        <span className={styles.separator}>/</span>
        <span className={styles.currentBreadcrumb}>{expert.name}</span>
      </div>

      {/* Header */}
      <div className={styles.headerBlock}>
        <div className={styles.imageWrapper}>
          <Image src={expert.imageUrl} alt={expert.name} fill className={styles.expertImage} />
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.titleGroup}>
            <h1 className={styles.expertName}>{expert.name}</h1>
            <div className={styles.expertRole}>
              <span className={styles.roleText}>{expert.role}</span>
              <span className={styles.companyText}>{expert.company}</span>
            </div>
          </div>
          <div className={styles.quoteBlock}>
            <div className={styles.quoteIcon}></div>
            <p className={styles.quoteText}>{expert.quote}</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Background */}
          {expert.bio && expert.bio.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t.background}</h2>
              </div>
              <div className={styles.bioContent}>
                {expert.bio.map((paragraph, index) => (
                  <p key={index} className={styles.bioParagraph}>{paragraph}</p>
                ))}
                <button className={styles.showAllBtn}>
                  {t.showAll} <span className={styles.caret}></span>
                </button>
              </div>
            </div>
          )}

          {/* Experience */}
          {expert.experienceList && expert.experienceList.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t.experienceLabel}</h2>
                <span className={styles.viewAllText}>{t.allText}</span>
              </div>
              <div className={styles.experienceList}>
                {expert.experienceList.map(exp => (
                  <div key={exp.id} className={styles.experienceItem}>
                    <div className={styles.expRole}>{exp.role}</div>
                    <div className={styles.expDetails}>
                      <span className={styles.expCompany}>{exp.company}</span>
                      <span className={styles.expPeriod}>{exp.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fluent In */}
          {expert.languages && expert.languages.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t.fluentIn}</h2>
              </div>
              <div className={styles.languagesList}>
                {expert.languages.map(lang => (
                  <div key={lang} className={styles.languageItem}>
                    <div className={styles.flagIcon}></div>
                    <span className={styles.langName}>{lang}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics */}
          {expert.analytics && (
            <div className={styles.section}>
              <div className={styles.analyticsHeader}>
                <span className={styles.analyticsIcon}></span>
                <h2 className={styles.analyticsTitle}>{t.profileAnalytics}</h2>
              </div>
              <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                  <div className={styles.analyticsValue}>{expert.analytics.consultations}</div>
                  <div className={styles.analyticsLabel}>{t.consultationsCompleted}</div>
                </div>
                <div className={styles.analyticsCard}>
                  <div className={styles.analyticsValue}>{expert.analytics.attendance}</div>
                  <div className={styles.analyticsLabel}>{t.sessionAttendance}</div>
                </div>
                <div className={styles.analyticsCardRow}>
                  <div className={styles.analyticsValue}>{expert.analytics.experienceYears}</div>
                  <div className={styles.analyticsLabel}>{t.yearsOfExperience}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Sessions */}
          {expert.sessions && expert.sessions.length > 0 && (
            <div className={styles.sessionsBlock}>
              <div className={styles.sectionHeader}>
                <div className={styles.headerDot}></div>
                <h2 className={styles.sectionTitle}>{t.availableSessions}</h2>
              </div>
              <div className={styles.sessionsList}>
                {expert.sessions.map(session => (
                  <div key={session.id} className={styles.sessionCard}>
                    <div className={styles.sessionInfo}>
                      <h3 className={styles.sessionTitle}>{session.title}</h3>
                      <div className={styles.sessionSubtitle}>{session.subtitle}</div>
                      <p className={styles.sessionDesc}>{session.description}</p>
                    </div>
                    <div className={styles.sessionFooter}>
                      <div className={styles.sessionPrice}>€{session.price}</div>
                      <button className={styles.bookBtn}>{t.bookNow}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expertise */}
          {expert.expertise && expert.expertise.length > 0 && (
            <div className={styles.tagsBlock}>
              <h3 className={styles.tagsLabel}>{t.expertiseLabel}</h3>
              <div className={styles.tagsList}>
                {expert.expertise.map((item, i) => (
                  <React.Fragment key={item}>
                    <div className={styles.tagItem}>{item}</div>
                    {i < expert.expertise!.length - 1 && <div className={styles.tagDot}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {expert.industries && expert.industries.length > 0 && (
            <div className={styles.tagsBlock}>
              <h3 className={styles.tagsLabel}>{t.industriesLabel}</h3>
              <div className={styles.tagsList}>
                {expert.industries.map(item => (
                  <div key={item} className={styles.industryItem}>{item}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Experts */}
      {similarExperts && similarExperts.length > 0 && (
        <div className={styles.similarExpertsBlock}>
          <div className={styles.similarHeader}>
            <h2 className={styles.similarTitle}>{t.similarExperts}</h2>
            <div className={styles.similarActions}>
              <div className={styles.carouselArrows}>
                <button className={styles.arrowBtn}>&lt;</button>
                <button className={styles.arrowBtn}>&gt;</button>
              </div>
              <Link href={`/${lang}/experts`} className={styles.browseAllBtn}>
                {t.browseAll}
                <span className={styles.browseIcon}></span>
              </Link>
            </div>
          </div>
          <div className={styles.similarCardsContainer}>
            {similarExperts.map(simExpert => (
              <div key={simExpert.id} className={styles.similarCardWrapper}>
                <CatalogExpertCard 
                  expert={simExpert} 
                  lang={lang} 
                  availableForLabel={lang === 'bg' ? 'Свободен за:' : lang === 'ru' ? 'Доступно для:' : 'Available for:'} 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertProfile;
