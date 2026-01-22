'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyStateError } from '@/components/ui/empty-state'
import {
  Coins,
  Zap,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react'

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  popular?: boolean
  bonus?: number
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: 29,
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 500,
    price: 99,
    popular: true,
    bonus: 50,
  },
  {
    id: 'scale',
    name: 'Scale',
    credits: 2000,
    price: 299,
    bonus: 300,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 10000,
    price: 999,
    bonus: 2000,
  },
]

export default function BillingSettingsPage() {
  const { getToken } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [creditBalance, setCreditBalance] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCreditBalance()
  }, [])

  const fetchCreditBalance = async () => {
    try {
      setError(null)
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/billing/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setCreditBalance(data.balance || 0)
      } else {
        setError('Unable to load credit balance')
      }
    } catch (err) {
      setError('Unable to load credit balance')
    }
  }

  const handlePurchase = async (packageId: string) => {
    setIsLoading(true)
    const pkg = creditPackages.find((p) => p.id === packageId)

    try {
      const token = await getToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ package_id: packageId }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.checkout_url) {
          window.location.href = data.checkout_url
        }
      } else {
        toast.info(`Purchase ${pkg?.name} package`, {
          description: 'Payment integration coming soon'
        })
      }
    } catch (err) {
      toast.info(`Purchase ${pkg?.name} package`, {
        description: 'Payment integration coming soon'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Billing
          </h1>
          <p className="text-[var(--cream)]/70">
            Manage your credit balance and purchase additional credits.
          </p>
        </div>
        <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
          <EmptyStateError
            message={error}
            onRetry={fetchCreditBalance}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Billing
        </h1>
        <p className="text-[var(--cream)]/70">
          Manage your credit balance and purchase additional credits.
        </p>
      </div>

      {/* Credit Balance Card */}
      <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--turquoise)]/20 to-[var(--navy)] border border-[var(--turquoise)]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[var(--turquoise)]/20">
              <Coins className="w-8 h-8 text-[var(--turquoise)]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[var(--cream)]">Credit Balance</h2>
              <p className="text-sm text-[var(--cream)]/60">Available for enrichments</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[var(--turquoise)]">
              {creditBalance !== null ? creditBalance.toLocaleString() : '—'}
            </div>
            <div className="text-sm text-[var(--cream)]/60">credits remaining</div>
          </div>
        </div>

        {creditBalance !== null && creditBalance < 50 && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <Zap className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-yellow-200">
              Running low on credits! Purchase more to continue enriching contacts.
            </p>
          </div>
        )}
      </div>

      {/* Credit Packages */}
      <div>
        <h2 className="text-xl font-medium text-[var(--cream)] mb-4">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-lg border transition-all ${
                pkg.popular
                  ? 'bg-[var(--turquoise)]/10 border-[var(--turquoise)] ring-1 ring-[var(--turquoise)]/50'
                  : 'bg-[var(--navy)] border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40'
              }`}
            >
              {pkg.popular && (
                <Badge className="mb-3 bg-[var(--turquoise)] text-[var(--navy)]">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              <h3 className="text-lg font-medium text-[var(--cream)]">{pkg.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-[var(--cream)]">${pkg.price}</span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[var(--cream)]">
                  <Coins className="w-4 h-4 text-[var(--turquoise)]" />
                  <span>{pkg.credits.toLocaleString()} credits</span>
                </div>
                {pkg.bonus && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Plus className="w-4 h-4" />
                    <span>{pkg.bonus.toLocaleString()} bonus credits</span>
                  </div>
                )}
                <div className="text-sm text-[var(--cream)]/60">
                  ${(pkg.price / (pkg.credits + (pkg.bonus || 0))).toFixed(3)} per credit
                </div>
              </div>
              <Button
                className="w-full"
                variant={pkg.popular ? 'default' : 'outline'}
                onClick={() => handlePurchase(pkg.id)}
                disabled={isLoading}
              >
                Purchase
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Pricing Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-4">Credit Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
            <div className="text-2xl font-bold text-[var(--turquoise)]">1</div>
            <div className="text-sm text-[var(--cream)]">Person Enrichment</div>
            <div className="text-xs text-[var(--cream)]/40">Basic profile data</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
            <div className="text-2xl font-bold text-[var(--turquoise)]">2</div>
            <div className="text-sm text-[var(--cream)]">Company Enrichment</div>
            <div className="text-xs text-[var(--cream)]/40">Full company data</div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
            <div className="text-2xl font-bold text-[var(--turquoise)]">5</div>
            <div className="text-sm text-[var(--cream)]">Deep Enrichment</div>
            <div className="text-xs text-[var(--cream)]/40">With intent signals</div>
          </div>
        </div>
      </div>
    </div>
  )
}
