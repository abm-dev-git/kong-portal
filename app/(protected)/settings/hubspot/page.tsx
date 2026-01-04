'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Database,
  Check,
  RefreshCw,
  Unlink,
  ArrowRightLeft,
  History,
  AlertCircle,
} from 'lucide-react'

export default function HubSpotSettingsPage() {
  // Mock state - in production this would come from API
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock connected portal data
  const connectedPortal = {
    portalId: '12345678',
    portalName: 'Acme Corp',
    hubDomain: 'acme-corp.hubspot.com',
    connectedAt: '2024-01-10',
    lastSync: '2024-01-20T14:30:00Z',
  }

  // Mock sync history
  const syncHistory = [
    { date: '2024-01-20 14:30', type: 'Contacts', count: 150, status: 'success' },
    { date: '2024-01-20 14:00', type: 'Companies', count: 42, status: 'success' },
    { date: '2024-01-19 10:15', type: 'Deals', count: 28, status: 'success' },
    { date: '2024-01-18 09:00', type: 'Contacts', count: 0, status: 'error' },
  ]

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
          HubSpot Integration
        </h1>
        <p className="text-[var(--cream)]/70">
          Connect your HubSpot CRM for seamless data synchronization.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#FF7A59]/10">
              <Database className="w-8 h-8 text-[#FF7A59]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[var(--cream)]">
                HubSpot CRM
              </h2>
              <p className="text-sm text-[var(--cream)]/60">
                {isConnected
                  ? `Connected to ${connectedPortal.portalName}`
                  : 'Connect to sync your CRM data'}
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? 'success' : 'warning'}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            {/* Connected Portal Info */}
            <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--cream)] font-medium">
                    {connectedPortal.portalName}
                  </p>
                  <p className="text-sm text-[var(--cream)]/60">
                    Portal ID: {connectedPortal.portalId}
                  </p>
                  <p className="text-xs text-[var(--cream)]/40 mt-1">
                    Last synced: {new Date(connectedPortal.lastSync).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
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
              Connect your HubSpot CRM to unlock these features:
            </p>
            <ul className="space-y-2">
              {[
                'Two-way contact synchronization',
                'Automatic deal and pipeline updates',
                'Company data enrichment',
                'Activity tracking and logging',
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
              className="mt-4 bg-[#FF7A59] hover:bg-[#FF7A59]/90 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Connect HubSpot
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Field Mapping Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3 mb-6">
          <ArrowRightLeft className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-medium text-[var(--cream)]">Field Mapping</h2>
        </div>

        <div className="space-y-3">
          {[
            { local: 'First Name', hubspot: 'firstname', synced: true },
            { local: 'Last Name', hubspot: 'lastname', synced: true },
            { local: 'Email', hubspot: 'email', synced: true },
            { local: 'Company', hubspot: 'company', synced: true },
            { local: 'Job Title', hubspot: 'jobtitle', synced: false },
            { local: 'Phone', hubspot: 'phone', synced: false },
          ].map((mapping) => (
            <div
              key={mapping.local}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10"
            >
              <div className="flex items-center gap-4">
                <span className="text-[var(--cream)] w-32">{mapping.local}</span>
                <ArrowRightLeft className="w-4 h-4 text-[var(--cream)]/40" />
                <span className="text-[var(--cream)]/60 font-mono text-sm">
                  {mapping.hubspot}
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-[var(--cream)]/60">Sync</span>
                <input
                  type="checkbox"
                  defaultChecked={mapping.synced}
                  disabled={!isConnected}
                  className="w-5 h-5 rounded border-[var(--turquoise)]/30 text-[var(--turquoise)] focus:ring-[var(--turquoise)] focus:ring-offset-0 bg-transparent disabled:opacity-50"
                />
              </label>
            </div>
          ))}
        </div>

        {!isConnected && (
          <p className="mt-4 text-sm text-[var(--cream)]/50 italic">
            Connect your HubSpot account to configure field mapping.
          </p>
        )}
      </div>

      {/* Sync History Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-medium text-[var(--cream)]">Sync History</h2>
        </div>

        {isConnected ? (
          <div className="space-y-2">
            {syncHistory.map((sync, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[var(--cream)]/60">{sync.date}</span>
                  <span className="text-[var(--cream)]">{sync.type}</span>
                  <span className="text-sm text-[var(--cream)]/60">
                    {sync.count} records
                  </span>
                </div>
                {sync.status === 'success' ? (
                  <Badge variant="success">Success</Badge>
                ) : (
                  <Badge variant="error">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--cream)]/50 italic">
            Connect your HubSpot account to view sync history.
          </p>
        )}
      </div>
    </div>
  )
}
