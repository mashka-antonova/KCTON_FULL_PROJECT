import * as React from "react"
import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Light mode: clean white card with soft shadow and defined border
        "rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden",
        // Dark mode: glass card matching original design
        "dark:bg-white/[0.04] dark:border-white/10 dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] dark:backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
)
BentoCard.displayName = "BentoCard"

export { BentoCard }
