import styles from "./LegalPage.module.scss";
import { getLegalDocument, LegalPageKey } from "./legalContent.ts";

interface LegalPageProps {
  lang: string;
  pageKey: LegalPageKey;
}

export const LegalPage = ({ lang, pageKey }: LegalPageProps) => {
  const document = getLegalDocument(lang, pageKey);

  return (
    <article className={styles.legalPage}>
      <p className={styles.eyebrow}>{document.eyebrow}</p>
      <h1 className={styles.title}>{document.title}</h1>
      <p className={styles.updated}>{document.updated}</p>
      <p className={styles.intro}>{document.intro}</p>

      <div className={styles.sections}>
        {document.sections.map((section) => (
          <section className={styles.section} key={section.title}>
            <h2>{section.title}</h2>
            {section.body && <p>{section.body}</p>}
            {section.items && (
              <ul className={styles.list}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
};
