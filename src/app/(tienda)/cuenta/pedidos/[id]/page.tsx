import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, CreditCard, Download, ExternalLink, HelpCircle, MapPin, RotateCcw, ShoppingCart, Store, Truck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OrderProgress, OrderStatusBadge, statusLine } from "@/components/account/order-ui"
import { ProductImage } from "@/components/product/product-image"
import { customerOrders, getAddress, getCustomerOrder, orderSubtotal, orderUnits } from "@/lib/account-data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

type Props = PageProps<"/cuenta/pedidos/[id]">

export function generateStaticParams() {
  return customerOrders.map((o) => ({ id: o.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const order = getCustomerOrder(id)
  return { title: order ? `Pedido ${order.number}` : "Pedido" }
}

export default async function AccountOrderPage({ params }: Props) {
  const { id } = await params
  const order = getCustomerOrder(id)
  if (!order) notFound()

  const subtotal = orderSubtotal(order)
  const units = orderUnits(order)
  const address = getAddress(order.addressId)
  const isPickup = order.shippingMethod === "Retiro en tienda"
  const canReturn = order.status === "entregado"

  return (
    <>
      <div>
        <Link href="/cuenta/pedidos" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Mis pedidos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">Pedido {order.number}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Realizado el {order.date} · {units} {units === 1 ? "artículo" : "artículos"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {order.status !== "cancelado" && (
              <button type="button" className={cn(buttonVariants({ variant: "outline" }), "h-9")}>
                <Download data-icon="inline-start" /> Factura
              </button>
            )}
            <button type="button" className={cn(buttonVariants(), "h-9")}>
              <ShoppingCart data-icon="inline-start" /> Comprar de nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Seguimiento */}
      <section className="rounded-2xl border bg-card p-5 sm:p-6" aria-labelledby="seguimiento">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="seguimiento" className="font-medium">
              {order.status === "cancelado" ? "Pedido cancelado" : "Seguimiento"}
            </h2>
            <p className={cn("text-sm", order.status === "enviado" ? "font-medium text-primary" : "text-muted-foreground")}>
              {statusLine(order)}
            </p>
          </div>
          {order.tracking && (
            <a href="#" className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm hover:bg-muted">
              <Truck className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">{order.tracking.carrier}</span>
              <span className="font-mono">{order.tracking.code}</span>
              <ExternalLink className="size-3.5 text-primary" />
            </a>
          )}
        </div>
        {order.status === "cancelado" ? (
          <p className="rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
            No recibimos la transferencia a tiempo y el pedido se canceló automáticamente. No se realizó ningún cargo.
          </p>
        ) : (
          <OrderProgress status={order.status} />
        )}
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_300px]">
        {/* Artículos */}
        <section className="rounded-2xl border bg-card" aria-labelledby="articulos">
          <h2 id="articulos" className="px-5 pt-5 font-medium">Artículos</h2>
          <ul className="divide-y">
            {order.items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-4 px-5 py-4">
                <Link href={`/producto/${product.slug}`} className="w-16 shrink-0 sm:w-20">
                  <ProductImage category={product.category} label="" className="rounded-lg border" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <Link href={`/producto/${product.slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary">
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(product.price)} × {quantity}
                    </p>
                    {canReturn && (
                      <button type="button" className="mt-1 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        <RotateCcw className="size-3" /> Devolver
                      </button>
                    )}
                  </div>
                  <p className="text-sm font-medium tabular-nums">{formatPrice(product.price * quantity)}</p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t px-5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{order.shippingMethod}</dt>
              <dd className="tabular-nums">{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</dd>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(subtotal + order.shipping)}</dd>
            </div>
          </dl>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <section className="rounded-2xl border bg-card p-5 text-sm">
            <h2 className="mb-3 font-medium">{isPickup ? "Retiro en tienda" : "Dirección de envío"}</h2>
            <p className="flex gap-2 text-muted-foreground">
              {isPickup ? <Store className="mt-0.5 size-4 shrink-0" /> : <MapPin className="mt-0.5 size-4 shrink-0" />}
              {isPickup || !address ? (
                <span>SuTech Centro<br />Av. Principal 123</span>
              ) : (
                <span>
                  <span className="text-foreground">{address.name}</span>
                  <br />
                  {address.line1}
                  {address.line2 && <><br />{address.line2}</>}
                  <br />
                  {address.postal} {address.city}, {address.region}
                </span>
              )}
            </p>
          </section>
          <section className="rounded-2xl border bg-card p-5 text-sm">
            <h2 className="mb-3 font-medium">Pago</h2>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="size-4 shrink-0" /> {order.payment}
            </p>
          </section>
          <section className="rounded-2xl border bg-card p-5 text-sm sm:col-span-2 xl:col-span-1">
            <h2 className="mb-1 font-medium">¿Necesitas ayuda?</h2>
            <p className="mb-3 text-muted-foreground">Nuestro equipo responde en menos de 24 h.</p>
            <a href="#" className="flex items-center gap-1.5 font-medium text-primary hover:underline">
              <HelpCircle className="size-4" /> Contactar a soporte
            </a>
          </section>
        </div>
      </div>
    </>
  )
}
