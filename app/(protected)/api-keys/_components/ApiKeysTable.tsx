'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Copy, Trash2, Check } from 'lucide-react';
import type { ApiKey } from '@/lib/api-keys';
import { RevokeKeyDialog } from './RevokeKeyDialog';

interface ApiKeysTableProps {
  keys: ApiKey[];
  onCreateKey: () => void;
  onKeyRevoked: () => void;
}

export function ApiKeysTable({ keys, onCreateKey, onKeyRevoked }: ApiKeysTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revokeKey, setRevokeKey] = useState<ApiKey | null>(null);

  const handleCopyPrefix = async (keyPrefix: string, keyId: string) => {
    await navigator.clipboard.writeText(keyPrefix);
    setCopiedId(keyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (keys.length === 0) {
    return (
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
          <tbody>
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
                  <Button onClick={onCreateKey} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create API Key
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
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
            {keys.map((key) => (
              <tr key={key.id} className="hover:bg-[var(--navy)]/50">
                <td className="px-6 py-4 text-sm text-[var(--cream)]">{key.name}</td>
                <td className="px-6 py-4 text-sm">
                  <code className="px-2 py-1 bg-[var(--navy)] text-[var(--turquoise)] rounded text-xs font-mono">
                    {key.keyPrefix}...
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--cream)]/70">
                  {formatDate(key.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--cream)]/70">
                  {key.lastUsed ? formatDate(key.lastUsed) : 'Never'}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={key.status === 'active' ? 'success' : 'error'}>
                    {key.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Copy key prefix"
                      onClick={() => handleCopyPrefix(key.keyPrefix, key.id)}
                    >
                      {copiedId === key.id ? (
                        <Check className="w-4 h-4 text-[var(--success-green)]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Revoke key"
                      onClick={() => setRevokeKey(key)}
                    >
                      <Trash2 className="w-4 h-4 text-[var(--error-red)]" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RevokeKeyDialog
        apiKey={revokeKey}
        open={!!revokeKey}
        onOpenChange={(open) => !open && setRevokeKey(null)}
        onRevoked={() => {
          setRevokeKey(null);
          onKeyRevoked();
        }}
      />
    </>
  );
}
