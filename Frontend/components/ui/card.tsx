import * as React from "react"

function Card({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex flex-col gap-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-cyan-500/10 ${className}`}
      {...props}
    />
  )
}

function CardHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex flex-col gap-2 pb-4 border-b border-gray-700 ${className}`}
      {...props}
    />
  )
}

function CardTitle({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <h3
      className={`text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent sm:text-2xl ${className}`}
      {...props}
    />
  )
}

function CardDescription({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <p
      className={`text-sm text-gray-300 sm:text-base ${className}`}
      {...props}
    />
  )
}

function CardAction({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`self-end ${className}`}
      {...props}
    />
  )
}

function CardContent({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex-1 space-y-4 ${className}`}
      {...props}
    />
  )
}

function CardFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex items-center pt-4 border-t border-gray-700 ${className}`}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
}