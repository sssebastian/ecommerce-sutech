import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function StatTile({
  label,
  value,
  delta,
  note,
  invert,
}: {
  label: string
  value: string
  delta?: number
  note?: string
  invert?: boolean // true cuando bajar es bueno (p. ej. pagos fallidos)
}) {
  const up = (delta ?? 0) >= 0
  const good = invert ? !up : up
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</p>
      {delta !== undefined ? (
        <p className="mt-1 flex flex-wrap items-center gap-x-1 text-xs">
          <span className={cn("flex items-center gap-0.5 font-medium", good ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
            <Icon className="size-3.5" />
            {up ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">vs. mes anterior</span>
        </p>
      ) : (
        note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      )}
    </div>
  )
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("rounded-xl border bg-card", className)}>
      <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
