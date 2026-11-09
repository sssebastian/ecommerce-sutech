import type { Metadata } from "next"
import { Download } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { OrdersTable } from "@/components/admin/orders-table"
import { PageHeader, StatTile } from "@/components/admin/page-header"
import { orders } from "@/lib/admin-data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Pedidos" }

export default function AdminOrdersPage() {
  const count = (s: string) => orders.filter((o) => o.fulfillment === s).length
  const paid = orders.filter((o) => o.payment.status === "pagado")
  const avg = paid.length ? Math.round(paid.reduce((s, o) => s + o.total, 0) / paid.length) : 0

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Pedidos"
        description="Pedidos de los últimos 7 días"
        actions={
          <button className={cn(buttonVariants({ variant: "outline" }), "h-9")}>
            <Download data-icon="inline-start" /> Exportar CSV
          </button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile label="Por preparar" value={String(count("preparando"))} note="Pagados, listos para empacar" />
        <StatTile label="En camino" value={String(count("enviado"))} note="Con número de seguimiento" />
        <StatTile label="Sin pagar" value={String(count("pendiente"))} note="Esperando confirmación del pago" />
        <StatTile label="Ticket promedio" value={formatPrice(avg)} delta={-2.3} />
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
