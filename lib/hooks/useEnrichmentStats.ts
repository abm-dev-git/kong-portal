import { useState, useEffect, useCallback } from 'react';
import { createApiClient } from '../api-client';

/**
 * Enrichment statistics returned from the API
 */
export interface EnrichmentStats {
  hasCompletedEnrichment: boolean;
  totalCompleted: number;
  totalFailed: number;
}

/**
 * Hook to fetch enrichment statistics for the current organization
 *
 * Used to determine if user has completed their first enrichment,
 * which controls visibility of the Getting Started card.
 */
export function useEnrichmentStats(token?: string, orgId?: string) {
  const [data, setData] = useState<EnrichmentStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!token || typeof window === 'undefined') {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(token, orgId);
      const result = await api.get<EnrichmentStats>('/v1/enrichments/stats');

      if (result.success && result.data) {
        setData(result.data);
      } else {
        // Endpoint might not exist yet - fail gracefully
        // Default to false so Getting Started card shows
        setData({
          hasCompletedEnrichment: false,
          totalCompleted: 0,
          totalFailed: 0,
        });
        if (result.error && result.error.code !== 'NOT_FOUND') {
          setError(new Error(result.error.message || 'Failed to fetch enrichment stats'));
        }
      }
    } catch (err) {
      console.warn('Enrichment stats API not available:', err);
      // Default to showing Getting Started card
      setData({
        hasCompletedEnrichment: false,
        totalCompleted: 0,
        totalFailed: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, orgId]);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token, fetchStats]);

  return {
    data,
    hasCompletedEnrichment: data?.hasCompletedEnrichment ?? false,
    totalCompleted: data?.totalCompleted ?? 0,
    totalFailed: data?.totalFailed ?? 0,
    isLoading,
    error,
    refetch: fetchStats,
  };
}
