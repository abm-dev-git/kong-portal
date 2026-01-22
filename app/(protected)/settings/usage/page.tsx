'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  BarChart3,
  RefreshCw,
  TrendingUp,
  Calendar,
  Loader2,
  User,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyStateError, EmptyStateNoData } from '@/components/ui/empty-state'
import { formatDate } from '@/lib/utils'

interface DailyUsage {
  date: string
  personEnrichments: number
  companyEnrichments: number
  total: number
}

interface Enrichment {
  id: string
  entity_type: 'person' | 'company'
  status: string
  created_at: string
}

export default function UsagePage() {
  const { getToken } = useAuth()
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
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
        const enrichments: Enrichment[] = data.items || []

        // Aggregate by day
        const usageByDay = new Map<string, DailyUsage>()

        enrichments.forEach((e) => {
          // Only count completed enrichments
          if (e.status !== 'completed') return

          const date = new Date(e.created_at).toISOString().split('T')[0]
          const existing = usageByDay.get(date) || {
            date,
            personEnrichments: 0,
            companyEnrichments: 0,
            total: 0,
          }

          if (e.entity_type === 'person') {
            existing.personEnrichments++
          } else if (e.entity_type === 'company') {
            existing.companyEnrichments++
          }
          existing.total++

          usageByDay.set(date, existing)
        })

        // Sort by date descending and take last 30 days
        const sorted = Array.from(usageByDay.values())
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 30)

        setDailyUsage(sorted)
      } else {
        setError('Unable to load usage data')
      }
    } catch (err) {
      setError('Unable to load usage data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary stats
  const totalEnrichments = dailyUsage.reduce((sum, day) => sum + day.total, 0)
  const totalPerson = dailyUsage.reduce((sum, day) => sum + day.personEnrichments, 0)
  const totalCompany = dailyUsage.reduce((sum, day) => sum + day.companyEnrichments, 0)
  const avgDaily = dailyUsage.length > 0 ? Math.round(totalEnrichments / dailyUsage.length) : 0

  // Find max for bar chart scaling
  const maxDaily = Math.max(...dailyUsage.map(d => d.total), 1)

  if (error) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Usage
          </h1>
          <p className="text-[var(--cream)]/70">
            View your enrichment usage and daily breakdown.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
          <EmptyStateError message={error} onRetry={fetchUsage} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Usage
          </h1>
          <p className="text-[var(--cream)]/70">
            View your enrichment usage and daily breakdown.
          </p>
        </div>
        <Button onClick={fetchUsage} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[var(--turquoise)] animate-spin" />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--turquoise)]/20 to-[var(--navy)] border border-[var(--turquoise)]/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[var(--turquoise)]" />
                <span className="text-sm text-[var(--cream)]/60">Total (30 days)</span>
              </div>
              <div className="text-3xl font-bold text-[var(--turquoise)]">
                {totalEnrichments.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--cream)]/40">enrichments</div>
            </div>

            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-[var(--turquoise)]" />
                <span className="text-sm text-[var(--cream)]/60">Person</span>
              </div>
              <div className="text-3xl font-bold text-[var(--cream)]">
                {totalPerson.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--cream)]/40">enrichments</div>
            </div>

            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-[var(--turquoise)]" />
                <span className="text-sm text-[var(--cream)]/60">Company</span>
              </div>
              <div className="text-3xl font-bold text-[var(--cream)]">
                {totalCompany.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--cream)]/40">enrichments</div>
            </div>

            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-[var(--turquoise)]" />
                <span className="text-sm text-[var(--cream)]/60">Daily Average</span>
              </div>
              <div className="text-3xl font-bold text-[var(--cream)]">
                {avgDaily.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--cream)]/40">per day</div>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-[var(--turquoise)]" />
              <h2 className="text-lg font-medium text-[var(--cream)]">Daily Breakdown</h2>
            </div>

            {dailyUsage.length === 0 ? (
              <EmptyStateNoData resourceName="usage records" />
            ) : (
              <div className="space-y-3">
                {dailyUsage.map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center gap-4 p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10"
                  >
                    <div className="w-28 text-sm text-[var(--cream)]/60">
                      {formatDate(day.date)}
                    </div>
                    <div className="flex-1">
                      <div className="h-6 bg-[var(--turquoise)]/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--turquoise)] to-[var(--turquoise)]/70 rounded-full transition-all"
                          style={{ width: `${(day.total / maxDaily) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[var(--cream)]/40" />
                        <span className="text-[var(--cream)]">{day.personEnrichments}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[var(--cream)]/40" />
                        <span className="text-[var(--cream)]">{day.companyEnrichments}</span>
                      </div>
                      <div className="w-16 text-right">
                        <span className="font-medium text-[var(--turquoise)]">{day.total}</span>
                        <span className="text-[var(--cream)]/40"> total</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
