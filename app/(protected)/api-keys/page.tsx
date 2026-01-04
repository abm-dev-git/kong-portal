import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, Plus, Copy, Trash2 } from 'lucide-react'

export default async function ApiKeysPage() {
  const { userId, orgId } = await auth()

  // Mock data - will be replaced with Kong Admin API calls
  const apiKeys: Array<{
    id: string
    name: string
    keyPrefix: string
    createdAt: string
    lastUsed: string | null
    status: 'active' | 'revoked'
  }> = []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            API Keys
          </h1>
          <p className="text-[var(--cream)]/70">
            Manage your API keys for accessing the ABM.dev API.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create API Key
        </Button>
      </div>

      {/* API Keys Table */}
      <div className="rounded-lg border border-[var(--turquoise)]/20 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--navy)]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-[var(--cream)]">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[var(--cream)]">Key</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[var(--cream)]">Created</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[var(--cream)]">Last Used</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[var(--cream)]">Status</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-[var(--cream)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--turquoise)]/10">
            {apiKeys.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-[var(--turquoise)]/10">
                      <Key className="w-8 h-8 text-[var(--turquoise)]" />
                    </div>
                    <div>
                      <p className="text-[var(--cream)] font-medium">No API keys yet</p>
                      <p className="text-sm text-[var(--cream)]/60">Create your first API key to get started.</p>
                    </div>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create API Key
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-[var(--navy)]/50">
                  <td className="px-6 py-4 text-sm text-[var(--cream)]">{key.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <code className="px-2 py-1 bg-[var(--navy)] text-[var(--turquoise)] rounded text-xs font-mono">
                      {key.keyPrefix}...
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--cream)]/70">{key.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-[var(--cream)]/70">
                    {key.lastUsed || 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={key.status === 'active' ? 'success' : 'error'}>
                      {key.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Copy key">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Revoke key">
                        <Trash2 className="w-4 h-4 text-[var(--error-red)]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* API Usage Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg text-[var(--cream)] font-medium mb-4">API Key Usage</h2>
        <div className="space-y-3 text-sm text-[var(--cream)]/70">
          <p>Include your API key in the <code className="px-1.5 py-0.5 bg-[var(--turquoise)]/10 text-[var(--turquoise)] rounded text-xs">x-api-key</code> header:</p>
          <pre className="p-4 bg-[var(--dark-blue)] rounded-lg overflow-x-auto">
            <code className="text-[var(--turquoise)] text-xs font-mono">
{`curl -X POST https://api.abm.dev/v1/enrichment \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "example@company.com"}'`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
