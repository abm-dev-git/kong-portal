'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Linkedin, Check, RefreshCw, Unlink, Settings2 } from 'lucide-react'

export default function LinkedInSettingsPage() {
  // Mock state - in production this would come from API
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock connected account data
  const connectedAccount = {
    name: 'John Doe',
    email: 'john@company.com',
    profileUrl: 'https://linkedin.com/in/johndoe',
    connectedAt: '2024-01-15',
  }

  const handleConnect = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsConnected(true)
    setIsLoading(false)
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsConnected(false)
    setIsLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          LinkedIn Integration
        </h1>
        <p className="text-[var(--cream)]/70">
          Connect your LinkedIn account for profile enrichment and lead insights.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#0A66C2]/10">
              <Linkedin className="w-8 h-8 text-[#0A66C2]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[var(--cream)]">
                LinkedIn Account
              </h2>
              <p className="text-sm text-[var(--cream)]/60">
                {isConnected
                  ? 'Your LinkedIn account is connected'
                  : 'Connect to enable profile enrichment'}
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? 'success' : 'warning'}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            {/* Connected Account Info */}
            <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--cream)] font-medium">
                    {connectedAccount.name}
                  </p>
                  <p className="text-sm text-[var(--cream)]/60">
                    {connectedAccount.email}
                  </p>
                  <p className="text-xs text-[var(--cream)]/40 mt-1">
                    Connected on {new Date(connectedAccount.connectedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={isLoading}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[var(--cream)]/60">
              Connect your LinkedIn account to unlock powerful features:
            </p>
            <ul className="space-y-2">
              {[
                'Automatically enrich contact profiles',
                'Track company and prospect updates',
                'Import connections as leads',
                'Sync activities and engagement',
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-[var(--cream)]/70"
                >
                  <Check className="w-4 h-4 text-[var(--turquoise)]" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="mt-4 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect LinkedIn
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Sync Settings Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-medium text-[var(--cream)]">Sync Settings</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              id: 'auto-enrich',
              label: 'Auto-enrich new contacts',
              description: 'Automatically fetch LinkedIn data for new contacts',
              defaultChecked: true,
            },
            {
              id: 'sync-activities',
              label: 'Sync engagement activities',
              description: 'Track LinkedIn interactions and messages',
              defaultChecked: true,
            },
            {
              id: 'company-updates',
              label: 'Monitor company updates',
              description: 'Get notified about changes at target companies',
              defaultChecked: false,
            },
            {
              id: 'import-connections',
              label: 'Import LinkedIn connections',
              description: 'Automatically add your connections as leads',
              defaultChecked: false,
            },
          ].map((setting) => (
            <label
              key={setting.id}
              className="flex items-center justify-between p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10 cursor-pointer hover:border-[var(--turquoise)]/20 transition-colors"
            >
              <div>
                <p className="text-[var(--cream)]">{setting.label}</p>
                <p className="text-sm text-[var(--cream)]/60">{setting.description}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={setting.defaultChecked}
                disabled={!isConnected}
                className="w-5 h-5 rounded border-[var(--turquoise)]/30 text-[var(--turquoise)] focus:ring-[var(--turquoise)] focus:ring-offset-0 bg-transparent disabled:opacity-50"
              />
            </label>
          ))}
        </div>

        {!isConnected && (
          <p className="mt-4 text-sm text-[var(--cream)]/50 italic">
            Connect your LinkedIn account to configure sync settings.
          </p>
        )}
      </div>
    </div>
  )
}
