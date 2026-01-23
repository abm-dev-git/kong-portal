'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  User,
  Building2,
  Activity,
  Wifi,
  WifiOff,
  AlertCircle,
  Info,
  Bug,
  AlertTriangle,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { useEnrichmentLogStream, LogEntry } from '@/lib/hooks/useEnrichmentLogStream'
import { toast } from 'sonner'

interface EnrichmentDetail {
  id: string
  request_id: string
  entity_type: 'person' | 'company'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  percent_complete: number
  current_step?: string
  input_data: Record<string, unknown>
  result?: Record<string, unknown>
  source_results?: Array<{
    source: string
    success: boolean
    response_time_ms: number
    fields_populated: string[]
  }>
  field_attribution?: Array<{
    field: string
    source: string
    confidence: number
  }>
  crm_mappings?: Array<{
    field: string
    crm_field: string
    status: string
  }>
  error_message?: string
  created_at: string
  started_at?: string
  completed_at?: string
}

const getLogLevelIcon = (level: string) => {
  switch (level) {
    case 'error':
      return <XCircle className="w-3.5 h-3.5 text-red-400" />
    case 'warning':
      return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
    case 'info':
      return <Info className="w-3.5 h-3.5 text-[var(--turquoise)]" />
    case 'debug':
      return <Bug className="w-3.5 h-3.5 text-[var(--cream)]/40" />
    default:
      return <Activity className="w-3.5 h-3.5 text-[var(--cream)]/60" />
  }
}

const getLogLevelClass = (level: string) => {
  switch (level) {
    case 'error':
      return 'border-l-red-500 bg-red-500/5'
    case 'warning':
      return 'border-l-yellow-500 bg-yellow-500/5'
    case 'info':
      return 'border-l-[var(--turquoise)] bg-[var(--turquoise)]/5'
    case 'debug':
      return 'border-l-[var(--cream)]/20 bg-[var(--cream)]/5'
    default:
      return 'border-l-[var(--cream)]/10'
  }
}

export default function EnrichmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { getToken } = useAuth()
  const [enrichment, setEnrichment] = useState<EnrichmentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // SSE log streaming
  const correlationId = enrichment?.status === 'processing' ? enrichment.request_id : null
  const { logs, status: streamStatus, percentComplete, isComplete } = useEnrichmentLogStream(correlationId)

  useEffect(() => {
    fetchEnrichment()
  }, [id])

  // Refresh when streaming completes
  useEffect(() => {
    if (isComplete) {
      fetchEnrichment()
    }
  }, [isComplete])

  const fetchEnrichment = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrichments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEnrichment(data)
      }
    } catch (error) {
      console.error('Failed to fetch enrichment:', error)
      toast.error('Failed to load enrichment details')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[var(--turquoise)] animate-spin" />
      </div>
    )
  }

  if (!enrichment) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--cream)]/40" />
        <p className="text-[var(--cream)]/60">Enrichment not found</p>
        <Link href="/dashboard/enrichments">
          <Button variant="link" className="mt-4">
            Back to Enrichments
          </Button>
        </Link>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-[var(--turquoise)] animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/enrichments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1
                className="text-2xl text-[var(--cream)]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Enrichment Details
              </h1>
              {getStatusIcon(enrichment.status)}
            </div>
            <p className="text-sm text-[var(--cream)]/60 mt-1">
              Request ID: {enrichment.request_id}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 w-6 p-0"
                onClick={() => copyToClipboard(enrichment.request_id)}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </p>
          </div>
        </div>
        <Button onClick={fetchEnrichment} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Details */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <h2 className="text-lg font-medium text-[var(--cream)] mb-4">Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[var(--cream)]/60">Entity Type</span>
                <Badge variant="outline">
                  {enrichment.entity_type === 'person' ? (
                    <><User className="w-3 h-3 mr-1" /> Person</>
                  ) : (
                    <><Building2 className="w-3 h-3 mr-1" /> Company</>
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--cream)]/60">Status</span>
                <Badge
                  className={
                    enrichment.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : enrichment.status === 'failed'
                      ? 'bg-red-500/10 text-red-400'
                      : enrichment.status === 'processing'
                      ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }
                >
                  {enrichment.status.charAt(0).toUpperCase() + enrichment.status.slice(1)}
                </Badge>
              </div>
              {enrichment.status === 'processing' && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[var(--cream)]/60">Progress</span>
                    <span className="text-[var(--cream)]">
                      {percentComplete || enrichment.percent_complete}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--turquoise)]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--turquoise)] rounded-full transition-all"
                      style={{ width: `${percentComplete || enrichment.percent_complete}%` }}
                    />
                  </div>
                  {enrichment.current_step && (
                    <p className="text-xs text-[var(--cream)]/40 mt-2">
                      {enrichment.current_step}
                    </p>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[var(--cream)]/60">Created</span>
                <span className="text-[var(--cream)] text-sm">{formatDate(enrichment.created_at)}</span>
              </div>
              {enrichment.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--cream)]/60">Completed</span>
                  <span className="text-[var(--cream)] text-sm">{formatDate(enrichment.completed_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Input Data Card */}
          <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <h2 className="text-lg font-medium text-[var(--cream)] mb-4">Input Data</h2>
            <pre className="text-sm text-[var(--cream)]/80 bg-[var(--dark-blue)] p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(enrichment.input_data, null, 2)}
            </pre>
          </div>

          {/* Result Card */}
          {enrichment.result && (
            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
              <h2 className="text-lg font-medium text-[var(--cream)] mb-4">Enriched Data</h2>
              <pre className="text-sm text-[var(--cream)]/80 bg-[var(--dark-blue)] p-4 rounded-lg overflow-x-auto max-h-96">
                {JSON.stringify(enrichment.result, null, 2)}
              </pre>
            </div>
          )}

          {/* Error Card */}
          {enrichment.error_message && (
            <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30">
              <h2 className="text-lg font-medium text-red-400 mb-2">Error</h2>
              <p className="text-red-300">{enrichment.error_message}</p>
            </div>
          )}
        </div>

        {/* Right Column - Logs */}
        <div className="space-y-6">
          {/* Live Logs Card */}
          <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[var(--cream)]">Processing Logs</h2>
              <div className="flex items-center gap-2">
                {streamStatus.status === 'connected' ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                ) : streamStatus.status === 'connecting' ? (
                  <Badge className="bg-yellow-500/10 text-yellow-400">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Connecting
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[var(--cream)]/40">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] min-h-[200px] overflow-y-scroll">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-[var(--cream)]/40">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">
                    {enrichment.status === 'processing'
                      ? 'Waiting for logs...'
                      : 'No logs available'}
                  </p>
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border-l-2 ${getLogLevelClass(log.level)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getLogLevelIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-[var(--cream)]">{log.message}</span>
                          {log.duration_ms !== undefined && (
                            <span className="text-xs text-[var(--cream)]/40 flex-shrink-0">
                              {log.duration_ms}ms
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--cream)]/40">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          {log.step && (
                            <Badge variant="outline" className="text-xs h-5">
                              {log.step}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Source Results */}
          {enrichment.source_results && enrichment.source_results.length > 0 && (
            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
              <h2 className="text-lg font-medium text-[var(--cream)] mb-4">Source Results</h2>
              <div className="space-y-3">
                {enrichment.source_results.map((source, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {source.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-[var(--cream)] font-medium">{source.source}</span>
                      </div>
                      <span className="text-xs text-[var(--cream)]/40">
                        {source.response_time_ms}ms
                      </span>
                    </div>
                    {source.fields_populated && source.fields_populated.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {source.fields_populated.map((field) => (
                          <Badge key={field} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
