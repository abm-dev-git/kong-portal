"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

interface NavigationProps {
  className?: string;
  variant?: "dark" | "light";
}

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "#pricing" },
];

export function Navigation({ className, variant = "dark" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Only render auth-dependent UI after hydration to prevent mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isLight = variant === "light";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md",
        isLight
          ? "border-gray-200 bg-white/95"
          : "border-white/10 bg-white",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="ABM.dev home">
              <Logo variant="light" size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8" aria-label="Main navigation">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors text-sm font-medium",
                  isLight
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-gray-700 hover:text-[var(--dark-blue)]"
                )}
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {mounted && (
              <>
                <SignedIn>
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => router.push("/dashboard")}
                    className={cn(
                      "font-semibold",
                      isLight
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
                    )}
                    aria-label="Go to dashboard"
                  >
                    Dashboard
                  </Button>
                  <UserMenu />
                </SignedIn>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button
                      variant="default"
                      size="default"
                      className="font-semibold bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
                      aria-label="Get started"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <SignedIn>
                <UserMenu size="sm" />
              </SignedIn>
            )}
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md transition-colors",
                isLight
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  : "text-[var(--cream)] hover:text-[var(--turquoise)] hover:bg-[var(--turquoise)]/10"
              )}
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={cn(
          "md:hidden border-t animate-slide-in",
          isLight
            ? "border-gray-200 bg-white"
            : "border-[var(--turquoise)]/20 bg-[var(--dark-blue)]"
        )}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3" aria-label="Mobile navigation">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors text-base font-medium py-2",
                    isLight
                      ? "text-gray-700 hover:text-gray-900"
                      : "text-[var(--cream)] hover:text-[var(--turquoise)]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className={cn(
              "flex flex-col gap-3 pt-4 border-t",
              isLight ? "border-gray-200" : "border-[var(--turquoise)]/20"
            )}>
              {mounted && (
                <>
                  <SignedIn>
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push("/dashboard");
                      }}
                      className={cn(
                        "w-full font-semibold",
                        isLight
                          ? "bg-gray-900 text-white hover:bg-gray-800"
                          : "bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
                      )}
                      aria-label="Go to dashboard"
                    >
                      Dashboard
                    </Button>
                  </SignedIn>
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <Button
                        variant="default"
                        size="lg"
                        className={cn(
                          "w-full font-semibold",
                          isLight
                            ? "bg-gray-900 text-white hover:bg-gray-800"
                            : "bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
                        )}
                        aria-label="Get started"
                      >
                        Get Started
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
