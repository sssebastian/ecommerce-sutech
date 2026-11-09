"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Printer, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FulfillmentStatus, Order } from "@/lib/admin-data"
import { formatDateTime } from "@/lib/admin-format"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { EmptyRow, TableFooter, TableSearch } from "./data-table"
import { FilterSelect } from "./products-table"
import { FulfillmentStatusBadge, PaymentStatusBadge } from "./status-badge"

const tabs: { value: "todos" | FulfillmentStatus; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Sin pagar" },
  { value: "preparando", label: "Por preparar" },
  { value: "enviado", label: "En camino" },
  { value: "entregado", label: "Entregados" },
  { value: "cancelado", label: "Cancelados" },
  { value: "devuelto", label: "Devueltos" },
]

const shippingItems = [
  { value: "todos", label: "Todas las entregas" },
  { value: "Envío estándar", label: "Envío estándar" },
  { value: "Envío express", label: "Envío express" },
  { value: "Retiro en tienda", label: "Retiro en tienda" },
]

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("todos")
  const [query, setQuery] = useState("")
  const [shipping, setShipping] = useState("todos")
  const [selected, setSelected] = useState<string[]>([])

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: orders.length }
    for (const o of orders) c[o.fulfillment] = (c[o.fulfillment] ?? 0) + 1
    return c
  }, [orders])

  const rows = useMemo(() => {
    const q = query.toLowerCase()
    return orders.filter(
      (o) =>
        (tab === "todos" || o.fulfillment === tab) &&
        (shipping === "todos" || o.shippingMethod === shipping) &&
        (!q || [o.number, o.customer.name, o.customer.email].some((f) => f.toLowerCase().includes(q)))
    )
  }, [orders, tab, query, shipping])

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id))

  return (
    <div className="rounded-xl border bg-card">
      <div className="flex gap-1 overflow-x-auto border-b px-3 pt-2" role="tablist" aria-label="Estado del pedido">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => {
              setTab(t.value)
              setSelected([])
            }}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm whitespace-nowrap transition",
              tab === t.value ? "border-primary font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums">{counts[t.value] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b p-3">
        <TableSearch value={query} onChange={setQuery} placeholder="Buscar por pedido o cliente" className="w-full sm:w-72" />
        <FilterSelect items={shippingItems} value={shipping} onChange={setShipping} />
        {selected.length > 0 && (
          <div className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{selected.length} seleccionados</span>
            <Button variant="outline" size="sm">
              <Printer data-icon="inline-start" /> Imprimir etiquetas
            </Button>
            <Button size="sm">
              <Truck data-icon="inline-start" /> Marcar como enviados
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && rows.some((r) => selected.includes(r.id))}
                  onCheckedChange={(c) => setSelected(c ? rows.map((r) => r.id) : [])}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="pr-4 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((o) => (
              <TableRow
                key={o.id}
                className="cursor-pointer"
                data-state={selected.includes(o.id) ? "selected" : undefined}
                onClick={() => router.push(`/admin/pedidos/${o.id}`)}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.includes(o.id)}
                    onCheckedChange={(c) => setSelected(c ? [...selected, o.id] : selected.filter((id) => id !== o.id))}
                    aria-label={`Seleccionar pedido ${o.number}`}
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/admin/pedidos/${o.id}`} className="font-medium hover:text-primary" onClick={(e) => e.stopPropagation()}>
                    {o.number}
                  </Link>
                  <span className="block text-xs whitespace-nowrap text-muted-foreground">{formatDateTime(o.date)}</span>
                </TableCell>
                <TableCell>
                  <span className="block font-medium">{o.customer.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {o.items.reduce((s, it) => s + it.quantity, 0)} artículos
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{o.shippingMethod}</TableCell>
                <TableCell><PaymentStatusBadge status={o.payment.status} /></TableCell>
                <TableCell><FulfillmentStatusBadge status={o.fulfillment} /></TableCell>
                <TableCell className="pr-4 text-right font-medium tabular-nums">{formatPrice(o.total)}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <EmptyRow colSpan={7}>No hay pedidos que coincidan con los filtros.</EmptyRow>}
          </TableBody>
        </Table>
      </div>
      <TableFooter shown={rows.length} total={orders.length} label="pedidos" />
    </div>
  )
}
