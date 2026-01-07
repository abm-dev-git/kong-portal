import { Navigation } from "@/components/shared/Navigation";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { PageNavigation } from "@/components/docs/PageNavigation";

export const metadata = {
  title: "Documentation - ABM.dev",
  description: "Learn how to use ABM.dev for data enrichment and CRM integration",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--dark-blue)]">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <DocsSidebar />
          <main id="main-content" className="flex-1 min-w-0 max-w-4xl">
            <Breadcrumbs />
            {children}
            <PageNavigation />
          </main>
        </div>
      </div>
    </div>
  );
}
