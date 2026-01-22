'use client'

import { useState } from 'react'
import { Check, ChevronDown, Plus, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspaceContext } from '@/lib/contexts/WorkspaceContext'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface WorkspaceSwitcherProps {
  className?: string
}

export function WorkspaceSwitcher({ className }: WorkspaceSwitcherProps) {
  const { currentWorkspace, workspaces, isLoading, setCurrentWorkspace } = useWorkspaceContext()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <div className={cn('px-3 py-2', className)}>
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (!currentWorkspace || workspaces.length === 0) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select workspace"
          className={cn(
            'w-full justify-between px-3 py-2.5 h-auto',
            'bg-[var(--navy)]/50 hover:bg-[var(--navy)]',
            'border border-[var(--cream)]/10 hover:border-[var(--turquoise)]/30',
            'text-left font-normal',
            className
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--turquoise)]/10 border border-[var(--turquoise)]/20">
              <Building2 className="h-4 w-4 text-[var(--turquoise)]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-[var(--cream)]/50 uppercase tracking-wider">
                Workspace
              </span>
              <span className="text-sm font-medium text-[var(--cream)] truncate">
                {currentWorkspace.name}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--cream)]/50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1 bg-[var(--navy)] border-[var(--cream)]/20"
        align="start"
      >
        <div className="space-y-1">
          {workspaces.map((workspace) => (
            <button
              key={workspace.id}
              onClick={() => {
                setCurrentWorkspace(workspace)
                setOpen(false)
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                'text-left',
                workspace.id === currentWorkspace.id
                  ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)]'
                  : 'text-[var(--cream)]/70 hover:bg-[var(--cream)]/5 hover:text-[var(--cream)]'
              )}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[var(--cream)]/5">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{workspace.name}</p>
                {workspace.isDefault && (
                  <p className="text-xs text-[var(--cream)]/50">Default</p>
                )}
              </div>
              {workspace.id === currentWorkspace.id && (
                <Check className="h-4 w-4 shrink-0" />
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="my-1 border-t border-[var(--cream)]/10" />

          {/* Manage workspaces link */}
          <a
            href="/settings/workspaces"
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              'text-[var(--cream)]/50 hover:bg-[var(--cream)]/5 hover:text-[var(--cream)]'
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Manage Workspaces</span>
          </a>
        </div>
      </PopoverContent>
    </Popover>
  )
}
