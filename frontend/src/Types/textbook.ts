export interface TextbookItem {
  id?: string;
  title: string;
  excerpt: string;
  authorLabel: string;
  authorName: string;
  authorExpertId?: string;
  imageUrl: string;
  pdfUrl: string;
  previewPdfUrl?: string;
  salesUrl?: string;
  category?: string;
  format?: string;
  price?: string;
  badge?: string;
  hasPreview?: boolean;
  isTrending?: boolean;
  createdAt?: string;
}
