export interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  displayDate?: string;
  imageUrl: string;
  excerpt?: string;
  lead?: string;
  bodySections?: Array<{
    title?: string;
    paragraphs?: string[];
    html?: string;
  }>;
  hashtags?: string[];
  authorName?: string;
  authorLabel?: string;
  authorId?: string;
  authorExpertId?: string;
  authorAvatarUrl?: string;
  tags?: string[];
}
