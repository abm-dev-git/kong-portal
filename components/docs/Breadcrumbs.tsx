"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getBreadcrumbs } from "@/lib/docs-navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1 text-sm text-[var(--cream)]/60">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[var(--turquoise)] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-[var(--cream)]/40" />
            {crumb.href && index < breadcrumbs.length - 1 ? (
              <Link
                href={crumb.href}
                className="hover:text-[var(--turquoise)] transition-colors"
              >
                {crumb.title}
              </Link>
            ) : (
              <span className={index === breadcrumbs.length - 1 ? "text-[var(--cream)]" : ""}>
                {crumb.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
