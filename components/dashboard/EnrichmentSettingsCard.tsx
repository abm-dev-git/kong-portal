'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Loader2,
  RotateCcw,
  Save,
  Database,
  Shield,
  Gauge,
  Zap,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { toast } from 'sonner'
import {
  EnrichmentConfig,
  DEFAULT_ENRICHMENT_CONFIG,
  AVAILABLE_SOURCES,
} from '@/lib/data/enrichment-defaults'

export function EnrichmentSettingsCard() {
  const { getToken } = useAuth()
  const [expanded, setExpanded] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<EnrichmentConfig>(DEFAULT_ENRICHMENT_CONFIG)
  const [originalConfig, setOriginalConfig] = useState<EnrichmentConfig>(DEFAULT_ENRICHMENT_CONFIG)
  const [personPromptExpanded, setPersonPromptExpanded] = useState(false)
  const [companyPromptExpanded, setCompanyPromptExpanded] = useState(false)

  const isDirty = JSON.stringify(config) !== JSON.stringify(originalConfig)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrichment-config`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        // Merge with defaults to ensure all fields exist
        const mergedConfig = { ...DEFAULT_ENRICHMENT_CONFIG, ...data }
        setConfig(mergedConfig)
        setOriginalConfig(mergedConfig)
      } else if (response.status === 404) {
        // No config set yet, use defaults
        setConfig(DEFAULT_ENRICHMENT_CONFIG)
        setOriginalConfig(DEFAULT_ENRICHMENT_CONFIG)
      }
    } catch (error) {
      console.error('Failed to fetch enrichment config:', error)
      // Use defaults on error
      setConfig(DEFAULT_ENRICHMENT_CONFIG)
      setOriginalConfig(DEFAULT_ENRICHMENT_CONFIG)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrichment-config`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(config),
        }
      )
      if (response.ok) {
        toast.success('Enrichment settings saved')
        setOriginalConfig(config)
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save enrichment settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrichment-config/reset`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.ok) {
        setConfig(DEFAULT_ENRICHMENT_CONFIG)
        setOriginalConfig(DEFAULT_ENRICHMENT_CONFIG)
        toast.success('Settings reset to defaults')
      } else {
        throw new Error('Failed to reset')
      }
    } catch (error) {
      // Even if API fails, reset locally
      setConfig(DEFAULT_ENRICHMENT_CONFIG)
      setOriginalConfig(DEFAULT_ENRICHMENT_CONFIG)
      toast.success('Settings reset to defaults')
    } finally {
      setSaving(false)
    }
  }

  const toggleSource = (sourceId: string) => {
    setConfig((prev) => ({
      ...prev,
      sources: prev.sources.includes(sourceId)
        ? prev.sources.filter((s) => s !== sourceId)
        : [...prev.sources, sourceId],
    }))
  }

  const updateConfig = <K extends keyof EnrichmentConfig>(
    key: K,
    value: EnrichmentConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="mb-6">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
              <Settings className="w-5 h-5 text-[var(--turquoise)]" />
            </div>
            <div>
              <CardTitle className="text-lg">Enrichment Settings</CardTitle>
              <CardDescription>
                Configure data sources, AI behavior, and quality thresholds
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && (
              <Badge className="bg-[var(--warning-yellow)]/10 text-[var(--warning-yellow)] border-[var(--warning-yellow)]/30">
                Unsaved changes
              </Badge>
            )}
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-[var(--cream)]/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--cream)]/60" />
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[var(--turquoise)] animate-spin" />
            </div>
          ) : (
            <>
              {/* Data Sources */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[var(--turquoise)]" />
                  <Label className="text-[var(--cream)]">Data Sources</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SOURCES.map((source) => {
                    const isSelected = config.sources.includes(source.id)
                    return (
                      <button
                        key={source.id}
                        onClick={() => toggleSource(source.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-[var(--turquoise)] text-[var(--dark-blue)]'
                            : 'bg-[var(--cream)]/10 text-[var(--cream)]/60 hover:bg-[var(--cream)]/20'
                        }`}
                        title={source.description}
                      >
                        {source.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Boolean Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--turquoise)]" />
                    <div>
                      <Label className="text-[var(--cream)]">AI Auditor</Label>
                      <p className="text-xs text-[var(--cream)]/50">
                        Verify enrichment quality
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.enable_auditor}
                    onCheckedChange={(checked) =>
                      updateConfig('enable_auditor', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--turquoise)]" />
                    <div>
                      <Label className="text-[var(--cream)]">Auto Proceed</Label>
                      <p className="text-xs text-[var(--cream)]/50">
                        Auto CRM writeback
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.auto_proceed}
                    onCheckedChange={(checked) =>
                      updateConfig('auto_proceed', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10">
                  <div>
                    <Label className="text-[var(--cream)]">Require LinkedIn</Label>
                    <p className="text-xs text-[var(--cream)]/50">
                      Fail if LinkedIn unavailable
                    </p>
                  </div>
                  <Switch
                    checked={config.require_linkedin}
                    onCheckedChange={(checked) =>
                      updateConfig('require_linkedin', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10">
                  <div>
                    <Label className="text-[var(--cream)]">HubSpot Writeback</Label>
                    <p className="text-xs text-[var(--cream)]/50">
                      Write data to HubSpot
                    </p>
                  </div>
                  <Switch
                    checked={config.enable_hubspot_writeback}
                    onCheckedChange={(checked) =>
                      updateConfig('enable_hubspot_writeback', checked)
                    }
                  />
                </div>
              </div>

              {/* Confidence Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[var(--turquoise)]" />
                    <Label className="text-[var(--cream)]">
                      Minimum Confidence to Proceed
                    </Label>
                  </div>
                  <span className="text-sm font-mono text-[var(--turquoise)]">
                    {config.min_confidence_to_proceed.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.min_confidence_to_proceed}
                  onChange={(e) =>
                    updateConfig('min_confidence_to_proceed', parseFloat(e.target.value))
                  }
                  className="w-full h-2 bg-[var(--cream)]/10 rounded-lg appearance-none cursor-pointer accent-[var(--turquoise)]"
                />
                <div className="flex justify-between text-xs text-[var(--cream)]/40">
                  <span>0.0 (Accept all)</span>
                  <span>0.5 (Default)</span>
                  <span>1.0 (High quality only)</span>
                </div>
              </div>

              {/* Custom Prompts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--turquoise)]" />
                  <Label className="text-[var(--cream)]">Custom AI Prompts</Label>
                </div>

                {/* Person Prompt */}
                <div className="rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 overflow-hidden">
                  <button
                    onClick={() => setPersonPromptExpanded(!personPromptExpanded)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[var(--cream)]/5 transition-colors"
                  >
                    <span className="text-sm font-medium text-[var(--cream)]">
                      Person System Prompt
                    </span>
                    {personPromptExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--cream)]/60" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--cream)]/60" />
                    )}
                  </button>
                  {personPromptExpanded && (
                    <div className="px-3 pb-3">
                      <Textarea
                        value={config.person_system_prompt}
                        onChange={(e) =>
                          updateConfig('person_system_prompt', e.target.value)
                        }
                        rows={6}
                        className="font-mono text-sm"
                        placeholder="Instructions for person enrichment..."
                      />
                    </div>
                  )}
                </div>

                {/* Company Prompt */}
                <div className="rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 overflow-hidden">
                  <button
                    onClick={() => setCompanyPromptExpanded(!companyPromptExpanded)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[var(--cream)]/5 transition-colors"
                  >
                    <span className="text-sm font-medium text-[var(--cream)]">
                      Company System Prompt
                    </span>
                    {companyPromptExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--cream)]/60" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--cream)]/60" />
                    )}
                  </button>
                  {companyPromptExpanded && (
                    <div className="px-3 pb-3">
                      <Textarea
                        value={config.company_system_prompt}
                        onChange={(e) =>
                          updateConfig('company_system_prompt', e.target.value)
                        }
                        rows={6}
                        className="font-mono text-sm"
                        placeholder="Instructions for company enrichment..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[var(--turquoise)]/10">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={saving}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!isDirty || saving}
                  className="gap-2"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  )
}
