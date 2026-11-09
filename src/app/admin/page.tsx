import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowRight, Download } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CategoryChart, RevenueChart } from "@/components/admin/charts"
import { PageHeader, Panel, StatTile } from "@/components/admin/page-header"
import { PaymentStatusBadge } from "@/components/admin/status-badge"
import { ProductImage } from "@/components/product/product-image"
import { adminProducts, dailyRevenue, kpis, payments, revenueByCategory } from "@/lib/admin-data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Resumen" }

export default function AdminDashboard() {
  const lowStock = adminProducts.filter((p) => p.stock <= 6).sort((a, b) => a.stock - b.stock).slice(0, 5)
  const recentPayments = payments.slice(0, 6)
  const total = dailyRevenue.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Resumen"
        description="Últimos 30 días · 10 oct – 8 nov 2026"
        actions={
          <button className={cn(buttonVariants({ variant: "outline" }), "h-9")}>
            <Download data-icon="inline-start" /> Exportar
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <StatTile
            key={k.label}
            label={k.label}
            value={k.format === "money" ? formatPrice(k.value) : k.value.toLocaleString("es")}
            delta={k.delta}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Ingresos diarios" description={`Total del periodo: ${formatPrice(total)}`}>
          <div className="px-3 pb-4">
            <RevenueChart data={dailyRevenue} />
          </div>
        </Panel>
        <Panel title="Ingresos por categoría" description="Últimos 30 días">
          <div className="px-3 pb-4">
            <CategoryChart data={revenueByCategory} />
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Pagos recientes"
          action={
            <Link href="/admin/pagos" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Ver todos <ArrowRight className="size-4" />
            </Link>
          }
        >
          <ul className="divide-y">
            {recentPayments.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.order} · {p.method === "tarjeta" ? `Tarjeta •••• ${p.last4}` : p.method === "paypal" ? "PayPal" : "Transferencia"}
                  </p>
                </div>
                <PaymentStatusBadge status={p.status} />
                <span className="w-20 text-right font-medium tabular-nums">{formatPrice(p.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Stock bajo"
          description="Productos con 6 unidades o menos"
          action={<AlertTriangle className="size-4.5 text-amber-500" aria-hidden />}
        >
          <ul className="divide-y">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <ProductImage category={p.category} label="" className="w-10 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <Progress value={(p.stock / 6) * 100} className="h-1.5" aria-label={`Stock de ${p.name}`} />
                </div>
                <span className={cn("w-16 text-right text-xs font-medium", p.stock === 0 ? "text-rose-600 dark:text-rose-400" : "text-amber-700 dark:text-amber-400")}>
                  {p.stock === 0 ? "Agotado" : `${p.stock} u.`}
                </span>
              </li>
            ))}
          </ul>
          <div className="px-5 py-3">
            <Link href="/admin/productos" className={cn(buttonVariants({ variant: "outline" }), "h-9 w-full")}>
              Gestionar inventario
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  )
}
