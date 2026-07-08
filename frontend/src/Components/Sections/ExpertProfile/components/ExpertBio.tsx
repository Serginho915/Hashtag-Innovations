'use client';

import React, { useState } from 'react';
import styles from '../ExpertProfile.module.scss';
import { ExpertSection } from './ExpertSection.tsx';
import type { ExpertsTranslations } from '../../../../app/[lang]/experts/translations.ts';

interface Props {
  bio: string[];
  t: ExpertsTranslations;
}

type InlinePart = {
  text: string;
  marker?: 'bold' | 'italic';
};

const parseInlineMarkdown = (value: string): InlinePart[] => {
  const parts: InlinePart[] = [];
  const pattern = /(\*\*([^*]+)\*\*|_([^_]+)_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: value.slice(lastIndex, match.index) });
    }

    parts.push({
      text: match[2] || match[3] || '',
      marker: match[2] ? 'bold' : 'italic',
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    parts.push({ text: value.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ text: value }];
};

const renderInlineText = (value: string) =>
  parseInlineMarkdown(value).map((part, index) => {
    if (part.marker === 'bold') {
      return <strong key={`${part.text}-${index}`}>{part.text}</strong>;
    }

    if (part.marker === 'italic') {
      return <em key={`${part.text}-${index}`}>{part.text}</em>;
    }

    return <React.Fragment key={`${part.text}-${index}`}>{part.text}</React.Fragment>;
  });

const isHtmlBlock = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const renderBioBlock = (paragraph: string, idx: number, suffix = '') => {
  if (isHtmlBlock(paragraph)) {
    return (
      <div
        key={idx}
        className={styles.bioHtml}
        dangerouslySetInnerHTML={{ __html: paragraph }}
      />
    );
  }

  const lines = paragraph.split('\n');
  const isList = lines.some((line) => line.trim().startsWith('- '));

  if (isList) {
    const listItems = lines.map((line) => line.trim()).filter(Boolean);

    return (
      <ul key={idx} className={styles.bioList}>
        {listItems
          .map((line, lineIndex) => (
            <li key={`${line}-${lineIndex}`}>
              {renderInlineText(line.replace(/^-\s*/, ''))}
              {lineIndex === listItems.length - 1 ? suffix : ''}
            </li>
          ))}
      </ul>
    );
  }

  return (
    <p key={idx} className={styles.bioParagraph}>
      {renderInlineText(paragraph)}
      {suffix}
    </p>
  );
};

export const ExpertBio: React.FC<Props> = ({ bio, t }) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  if (!bio || bio.length === 0) return null;

  return (
    <ExpertSection title={t.background}>
      <div className={styles.bioContent}>
        {bio.slice(0, isBioExpanded ? undefined : 1).map((paragraph, idx) => (
          renderBioBlock(paragraph, idx, !isBioExpanded && idx === 0 && bio.length > 1 ? '...' : '')
        ))}
        {bio.length > 1 && (
          <button className={styles.showAllBtn} onClick={() => setIsBioExpanded(!isBioExpanded)}>
            {isBioExpanded ? (t.hideText || 'скрыть') : t.showAll || 'показать все'}
            <div className={`${styles.caret} ${isBioExpanded ? styles.caretUp : ''}`}></div>
          </button>
        )}
      </div>
    </ExpertSection>
  );
};
