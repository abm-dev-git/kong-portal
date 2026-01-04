import { Mail } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

type FooterVariant = "stacked" | "columns" | "centered" | "minimal";

interface FooterProps {
  variant?: FooterVariant;
  theme?: "light" | "dark";
}

export function Footer({ variant = "columns", theme = "dark" }: FooterProps) {
  const bgColor = theme === "dark" ? "bg-[#1a1a2e]" : "bg-[#FAEBD7]";
  const textColor = theme === "dark" ? "text-[#FAEBD7]/80" : "text-[#0A1F3D]/80";
  const headingColor = theme === "dark" ? "text-[#FAEBD7]" : "text-[#0A1F3D]";
  const linkColor = theme === "dark" ? "text-[#40E0D0] hover:text-[#40E0D0]/80" : "text-[#0084FF] hover:text-[#0084FF]/80";
  const borderColor = theme === "dark" ? "border-[#40E0D0]/20" : "border-[#0A1F3D]/20";

  return (
    <footer className={cn(bgColor, "border-t", borderColor)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="mb-8">
          <Logo variant={theme} size="md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Company Info */}
          <div>
            <h3 className={cn(headingColor, "mb-4")} style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Foxley Farm Operations, LTD
            </h3>
            <div className="space-y-1">
              <p className={cn("text-sm", textColor)} style={{ fontFamily: 'Courier New, monospace' }}>
                Company No. 16392009
              </p>
              <p className={cn("text-sm", textColor)} style={{ fontFamily: 'Courier New, monospace' }}>
                Registered in England and Wales
              </p>
            </div>
          </div>

          {/* Column 2: Address */}
          <div>
            <h4 className={cn("text-sm", headingColor, "mb-4")}>Registered Office</h4>
            <address className={cn("text-sm", textColor, "not-italic")} style={{ fontFamily: 'Courier New, monospace' }}>
              One Express C/O Beever And Struthers<br />
              1 George Leigh Street<br />
              Manchester, United Kingdom<br />
              M4 5DL
            </address>
          </div>

          {/* Column 3: Contact & Legal Links */}
          <div>
            <h4 className={cn("text-sm", headingColor, "mb-4")}>Contact & Legal</h4>
            <div className="space-y-4">
              <a
                href="mailto:info@abm.dev"
                className={cn("text-sm", linkColor, "flex items-center gap-2 transition-colors")}
                style={{ fontFamily: 'Courier New, monospace' }}
              >
                <Mail className="w-4 h-4" />
                info@abm.dev
              </a>
              <div className="space-y-2">
                <a
                  href="https://www.notion.so/Privacy-Policy-UK-abm-dev-9f9d60805dfc4079a7ce9215874caacd?pvs=21"
                  className={cn("text-sm", linkColor, "block transition-colors")}
                  style={{ fontFamily: 'Courier New, monospace' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://www.notion.so/Terms-of-Use-UK-abm-dev-6cbb9dcf3c254d30bbff27249ac8ce11?pvs=21"
                  className={cn("text-sm", linkColor, "block transition-colors")}
                  style={{ fontFamily: 'Courier New, monospace' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>
                <a
                  href="https://www.notion.so/Cookie-Policy-UK-abm-dev-0ff28e490c0e4c3ea074f2e9ac32b84c?pvs=21"
                  className={cn("text-sm", linkColor, "block transition-colors")}
                  style={{ fontFamily: 'Courier New, monospace' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={cn("mt-12 pt-8 border-t", borderColor)}>
          <p className={cn("text-sm", textColor, "text-center")} style={{ fontFamily: 'Courier New, monospace' }}>
            &copy; {new Date().getFullYear()} Foxley Farm Operations, LTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
