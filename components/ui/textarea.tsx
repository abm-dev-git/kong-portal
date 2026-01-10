import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[var(--turquoise)]/20 bg-[var(--dark-blue)] px-3 py-2 text-sm text-[var(--cream)] ring-offset-[var(--dark-blue)] placeholder:text-[var(--cream)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--turquoise)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
