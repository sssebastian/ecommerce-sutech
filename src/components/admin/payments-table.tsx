"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Building2, CreditCard, Landmark, Mail, Receipt, RotateCcw } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Payment, PaymentMethod, PaymentStatus } from "@/lib/admin-data"
import { formatDateTime as formatDate } from "@/lib/admin-format"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { EmptyRow, TableFooter, TableSearch } from "./data-table"
import { FilterSelect } from "./products-table"
import { PaymentStatusBadge } from "./status-badge"


const methodInfo: Record<PaymentMethod, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  tarjeta: { label: "Tarjeta", icon: CreditCard },
  paypal: { label: "PayPal", icon: Building2 },
  transferencia: { label: "Transferencia", icon: Landmark },
}

const tabs: { value: "todos" | PaymentStatus; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pagado", label: "Pagados" },
  { value: "pendiente", label: "Pendientes" },
  { value: "reembolsado", label: "Reembolsados" },
  { value: "fallido", label: "Fallidos" },
]

const methodItems = [
  { value: "todos", label: "Todos los métodos" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "paypal", label: "PayPal" },
  { value: "transferencia", label: "Transferencia" },
]

function MethodCell({ p }: { p: Payment }) {
  const { label, icon: Icon } = methodInfo[p.method]
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <Icon className="size-4" />
      {p.method === "tarjeta" ? `•••• ${p.last4}` : label}
    </span>
  )
}

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("todos")
  const [query, setQuery] = useState("")
  const [method, setMethod] = useState("todos")
  const [detail, setDetail] = useState<Payment | null>(null)

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: payments.length }
    for (const p of payments) c[p.status] = (c[p.status] ?? 0) + 1
    return c
  }, [payments])

  const rows = useMemo(() => {
    const q = query.toLowerCase()
    return payments.filter(
      (p) =>
        (tab === "todos" || p.status === tab) &&
        (method === "todos" || p.method === method) &&
        (!q || [p.id, p.order, p.customer, p.email].some((f) => f.toLowerCase().includes(q)))
    )
  }, [payments, tab, query, method])

  return (
    <>
      <div className="rounded-xl border bg-card">
        <div className="flex gap-1 overflow-x-auto border-b px-3 pt-2" role="tablist" aria-label="Estado del pago">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
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
          <TableSearch value={query} onChange={setQuery} placeholder="Buscar por cliente, pedido o ID" className="w-full sm:w-80" />
          <FilterSelect items={methodItems} value={method} onChange={setMethod} />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Pago</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="pr-4 text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => setDetail(p)}>
                  <TableCell className="pl-4">
                    <button type="button" className="text-left" onClick={() => setDetail(p)}>
                      <span className="block font-medium">{p.order}</span>
                      <span className="block font-mono text-xs text-muted-foreground">{p.id}</span>
                    </button>
                  </TableCell>
                  <TableCell>
                    <span className="block font-medium">{p.customer}</span>
                    <span className="block text-xs text-muted-foreground">{p.email}</span>
                  </TableCell>
                  <TableCell><MethodCell p={p} /></TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(p.date)}</TableCell>
                  <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
                  <TableCell className={cn("pr-4 text-right font-medium tabular-nums", p.status === "reembolsado" && "text-muted-foreground line-through")}>
                    {formatPrice(p.amount)}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <EmptyRow colSpan={6}>No hay pagos que coincidan con los filtros.</EmptyRow>}
            </TableBody>
          </Table>
        </div>
        <TableFooter shown={rows.length} total={payments.length} label="pagos" />
      </div>

      <PaymentDetail payment={detail} onClose={() => setDetail(null)} />
    </>
  )
}

function PaymentDetail({ payment, onClose }: { payment: Payment | null; onClose: () => void }) {
  return (
    <Sheet open={!!payment} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        {payment && (
          <>
            <SheetHeader className="border-b">
              <SheetTitle>Pago {payment.order}</SheetTitle>
              <SheetDescription className="font-mono">{payment.id}</SheetDescription>
            </SheetHeader>
            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">{formatPrice(payment.amount)}</span>
                <PaymentStatusBadge status={payment.status} />
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="text-right">
                  {payment.customer}
                  <span className="block text-xs text-muted-foreground">{payment.email}</span>
                </dd>
                <dt className="text-muted-foreground">Método</dt>
                <dd className="flex justify-end"><MethodCell p={payment} /></dd>
                <dt className="text-muted-foreground">Fecha</dt>
                <dd className="text-right">{formatDate(payment.date)}</dd>
                <dt className="text-muted-foreground">Comisión</dt>
                <dd className="text-right tabular-nums">{formatPrice(Math.round(payment.amount * 0.035))}</dd>
                <dt className="text-muted-foreground">Neto</dt>
                <dd className="text-right font-medium tabular-nums">{formatPrice(payment.amount - Math.round(payment.amount * 0.035))}</dd>
              </dl>

              <Separator />

              <section>
                <h3 className="mb-3 text-sm font-semibold">Historial</h3>
                <ol className="relative space-y-4 border-l pl-5 text-sm">
                  {timeline(payment).map((e) => (
                    <li key={e.label} className="relative">
                      <span className={cn("absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-card", e.dot)} />
                      <p className="font-medium">{e.label}</p>
                      <p className="text-xs text-muted-foreground">{e.note}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
            <SheetFooter className="flex-row flex-wrap justify-end border-t">
              <Button variant="outline">
                <Mail data-icon="inline-start" /> Reenviar recibo
              </Button>
              <Link href={`/admin/pedidos/${payment.orderId}`} className={buttonVariants({ variant: "outline" })}>
                <Receipt data-icon="inline-start" /> Ver pedido
              </Link>
              {payment.status === "pagado" && (
                <Button variant="destructive">
                  <RotateCcw data-icon="inline-start" /> Reembolsar
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function timeline(p: Payment) {
  const at = formatDate(p.date)
  const events = [{ label: "Pago iniciado", note: at, dot: "bg-muted-foreground" }]
  if (p.status === "fallido") events.push({ label: "Pago rechazado", note: "Fondos insuficientes", dot: "bg-rose-500" })
  if (p.status === "pendiente") events.push({ label: "Esperando confirmación", note: p.method === "transferencia" ? "Verificando la transferencia" : "En revisión antifraude", dot: "bg-amber-500" })
  if (p.status === "pagado" || p.status === "reembolsado") events.push({ label: "Pago aprobado", note: at, dot: "bg-emerald-500" })
  if (p.status === "reembolsado") events.push({ label: "Reembolso emitido", note: "Solicitado por el cliente", dot: "bg-muted-foreground" })
  return events.reverse()
}
