import * as React from "react"

function Input({ className = "", type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full min-w-0 rounded-lg border border-purple-700/50 
        bg-gray-900/50 px-4 py-2 text-sm text-white shadow-sm transition-all
        placeholder:text-purple-300/60
        focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30
        disabled:cursor-not-allowed disabled:opacity-50
        file:border-0 file:bg-transparent file:text-sm file:font-medium
        selection:bg-cyan-500/50 selection:text-white
        ${className}
      `}
      {...props}
    />
  )
}

export { Input }