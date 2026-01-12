'use client';

import { useState, useEffect } from 'react';
import { useUser, useSession, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Loader2, Monitor, Smartphone, Laptop, Globe, MapPin, Clock, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SessionWithActivitiesResource } from '@clerk/types';

export function SessionsList() {
  const { user, isLoaded } = useUser();
  const { session: currentSession } = useSession();
  const { signOut } = useClerk();
  const [sessions, setSessions] = useState<SessionWithActivitiesResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  // Load sessions
  useEffect(() => {
    if (isLoaded && user) {
      loadSessions();
    }
  }, [isLoaded, user]);

  const loadSessions = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const userSessions = await user.getSessions();
      setSessions(userSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to sign out this device?')) {
      return;
    }

    setRevokingId(sessionId);

    try {
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        await session.revoke();
        setSessions(sessions.filter((s) => s.id !== sessionId));
        toast.success('Session revoked successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to revoke session';
      toast.error(message);
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAllOther = async () => {
    if (!confirm('Are you sure you want to sign out all other devices? This cannot be undone.')) {
      return;
    }

    setIsRevokingAll(true);

    try {
      const otherSessions = sessions.filter((s) => s.id !== currentSession?.id);

      for (const session of otherSessions) {
        await session.revoke();
      }

      setSessions(sessions.filter((s) => s.id === currentSession?.id));
      toast.success('All other sessions have been revoked');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to revoke sessions';
      toast.error(message);
    } finally {
      setIsRevokingAll(false);
    }
  };

  // Parse device info from session
  const getDeviceInfo = (session: SessionWithActivitiesResource) => {
    const activity = session.latestActivity;
    const browserName = activity?.browserName || 'Unknown browser';
    const ipAddress = activity?.ipAddress || 'Unknown';
    const city = activity?.city || '';
    const country = activity?.country || '';
    const isMobile = activity?.isMobile;
    const deviceTypeRaw = activity?.deviceType || '';

    // Determine device type
    let deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'unknown';
    if (isMobile) {
      deviceType = 'mobile';
    } else if (deviceTypeRaw.toLowerCase().includes('tablet')) {
      deviceType = 'tablet';
    } else if (deviceTypeRaw || browserName !== 'Unknown browser') {
      deviceType = 'desktop';
    }

    const location = [city, country].filter(Boolean).join(', ') || 'Unknown location';

    return {
      deviceType,
      browser: browserName,
      os: deviceTypeRaw || 'Unknown device',
      location,
      ipAddress
    };
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Laptop;
      default:
        return Monitor;
    }
  };

  const formatLastActive = (date: Date | null | undefined) => {
    if (!date) return 'Unknown';

    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-[var(--turquoise)]/10 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-[var(--turquoise)]/10 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const otherSessionsCount = sessions.filter((s) => s.id !== currentSession?.id).length;

  return (
    <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-semibold text-[var(--cream)]">Active Sessions</h2>
        </div>
        <span className="text-sm text-[var(--cream)]/60">
          {sessions.length} active
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const isCurrentSession = session.id === currentSession?.id;
          const deviceInfo = getDeviceInfo(session);
          const DeviceIcon = getDeviceIcon(deviceInfo.deviceType);
          const isRevoking = revokingId === session.id;

          return (
            <div
              key={session.id}
              className={cn(
                'p-4 rounded-lg border transition-colors',
                isCurrentSession
                  ? 'bg-[var(--turquoise)]/10 border-[var(--turquoise)]/30'
                  : 'bg-[var(--dark-blue)] border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/20'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isCurrentSession ? 'bg-[var(--turquoise)]/20' : 'bg-[var(--navy)]'
                  )}>
                    <DeviceIcon className={cn(
                      'w-5 h-5',
                      isCurrentSession ? 'text-[var(--turquoise)]' : 'text-[var(--cream)]/60'
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[var(--cream)]">
                        {deviceInfo.browser} on {deviceInfo.os}
                      </p>
                      {isCurrentSession && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-[var(--turquoise)]/20 text-[var(--turquoise)] rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-[var(--cream)]/60">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {deviceInfo.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatLastActive(session.lastActiveAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {!isCurrentSession && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                    disabled={isRevoking}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    {isRevoking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {sessions.length === 0 && (
          <p className="text-center text-[var(--cream)]/50 py-8">
            No active sessions found
          </p>
        )}
      </div>

      {/* Revoke All Other Sessions */}
      {otherSessionsCount > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--turquoise)]/10">
          <Button
            variant="outline"
            onClick={handleRevokeAllOther}
            disabled={isRevokingAll}
            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            {isRevokingAll ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Sign out all other sessions ({otherSessionsCount})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
