import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-blue-400/20',
        outline:
          'border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-200 hover:text-white backdrop-blur-sm',
        secondary:
          'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700/50',
        ghost:
          'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60',
        destructive:
          'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        link: 'text-blue-400 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        xs: 'h-7 rounded-lg px-2.5 text-xs',
        sm: 'h-8.5 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-sm sm:text-base font-semibold',
        icon: 'size-9 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const combinedClassName = cn(buttonVariants({ variant, size, className }))

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>
      return React.cloneElement(child, {
        className: cn(combinedClassName, child.props.className),
        ...props,
      })
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
