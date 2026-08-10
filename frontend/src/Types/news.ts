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
  seo?: {
    meta_title?: string;
    meta_description?: string;
    url_slug?: string;
  };
  faq?: Array<{
    question?: string;
    answer?: string;
  }>;
  sources?: Array<{
    title?: string;
    publisher?: string;
    url?: string;
    note?: string;
  }>;
  statistics?: Array<{
    label?: string;
    value?: string;
    source?: string;
    url?: string;
  }>;
  imageIdeas?: string[];
  socialTitles?: string[];
  linkedinPost?: string;
  facebookPost?: string;
  internalLinks?: string[];
  externalLinks?: Array<{
    title?: string;
    publisher?: string;
    url?: string;
    note?: string;
  }>;
  hashtags?: string[];
  authorName?: string;
  authorLabel?: string;
  authorId?: string;
  authorExpertId?: string;
  authorAvatarUrl?: string;
  tags?: string[];
}
