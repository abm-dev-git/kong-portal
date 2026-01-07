'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[var(--turquoise)] focus:text-[var(--dark-blue)] focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--turquoise)]"
    >
      Skip to main content
    </a>
  );
}
