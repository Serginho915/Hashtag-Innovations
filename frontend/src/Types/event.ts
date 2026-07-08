export interface UpcomingEventData {
  id: number;
  eventId?: string;
  eventHref?: string;
  title: string;
  speakerName: string;
  speakerExpertId?: string;
  description: string;
  dateIso: string;
  location: string;
}
