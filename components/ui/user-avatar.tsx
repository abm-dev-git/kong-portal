'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getGravatarUrl, getInitials, getAvatarColor } from '@/lib/utils/gravatar';

export interface UserAvatarProps {
  email?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const sizePx = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function UserAvatar({ email, name, size = 'md', className }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const gravatarUrl = email ? getGravatarUrl(email, sizePx[size] * 2, '404') : '';
  const initials = getInitials(name, email);
  const bgColor = getAvatarColor(email || name);

  const showGravatar = gravatarUrl && !imageError;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-semibold',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: !showGravatar || !imageLoaded ? bgColor : 'transparent' }}
    >
      {/* Initials fallback - always render underneath */}
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center text-white',
          imageLoaded && showGravatar && 'opacity-0'
        )}
      >
        {initials}
      </span>

      {/* Gravatar image - on top when loaded */}
      {showGravatar && (
        <img
          src={gravatarUrl}
          alt={name || email || 'User avatar'}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-200',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
