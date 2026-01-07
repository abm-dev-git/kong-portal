"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPageNavigation } from "@/lib/docs-navigation";

export function PageNavigation() {
  const pathname = usePathname();
  const { prev, next } = getPageNavigation(pathname);

  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Page navigation"
      className="mt-12 pt-8 border-t border-[var(--turquoise)]/20"
    >
      <div className="flex justify-between gap-4">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex-1 max-w-[50%] p-4 rounded-lg border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all"
          >
            <div className="flex items-center gap-2 text-sm text-[var(--cream)]/60 mb-1">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Previous
            </div>
            <div className="font-medium text-[var(--cream)] group-hover:text-[var(--turquoise)] transition-colors">
              {prev.title}
            </div>
            {prev.category && (
              <div className="text-xs text-[var(--cream)]/50 mt-1">
                {prev.category}
              </div>
            )}
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={next.href}
            className="group flex-1 max-w-[50%] p-4 rounded-lg border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all text-right ml-auto"
          >
            <div className="flex items-center justify-end gap-2 text-sm text-[var(--cream)]/60 mb-1">
              Next
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="font-medium text-[var(--cream)] group-hover:text-[var(--turquoise)] transition-colors">
              {next.title}
            </div>
            {next.category && (
              <div className="text-xs text-[var(--cream)]/50 mt-1">
                {next.category}
              </div>
            )}
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
