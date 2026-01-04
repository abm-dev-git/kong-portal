"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

interface NavigationProps {
  className?: string;
}

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "#pricing" },
  { label: "API Reference", href: "/api-reference" },
];

export function Navigation({ className }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-[var(--turquoise)]/20 bg-[var(--dark-blue)]/95 backdrop-blur-md",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center" aria-label="ABM.dev home">
              <Logo variant="dark" size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8" aria-label="Main navigation">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--cream)] hover:text-[var(--turquoise)] transition-colors text-sm font-medium"
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {isSignedIn ? (
              <>
                <Button
                  variant="default"
                  size="default"
                  onClick={() => router.push("/dashboard")}
                  className="bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-semibold"
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="default"
                    className="text-[var(--cream)] hover:text-[var(--cream)] hover:bg-[var(--turquoise)]/15 font-medium"
                    aria-label="Sign in to your account"
                  >
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    variant="default"
                    size="default"
                    className="bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-semibold"
                    aria-label="Get started"
                  >
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--cream)] hover:text-[var(--turquoise)] hover:bg-[var(--turquoise)]/10 transition-colors"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--turquoise)]/20 bg-[var(--dark-blue)] animate-slide-in">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-3" aria-label="Mobile navigation">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--cream)] hover:text-[var(--turquoise)] transition-colors text-base font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-[var(--turquoise)]/20">
              {isSignedIn ? (
                <>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/dashboard");
                    }}
                    className="w-full bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-semibold"
                    aria-label="Go to dashboard"
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-[var(--cream)] border-[var(--turquoise)]/30 hover:bg-[var(--turquoise)]/15 hover:border-[var(--turquoise)]/50"
                      aria-label="Sign in to your account"
                    >
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)] font-semibold"
                      aria-label="Get started"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
