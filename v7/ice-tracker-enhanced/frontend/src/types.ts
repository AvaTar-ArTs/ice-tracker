// types.ts

export interface Location {
  id: number;
  name: string;
  type: 'city' | 'county' | 'state' | 'country';
  latitude: number | null;
  longitude: number | null;
  stateCode: string | null;
  countryCode: string;
  population: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Source {
  id: number;
  name: string;
  url: string;
  sourceType: 'rss' | 'api' | 'website' | 'social_media';
  isActive: boolean;
  lastFetched: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Keyword {
  id: number;
  term: string;
  category: string;
  frequency: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string | null;
  link: string;
  pubDate: string;
  sourceId: number;
  confidenceScore: number;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  source?: Source;
  locations?: Location[];
  keywords?: Keyword[];
}

export interface ActivityFilters {
  page: number;
  limit: number;
  startDate: string | null;
  endDate: string | null;
  locationId: number | null;
  sourceId: number | null;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ActivityResponse {
  success: boolean;
  data: {
    activities: Activity[];
    pagination: Pagination;
  };
}

export interface AnalyticsData {
  trends: any[];
  locationDistribution: any[];
  keywordFrequency: any[];
  monthlySummary: any[];
  heatmapData: any[];
}