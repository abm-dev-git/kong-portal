'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserManagement } from '@/lib/hooks/useUserManagement';

type InviteState = 'loading' | 'success' | 'error';

export default function AcceptInvitePage() {
  const { token: inviteToken } = useParams<{ token: string }>();
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [state, setState] = useState<InviteState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [authToken, setAuthToken] = useState<string>();

  const { acceptInvite } = useUserManagement(authToken);

  // Get auth token when signed in
  useEffect(() => {
    if (isSignedIn) {
      getToken().then((t) => {
        if (t) setAuthToken(t);
      });
    }
  }, [isSignedIn, getToken]);

  // Handle authentication and invite acceptance
  useEffect(() => {
    if (!isLoaded) return;

    // Redirect to sign in if not authenticated
    if (!isSignedIn) {
      const returnUrl = encodeURIComponent(`/invite/${inviteToken}`);
      router.push(`/sign-in?redirect_url=${returnUrl}`);
      return;
    }

    // Wait for auth token
    if (!authToken) return;

    // Accept the invite
    const doAccept = async () => {
      try {
        await acceptInvite(inviteToken);
        setState('success');
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error) {
        setState('error');
        const err = error as Error & { code?: string };
        if (err.code === 'INVITE_EXPIRED') {
          setErrorMessage('This invitation has expired.');
        } else if (err.code === 'INVITE_INVALID') {
          setErrorMessage('This invitation is no longer valid.');
        } else if (err.code === 'MEMBER_EXISTS') {
          setErrorMessage('You are already a member of this organization.');
        } else {
          setErrorMessage(err.message || 'Failed to accept invitation.');
        }
      }
    };

    doAccept();
  }, [isLoaded, isSignedIn, authToken, inviteToken, acceptInvite, router]);

  return (
    <div className="min-h-screen bg-[var(--dark-blue)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1
              className="text-2xl text-[var(--cream)] mb-2"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Team Invitation
            </h1>
            <p className="text-[var(--cream)]/60 text-sm">
              {state === 'loading' && 'Processing your invitation...'}
              {state === 'success' && 'Welcome to the team!'}
              {state === 'error' && 'Unable to accept invitation'}
            </p>
          </div>

          {/* Status */}
          <div className="flex flex-col items-center gap-4">
            {state === 'loading' && (
              <Loader2 className="h-12 w-12 animate-spin text-[var(--turquoise)]" />
            )}
            {state === 'success' && (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="text-[var(--cream)]/60 text-sm">
                  Redirecting to dashboard...
                </p>
              </>
            )}
            {state === 'error' && (
              <>
                <XCircle className="h-12 w-12 text-red-400" />
                <p className="text-center text-[var(--cream)]/60 text-sm">
                  {errorMessage}
                </p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4"
                >
                  Go to Dashboard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
