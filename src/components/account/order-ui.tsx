import Link from "next/link"
import { Check, CheckCircle2, ChevronRight, Clock, Package, Truck, XCircle, type LucideIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ProductImage } from "@/components/product/product-image"
import {
  orderStatusFlow,
  orderStatusLabel,
  orderSubtotal,
  orderUnits,
  type CustomerOrder,
  type CustomerOrderStatus,
} from "@/lib/account-data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function AccountHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// Siempre ícono + texto, nunca solo color.
const statusStyle: Record<CustomerOrderStatus, [string, LucideIcon]> = {
  confirmado: ["bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950 dark:text-sky-300", Clock],
  preparando: ["bg-amber-50 text-amber-800 ring-amber-600/25 dark:bg-amber-950 dark:text-amber-300", Package],
  enviado: ["bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950 dark:text-sky-300", Truck],
  entregado: ["bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300", CheckCircle2],
  cancelado: ["bg-muted text-muted-foreground ring-border", XCircle],
}

export function OrderStatusBadge({ status }: { status: CustomerOrderStatus }) {
  const [cls, Icon] = statusStyle[status]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset", cls)}>
      <Icon className="size-3" /> {orderStatusLabel[status]}
    </span>
  )
}

const stepIcons = { confirmado: Check, preparando: Package, enviado: Truck, entregado: CheckCircle2 } as const

// Barra de progreso del pedido: Confirmado → Preparando → En camino → Entregado.
export function OrderProgress({ status, compact = false }: { status: CustomerOrderStatus; compact?: boolean }) {
  if (status === "cancelado") return null
  const current = orderStatusFlow.indexOf(status)
  return (
    <ol className="grid grid-cols-4" aria-label="Progreso del pedido">
      {orderStatusFlow.map((step, i) => {
        const done = i <= current
        const Icon = stepIcons[step]
        return (
          <li key={step} className="relative flex flex-col items-center gap-2 text-center" aria-current={i === current ? "step" : undefined}>
            {i > 0 && (
              <span
                className={cn("absolute top-3.5 right-1/2 h-0.5 w-full -translate-y-1/2", i <= current ? "bg-primary" : "bg-border")}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative grid size-7 place-items-center rounded-full ring-4 ring-card",
                done ? "bg-primary text-primary-foreground" : "border bg-card text-muted-foreground",
                i === current && status !== "entregado" && "ring-primary/20"
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <span className={cn("text-xs", done ? "font-medium" : "text-muted-foreground", compact && "max-sm:sr-only")}>
              {orderStatusLabel[step]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function OrderCard({ order }: { order: CustomerOrder }) {
  const total = orderSubtotal(order) + order.shipping
  const units = orderUnits(order)
  const shown = order.items.slice(0, 3)
  return (
    <article className="overflow-hidden rounded-xl border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b bg-muted/40 px-4 py-3 text-sm sm:px-5">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <div>
            <p className="text-xs text-muted-foreground">Pedido</p>
            <p className="font-medium">{order.number}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p>{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-medium tabular-nums">{formatPrice(total)}</p>
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </header>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex shrink-0 -space-x-3">
            {shown.map((it) => (
              <ProductImage
                key={it.product.id}
                category={it.product.category}
                label=""
                className="w-14 rounded-lg border-2 border-card"
              />
            ))}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{order.items[0].product.name}</p>
            <p className="text-xs text-muted-foreground">
              {order.items.length > 1 ? `y ${order.items.length - 1} más · ` : ""}
              {units} {units === 1 ? "artículo" : "artículos"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{statusLine(order)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {order.status === "enviado" && (
            <Link href={`/cuenta/pedidos/${order.id}`} className={cn(buttonVariants({ size: "sm" }), "h-9")}>
              <Truck data-icon="inline-start" /> Seguir envío
            </Link>
          )}
          <Link
            href={`/cuenta/pedidos/${order.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9")}
          >
            Ver detalle <ChevronRight data-icon="inline-end" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function statusLine(o: CustomerOrder) {
  switch (o.status) {
    case "enviado":
      return o.tracking?.eta ?? "En camino"
    case "entregado":
      return `Entregado el ${o.deliveredOn}`
    case "preparando":
      return "Estamos empacando tu pedido"
    case "confirmado":
      return "Pago confirmado"
    case "cancelado":
      return "Pedido cancelado · reembolso emitido"
  }
}
