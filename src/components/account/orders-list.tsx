"use client"

import { useState } from "react"
import Link from "next/link"
import { PackageOpen, Search, SearchX } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/states/empty-state"
import { OrderCard } from "@/components/account/order-ui"
import type { CustomerOrder } from "@/lib/account-data"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "todos", label: "Todos", match: () => true },
  { id: "curso", label: "En curso", match: (o: CustomerOrder) => ["confirmado", "preparando", "enviado"].includes(o.status) },
  { id: "entregados", label: "Entregados", match: (o: CustomerOrder) => o.status === "entregado" },
  { id: "cancelados", label: "Cancelados", match: (o: CustomerOrder) => o.status === "cancelado" },
  { id: "devoluciones", label: "Devoluciones", match: () => false },
] as const

type TabId = (typeof tabs)[number]["id"]

const emptyCopy: Record<TabId, { title: string; text: string }> = {
  todos: { title: "Todavía no tienes pedidos", text: "Cuando compres algo, aquí podrás seguir el envío y descargar tus facturas." },
  curso: { title: "No tienes pedidos en curso", text: "Todos tus pedidos ya fueron entregados." },
  entregados: { title: "Aún no hay pedidos entregados", text: "Te avisaremos por correo cuando llegue tu primer pedido." },
  cancelados: { title: "No tienes pedidos cancelados", text: "¡Bien! Todo marcha como debe." },
  devoluciones: { title: "No tienes devoluciones", text: "Si algo no te convence, tienes 30 días para devolverlo desde el detalle del pedido." },
}

export function OrdersList({ orders }: { orders: CustomerOrder[] }) {
  const [tab, setTab] = useState<TabId>("todos")
  const [q, setQ] = useState("")

  const current = tabs.find((t) => t.id === tab)!
  const needle = q.trim().toLowerCase()
  const rows = orders
    .filter(current.match)
    .filter((o) => !needle || o.number.toLowerCase().includes(needle) || o.items.some((it) => it.product.name.toLowerCase().includes(needle)))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filtrar pedidos" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {tabs.map((t) => {
            const count = orders.filter(t.match).length
            const selected = t.id === tab
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={selected}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm transition",
                  selected ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t.label}
                <span className={cn("text-xs tabular-nums", selected ? "opacity-70" : "opacity-60")}>{count}</span>
              </button>
            )
          })}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar pedido o producto"
            aria-label="Buscar en mis pedidos"
            className="h-9 pl-9"
          />
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      ) : needle ? (
        <EmptyState icon={SearchX} title={`Sin resultados para “${q.trim()}”`} description="Prueba con el número de pedido (por ejemplo #ST-104822) o el nombre de un producto.">
          <Button variant="outline" onClick={() => setQ("")}>Limpiar búsqueda</Button>
        </EmptyState>
      ) : (
        <EmptyState icon={PackageOpen} title={emptyCopy[tab].title} description={emptyCopy[tab].text}>
          {tab === "todos" ? (
            <Link href="/productos" className={buttonVariants()}>Explorar productos</Link>
          ) : (
            <Button variant="outline" onClick={() => setTab("todos")}>Ver todos los pedidos</Button>
          )}
        </EmptyState>
      )}
    </div>
  )
}
