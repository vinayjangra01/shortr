import axiosClient from '@/lib/axiosClient';
import type { ApiResult } from '@/types';

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

export type GetUrlsResponse = {
  success: boolean;
  message: string;
  data: {
    urls: Url[];
  };
};

export type CreateUrlResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    originalUrl: string;
    shortUrl: string;
    customUrl: string | null;
    title: string | null;
    createdAt: string;
  };
};

export type UpdateUrlResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    originalUrl: string;
    shortUrl: string;
    customUrl: string | null;
    title: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type AnalyticsResponse = {
  success: boolean;
  message: string;
  data: UrlAnalytics;
};

/**
 * Get all URLs for the authenticated user
 */
export const getUrls = async (): Promise<ApiResult<Url[]>> => {
  try {
    const res = await axiosClient.get<GetUrlsResponse>('/api/urls');
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data?.urls,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch URLs',
    };
  }
};

/**
 * Create a new short URL
 */
export const createUrl = async (
  params: CreateUrlParams
): Promise<ApiResult<CreateUrlResponse['data']>> => {
  try {
    const res = await axiosClient.post<CreateUrlResponse>('/api/urls', params);
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create URL',
    };
  }
};

/**
 * Update an existing URL
 */
export const updateUrl = async (
  id: number,
  params: UpdateUrlParams
): Promise<ApiResult<UpdateUrlResponse['data']>> => {
  try {
    const res = await axiosClient.put<UpdateUrlResponse>(
      `/api/urls/${id}`,
      params
    );
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update URL',
    };
  }
};

/**
 * Delete a URL
 */
export const deleteUrl = async (id: number): Promise<ApiResult<void>> => {
  try {
    const res = await axiosClient.delete(`/api/urls/${id}`);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete URL',
    };
  }
};

/**
 * Get analytics for a specific URL
 */
export const getUrlAnalytics = async (
  id: number
): Promise<ApiResult<UrlAnalytics>> => {
  try {
    const res = await axiosClient.get<AnalyticsResponse>(
      `/api/urls/${id}/analytics`
    );
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch analytics',
    };
  }
};

