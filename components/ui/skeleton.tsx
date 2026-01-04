import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton Loading Components
 * A suite of skeleton loading components for creating placeholder UI while content is being fetched.
 */

// Base Skeleton component
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-md bg-[var(--turquoise)]/10",
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

/**
 * SkeletonText - for text content placeholders
 */
export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: "full" | "3/4" | "1/2" | "1/4";
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, lastLineWidth = "3/4" }, ref) => {
    const lastWidthClass = {
      full: "w-full",
      "3/4": "w-3/4",
      "1/2": "w-1/2",
      "1/4": "w-1/4",
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i === lines - 1 ? lastWidthClass[lastLineWidth] : "w-full"
            )}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = "SkeletonText";

/**
 * SkeletonCard - for card content placeholders
 */
export interface SkeletonCardProps {
  hasHeader?: boolean;
  hasFooter?: boolean;
  className?: string;
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ hasHeader = true, hasFooter = false, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-[var(--turquoise)]/20 bg-[var(--navy)] p-6",
          className
        )}
      >
        {hasHeader && (
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        )}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        {hasFooter && (
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        )}
      </div>
    );
  }
);
SkeletonCard.displayName = "SkeletonCard";

/**
 * SkeletonList - for list item placeholders
 */
export interface SkeletonListProps {
  count?: number;
  hasAvatar?: boolean;
  className?: string;
}

const SkeletonList = React.forwardRef<HTMLDivElement, SkeletonListProps>(
  ({ count = 5, hasAvatar = false, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            {hasAvatar && <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
SkeletonList.displayName = "SkeletonList";

/**
 * SkeletonAvatar - for avatar/profile picture placeholders
 */
export interface SkeletonAvatarProps {
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}

const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = "default", className }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    return (
      <Skeleton
        ref={ref}
        className={cn("rounded-full", sizeClasses[size], className)}
      />
    );
  }
);
SkeletonAvatar.displayName = "SkeletonAvatar";

/**
 * SkeletonButton - for button placeholders
 */
export interface SkeletonButtonProps {
  size?: "sm" | "default" | "lg";
  width?: "auto" | "full";
  className?: string;
}

const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonButtonProps>(
  ({ size = "default", width = "auto", className }, ref) => {
    const sizeClasses = {
      sm: "h-8",
      default: "h-10",
      lg: "h-12",
    };

    const widthClasses = {
      auto: "w-24",
      full: "w-full",
    };

    return (
      <Skeleton
        ref={ref}
        className={cn(
          "rounded-md",
          sizeClasses[size],
          widthClasses[width],
          className
        )}
      />
    );
  }
);
SkeletonButton.displayName = "SkeletonButton";

export {
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonList,
  SkeletonAvatar,
  SkeletonButton,
};
