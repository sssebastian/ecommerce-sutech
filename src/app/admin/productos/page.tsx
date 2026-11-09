import type { Metadata } from "next"
import { PageHeader, StatTile } from "@/components/admin/page-header"
import { ProductsTable } from "@/components/admin/products-table"
import { adminProducts } from "@/lib/admin-data"
import { formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Productos" }

export default function AdminProductsPage() {
  const active = adminProducts.filter((p) => p.status === "activo").length
  const low = adminProducts.filter((p) => p.stock > 0 && p.stock <= 5).length
  const out = adminProducts.filter((p) => p.stock === 0).length
  const value = adminProducts.reduce((s, p) => s + p.price * p.stock, 0)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Productos" description="Catálogo, precios e inventario" />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile label="Productos activos" value={String(active)} note={`de ${adminProducts.length} en total`} />
        <StatTile label="Stock bajo" value={String(low)} note="5 unidades o menos" />
        <StatTile label="Agotados" value={String(out)} note="Sin unidades disponibles" />
        <StatTile label="Valor del inventario" value={formatPrice(value)} note="A precio de venta" />
      </div>
      <ProductsTable products={adminProducts} />
    </div>
  )
}
