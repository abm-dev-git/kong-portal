import md5 from 'md5';

export type GravatarFallback = 'mp' | 'identicon' | 'retro' | 'robohash' | 'blank' | '404';

/**
 * Generate a Gravatar URL from an email address
 * @param email - User's email address
 * @param size - Image size in pixels (1-2048, default 80)
 * @param fallback - Fallback behavior when no Gravatar exists
 *   - 'mp': Mystery person silhouette
 *   - 'identicon': Geometric pattern based on email hash
 *   - 'retro': 8-bit arcade style face
 *   - 'robohash': Robot avatar
 *   - 'blank': Transparent PNG
 *   - '404': Return 404 error (useful for detecting no Gravatar)
 * @returns Gravatar URL
 */
export function getGravatarUrl(
  email: string,
  size: number = 80,
  fallback: GravatarFallback = '404'
): string {
  if (!email) {
    return '';
  }

  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${fallback}`;
}

/**
 * Get initials from a name for avatar fallback
 * @param name - Full name or single name
 * @returns 1-2 character initials
 */
export function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  if (email) {
    return email[0].toUpperCase();
  }

  return '?';
}

/**
 * Generate a consistent background color from a string (email or name)
 * @param str - String to hash for color generation
 * @returns HSL color string
 */
export function getAvatarColor(str?: string | null): string {
  if (!str) {
    return 'hsl(180, 70%, 45%)'; // Default turquoise
  }

  // Simple hash to generate a hue
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to pick a hue (0-360)
  const hue = Math.abs(hash % 360);

  // Return a nice saturated color
  return `hsl(${hue}, 65%, 45%)`;
}
