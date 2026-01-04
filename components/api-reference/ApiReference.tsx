'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Key, Loader2 } from 'lucide-react';

interface ApiReferenceProps {
  specUrl?: string;
}

export function ApiReference({ specUrl = '/api/openapi' }: ApiReferenceProps) {
  const { getToken, isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [authStatus, setAuthStatus] = useState<'loading' | 'none' | 'injected' | 'error'>('loading');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mountedRef = useRef(true);

  // Track if auth has stabilized (prevent flickering during initial load)
  const authStabilized = isAuthLoaded && isUserLoaded;

  const injectAuthToken = useCallback(async () => {
    if (!mountedRef.current) return;

    if (!isSignedIn) {
      setAuthStatus('none');
      return;
    }

    try {
      const token = await getToken();
      if (!mountedRef.current) return;

      if (token && iframeRef.current?.contentWindow) {
        // Send the token to the iframe via postMessage
        iframeRef.current.contentWindow.postMessage(
          { type: 'AUTH_TOKEN', token: `Bearer ${token}` },
          window.location.origin
        );
        setAuthStatus('injected');
        setLastUpdated(new Date());
      }
    } catch (error) {
      if (!mountedRef.current) return;
      console.error('Failed to inject auth token:', error);
      setAuthStatus('error');
    }
  }, [isSignedIn, getToken]);

  // Inject token when iframe loads
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    if (authStabilized && isSignedIn) {
      // Small delay to ensure iframe is ready
      setTimeout(injectAuthToken, 500);
    }
  }, [authStabilized, isSignedIn, injectAuthToken]);

  // Update auth status when auth state stabilizes
  useEffect(() => {
    if (authStabilized) {
      if (!isSignedIn) {
        setAuthStatus('none');
      } else if (iframeLoaded) {
        injectAuthToken();
      }
    }
  }, [authStabilized, isSignedIn, iframeLoaded, injectAuthToken]);

  // Refresh token every 50 minutes (Clerk tokens expire after 60 min)
  useEffect(() => {
    if (!isSignedIn) return;

    const interval = setInterval(injectAuthToken, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isSignedIn, injectAuthToken]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Show loading state while auth is stabilizing
  const isLoading = !authStabilized || authStatus === 'loading';

  return (
    <div className="space-y-4">
      {/* Auth Status Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <>
              <div className="p-2 rounded-full bg-[var(--turquoise)]/10">
                <Loader2 className="w-4 h-4 text-[var(--turquoise)] animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--cream)]">
                  Loading authentication...
                </p>
                <p className="text-xs text-[var(--cream)]/60">
                  Checking your session
                </p>
              </div>
            </>
          ) : isSignedIn ? (
            <>
              <div className="p-2 rounded-full bg-[var(--turquoise)]/10">
                <User className="w-4 h-4 text-[var(--turquoise)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--cream)]">
                  Authenticated as {user?.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-xs text-[var(--cream)]/60">
                  {authStatus === 'injected' && lastUpdated && (
                    <>Token injected into Try It console &bull; {lastUpdated.toLocaleTimeString()}</>
                  )}
                  {authStatus === 'error' && (
                    <span className="text-[var(--error-red)]">Failed to inject token</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 rounded-full bg-[var(--warning-yellow)]/10">
                <Key className="w-4 h-4 text-[var(--warning-yellow)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--cream)]">
                  Sign in to use Try It console
                </p>
                <p className="text-xs text-[var(--cream)]/60">
                  API requests require authentication
                </p>
              </div>
            </>
          )}
        </div>

        {authStabilized && isSignedIn && (
          <Button
            variant="outline"
            size="sm"
            onClick={injectAuthToken}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Token
          </Button>
        )}
      </div>

      {/* Stoplight Elements via iframe */}
      <div className="stoplight-container rounded-lg overflow-hidden border border-[var(--turquoise)]/20">
        <iframe
          ref={iframeRef}
          src="/api-docs.html"
          onLoad={handleIframeLoad}
          className="w-full border-0"
          style={{ height: '800px', minHeight: '600px' }}
          title="API Reference Documentation"
        />
      </div>
    </div>
  );
}
