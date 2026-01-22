'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Linkedin,
  User,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Shuffle,
  Target,
  Star,
  Info,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTeamLinkedInMembers, type TeamMemberWithLinkedIn } from '@/lib/hooks/useTeamLinkedInMembers'

export type LinkedInSelectionStrategy = 'closest' | 'least_used' | 'random' | 'primary'

interface LinkedInMemberSelectorProps {
  teamId?: string
  selectedUserId?: string
  selectedStrategy?: LinkedInSelectionStrategy
  onUserSelect: (userId: string | undefined) => void
  onStrategySelect: (strategy: LinkedInSelectionStrategy) => void
  className?: string
}

const strategyOptions: Array<{
  value: LinkedInSelectionStrategy
  label: string
  description: string
  icon: React.ElementType
}> = [
  {
    value: 'closest',
    label: 'Closest Connection',
    description: 'Use the team member with the closest network proximity to the target',
    icon: Target,
  },
  {
    value: 'least_used',
    label: 'Least Used',
    description: 'Distribute load by using the least recently used connection',
    icon: Clock,
  },
  {
    value: 'random',
    label: 'Random',
    description: 'Randomly select from available connections',
    icon: Shuffle,
  },
  {
    value: 'primary',
    label: 'Primary',
    description: 'Always use the first connected account',
    icon: Star,
  },
]

export function LinkedInMemberSelector({
  teamId,
  selectedUserId,
  selectedStrategy = 'closest',
  onUserSelect,
  onStrategySelect,
  className,
}: LinkedInMemberSelectorProps) {
  const { members, loading, error, refresh } = useTeamLinkedInMembers(teamId)

  const connectedMembers = members.filter((m) => m.hasLinkedInConnection)
  const hasConnectedMembers = connectedMembers.length > 0

  if (!teamId) {
    return (
      <div className={`p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 ${className}`}>
        <div className="flex items-center gap-2 text-[var(--cream)]/60">
          <Users className="w-4 h-4" />
          <span className="text-sm">Select a team to enable LinkedIn routing</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 ${className}`}>
        <div className="flex items-center gap-2 text-[var(--cream)]/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading team members...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/30 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          <span className="text-sm font-medium text-[var(--cream)]">LinkedIn Connection</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-[var(--cream)]/40" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Select which team member's LinkedIn connection to use for enrichment, or choose an automatic selection strategy.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Connection Status Summary */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={hasConnectedMembers
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
          }
        >
          {connectedMembers.length} of {members.length} connected
        </Badge>
      </div>

      {!hasConnectedMembers ? (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium">No LinkedIn Connections</p>
              <p className="text-xs text-yellow-200/70 mt-1">
                No team members have connected their LinkedIn account. Ask team members to connect their LinkedIn in settings to enable enrichment.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Strategy Selection */}
          <div className="space-y-2">
            <label className="text-xs text-[var(--cream)]/60">Selection Strategy</label>
            <Select value={selectedStrategy} onValueChange={(v) => onStrategySelect(v as LinkedInSelectionStrategy)}>
              <SelectTrigger className="w-full bg-[var(--dark-blue)] border-[var(--turquoise)]/20">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4 text-[var(--turquoise)]" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--cream)]/40">
              {strategyOptions.find((s) => s.value === selectedStrategy)?.description}
            </p>
          </div>

          {/* Specific Member Selection (Optional Override) */}
          <div className="space-y-2">
            <label className="text-xs text-[var(--cream)]/60">Preferred Member (Optional)</label>
            <Select
              value={selectedUserId || 'auto'}
              onValueChange={(v) => onUserSelect(v === 'auto' ? undefined : v)}
            >
              <SelectTrigger className="w-full bg-[var(--dark-blue)] border-[var(--turquoise)]/20">
                <SelectValue placeholder="Auto-select based on strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-[var(--turquoise)]" />
                    <span>Auto-select (use strategy)</span>
                  </div>
                </SelectItem>
                {connectedMembers.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[var(--cream)]/60" />
                      <span>{member.displayName}</span>
                      {member.linkedInProfileName && (
                        <span className="text-xs text-[var(--cream)]/40">
                          ({member.linkedInProfileName})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedUserId && (
              <p className="text-xs text-[var(--cream)]/40">
                Will use this member's LinkedIn connection, falling back to strategy if unavailable.
              </p>
            )}
          </div>

          {/* Connected Members List */}
          <div className="space-y-2">
            <label className="text-xs text-[var(--cream)]/60">Team LinkedIn Connections</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.userId}
                  className={`p-3 rounded-lg border transition-colors ${
                    member.hasLinkedInConnection
                      ? 'bg-[var(--turquoise)]/5 border-[var(--turquoise)]/20'
                      : 'bg-[var(--cream)]/5 border-[var(--cream)]/10 opacity-60'
                  } ${selectedUserId === member.userId ? 'ring-1 ring-[var(--turquoise)]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${
                        member.hasLinkedInConnection ? 'bg-[#0A66C2]/20' : 'bg-[var(--cream)]/10'
                      }`}>
                        {member.hasLinkedInConnection ? (
                          <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-[var(--cream)]/40" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--cream)]">
                            {member.displayName}
                          </span>
                          <Badge variant="outline" className="text-xs h-5">
                            {member.teamRole}
                          </Badge>
                        </div>
                        <div className="text-xs text-[var(--cream)]/40">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.hasLinkedInConnection ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[var(--cream)]/30" />
                      )}
                    </div>
                  </div>
                  {member.hasLinkedInConnection && member.lastUsedAt && (
                    <div className="mt-2 pt-2 border-t border-[var(--turquoise)]/10 flex items-center gap-4 text-xs text-[var(--cream)]/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last used: {formatDate(member.lastUsedAt)}
                      </span>
                      {member.linkedInProfileName && (
                        <span>Profile: {member.linkedInProfileName}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LinkedInMemberSelector
