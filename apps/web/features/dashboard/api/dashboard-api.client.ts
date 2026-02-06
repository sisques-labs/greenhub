/**
 * Dashboard API Client
 * Handles HTTP requests to Next.js API routes for dashboard/overview
 */

import { httpClient } from '@/lib/client/http-client';
import type { OverviewResponse } from './types';

export const dashboardApiClient = {
  /**
   * Get overview/dashboard data
   */
  getOverview: async (): Promise<OverviewResponse> => {
    return httpClient.get<OverviewResponse>('/api/dashboard/overview');
  },
};
