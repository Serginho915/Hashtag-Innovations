export interface CommunitySpeaker {
  id: string;
  name: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  speaker: CommunitySpeaker;
  description: string;
  date: string; // ISO 8601 string, e.g., "2026-05-20T10:00:00Z"
  displayDate: string; // Formatted date string for UI, e.g., "Friday, 20 May"
  location: string;
  imageSrc?: string;
  tags: string[]; // Array of tag IDs, e.g., ['recommended', 'business']
}

export interface CommunityTag {
  id: string;
  label: string;
  showDot?: boolean;
}
