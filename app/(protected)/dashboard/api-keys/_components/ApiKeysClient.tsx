'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import { ApiKeysTable } from './ApiKeysTable';
import { CreateKeyModal } from './CreateKeyModal';
import type { ApiKey, ListApiKeysResponse } from '@/lib/api-keys';

interface ApiKeysResponseWithWarning extends ListApiKeysResponse {
  warning?: string;
}

export function ApiKeysClient() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setWarning(null);

    try {
      const response = await fetch('/api/api-keys');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch API keys');
      }

      const data: ApiKeysResponseWithWarning = await response.json();
      setKeys(data.keys);
      if (data.warning) {
        setWarning(data.warning);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch API keys');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleKeyCreated = () => {
    setIsCreateModalOpen(false);
    fetchKeys();
  };

  const handleKeyRevoked = () => {
    fetchKeys();
  };

  if (error) {
    return (
      <div className="rounded-lg border border-[var(--error-red)]/20 bg-[var(--error-red)]/10 p-6">
        <p className="text-[var(--error-red)] mb-4">{error}</p>
        <Button onClick={fetchKeys} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Warning Banner */}
      {warning && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[var(--warning-yellow)]/10 border border-[var(--warning-yellow)]/30">
          <AlertTriangle className="w-5 h-5 text-[var(--warning-yellow)] shrink-0" />
          <p className="text-sm text-[var(--cream)]">{warning}</p>
        </div>
      )}

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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchKeys} disabled={isLoading} title="Refresh">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create API Key
          </Button>
        </div>
      </div>

      {/* API Keys Table */}
      {isLoading ? (
        <div className="rounded-lg border border-[var(--turquoise)]/20 overflow-hidden">
          <div className="h-64 flex items-center justify-center bg-[var(--navy)]/50">
            <RefreshCw className="w-6 h-6 text-[var(--turquoise)] animate-spin" />
          </div>
        </div>
      ) : (
        <ApiKeysTable
          keys={keys}
          onCreateKey={() => setIsCreateModalOpen(true)}
          onKeyRevoked={handleKeyRevoked}
        />
      )}

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

      {/* Create Key Modal */}
      <CreateKeyModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onKeyCreated={handleKeyCreated}
      />
    </>
  );
}
