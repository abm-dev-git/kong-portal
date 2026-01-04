'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { RefreshCw, User, Key } from 'lucide-react';

interface ApiReferenceProps {
  specUrl?: string;
}

export function ApiReference({ specUrl = '/api/openapi' }: ApiReferenceProps) {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [authStatus, setAuthStatus] = useState<'none' | 'injected' | 'error'>('none');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const injectAuthToken = useCallback(async () => {
    if (!isSignedIn) {
      setAuthStatus('none');
      return;
    }

    try {
      const token = await getToken();
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
      console.error('Failed to inject auth token:', error);
      setAuthStatus('error');
    }
  }, [isSignedIn, getToken]);

  // Inject token when iframe loads
  const handleIframeLoad = useCallback(() => {
    if (isSignedIn) {
      // Small delay to ensure iframe is ready
      setTimeout(injectAuthToken, 500);
    }
  }, [isSignedIn, injectAuthToken]);

  // Refresh token every 50 minutes (Clerk tokens expire after 60 min)
  useEffect(() => {
    if (!isSignedIn) return;

    const interval = setInterval(injectAuthToken, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isSignedIn, injectAuthToken]);

  return (
    <div className="space-y-4">
      {/* Auth Status Banner */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3">
          {isSignedIn ? (
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

        {isSignedIn && (
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
