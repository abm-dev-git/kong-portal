import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-[var(--turquoise)]/20',
          'bg-[var(--turquoise)]/5 px-3 py-2 text-sm text-[var(--cream)]',
          'ring-offset-background file:border-0 file:bg-transparent',
          'file:text-sm file:font-medium file:text-[var(--cream)]',
          'placeholder:text-[var(--cream)]/40',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--turquoise)]/50 focus-visible:border-[var(--turquoise)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
