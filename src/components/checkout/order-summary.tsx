import { ProductImage } from "@/components/product/product-image"
import { Separator } from "@/components/ui/separator"
import type { CartLine } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function orderTotals(lines: CartLine[], shipping: number) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)
  const savings = lines.reduce(
    (s, l) => s + ((l.product.compareAtPrice ?? l.product.price) - l.product.price) * l.quantity,
    0
  )
  return { subtotal, savings, shipping, total: subtotal + shipping }
}

export function OrderSummary({
  lines,
  shipping,
  className,
}: {
  lines: CartLine[]
  shipping: number
  className?: string
}) {
  const t = orderTotals(lines, shipping)
  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-4">
        {lines.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-3">
            <div className="relative w-14 shrink-0">
              <ProductImage category={product.category} label={product.name} className="rounded-lg border" />
              <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-foreground text-[11px] font-medium text-background">
                {quantity}
              </span>
            </div>
            <p className="line-clamp-2 flex-1 text-sm">{product.name}</p>
            <p className="text-sm font-medium">{formatPrice(product.price * quantity)}</p>
          </li>
        ))}
      </ul>
      <Separator />
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatPrice(t.subtotal)}</dd>
        </div>
        {t.savings > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <dt>Ahorros</dt>
            <dd>-{formatPrice(t.savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Envío</dt>
          <dd>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
        </div>
      </dl>
      <Separator />
      <div className="flex items-baseline justify-between">
        <span className="font-medium">Total</span>
        <span className="text-2xl font-semibold tracking-tight">{formatPrice(t.total)}</span>
      </div>
    </div>
  )
}
