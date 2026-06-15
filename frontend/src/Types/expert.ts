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
}
