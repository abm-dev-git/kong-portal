import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/lib/context/theme-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kong Portal - ABM.dev Developer Portal",
  description: "Developer portal for ABM.dev API with Kong Gateway integration",
};

// ABM.dev Dark Theme for Clerk
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#40E0D0",
    colorBackground: "#0A1F3D",
    colorInputBackground: "rgba(64, 224, 208, 0.05)",
    colorInputText: "#FAEBD7",
    colorText: "#FAEBD7",
    colorTextSecondary: "rgba(250, 235, 215, 0.7)",
    colorDanger: "#ef4444",
    borderRadius: "0.5rem",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  elements: {
    // Modal and card
    modalBackdrop: "bg-[#0A1F3D]/90 backdrop-blur-sm",
    card: "bg-[#0A1F3D] border border-[#40E0D0]/20 shadow-xl",
    rootBox: "bg-transparent",

    // Header
    headerTitle: "text-[#FAEBD7]",
    headerSubtitle: "text-[#FAEBD7]/70",

    // Form elements
    formFieldLabel: "text-[#FAEBD7]",
    formFieldInput: "bg-[#40E0D0]/5 border-[#40E0D0]/20 text-[#FAEBD7] focus:border-[#40E0D0] focus:ring-[#40E0D0]/20",
    formFieldInputShowPasswordButton: "text-[#FAEBD7]/60 hover:text-[#40E0D0]",

    // Buttons
    formButtonPrimary: "bg-[#40E0D0] text-[#0A1F3D] hover:bg-[#20B2AA] font-semibold",
    formButtonReset: "text-[#40E0D0] hover:text-[#FAEBD7]",

    // Social buttons
    socialButtonsBlockButton: "bg-[#40E0D0]/10 border-[#40E0D0]/20 text-[#FAEBD7] hover:bg-[#40E0D0]/20 hover:border-[#40E0D0]/40",
    socialButtonsBlockButtonText: "text-[#FAEBD7]",

    // Divider
    dividerLine: "bg-[#40E0D0]/20",
    dividerText: "text-[#FAEBD7]/60",

    // Footer
    footerActionLink: "text-[#40E0D0] hover:text-[#FAEBD7]",
    footerActionText: "text-[#FAEBD7]/60",

    // Alerts
    alert: "bg-[#40E0D0]/10 border-[#40E0D0]/20",
    alertText: "text-[#FAEBD7]",

    // Identity preview
    identityPreview: "bg-[#40E0D0]/5 border-[#40E0D0]/20",
    identityPreviewText: "text-[#FAEBD7]",
    identityPreviewEditButton: "text-[#40E0D0] hover:text-[#FAEBD7]",

    // User button
    userButtonPopoverCard: "bg-[#0A1F3D] border-[#40E0D0]/20",
    userButtonPopoverActionButton: "text-[#FAEBD7] hover:bg-[#40E0D0]/10",
    userButtonPopoverActionButtonText: "text-[#FAEBD7]",
    userButtonPopoverFooter: "border-t-[#40E0D0]/20",
  },
};

// Inline script to prevent theme flash - runs before React hydration
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('abm-dev-theme');
    var isDark = theme === 'dark' || theme === null ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body className="antialiased">
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
