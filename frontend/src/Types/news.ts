export interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  displayDate?: string;
  timeToRead?: string;
  readTime?: string;
  imageUrl: string;
  excerpt?: string;
  lead?: string;
  bodySections?: Array<{
    title?: string;
    paragraphs: string[];
  }>;
  promotedLabel?: string;
  hashtags?: string[];
  authorName?: string;
  authorLabel?: string;
  authorId?: string;
  authorExpertId?: string;
  authorAvatarUrl?: string;
  tags?: string[];
}
