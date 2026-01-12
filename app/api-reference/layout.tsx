import { Navigation } from "@/components/shared/Navigation";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Breadcrumbs } from "@/components/docs/Breadcrumbs";
import { PageNavigation } from "@/components/docs/PageNavigation";

export const metadata = {
  title: "API Reference - ABM.dev",
  description: "Complete API documentation for ABM.dev enrichment and integration APIs",
};

export default function ApiReferenceLayout({
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
