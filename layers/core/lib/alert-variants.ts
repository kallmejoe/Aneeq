import { cva, type VariantProps } from "class-variance-authority"

export const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-x-3 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "border-destructive/50 text-destructive [&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>
