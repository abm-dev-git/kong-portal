// Brand icons for integrations
// SVG paths sourced from official brand guidelines

import * as React from 'react'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

export function HubSpotIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.984v-.066a2.198 2.198 0 00-4.396 0V3.1c0 .9.54 1.67 1.313 2.012v2.789a5.42 5.42 0 00-2.477 1.277l-6.44-5.019a2.385 2.385 0 00.092-.642v-.065a2.385 2.385 0 10-2.556 2.376 2.375 2.375 0 001.045-.239l6.317 4.923a5.454 5.454 0 00-.77 2.796 5.464 5.464 0 00.787 2.843l-1.907 1.907a1.81 1.81 0 00-.527-.082 1.834 1.834 0 101.833 1.833c0-.184-.029-.36-.08-.527l1.89-1.89a5.456 5.456 0 108.009-8.463 5.426 5.426 0 00-3.4-1.092zm-.117 8.442a2.85 2.85 0 110-5.702 2.85 2.85 0 010 5.702z" />
    </svg>
  )
}

export function SalesforceIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.98 6.182a4.27 4.27 0 013.38-1.655 4.277 4.277 0 013.967 2.674 3.643 3.643 0 011.404-.28 3.675 3.675 0 013.678 3.678 3.643 3.643 0 01-.285 1.416 3.196 3.196 0 011.877 2.914 3.203 3.203 0 01-3.203 3.203 3.203 3.203 0 01-.54-.046 3.95 3.95 0 01-3.487 2.089 3.947 3.947 0 01-1.772-.418 4.494 4.494 0 01-7.83-1.573 3.315 3.315 0 01-.616.058 3.34 3.34 0 01-3.34-3.34 3.34 3.34 0 012.035-3.074 4.072 4.072 0 01-.19-1.234 4.094 4.094 0 014.094-4.094 4.072 4.072 0 01.828.085z" />
    </svg>
  )
}

export function DynamicsIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 4.5v6.75l-7.5 4.5-7.5-4.5V4.5L12 9l7.5-4.5zM12 11.25l7.5-4.5V15l-7.5 4.5L4.5 15V6.75l7.5 4.5z" />
    </svg>
  )
}

// LinkedIn icon wrapper to match brand icon interface
export function LinkedInIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
