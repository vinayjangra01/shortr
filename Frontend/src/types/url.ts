export type Url = {
  id: number;
  originalUrl: string;
  shortUrl: string;
  customUrl: string | null;
  title: string | null;
  visitCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateUrlParams = {
  originalUrl: string;
  customUrl?: string;
  title?: string;
};

export type UpdateUrlParams = {
  originalUrl: string;
  customUrl?: string;
  title?: string;
};

export type UrlAnalytics = {
  urlId: number;
  totalVisits: number;
  uniqueCountries: number;
  uniqueDevices: number;
  countries: string[];
  devices: string[];
  cities: string[];
};