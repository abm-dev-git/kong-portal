'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  MessageSquare,
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  Loader2,
  FileText,
  Mail,
  PenTool,
  Globe,
  Check,
  X,
  Building2,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useWorkspaceContext } from '@/lib/contexts/WorkspaceContext'
import { EnrichmentSettingsCard } from '@/components/dashboard/EnrichmentSettingsCard'

interface ContentInstruction {
  id: string
  role: string
  content_type: string
  version: number
  title: string
  description: string
  instructions: string
  example?: string
  min_words?: number
  max_words?: number
  is_active: boolean
  created_at: string
  updated_at?: string
  workspace_id?: string | null // null = organization default
  is_default?: boolean // true = organization default, can be copied to workspace
}

const ROLES = ['CEO', 'CFO', 'CTO', 'CMO', 'VP Sales', 'Director', 'Manager', 'General']
const CONTENT_TYPES = ['email', 'handwritten_card', 'landing_page', 'linkedin_message', 'sms']

const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="w-4 h-4" />
    case 'handwritten_card':
      return <PenTool className="w-4 h-4" />
    case 'landing_page':
      return <Globe className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export default function PromptsPage() {
  const { getToken } = useAuth()
  const { currentWorkspace } = useWorkspaceContext()
  const [instructions, setInstructions] = useState<ContentInstruction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [scopeFilter, setScopeFilter] = useState<string>('all') // all, workspace, default
  const [editingInstruction, setEditingInstruction] = useState<ContentInstruction | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchInstructions()
  }, [currentWorkspace?.id])

  const fetchInstructions = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      // Fetch both workspace-specific and default instructions
      const params = new URLSearchParams()
      if (currentWorkspace?.id) {
        params.append('workspaceId', currentWorkspace.id)
      }
      params.append('includeDefaults', 'true')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-instructions?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        const items = data.items || data || []
        // Mark which are defaults vs workspace-specific
        const processedItems = items.map((item: ContentInstruction) => ({
          ...item,
          is_default: !item.workspace_id,
        }))
        setInstructions(processedItems)
      }
    } catch (error) {
      console.error('Failed to fetch instructions:', error)
      toast.error('Failed to load prompt configurations')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingInstruction) return
    setSaving(true)
    try {
      const token = await getToken()
      // If saving a new instruction or copying a default, include workspace_id
      const isNewOrCopy = !editingInstruction.id || editingInstruction.id.startsWith('copy_')
      const method = isNewOrCopy ? 'POST' : 'PUT'
      const url = isNewOrCopy
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-instructions`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-instructions/${editingInstruction.id}`

      // Include workspace_id for new workspace-specific prompts
      const payload = {
        ...editingInstruction,
        workspace_id: currentWorkspace?.id || null,
      }
      // Remove the temporary copy id
      if (payload.id?.startsWith('copy_')) {
        delete (payload as { id?: string }).id
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast.success(editingInstruction.id && !editingInstruction.id.startsWith('copy_') ? 'Prompt updated' : 'Prompt created for this workspace')
        setIsDialogOpen(false)
        setEditingInstruction(null)
        fetchInstructions()
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save prompt configuration')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt configuration?')) return
    try {
      const token = await getToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-instructions/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.ok) {
        toast.success('Prompt deleted')
        fetchInstructions()
      }
    } catch (error) {
      toast.error('Failed to delete prompt')
    }
  }

  const openCreateDialog = () => {
    setEditingInstruction({
      id: '',
      role: 'General',
      content_type: 'email',
      version: 1,
      title: '',
      description: '',
      instructions: '',
      is_active: true,
      created_at: new Date().toISOString(),
      workspace_id: currentWorkspace?.id || null,
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (instruction: ContentInstruction) => {
    setEditingInstruction({ ...instruction })
    setIsDialogOpen(true)
  }

  // Copy a default prompt to the current workspace for customization
  const copyToWorkspace = (instruction: ContentInstruction) => {
    setEditingInstruction({
      ...instruction,
      id: `copy_${instruction.id}`, // Temporary ID to indicate this is a copy
      title: `${instruction.title} (Workspace Copy)`,
      workspace_id: currentWorkspace?.id || null,
      is_default: false,
      version: 1,
    })
    setIsDialogOpen(true)
    toast.info('Customize this prompt for your workspace')
  }

  const filteredInstructions = instructions.filter((i) => {
    const matchesSearch =
      i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.role?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || i.role === roleFilter
    const matchesType = typeFilter === 'all' || i.content_type === typeFilter
    const matchesScope = scopeFilter === 'all' ||
      (scopeFilter === 'workspace' && i.workspace_id) ||
      (scopeFilter === 'default' && !i.workspace_id)
    return matchesSearch && matchesRole && matchesType && matchesScope
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1
              className="text-3xl text-[var(--cream)]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Configuration
            </h1>
            {currentWorkspace && (
              <Badge variant="outline" className="text-[var(--turquoise)] border-[var(--turquoise)]/30">
                <Building2 className="w-3 h-3 mr-1" />
                {currentWorkspace.name}
              </Badge>
            )}
          </div>
          <p className="text-[var(--cream)]/70">
            Configure AI prompts for enrichments. Copy defaults to customize for this workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchInstructions} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Prompt
          </Button>
        </div>
      </div>

      {/* Enrichment Settings */}
      <EnrichmentSettingsCard />

      {/* Content Prompts Section Header */}
      <div className="flex items-center gap-3 pt-2">
        <h2
          className="text-xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Content Prompts
        </h2>
        <Badge variant="outline" className="text-[var(--cream)]/60 border-[var(--cream)]/20">
          Role &times; Content Type
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/40" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CONTENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={scopeFilter} onValueChange={setScopeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Scopes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scopes</SelectItem>
            <SelectItem value="workspace">Workspace</SelectItem>
            <SelectItem value="default">Defaults</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Instructions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[var(--turquoise)] animate-spin" />
          </div>
        ) : filteredInstructions.length === 0 ? (
          <div className="text-center py-12 text-[var(--cream)]/60">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>No prompt configurations found</p>
            <Button variant="link" onClick={openCreateDialog} className="mt-2">
              Create your first prompt
            </Button>
          </div>
        ) : (
          filteredInstructions.map((instruction) => (
            <div
              key={instruction.id}
              className={`p-4 rounded-lg bg-[var(--navy)] border transition-all ${
                instruction.is_default
                  ? 'border-[var(--cream)]/20 hover:border-[var(--cream)]/40'
                  : 'border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    instruction.is_default
                      ? 'bg-[var(--cream)]/10 text-[var(--cream)]'
                      : 'bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                  }`}>
                    {getContentTypeIcon(instruction.content_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[var(--cream)] font-medium">
                        {instruction.title || `${instruction.role} ${instruction.content_type}`}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        v{instruction.version}
                      </Badge>
                      {instruction.is_default ? (
                        <Badge variant="outline" className="text-[var(--cream)]/60 border-[var(--cream)]/30">
                          Default
                        </Badge>
                      ) : (
                        <Badge className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/30">
                          <Building2 className="w-3 h-3 mr-1" />
                          Workspace
                        </Badge>
                      )}
                      {instruction.is_active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[var(--cream)]/40">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--cream)]/60 mt-1 max-w-2xl">
                      {instruction.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[var(--cream)]/40 mt-2">
                      <span>Role: {instruction.role}</span>
                      <span>Type: {instruction.content_type.split('_').join(' ')}</span>
                      {instruction.min_words && <span>Min: {instruction.min_words} words</span>}
                      {instruction.max_words && <span>Max: {instruction.max_words} words</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {instruction.is_default && currentWorkspace && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToWorkspace(instruction)}
                      title="Copy to workspace for customization"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Customize
                    </Button>
                  )}
                  {!instruction.is_default && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(instruction)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(instruction.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInstruction?.id ? 'Edit Prompt Configuration' : 'Create Prompt Configuration'}
            </DialogTitle>
          </DialogHeader>
          {editingInstruction && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editingInstruction.title}
                    onChange={(e) => setEditingInstruction({ ...editingInstruction, title: e.target.value })}
                    placeholder="e.g., CEO Email Outreach"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={editingInstruction.role}
                    onValueChange={(value) => setEditingInstruction({ ...editingInstruction, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select
                    value={editingInstruction.content_type}
                    onValueChange={(value) => setEditingInstruction({ ...editingInstruction, content_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Min Words</Label>
                    <Input
                      type="number"
                      value={editingInstruction.min_words || ''}
                      onChange={(e) => setEditingInstruction({
                        ...editingInstruction,
                        min_words: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Max Words</Label>
                    <Input
                      type="number"
                      value={editingInstruction.max_words || ''}
                      onChange={(e) => setEditingInstruction({
                        ...editingInstruction,
                        max_words: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingInstruction.description}
                  onChange={(e) => setEditingInstruction({ ...editingInstruction, description: e.target.value })}
                  placeholder="Brief description of this prompt configuration"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Instructions (Prompt)</Label>
                <Textarea
                  value={editingInstruction.instructions}
                  onChange={(e) => setEditingInstruction({ ...editingInstruction, instructions: e.target.value })}
                  placeholder="Enter the AI prompt instructions..."
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Example Output (Optional)</Label>
                <Textarea
                  value={editingInstruction.example || ''}
                  onChange={(e) => setEditingInstruction({ ...editingInstruction, example: e.target.value })}
                  placeholder="Example of expected output..."
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingInstruction.is_active}
                  onChange={(e) => setEditingInstruction({ ...editingInstruction, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingInstruction?.id ? 'Save Changes' : 'Create Prompt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
