export interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  timeToRead?: string;
  readTime?: string;
  imageUrl: string;
  excerpt?: string;
  authorName?: string;
  authorLabel?: string;
  authorId?: string;
  authorExpertId?: string;
  tags?: string[];
}
