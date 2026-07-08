export interface CommunitySpeaker {
  id: string;
  name: string;
  nameBg?: string;
  expertId?: string; // If present, the speaker is an expert and their name should be a link.
  role?: string;
  roleBg?: string;
  avatarSrc?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  titleBg?: string;
  speaker: CommunitySpeaker;
  description: string;
  descriptionBg?: string;
  date: string; // ISO 8601 string, e.g., "2026-05-20T10:00:00Z"
  displayDate: string; // Formatted date string for UI, e.g., "Friday, 20 May"
  displayDateBg?: string;
  location: string;
  locationBg?: string;
  imageSrc?: string;
  tags: string[]; // Array of tag IDs, e.g., ['recommended', 'business']
  price?: string;
  startTime?: string;
  detailDescription?: string;
  detailDescriptionBg?: string;
  speakers?: CommunitySpeaker[];
  organizers?: EventOrganization[];
  partners?: EventOrganization[];
}

export interface EventOrganization {
  id: string;
  name: string;
  logoSrc?: string;
}

export interface CommunityTag {
  id: string;
  label: string;
  showDot?: boolean;
}
