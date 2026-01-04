import { cn } from "@/lib/utils";

// SVG path definitions for the ABM.dev logo mark
const svgPaths = {
  p3588ee00: "M32 60.8C47.9058 60.8 60.8 47.9058 60.8 32C60.8 16.0942 47.9058 3.2 32 3.2C16.0942 3.2 3.2 16.0942 3.2 32C3.2 47.9058 16.0942 60.8 32 60.8Z",
  p1f4b7070: "M19.2 35.84C21.3208 35.84 23.04 34.1208 23.04 32C23.04 29.8792 21.3208 28.16 19.2 28.16C17.0792 28.16 15.36 29.8792 15.36 32C15.36 34.1208 17.0792 35.84 19.2 35.84Z",
  p3a6921c0: "M23.04 32L32 22.4V41.6L23.04 32Z",
  p209dee70: "M44.8 35.84C46.9208 35.84 48.64 34.1208 48.64 32C48.64 29.8792 46.9208 28.16 44.8 28.16C42.6792 28.16 40.96 29.8792 40.96 32C40.96 34.1208 42.6792 35.84 44.8 35.84Z",
  p1e5256c0: "M49.1968 49.1968L51.007 51.007",
  p6a2a180: "M14.8032 49.1968L12.993 51.007",
  p374c5180: "M14.8032 14.8032L12.993 12.993",
  p1be96a00: "M49.1968 14.8032L51.007 12.993",
};

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ variant = 'light', size = 'md', className = '' }: LogoProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-8',
      icon: 'w-8 h-8',
      abmText: 'text-[28px] leading-[32px]',
      devText: 'text-[28px] leading-[32px]',
      spacing: 'ml-2'
    },
    md: {
      container: 'h-10',
      icon: 'w-10 h-10',
      abmText: 'text-[32px] leading-[40px]',
      devText: 'text-[32px] leading-[40px]',
      spacing: 'ml-2.5'
    },
    lg: {
      container: 'h-16',
      icon: 'w-16 h-16',
      abmText: 'text-[42px] leading-[63px]',
      devText: 'text-[42px] leading-[63px]',
      spacing: 'ml-3'
    }
  };

  const config = sizeConfig[size];

  // Color configurations
  const iconStroke = variant === 'dark' ? '#40E0D0' : '#20B2AA';
  const iconFillTurquoise = variant === 'dark' ? '#40E0D0' : '#20B2AA';
  const iconFillRed = '#FF6347';
  const iconFillBlue = '#0084FF';
  const abmColor = variant === 'dark' ? 'text-white' : 'text-[#0A1F3D]';
  const devColor = 'text-[#0084FF]';

  return (
    <div className={cn(`flex items-center ${config.container}`, className)}>
      {/* Icon Mark */}
      <div className={`relative ${config.icon} flex-shrink-0`}>
        <svg className="block w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 64 64">
          <g>
            <path d={svgPaths.p3588ee00} stroke={iconStroke} strokeWidth="1.92" />
            <path d={svgPaths.p1f4b7070} fill={iconFillTurquoise} />
            <path d={svgPaths.p3a6921c0} fill={iconFillRed} opacity="0.8" />
            <path d={svgPaths.p209dee70} fill={iconFillBlue} />
            <path d="M23.04 32H28.16" stroke={iconStroke} strokeWidth="1.28" />
            <path d="M35.84 32H40.96" stroke={iconFillBlue} strokeWidth="1.28" />
            <path d="M56.32 32H58.88" opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d={svgPaths.p1e5256c0} opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d="M32 56.32V58.88" opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d={svgPaths.p6a2a180} opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d="M7.68 32H5.12" opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d={svgPaths.p374c5180} opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d="M32 7.68V5.12" opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
            <path d={svgPaths.p1be96a00} opacity="0.6" stroke={iconStroke} strokeWidth="1.28" />
          </g>
        </svg>
      </div>

      {/* Wordmark */}
      <div className={`flex items-center ${config.spacing}`}>
        <span
          className={`${abmColor} ${config.abmText} tracking-[-0.05em]`}
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
        >
          abm
        </span>
        <span
          className={`${devColor} ${config.devText} tracking-[-0.05em]`}
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
        >
          .dev
        </span>
      </div>
    </div>
  );
}
