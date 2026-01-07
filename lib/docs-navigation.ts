// Shared docs navigation config for sidebar, breadcrumbs, and prev/next navigation
export interface DocsPage {
  title: string;
  href: string;
  category?: string;
}

// Flat list of all docs pages in order
export const docsPages: DocsPage[] = [
  { title: "Getting Started", href: "/docs/getting-started", category: "Getting Started" },
  { title: "Authentication", href: "/docs/concepts/authentication", category: "Concepts" },
  { title: "Canonical Fields", href: "/docs/concepts/canonical-fields", category: "Concepts" },
  { title: "Confidence Scores", href: "/docs/concepts/confidence-scores", category: "Concepts" },
  { title: "Data Sources", href: "/docs/concepts/data-sources", category: "Concepts" },
  { title: "Enrichment", href: "/docs/concepts/enrichment", category: "Concepts" },
  { title: "Field Mapping", href: "/docs/concepts/field-mapping", category: "Concepts" },
  { title: "HubSpot Integration", href: "/docs/guides/hubspot", category: "Integration Guides" },
  { title: "LinkedIn Connection", href: "/docs/guides/linkedin", category: "Integration Guides" },
  { title: "Enrichment Configuration", href: "/docs/advanced/enrichment-config", category: "Advanced" },
];

// Get prev/next pages for navigation
export function getPageNavigation(currentPath: string): { prev: DocsPage | null; next: DocsPage | null } {
  const currentIndex = docsPages.findIndex(page => page.href === currentPath);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? docsPages[currentIndex - 1] : null,
    next: currentIndex < docsPages.length - 1 ? docsPages[currentIndex + 1] : null,
  };
}

// Get breadcrumb path for a docs page
export function getBreadcrumbs(currentPath: string): { title: string; href: string }[] {
  const breadcrumbs: { title: string; href: string }[] = [
    { title: "Documentation", href: "/docs" },
  ];

  const page = docsPages.find(p => p.href === currentPath);
  if (page) {
    if (page.category) {
      breadcrumbs.push({ title: page.category, href: "" }); // No link for category
    }
    breadcrumbs.push({ title: page.title, href: page.href });
  }

  return breadcrumbs;
}
