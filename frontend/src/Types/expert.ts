export interface Session {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
}

export interface Analytics {
  consultations: string;
  attendance: string;
  experienceYears: string;
}

export interface Expert {
  id: string;
  name: string;
  role: string;
  company: string;
  imageUrl: string;
  quote: string;
  availableFor?: string[];
  expertise?: string[];
  price?: number;
  languages?: string[];
  
  // New profile fields
  industries?: string[];
  bio?: string[];
  sessions?: Session[];
  experienceList?: Experience[];
  analytics?: Analytics;
  availableDates?: string[]; // ISO format YYYY-MM-DD
  availableTimes?: string[] | Record<string, string[]>; // HH:mm format array or mapping from date to times
}
