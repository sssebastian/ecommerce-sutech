"use client"

import { useState } from "react"
import Link from "next/link"
import { Lock, ShoppingBag, Tag, Trash2, Truck } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ProductImage } from "@/components/product/product-image"
import { EmptyState } from "@/components/states/empty-state"
import { QuantityStepper } from "@/components/product/purchase-panel"
import { FREE_SHIPPING_FROM, getBrandName, shippingCost, type CartLine } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function CartView({ initialLines }: { initialLines: CartLine[] }) {
  const [lines, setLines] = useState(initialLines)

  const setQty = (id: string, quantity: number) =>
    setLines((ls) => ls.map((l) => (l.product.id === id ? { ...l, quantity } : l)))
  const remove = (id: string) => setLines((ls) => ls.filter((l) => l.product.id !== id))

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Tu carrito está vacío"
        description="Agrega productos y aquí verás el resumen con envío y cuotas."
      >
        <Link href="/productos" className={buttonVariants({ size: "lg" })}>
          Ver productos
        </Link>
        <Link href="/cuenta/favoritos" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Ir a favoritos
        </Link>
      </EmptyState>
    )
  }

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const savings = lines.reduce(
    (s, l) => s + ((l.product.compareAtPrice ?? l.product.price) - l.product.price) * l.quantity,
    0
  )
  const shipping = shippingCost("estandar", subtotal)
  const total = subtotal + shipping
  const items = lines.reduce((s, l) => s + l.quantity, 0)

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <section aria-label="Productos en el carrito" className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3 text-sm text-muted-foreground">
          <span>{items} {items === 1 ? "producto" : "productos"}</span>
          <Link href="/productos" className="font-medium text-primary hover:underline">
            Seguir comprando
          </Link>
        </div>
        <ul className="divide-y">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 p-5">
              <Link href={`/producto/${product.slug}`} className="w-20 shrink-0 overflow-hidden rounded-lg sm:w-28">
                <ProductImage category={product.category} label={product.name} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{getBrandName(product.brand)}</p>
                  <Link href={`/producto/${product.slug}`} className="line-clamp-2 font-medium hover:text-primary">
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{formatPrice(product.price)} c/u</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="font-semibold">{formatPrice(product.price * quantity)}</p>
                  <div className="flex items-center gap-1">
                    <QuantityStepper
                      value={quantity}
                      max={product.stock}
                      onChange={(n) => setQty(product.id, n)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 text-muted-foreground hover:text-destructive"
                      aria-label={`Quitar ${product.name}`}
                      onClick={() => remove(product.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-40">
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h2 className="font-semibold">Resumen del pedido</h2>

          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Código de descuento" aria-label="Código de descuento" className="h-10 pl-9" />
            </div>
            <Button type="submit" variant="outline" className="h-10">
              Aplicar
            </Button>
          </form>

          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {savings > 0 && (
              <Row label="Ahorros" value={`-${formatPrice(savings)}`} className="text-emerald-600 dark:text-emerald-400" />
            )}
            <Row label="Envío" value={shipping === 0 ? "Gratis" : formatPrice(shipping)} />
          </dl>
          <Separator />
          <div className="flex items-baseline justify-between">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-semibold tracking-tight">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}>
            <Lock data-icon="inline-start" /> Ir a pagar
          </Link>
          <p className="text-center text-xs text-muted-foreground">
            o hasta 12 cuotas sin interés de {formatPrice(Math.ceil(total / 12))}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
          <Truck className="size-5 shrink-0 text-primary" />
          {shipping === 0 ? (
            <span>Tu pedido tiene <strong>envío gratis</strong>.</span>
          ) : (
            <span>
              Agrega {formatPrice(FREE_SHIPPING_FROM - subtotal)} más para tener <strong>envío gratis</strong>.
            </span>
          )}
        </div>
      </aside>
    </div>
  )
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex justify-between", className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}
