import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getBrandName, type Product } from "@/lib/data"
import { discountPercent, formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ProductImage } from "./product-image"
import { Rating } from "./rating"

export function ProductBadge({ product, className }: { product: Product; className?: string }) {
  const off = discountPercent(product.price, product.compareAtPrice)
  if (product.stock === 0)
    return <Badge variant="secondary" className={className}>Agotado</Badge>
  if (off > 0) return <Badge className={cn("bg-rose-600 text-white", className)}>-{off}%</Badge>
  if (product.badge === "Nuevo")
    return <Badge className={cn("bg-emerald-600 text-white", className)}>Nuevo</Badge>
  if (product.badge === "Más vendido")
    return <Badge className={cn("bg-amber-500 text-white", className)}>Más vendido</Badge>
  return null
}

export function StockNote({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs text-muted-foreground">Sin stock</span>
  if (stock <= 5) return <span className="text-xs font-medium text-rose-600 dark:text-rose-400">¡Quedan {stock}!</span>
  return <span className="text-xs text-emerald-600 dark:text-emerald-400">En stock</span>
}

function Price({ product }: { product: Product }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-semibold tracking-tight">{formatPrice(product.price)}</span>
      {product.compareAtPrice && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(product.compareAtPrice)}
        </span>
      )}
    </div>
  )
}

export function ProductCard({
  product,
  layout = "grid",
  favorite = false,
  onToggleFavorite,
}: {
  product: Product
  layout?: "grid" | "list"
  favorite?: boolean
  onToggleFavorite?: () => void
}) {
  const href = `/producto/${product.slug}`
  const soldOut = product.stock === 0

  if (layout === "list") {
    return (
      <article className="group relative flex gap-4 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md sm:gap-6">
        <Link href={href} className="relative w-28 shrink-0 overflow-hidden rounded-lg sm:w-44">
          <ProductImage category={product.category} label={product.name} />
          <ProductBadge product={product} className="absolute top-2 left-2" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {getBrandName(product.brand)}
          </span>
          <Link href={href} className="line-clamp-2 font-medium hover:text-primary">
            {product.name}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          <Rating value={product.rating} count={product.reviewCount} />
          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
            <div>
              <Price product={product} />
              <StockNote stock={product.stock} />
            </div>
            <Button disabled={soldOut}>
              <ShoppingCart data-icon="inline-start" />
              Agregar
            </Button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md">
      <Link href={href} className="relative block overflow-hidden">
        <ProductImage
          category={product.category}
          label={product.name}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <ProductBadge product={product} className="absolute top-3 left-3" />
      </Link>
      <Button
        variant="secondary"
        size="icon"
        aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        aria-pressed={favorite}
        onClick={onToggleFavorite}
        className="absolute top-2.5 right-2.5 rounded-full bg-background/80 backdrop-blur"
      >
        <Heart className={cn(favorite && "fill-rose-500 text-rose-500")} />
      </Button>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {getBrandName(product.brand)}
          </span>
          <StockNote stock={product.stock} />
        </div>
        <Link href={href} className="line-clamp-2 min-h-10 text-sm font-medium leading-5 hover:text-primary">
          {product.name}
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price product={product} />
          <Button size="icon" aria-label="Agregar al carrito" disabled={soldOut}>
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </article>
  )
}
