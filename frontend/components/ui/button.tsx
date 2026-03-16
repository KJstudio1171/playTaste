import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent text-sm font-semibold transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--accent-hover)]",
        outline: "border-[var(--accent-mid)] bg-[var(--accent-soft)] text-primary hover:bg-[color-mix(in_srgb,var(--accent-soft)_88%,white_12%)]",
        secondary: "border-border bg-background text-foreground hover:border-primary hover:text-primary",
        ghost: "text-primary hover:bg-[var(--accent-soft)]",
        destructive: "bg-destructive text-white hover:bg-[color-mix(in_srgb,var(--danger-text)_90%,black_10%)]",
        link: "h-auto rounded-none border-0 px-0 py-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        xs: "h-7 rounded-full px-3 text-xs",
        sm: "h-8 rounded-full px-4 text-sm",
        lg: "h-11 rounded-full px-6 text-base",
        icon: "size-8",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-full",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
