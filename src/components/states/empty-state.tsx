import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Estado vacío reutilizable: ícono + título + texto + acciones.
// Se usa en carrito, catálogo, favoritos, pedidos, direcciones y tablas del admin.
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
  size = "default",
}: {
  icon: LucideIcon
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
  className?: string
  size?: "default" | "sm"
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-card/50 px-6 text-center",
        size === "sm" ? "py-10" : "py-16 sm:py-20",
        className
      )}
    >
      <span className="relative grid size-16 place-items-center">
        <span className="absolute inset-0 rounded-full bg-accent" />
        <span className="absolute -inset-2 rounded-full border border-dashed border-primary/20" />
        <Icon className="relative size-7 text-accent-foreground" strokeWidth={1.6} />
      </span>
      <div className="max-w-sm space-y-1">
        <p className="text-lg font-medium text-balance">{title}</p>
        {description && <p className="text-sm text-pretty text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  )
}
