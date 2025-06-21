"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: cn(
          "bg-gradient-to-r from-cyan-500 to-blue-600 text-white",
          "shadow-lg shadow-cyan-500/20",
          "hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/30",
          "active:scale-[0.98] transform transition-transform",
          "focus-visible:ring-cyan-400/50"
        ),
        destructive: cn(
          "bg-gradient-to-r from-red-500 to-pink-600 text-white",
          "shadow-lg shadow-red-500/20",
          "hover:from-red-400 hover:to-pink-500",
          "focus-visible:ring-red-400/50"
        ),
        outline: cn(
          "border border-cyan-400/30 bg-transparent text-cyan-100",
          "hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 hover:text-white",
          "focus-visible:ring-cyan-400/50"
        ),
        secondary: cn(
          "bg-gray-800/60 text-gray-200 border border-gray-700",
          "hover:bg-gray-800/80 hover:border-gray-600",
          "focus-visible:ring-cyan-400/50"
        ),
        ghost: cn(
          "text-cyan-300 hover:bg-cyan-500/10 hover:text-white",
          "focus-visible:ring-cyan-400/50"
        ),
        link: cn(
          "text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4",
          "focus-visible:ring-cyan-400/50"
        ),
        gradient: cn(
          "bg-gradient-to-r from-cyan-500 to-purple-600 text-white",
          "shadow-lg shadow-cyan-500/20",
          "hover:from-cyan-400 hover:to-purple-500 hover:shadow-purple-500/30",
          "focus-visible:ring-purple-400/50"
        )
      },
      size: {
        default: "h-10 px-6 py-2 text-sm sm:text-base",
        sm: "h-8 px-4 text-xs sm:text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }