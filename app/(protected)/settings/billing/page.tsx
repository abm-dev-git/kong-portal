'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CreditCard,
  Check,
  Zap,
  Building2,
  TrendingUp,
  Download,
  ExternalLink,
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      '100 API calls/month',
      '1 API key',
      'Community support',
      'Basic analytics',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'month',
    features: [
      '10,000 API calls/month',
      '10 API keys',
      'Priority support',
      'Advanced analytics',
      'LinkedIn integration',
      'HubSpot integration',
    ],
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    features: [
      'Unlimited API calls',
      'Unlimited API keys',
      'Dedicated support',
      'Custom analytics',
      'All integrations',
      'SLA guarantee',
      'Custom contracts',
    ],
  },
]

export default function BillingSettingsPage() {
  // Mock state - in production this would come from Stripe API
  const [currentPlan] = useState('free')
  const [isLoading, setIsLoading] = useState(false)

  // Mock usage data
  const usage = {
    apiCalls: { used: 78, limit: 100 },
    apiKeys: { used: 1, limit: 1 },
    periodEnd: '2024-02-01',
  }

  // Mock billing history
  const billingHistory = [
    { date: '2024-01-01', description: 'Free Plan - January 2024', amount: 0, status: 'paid' },
    { date: '2023-12-01', description: 'Free Plan - December 2023', amount: 0, status: 'paid' },
    { date: '2023-11-01', description: 'Free Plan - November 2023', amount: 0, status: 'paid' },
  ]

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true)
    // In production, this would redirect to Stripe Checkout
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert(`Upgrade to ${planId} - Stripe Checkout would open here`)
    setIsLoading(false)
  }

  const usagePercentage = (usage.apiCalls.used / usage.apiCalls.limit) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Billing & Subscription
        </h1>
        <p className="text-[var(--cream)]/70">
          Manage your subscription plan and payment methods.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[var(--turquoise)]/10">
              <Zap className="w-8 h-8 text-[var(--turquoise)]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-[var(--cream)]">
                Current Plan
              </h2>
              <p className="text-sm text-[var(--cream)]/60">
                {currentPlan === 'free'
                  ? 'You are on the Free plan'
                  : `You are on the ${currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} plan`}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
          </Badge>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--cream)]/60">API Calls</span>
              <span className="text-sm text-[var(--cream)]">
                {usage.apiCalls.used} / {usage.apiCalls.limit}
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--turquoise)]/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercentage > 90
                    ? 'bg-red-500'
                    : usagePercentage > 70
                    ? 'bg-yellow-500'
                    : 'bg-[var(--turquoise)]'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-[var(--cream)]/40 mt-2">
              Resets on {new Date(usage.periodEnd).toLocaleDateString()}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--cream)]/60">API Keys</span>
              <span className="text-sm text-[var(--cream)]">
                {usage.apiKeys.used} / {usage.apiKeys.limit}
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--turquoise)]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--turquoise)] rounded-full"
                style={{
                  width: `${(usage.apiKeys.used / usage.apiKeys.limit) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-[var(--cream)]/40 mt-2">
              {usage.apiKeys.limit - usage.apiKeys.used} keys remaining
            </p>
          </div>
        </div>

        {currentPlan === 'free' && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--turquoise)]/10 border border-[var(--turquoise)]/30">
            <TrendingUp className="w-5 h-5 text-[var(--turquoise)]" />
            <p className="text-sm text-[var(--cream)]">
              Upgrade to Pro to unlock more API calls, keys, and integrations.
            </p>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-lg border ${
              plan.highlighted
                ? 'bg-[var(--turquoise)]/10 border-[var(--turquoise)]'
                : 'bg-[var(--navy)] border-[var(--turquoise)]/20'
            }`}
          >
            {plan.highlighted && (
              <Badge className="mb-4 bg-[var(--turquoise)] text-[var(--navy)]">
                Most Popular
              </Badge>
            )}
            <h3 className="text-xl font-medium text-[var(--cream)]">{plan.name}</h3>
            <div className="mt-2 mb-6">
              <span className="text-3xl font-bold text-[var(--cream)]">
                ${plan.price}
              </span>
              <span className="text-[var(--cream)]/60">/{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-[var(--cream)]/70"
                >
                  <Check className="w-4 h-4 text-[var(--turquoise)]" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.id === currentPlan ? (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            ) : plan.id === 'enterprise' ? (
              <Button variant="outline" className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => handleUpgrade(plan.id)}
                disabled={isLoading}
              >
                {plan.price > plans.find((p) => p.id === currentPlan)!.price
                  ? 'Upgrade'
                  : 'Downgrade'}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Method Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-medium text-[var(--cream)]">Payment Method</h2>
        </div>

        {currentPlan === 'free' ? (
          <p className="text-[var(--cream)]/60">
            No payment method required for the Free plan. Add one when you upgrade.
          </p>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded bg-[var(--cream)]/10">
                <CreditCard className="w-6 h-6 text-[var(--cream)]" />
              </div>
              <div>
                <p className="text-[var(--cream)]">Visa ending in 4242</p>
                <p className="text-sm text-[var(--cream)]/60">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        )}
      </div>

      {/* Billing History Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-[var(--turquoise)]" />
            <h2 className="text-lg font-medium text-[var(--cream)]">
              Billing History
            </h2>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Stripe Portal
          </Button>
        </div>

        <div className="space-y-2">
          {billingHistory.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--cream)]/60">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span className="text-[var(--cream)]">{item.description}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[var(--cream)]">
                  ${item.amount.toFixed(2)}
                </span>
                <Badge variant="success">Paid</Badge>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
