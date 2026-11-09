import type { Metadata } from "next"
import { Download } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { PageHeader, StatTile } from "@/components/admin/page-header"
import { PaymentsTable } from "@/components/admin/payments-table"
import { payments } from "@/lib/admin-data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Pagos" }

export default function AdminPaymentsPage() {
  const sum = (status: string) => payments.filter((p) => p.status === status).reduce((s, p) => s + p.amount, 0)
  const failed = payments.filter((p) => p.status === "fallido").length

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Pagos"
        description="Transacciones de los últimos 7 días"
        actions={
          <button className={cn(buttonVariants({ variant: "outline" }), "h-9")}>
            <Download data-icon="inline-start" /> Exportar CSV
          </button>
        }
      />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile label="Cobrado" value={formatPrice(sum("pagado"))} delta={9.2} />
        <StatTile label="Pendiente" value={formatPrice(sum("pendiente"))} note="Transferencias y revisiones" />
        <StatTile label="Reembolsado" value={formatPrice(sum("reembolsado"))} delta={-4.1} invert />
        <StatTile label="Pagos fallidos" value={String(failed)} delta={-12.5} invert />
      </div>
      <PaymentsTable payments={payments} />
    </div>
  )
}
