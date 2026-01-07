import Link from "next/link";
import { Navigation } from "@/components/shared/Navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--dark-blue)]">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Graphic */}
          <div className="mb-8">
            <span className="text-8xl font-serif text-[var(--turquoise)]">404</span>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-serif text-[var(--cream)] mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-[var(--cream)]/70 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
            >
              <Link href="/docs">
                <Search className="w-4 h-4 mr-2" />
                Browse Docs
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <h2 className="text-lg font-medium text-[var(--cream)] mb-4">
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <Link
                href="/docs/getting-started"
                className="flex items-center gap-2 p-3 rounded-md text-[var(--cream)]/70 hover:text-[var(--turquoise)] hover:bg-[var(--turquoise)]/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                Getting Started
              </Link>
              <Link
                href="/api-reference"
                className="flex items-center gap-2 p-3 rounded-md text-[var(--cream)]/70 hover:text-[var(--turquoise)] hover:bg-[var(--turquoise)]/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                API Reference
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 p-3 rounded-md text-[var(--cream)]/70 hover:text-[var(--turquoise)] hover:bg-[var(--turquoise)]/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 p-3 rounded-md text-[var(--cream)]/70 hover:text-[var(--turquoise)] hover:bg-[var(--turquoise)]/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
