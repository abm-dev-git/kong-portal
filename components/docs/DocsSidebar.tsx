"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Rocket,
  BookOpen,
  Key,
  Puzzle,
  Zap,
  Building2,
  Linkedin,
  FileCode,
  Settings2,
  Database,
  TrendingUp,
  Layers,
  ArrowLeftRight
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

const docsNavigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: <Rocket className="w-4 h-4" />,
  },
  {
    title: "Concepts",
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { title: "Authentication", href: "/docs/concepts/authentication" },
      { title: "Canonical Fields", href: "/docs/concepts/canonical-fields", icon: <Layers className="w-4 h-4" /> },
      { title: "Confidence Scores", href: "/docs/concepts/confidence-scores", icon: <TrendingUp className="w-4 h-4" /> },
      { title: "Data Sources", href: "/docs/concepts/data-sources", icon: <Database className="w-4 h-4" /> },
      { title: "Enrichment", href: "/docs/concepts/enrichment" },
      { title: "Field Mapping", href: "/docs/concepts/field-mapping", icon: <ArrowLeftRight className="w-4 h-4" /> },
    ],
  },
  {
    title: "Integration Guides",
    icon: <Puzzle className="w-4 h-4" />,
    items: [
      {
        title: "HubSpot",
        href: "/docs/guides/hubspot",
        icon: <Building2 className="w-4 h-4" />
      },
      {
        title: "LinkedIn",
        href: "/docs/guides/linkedin",
        icon: <Linkedin className="w-4 h-4" />
      },
    ],
  },
  {
    title: "Advanced",
    icon: <Settings2 className="w-4 h-4" />,
    items: [
      { title: "Enrichment Configuration", href: "/docs/advanced/enrichment-config" },
    ],
  },
  {
    title: "API Reference",
    href: "/api-reference",
    icon: <FileCode className="w-4 h-4" />,
  },
];

interface NavSectionProps {
  item: NavItem;
  pathname: string;
}

function NavSection({ item, pathname }: NavSectionProps) {
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.href === pathname;
  const isChildActive = hasChildren && item.items?.some(
    child => child.href === pathname
  );
  const [isOpen, setIsOpen] = useState(isChildActive || false);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
            "text-[var(--cream)]/70 hover:text-[var(--cream)] hover:bg-[var(--turquoise)]/10",
            isChildActive && "text-[var(--cream)]"
          )}
        >
          <span className="flex items-center gap-2">
            {item.icon}
            {item.title}
          </span>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isOpen && (
          <div className="ml-4 pl-3 border-l border-[var(--turquoise)]/20 space-y-1">
            {item.items?.map((child) => (
              <Link
                key={child.href}
                href={child.href!}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === child.href
                    ? "text-[var(--turquoise)] bg-[var(--turquoise)]/10 font-medium"
                    : "text-[var(--cream)]/60 hover:text-[var(--cream)] hover:bg-[var(--turquoise)]/5"
                )}
              >
                {child.icon}
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
        isActive
          ? "text-[var(--turquoise)] bg-[var(--turquoise)]/10 font-medium"
          : "text-[var(--cream)]/70 hover:text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
      )}
    >
      {item.icon}
      {item.title}
    </Link>
  );
}

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* Logo/Title */}
        <div className="px-3">
          <Link
            href="/docs"
            className="flex items-center gap-2 text-lg font-semibold text-[var(--cream)]"
          >
            <Zap className="w-5 h-5 text-[var(--turquoise)]" />
            Documentation
          </Link>
          <p className="mt-1 text-sm text-[var(--cream)]/50">
            Learn how to use ABM.dev
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1" aria-label="Documentation navigation">
          {docsNavigation.map((item) => (
            <NavSection key={item.title} item={item} pathname={pathname} />
          ))}
        </nav>

        {/* Quick Links */}
        <div className="px-3 pt-4 border-t border-[var(--turquoise)]/20">
          <p className="text-xs font-medium text-[var(--cream)]/40 uppercase tracking-wide mb-2">
            Resources
          </p>
          <div className="space-y-1">
            <Link
              href="/dashboard/api-keys"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--cream)]/60 hover:text-[var(--cream)] rounded-md transition-colors"
            >
              <Key className="w-4 h-4" />
              Get API Key
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
