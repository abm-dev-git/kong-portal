/**
 * Empty State Component System
 * A collection of empty state components for various scenarios where no data
 * or content is available.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  FolderOpen,
  Key,
  Linkedin,
  AlertCircle,
  Inbox,
  type LucideIcon,
} from "lucide-react";

/**
 * Props for the base EmptyState component.
 */
export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState - Base component for creating custom empty state displays.
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon: Icon = Inbox,
      title,
      description,
      action,
      secondaryAction,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6 text-center",
          className
        )}
      >
        <div className="mb-4 rounded-full bg-[var(--turquoise)]/10 p-4">
          <Icon className="h-8 w-8 text-[var(--turquoise)]" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--cream)]">
          {title}
        </h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-[var(--cream)]/60">
            {description}
          </p>
        )}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

/**
 * EmptyStateNoResults - for search results with no matches
 */
export interface EmptyStateNoResultsProps {
  searchTerm?: string;
  onClearSearch?: () => void;
  className?: string;
}

const EmptyStateNoResults = React.forwardRef<
  HTMLDivElement,
  EmptyStateNoResultsProps
>(({ searchTerm, onClearSearch, className }, ref) => {
  return (
    <EmptyState
      ref={ref}
      icon={Search}
      title="No results found"
      description={
        searchTerm
          ? `We couldn't find any results for "${searchTerm}". Try adjusting your search.`
          : "We couldn't find any matching results. Try a different search term."
      }
      action={
        onClearSearch && (
          <button
            onClick={onClearSearch}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] transition-colors"
          >
            Clear search
          </button>
        )
      }
      className={className}
    />
  );
});
EmptyStateNoResults.displayName = "EmptyStateNoResults";

/**
 * EmptyStateNoData - for empty collections/lists
 */
export interface EmptyStateNoDataProps {
  resourceName?: string;
  onCreateNew?: () => void;
  className?: string;
}

const EmptyStateNoData = React.forwardRef<HTMLDivElement, EmptyStateNoDataProps>(
  ({ resourceName = "items", onCreateNew, className }, ref) => {
    return (
      <EmptyState
        ref={ref}
        icon={FolderOpen}
        title={`No ${resourceName} yet`}
        description={`Get started by creating your first ${resourceName.slice(0, -1) || resourceName}.`}
        action={
          onCreateNew && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] transition-colors"
            >
              Create {resourceName.slice(0, -1) || resourceName}
            </button>
          )
        }
        className={className}
      />
    );
  }
);
EmptyStateNoData.displayName = "EmptyStateNoData";

/**
 * EmptyStateNoAPIKeys - for API key management
 */
export interface EmptyStateNoAPIKeysProps {
  onCreateKey?: () => void;
  className?: string;
}

const EmptyStateNoAPIKeys = React.forwardRef<
  HTMLDivElement,
  EmptyStateNoAPIKeysProps
>(({ onCreateKey, className }, ref) => {
  return (
    <EmptyState
      ref={ref}
      icon={Key}
      title="No API keys"
      description="Create an API key to start integrating with ABM.dev. Your key will give you access to enrichment, content generation, and more."
      action={
        onCreateKey && (
          <button
            onClick={onCreateKey}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] transition-colors"
          >
            <Key className="mr-2 h-4 w-4" />
            Create API Key
          </button>
        )
      }
      className={className}
    />
  );
});
EmptyStateNoAPIKeys.displayName = "EmptyStateNoAPIKeys";

/**
 * EmptyStateLinkedInNotConnected - for LinkedIn integration status
 */
export interface EmptyStateLinkedInNotConnectedProps {
  onConnect?: () => void;
  className?: string;
}

const EmptyStateLinkedInNotConnected = React.forwardRef<
  HTMLDivElement,
  EmptyStateLinkedInNotConnectedProps
>(({ onConnect, className }, ref) => {
  return (
    <EmptyState
      ref={ref}
      icon={Linkedin}
      title="LinkedIn not connected"
      description="Connect your LinkedIn account to enable profile enrichment and Sales Navigator integration."
      action={
        onConnect && (
          <button
            onClick={onConnect}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
          >
            <Linkedin className="mr-2 h-4 w-4" />
            Connect LinkedIn
          </button>
        )
      }
      className={className}
    />
  );
});
EmptyStateLinkedInNotConnected.displayName = "EmptyStateLinkedInNotConnected";

// HubSpot icon component
function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.086a2.198 2.198 0 0 0 1.267-1.978V3.06a2.198 2.198 0 0 0-2.198-2.198h-.048a2.198 2.198 0 0 0-2.198 2.198v.048a2.198 2.198 0 0 0 1.267 1.978V7.93a5.996 5.996 0 0 0-2.77 1.29L6.164 3.71a2.43 2.43 0 1 0-1.358 1.13l7.26 5.418a6.002 6.002 0 0 0 .084 6.53l-2.18 2.18a1.835 1.835 0 1 0 1.13 1.13l2.18-2.18a6.002 6.002 0 0 0 6.53.084 6.002 6.002 0 0 0-1.646-10.072Zm-.979 8.059a3.453 3.453 0 1 1 0-6.905 3.453 3.453 0 0 1 0 6.905Z"/>
    </svg>
  );
}

/**
 * EmptyStateHubSpotNotConnected - for HubSpot CRM integration status
 */
export interface EmptyStateHubSpotNotConnectedProps {
  onConnect?: () => void;
  className?: string;
}

const EmptyStateHubSpotNotConnected = React.forwardRef<
  HTMLDivElement,
  EmptyStateHubSpotNotConnectedProps
>(({ onConnect, className }, ref) => {
  return (
    <EmptyState
      ref={ref}
      icon={Inbox}
      title="HubSpot not connected"
      description="Connect your HubSpot account to automatically sync enriched contacts and companies to your CRM."
      action={
        onConnect && (
          <button
            onClick={onConnect}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[#ff7a59] text-white hover:bg-[#e86a4a] transition-colors"
          >
            <HubSpotIcon className="mr-2 h-4 w-4" />
            Connect HubSpot
          </button>
        )
      }
      className={className}
    />
  );
});
EmptyStateHubSpotNotConnected.displayName = "EmptyStateHubSpotNotConnected";

/**
 * EmptyStateError - for error states
 */
export interface EmptyStateErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const EmptyStateError = React.forwardRef<HTMLDivElement, EmptyStateErrorProps>(
  ({ message, onRetry, className }, ref) => {
    return (
      <EmptyState
        ref={ref}
        icon={AlertCircle}
        title="Something went wrong"
        description={
          message || "An error occurred while loading the data. Please try again."
        }
        action={
          onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] transition-colors"
            >
              Try again
            </button>
          )
        }
        className={className}
      />
    );
  }
);
EmptyStateError.displayName = "EmptyStateError";

export {
  EmptyState,
  EmptyStateNoResults,
  EmptyStateNoData,
  EmptyStateNoAPIKeys,
  EmptyStateLinkedInNotConnected,
  EmptyStateHubSpotNotConnected,
  EmptyStateError,
  HubSpotIcon,
};
