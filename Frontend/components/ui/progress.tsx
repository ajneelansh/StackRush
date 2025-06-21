"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

function Progress({
  className = "",
  value = 0,
  indicatorClassName = "",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      className={`relative h-2.5 w-full overflow-hidden rounded-full bg-gray-800/50 backdrop-blur-sm ${className}`}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={`h-full rounded-full transition-all duration-500 ease-out ${
          value < 30 
            ? "bg-gradient-to-r from-red-500 to-pink-600" 
            : value < 70 
            ? "bg-gradient-to-r from-amber-400 to-orange-500"
            : "bg-gradient-to-r from-cyan-400 to-blue-500"
        } ${indicatorClassName}`}
        style={{ 
          width: `${value}%`,
          transitionProperty: 'width',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }