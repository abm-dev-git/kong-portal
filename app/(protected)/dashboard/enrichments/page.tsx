'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import {
  Activity,
  RefreshCw,
  Search,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  User,
  Building2,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EmptyStateError } from '@/components/ui/empty-state'
import { formatDate } from '@/lib/utils'

interface Enrichment {
  id: string
  request_id: string
  entity_type: 'person' | 'company'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  percent_complete: number
  input_data: {
    name?: string
    email?: string
    company?: string
    linkedin_url?: string
  }
  created_at: string
  completed_at?: string
  error_message?: string
}

export default function EnrichmentsPage() {
  const { getToken } = useAuth()
  const [enrichments, setEnrichments] = useState<Enrichment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchEnrichments()
  }, [])

  const fetchEnrichments = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrichments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEnrichments(data.items || [])
      } else {
        setError('Unable to load enrichments')
      }
    } catch (err) {
      setError('Unable to load enrichments')
    } finally {
      setLoading(false)
    }
  }

  const filteredEnrichments = enrichments.filter((e) => {
    const matchesSearch =
      e.input_data?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.input_data?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.input_data?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.request_id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-[var(--turquoise)] animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      failed: 'bg-red-500/10 text-red-400 border-red-500/30',
      processing: 'bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/30',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    }
    return (
      <Badge variant="outline" className={variants[status] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Enrichments
          </h1>
          <p className="text-[var(--cream)]/70">
            View and monitor your enrichment jobs and their results.
          </p>
        </div>
        <Button onClick={fetchEnrichments} variant="outline" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
          <Input
            placeholder="Search by name, email, company, or request ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'processing', 'pending', 'failed'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Enrichments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--turquoise)] animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <EmptyStateError message={error} onRetry={fetchEnrichments} />
          </div>
        ) : filteredEnrichments.length === 0 ? (
          <div className="text-center py-12 text-[var(--cream)]/60">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No enrichments found</p>
            {searchQuery && (
              <Button variant="link" onClick={() => setSearchQuery('')} className="mt-2">
                Clear search
              </Button>
            )}
          </div>
        ) : (
          filteredEnrichments.map((enrichment) => (
            <Link
              key={enrichment.id}
              href={`/dashboard/enrichments/${enrichment.id}`}
              className="block group"
            >
              <div className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
                      {enrichment.entity_type === 'person' ? (
                        <User className="w-5 h-5 text-[var(--turquoise)]" />
                      ) : (
                        <Building2 className="w-5 h-5 text-[var(--turquoise)]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--cream)] font-medium">
                          {enrichment.input_data?.name || enrichment.input_data?.email || 'Unknown'}
                        </span>
                        {getStatusBadge(enrichment.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--cream)]/60 mt-1">
                        {enrichment.input_data?.company && (
                          <span>{enrichment.input_data.company}</span>
                        )}
                        <span>ID: {enrichment.request_id.slice(0, 8)}...</span>
                        <span>{formatDate(enrichment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {enrichment.status === 'processing' && (
                      <div className="text-sm text-[var(--cream)]/60">
                        {enrichment.percent_complete}%
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-[var(--cream)]/30 group-hover:text-[var(--turquoise)] transition-colors" />
                  </div>
                </div>
                {enrichment.status === 'processing' && (
                  <div className="mt-3 w-full h-1.5 bg-[var(--turquoise)]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--turquoise)] rounded-full transition-all"
                      style={{ width: `${enrichment.percent_complete}%` }}
                    />
                  </div>
                )}
                {enrichment.error_message && (
                  <div className="mt-3 text-sm text-red-400">
                    {enrichment.error_message}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
