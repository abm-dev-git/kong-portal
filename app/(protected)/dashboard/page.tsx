import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, Settings, BarChart3, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Dashboard
        </h1>
        <p className="text-[var(--cream)]/70">
          Welcome back! Manage your API keys and view usage metrics.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--cream)]/60">API Calls Today</p>
              <p className="text-2xl font-semibold text-[var(--cream)]">0</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[var(--turquoise)]/50" />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--cream)]/60">Active API Keys</p>
              <p className="text-2xl font-semibold text-[var(--cream)]">0</p>
            </div>
            <Key className="w-8 h-8 text-[var(--turquoise)]/50" />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--cream)]/60">Account Status</p>
              <Badge variant="success" className="mt-1">Active</Badge>
            </div>
            <Settings className="w-8 h-8 text-[var(--turquoise)]/50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2
          className="text-xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/api-keys" className="block">
            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[var(--turquoise)]/10">
                    <Key className="w-6 h-6 text-[var(--turquoise)]" />
                  </div>
                  <div>
                    <h3 className="text-[var(--cream)] font-medium">Manage API Keys</h3>
                    <p className="text-sm text-[var(--cream)]/60">Create, view, and revoke API keys</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] transition-colors" />
              </div>
            </div>
          </Link>

          <Link href="/settings" className="block">
            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[var(--turquoise)]/10">
                    <Settings className="w-6 h-6 text-[var(--turquoise)]" />
                  </div>
                  <div>
                    <h3 className="text-[var(--cream)] font-medium">Settings</h3>
                    <p className="text-sm text-[var(--cream)]/60">Configure integrations and preferences</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
