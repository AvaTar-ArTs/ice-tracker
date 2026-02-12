/**
 * Shared types for ICE Activity Tracker (v4).
 */

export interface IceNewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  state?: string;
  city?: string;
  source: "enforcement" | "breaking" | "state";
}

export interface EROOffice {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  area: string;
}

export type StateCoords = Record<string, [number, number]>;

export interface CommunityReport {
  id: string;
  state: string;
  city: string;
  description: string;
  createdAt: string;
}

export type FilterSource = "all" | "enforcement" | "breaking" | "state";
