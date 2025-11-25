import { cn } from "@/lib/utils"

function Esqueleto({ className, ...props }) {
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />
}

const Skeleton = Esqueleto

export { Esqueleto }
export { Skeleton }
