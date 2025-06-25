
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

const DropdownMenu = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
  return <DropdownMenuPrimitive.Root {...props} />
}

const DropdownMenuTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => {
  return <DropdownMenuPrimitive.Trigger {...props} />
}

const DropdownMenuContent = ({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={`
          z-50 min-w-[12rem] rounded-lg border border-gray-700 bg-gray-900/95 p-1.5 shadow-lg
          backdrop-blur-md transition-all
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
          data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
          data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
          ${className}
        `}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

const DropdownMenuItem = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "destructive"
}) => {
  return (
    <DropdownMenuPrimitive.Item
      className={`
        group relative flex cursor-default select-none items-center rounded-md px-3 py-2
        text-sm outline-none transition-colors
        focus:bg-gray-800 focus:text-white
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        ${
          variant === "destructive"
            ? "text-red-400 focus:bg-red-900/30 focus:text-red-300"
            : "text-gray-300"
        }
        ${className}
      `}
      {...props}
    />
  )
}

const DropdownMenuLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) => {
  return (
    <DropdownMenuPrimitive.Label
      className={`px-3 py-2 text-xs font-medium text-purple-300 ${className}`}
      {...props}
    />
  )
}

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => {
  return (
    <DropdownMenuPrimitive.Separator
      className={`-mx-1 my-1 h-px bg-gray-700 ${className}`}
      {...props}
    />
  )
}

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      className={`ml-auto text-xs tracking-widest text-gray-500 ${className}`}
      {...props}
    />
  )
}

// Submenu components
const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuSubTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={`
        group flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm
        outline-none focus:bg-gray-800
        data-[state=open]:bg-gray-800
        ${className}
      `}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4 text-gray-500 group-hover:text-gray-300" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

const DropdownMenuSubContent = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => {
  return (
    <DropdownMenuPrimitive.SubContent
      className={`
        z-50 min-w-[12rem] rounded-lg border border-gray-700 bg-gray-900/95 p-1.5 shadow-lg
        backdrop-blur-md
        data-[state=open]:animate-in data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
        data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
        data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2
        ${className}
      `}
      {...props}
    />
  )
}

// Checkbox and Radio items
const DropdownMenuCheckboxItem = ({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={`
        group relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-3
        text-sm outline-none transition-colors focus:bg-gray-800
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        ${className}
      `}
      checked={checked}
      {...props}
    >
      <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="h-4 w-4 text-cyan-400" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

const DropdownMenuRadioItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={`
        group relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-3
        text-sm outline-none transition-colors focus:bg-gray-800
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        ${className}
      `}
      {...props}
    >
      <span className="absolute left-3 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="h-2 w-2 fill-current text-cyan-400" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
}