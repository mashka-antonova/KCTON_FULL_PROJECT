import * as React from "react"
import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const BentoCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-lg relative overflow-hidden",
        "shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]",
        className
      )}
      {...props}
    />
  )
)
BentoCard.displayName = "BentoCard"

export { BentoCard }