import type { TextbookItem } from '../../../Types/textbook.ts';

const normalizeAnchorValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '');

export const getMaterialAnchorId = (material: Pick<TextbookItem, 'id' | 'title'>) => {
  const normalized = normalizeAnchorValue(material.id || material.title);

  return normalized.startsWith('material-') ? normalized : `material-${normalized}`;
};

export const getMaterialAnchorHref = (material: Pick<TextbookItem, 'id' | 'title'>, lang: string) =>
  `/${lang}/learn#${getMaterialAnchorId(material)}`;
