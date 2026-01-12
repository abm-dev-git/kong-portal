import { useState, useEffect, useCallback } from 'react';
import { createApiClient } from '../api-client';

/**
 * LinkedIn Connection type returned from the API
 */
export interface LinkedInConnection {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  headline?: string;
  profileUrl: string;
  profileImageUrl?: string;
  company?: string;
  title?: string;
  connectedAt?: string;
  email?: string | null;
}

export interface LinkedInConnectionsResponse {
  connections: LinkedInConnection[];
  total: number;
  hasMore: boolean;
}

interface UseLinkedInConnectionsOptions {
  limit?: number;
  sort?: 'recent' | 'active' | 'alphabetical';
}

/**
 * Hook to fetch user's LinkedIn connections
 *
 * NOTE: This hook requires the backend endpoint GET /v1/linkedin-connection/connections
 * which may not be implemented yet. Falls back gracefully when endpoint doesn't exist.
 */
export function useLinkedInConnections(
  token?: string,
  orgId?: string,
  options: UseLinkedInConnectionsOptions = {}
) {
  const { limit = 10, sort = 'recent' } = options;

  const [data, setData] = useState<LinkedInConnectionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConnections = useCallback(async () => {
    if (!token || typeof window === 'undefined') {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(token, orgId);
      const queryParams = new URLSearchParams({
        limit: limit.toString(),
        sort,
      });

      const result = await api.get<LinkedInConnectionsResponse>(
        `/v1/linkedin-connection/connections?${queryParams.toString()}`
      );

      if (result.success && result.data) {
        setData(result.data);
      } else {
        // API might not exist yet - fail gracefully
        setData(null);
        if (result.error) {
          // Only set error if it's not a 404 (endpoint not found)
          if (result.error.code !== 'NOT_FOUND') {
            setError(new Error(result.error.message || 'Failed to fetch connections'));
          }
        }
      }
    } catch (err) {
      // Endpoint might not exist - fail gracefully
      console.warn('LinkedIn connections API not available:', err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, orgId, limit, sort]);

  useEffect(() => {
    if (token) {
      fetchConnections();
    }
  }, [token, fetchConnections]);

  return {
    data,
    connections: data?.connections || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    isLoading,
    error,
    refetch: fetchConnections,
  };
}
