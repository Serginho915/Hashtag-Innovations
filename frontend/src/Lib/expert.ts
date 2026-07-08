import type { Expert } from '../Types/expert.ts';

const trimRoleConnector = (value: string) => value
  .trim()
  .replace(/\s+(at|в)$/iu, '')
  .trim();

export const formatExpertRoleCompany = (expert: Pick<Expert, 'role' | 'company'>, lang: string) => {
  const role = trimRoleConnector(expert.role || '');
  const company = String(expert.company || '').trim();

  if (role && company) {
    return `${role} ${lang === 'en' ? 'at' : 'в'} ${company}`;
  }

  return role || company;
};
