'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useOrganization } from '@clerk/nextjs';

/**
 * DevLogin-aware authentication hook
 *
 * Provides unified auth state that works with both Clerk JWT and DevLogin bypass.
 * In DevLogin mode (for E2E testing), it bypasses Clerk token requirements and
 * uses the devlogin cookie for API authentication.
 *
 * Usage:
 * ```typescript
 * const { token, orgId, isReady, isDevLogin, getAuthHeaders } = useDevLoginAuth();
 *
 * if (!isReady) return <Loading />;
 *
 * // Use getAuthHeaders() for API calls to get correct auth headers
 * ```
 */
export function useDevLoginAuth() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();

  const [clerkToken, setClerkToken] = useState<string | null>(null);
  const [isClerkLoading, setIsClerkLoading] = useState(true);
  const [devLoginKey, setDevLoginKey] = useState<string | null>(null);
  const [isDevLoginEnabled, setIsDevLoginEnabled] = useState(false);

  // Check if DevLogin is enabled (client-side check via env var and cookie)
  useEffect(() => {
    const enabled = process.env.NEXT_PUBLIC_DEVLOGIN_ENABLED === 'true';
    setIsDevLoginEnabled(enabled);

    if (enabled && typeof document !== 'undefined') {
      // Parse cookies to find devlogin cookie
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'devlogin' && value) {
          setDevLoginKey(decodeURIComponent(value));
          break;
        }
      }
    }
  }, []);

  // Try to get Clerk token (may fail in DevLogin mode which is expected)
  useEffect(() => {
    let mounted = true;

    const fetchToken = async () => {
      try {
        const token = await getToken();
        if (mounted) {
          setClerkToken(token);
        }
      } catch {
        // Expected to fail in DevLogin mode - no Clerk session
        if (mounted) {
          setClerkToken(null);
        }
      } finally {
        if (mounted) {
          setIsClerkLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  // Determine if we're using DevLogin mode
  const isDevLogin = isDevLoginEnabled && !!devLoginKey && !clerkToken;

  // Authentication is ready when either:
  // 1. We have a Clerk token, OR
  // 2. We have a DevLogin key and DevLogin is enabled
  const isReady = !isClerkLoading && (!!clerkToken || isDevLogin);

  // The token to use for API calls (null in DevLogin mode - use headers instead)
  const token = clerkToken || (isDevLogin ? 'DEVLOGIN' : null);

  // Organization ID - from Clerk or default for DevLogin
  const orgId = organization?.id || (isDevLogin ? '00000000-0000-0000-0000-000000000001' : undefined);

  // Get auth headers for API calls
  const getAuthHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (clerkToken) {
      headers['Authorization'] = `Bearer ${clerkToken}`;
    } else if (isDevLogin && devLoginKey) {
      headers['X-DevLogin-Key'] = devLoginKey;
    }

    if (orgId) {
      headers['x-org-id'] = orgId;
    }

    return headers;
  }, [clerkToken, isDevLogin, devLoginKey, orgId]);

  return {
    /** The Clerk token (null in DevLogin mode) */
    token,
    /** The actual Clerk token or null */
    clerkToken,
    /** The DevLogin key or null */
    devLoginKey,
    /** Organization ID */
    orgId,
    /** Whether DevLogin mode is active */
    isDevLogin,
    /** Whether auth is ready (has valid Clerk token or DevLogin) */
    isReady,
    /** Whether still loading auth state */
    isLoading: !isReady,
    /** Get headers for API calls with proper auth */
    getAuthHeaders,
  };
}
