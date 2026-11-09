import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Building2, ChevronLeft, CreditCard, ExternalLink, Landmark, Mail, MapPin, Phone, Store, Truck } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { NoteForm, OrderHeaderActions, PickupReady, ShipForm } from "@/components/admin/order-actions"
import { Panel } from "@/components/admin/page-header"
import { FulfillmentStatusBadge, PaymentStatusBadge } from "@/components/admin/status-badge"
import { ProductImage } from "@/components/product/product-image"
import { getOrder, orders, type Order } from "@/lib/admin-data"
import { formatDateTime } from "@/lib/admin-format"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

type Props = PageProps<"/admin/pedidos/[id]">

export function generateStaticParams() {
  return orders.map((o) => ({ id: o.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order = getOrder(id)
  return { title: order ? `Pedido ${order.number}` : "Pedido" }
}

const methodLabel = { tarjeta: "Tarjeta", paypal: "PayPal", transferencia: "Transferencia bancaria" } as const
const methodIcon = { tarjeta: CreditCard, paypal: Building2, transferencia: Landmark } as const

export default async function AdminOrderPage({ params }: Props) {
  const { id } = await params
  const order = getOrder(id)
  if (!order) notFound()

  const units = order.items.reduce((s, it) => s + it.quantity, 0)
  const PayIcon = methodIcon[order.payment.method]
  const isPickup = order.shippingMethod === "Retiro en tienda"

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/pedidos" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" /> Pedidos
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{order.number}</h1>
            <PaymentStatusBadge status={order.payment.status} />
            <FulfillmentStatusBadge status={order.fulfillment} />
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(order.date)} · Tienda online · {units} {units === 1 ? "artículo" : "artículos"}
          </p>
        </div>
        <div className="flex gap-2">
          <OrderHeaderActions status={order.fulfillment} />
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Artículos */}
          <Panel title="Artículos" description={`${units} ${units === 1 ? "unidad" : "unidades"}`}>
            <ul className="divide-y border-t">
              {order.items.map((it) => (
                <li key={it.productId} className="flex items-center gap-4 px-5 py-4">
                  <ProductImage category={it.category} label="" className="w-14 shrink-0 rounded-lg border" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{it.name}</p>
                    <p className="text-xs text-muted-foreground">SKU {it.sku}</p>
                  </div>
                  <p className="text-sm whitespace-nowrap text-muted-foreground tabular-nums">
                    {formatPrice(it.unitPrice)} × {it.quantity}
                  </p>
                  <p className="w-20 text-right text-sm font-medium tabular-nums">{formatPrice(it.unitPrice * it.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{order.shippingMethod}</dt>
                <dd className="tabular-nums">{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</dd>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </Panel>

          {/* Entrega */}
          <Panel title="Entrega" action={<FulfillmentStatusBadge status={order.fulfillment} />}>
            <div className="space-y-4 px-5 pb-5">
              <p className="flex items-center gap-2 text-sm">
                {isPickup ? <Store className="size-4 text-muted-foreground" /> : <Truck className="size-4 text-muted-foreground" />}
                {order.shippingMethod}
                {isPickup && <span className="text-muted-foreground">· SuTech Centro</span>}
              </p>
              {order.tracking && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 px-4 py-3 text-sm">
                  <span>
                    <span className="text-muted-foreground">{order.tracking.carrier} · </span>
                    <span className="font-mono">{order.tracking.code}</span>
                  </span>
                  <a href="#" className="flex items-center gap-1 font-medium text-primary hover:underline">
                    Rastrear <ExternalLink className="size-3.5" />
                  </a>
                </div>
              )}
              {order.fulfillment === "preparando" && (isPickup ? <PickupReady /> : <ShipForm />)}
              {order.fulfillment === "pendiente" && (
                <p className="text-sm text-muted-foreground">Se podrá preparar cuando se confirme el pago.</p>
              )}
            </div>
          </Panel>

          {/* Historial */}
          <Panel title="Historial">
            <div className="space-y-5 px-5 pb-5">
              <NoteForm />
              <ol className="relative space-y-5 border-l pl-5 text-sm">
                {timeline(order).map((e, i) => (
                  <li key={i} className="relative">
                    <span className={cn("absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-card", e.dot)} />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-medium">{e.label}</p>
                      <time className="text-xs text-muted-foreground">{e.at}</time>
                    </div>
                    {e.note && <p className="text-xs text-muted-foreground">{e.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </Panel>
        </div>

        {/* Lateral */}
        <div className="space-y-4">
          <Panel title="Cliente">
            <div className="space-y-4 px-5 pb-5 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>{order.customer.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href="/admin/usuarios" className="font-medium hover:text-primary">{order.customer.name}</Link>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.orders} {order.customer.orders === 1 ? "pedido" : "pedidos"}
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2 break-all"><Mail className="size-4 shrink-0" /> {order.customer.email}</li>
                <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /> {order.customer.phone}</li>
              </ul>
            </div>
          </Panel>

          <Panel title={isPickup ? "Retiro" : "Dirección de envío"}>
            <div className="flex gap-2 px-5 pb-5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {isPickup ? (
                <address className="not-italic">SuTech Centro<br />Av. Principal 123</address>
              ) : (
                <address className="not-italic">
                  <span className="text-foreground">{order.customer.name}</span>
                  <br />
                  {order.address.line1}
                  {order.address.line2 && <>, {order.address.line2}</>}
                  <br />
                  {order.address.postal} {order.address.city}, {order.address.region}
                  <br />
                  México
                </address>
              )}
            </div>
          </Panel>

          <Panel title="Pago" action={<PaymentStatusBadge status={order.payment.status} />}>
            <div className="space-y-2 px-5 pb-5 text-sm">
              <p className="flex items-center gap-2">
                <PayIcon className="size-4 text-muted-foreground" />
                {methodLabel[order.payment.method]}
                {order.payment.last4 && <span className="text-muted-foreground">•••• {order.payment.last4}</span>}
              </p>
              <p className="font-mono text-xs text-muted-foreground">{order.payment.id}</p>
              <Link href="/admin/pagos" className="inline-block text-sm font-medium text-primary hover:underline">
                Ver en pagos
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function timeline(o: Order) {
  const at = formatDateTime(o.date)
  type E = { label: string; at: string; note?: string; dot: string }
  const e: E[] = [{ label: "Pedido creado", at, note: "Desde la tienda online", dot: "bg-muted-foreground" }]
  const p = o.payment.status
  if (p === "fallido") e.push({ label: "Pago rechazado", at, note: "El banco rechazó la tarjeta", dot: "bg-rose-500" }, { label: "Pedido cancelado", at, note: "Cancelado automáticamente", dot: "bg-rose-500" })
  if (p === "pendiente") e.push({ label: "Esperando pago", at, note: o.payment.method === "transferencia" ? "Verificando la transferencia" : "En revisión antifraude", dot: "bg-amber-500" })
  if (p === "pagado" || p === "reembolsado") e.push({ label: "Pago aprobado", at, note: `${formatPrice(o.total)} · ${methodLabel[o.payment.method]}`, dot: "bg-emerald-500" })
  if (o.fulfillment === "enviado" || o.fulfillment === "entregado") e.push({ label: "Pedido enviado", at: "Día siguiente", note: o.tracking ? `${o.tracking.carrier} · ${o.tracking.code}` : undefined, dot: "bg-sky-500" })
  if (o.fulfillment === "entregado") e.push({ label: "Pedido entregado", at: "2 días después", dot: "bg-emerald-500" })
  if (o.fulfillment === "devuelto") e.push({ label: "Reembolso emitido", at: "Días después", note: "El cliente devolvió el producto", dot: "bg-muted-foreground" })
  return e.reverse()
}
