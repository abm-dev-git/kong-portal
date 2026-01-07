"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  Zap,
  Briefcase,
  Building2,
  Linkedin,
  Settings,
  Key,
} from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  items?: NavItem[];
}

const methodColors = {
  GET: "text-emerald-400",
  POST: "text-blue-400",
  PUT: "text-amber-400",
  DELETE: "text-red-400",
  PATCH: "text-purple-400",
};

const apiNavigation: NavItem[] = [
  {
    title: "Overview",
    href: "/api-reference",
    icon: <FileCode className="w-4 h-4" />,
  },
  {
    title: "Enrichment",
    icon: <Zap className="w-4 h-4" />,
    items: [
      { title: "Enrich Contact", href: "/api-reference/enrichment#enrich", method: "POST" },
      { title: "Batch Enrich", href: "/api-reference/enrichment#batch", method: "POST" },
    ],
  },
  {
    title: "Jobs",
    icon: <Briefcase className="w-4 h-4" />,
    items: [
      { title: "List Jobs", href: "/api-reference/jobs#list", method: "GET" },
      { title: "Get Job", href: "/api-reference/jobs#get", method: "GET" },
      { title: "Get Results", href: "/api-reference/jobs#results", method: "GET" },
    ],
  },
  {
    title: "CRM Integrations",
    icon: <Building2 className="w-4 h-4" />,
    items: [
      { title: "List Integrations", href: "/api-reference/integrations#list", method: "GET" },
      { title: "Configure", href: "/api-reference/integrations#configure", method: "POST" },
      { title: "Test Connection", href: "/api-reference/integrations#test", method: "POST" },
      { title: "Delete Integration", href: "/api-reference/integrations#delete", method: "DELETE" },
    ],
  },
  {
    title: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    items: [
      { title: "Initialize", href: "/api-reference/linkedin#initialize", method: "POST" },
      { title: "Verify", href: "/api-reference/linkedin#verify", method: "POST" },
      { title: "Get Status", href: "/api-reference/linkedin#status", method: "GET" },
      { title: "Availability", href: "/api-reference/linkedin#availability", method: "GET" },
      { title: "Disconnect", href: "/api-reference/linkedin#disconnect", method: "DELETE" },
      { title: "Cleanup Sessions", href: "/api-reference/linkedin#cleanup", method: "POST" },
    ],
  },
  {
    title: "Configuration",
    icon: <Settings className="w-4 h-4" />,
    items: [
      { title: "Organization", href: "/api-reference/configuration#organization", method: "GET" },
      { title: "Update Settings", href: "/api-reference/configuration#update-settings", method: "PATCH" },
      { title: "Health Check", href: "/api-reference/configuration#status", method: "GET" },
    ],
  },
];

interface NavSectionProps {
  item: NavItem;
  pathname: string;
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={cn("font-mono text-xs font-medium", methodColors[method as keyof typeof methodColors])}>
      {method}
    </span>
  );
}

function NavSection({ item, pathname }: NavSectionProps) {
  const hasChildren = item.items && item.items.length > 0;
  const isActive = item.href === pathname || pathname.startsWith(item.href + "#");
  const isChildActive = hasChildren && item.items?.some(
    child => pathname === child.href || pathname.startsWith((child.href || "").split("#")[0])
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
                  "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === child.href
                    ? "text-[var(--turquoise)] bg-[var(--turquoise)]/10 font-medium"
                    : "text-[var(--cream)]/60 hover:text-[var(--cream)] hover:bg-[var(--turquoise)]/5"
                )}
              >
                <span>{child.title}</span>
                {child.method && <MethodBadge method={child.method} />}
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

export function ApiSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-6">
        {/* Logo/Title */}
        <div className="px-3">
          <Link
            href="/api-reference"
            className="flex items-center gap-2 text-lg font-semibold text-[var(--cream)]"
          >
            <FileCode className="w-5 h-5 text-[var(--turquoise)]" />
            API Reference
          </Link>
          <p className="mt-1 text-sm text-[var(--cream)]/50">
            v1.0 &middot; REST API
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-1" aria-label="API reference navigation">
          {apiNavigation.map((item) => (
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
              href="/api-keys"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--cream)]/60 hover:text-[var(--cream)] rounded-md transition-colors"
            >
              <Key className="w-4 h-4" />
              Get API Key
            </Link>
            <Link
              href="/docs"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--cream)]/60 hover:text-[var(--cream)] rounded-md transition-colors"
            >
              <FileCode className="w-4 h-4" />
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
