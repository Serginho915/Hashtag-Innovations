export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  organization?: string;
  tags?: string[];
  code: string;
  date: string;
  dateIso?: string;
  imageUrl: string;
  href?: string;
}
