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
  category?: string;
  price?: string;
  badge?: string;
  isTrending?: boolean;
  createdAt?: string;
}
