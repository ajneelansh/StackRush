"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
  {
    variants: {
      variant: {
        default: cn(
          "bg-gradient-to-r from-purple-600 to-purple-400 text-white",
          "shadow-lg shadow-purple-600/30",
          "hover:from-purple-600 hover:to-purple-800",
          "active:scale-[0.97] transform transition-transform",
          "focus-visible:ring-purple-500/50"
        ),
        destructive: cn(
          "bg-gradient-to-r from-red-600 to-pink-600 text-white",
          "shadow-lg shadow-red-600/30",
          "hover:from-red-500 hover:to-pink-500",
          "focus-visible:ring-red-500/50"
        ),
        outline: cn(
          "border border-purple-500 text-purple-200 bg-transparent",
          "hover:bg-purple-800/20 hover:text-white",
          "focus-visible:ring-purple-500/50"
        ),
        secondary: cn(
          "bg-gradient-to-br from-gray-900 to-purple-950 text-gray-300 border border-purple-900/20",
          "hover:bg-purple-900/30 hover:border-purple-700",
          "focus-visible:ring-purple-700/50"
        ),
        ghost: cn(
          "text-purple-300 hover:bg-purple-700/20 hover:text-white",
          "focus-visible:ring-purple-500/30"
        ),
        link: cn(
          "text-cyan-400 hover:text-cyan-300 hover:underline underline-offset-4",
          "focus-visible:ring-cyan-400/50"
        ),
        gradient: cn(
          "bg-gradient-to-r from-pink-600 to-yellow-400 text-black",
          "hover:from-pink-500 hover:to-yellow-300",
          "shadow-md shadow-yellow-400/20",
          "focus-visible:ring-yellow-400/50"
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
