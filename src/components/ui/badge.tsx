import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-blue-600 text-white shadow-sm',
        secondary:
          'border-zinc-700/60 bg-zinc-800/80 text-zinc-300',
        destructive:
          'border-red-500/30 bg-red-500/10 text-red-400',
        outline: 'border-zinc-800 text-zinc-300 bg-zinc-900/50',
        success:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        warning:
          'border-amber-500/30 bg-amber-500/10 text-amber-400',
        accent:
          'border-blue-500/30 bg-blue-500/10 text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
