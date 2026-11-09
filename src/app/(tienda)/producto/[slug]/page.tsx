import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gallery } from "@/components/product/gallery"
import { ProductBadge, ProductCard, StockNote } from "@/components/product/product-card"
import { PurchasePanel } from "@/components/product/purchase-panel"
import { Rating } from "@/components/product/rating"
import { getBrandName, getCategory, getProduct, products, sampleReviews } from "@/lib/data"
import { discountPercent, formatPrice } from "@/lib/format"

type Props = PageProps<"/producto/[slug]">

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  return product ? { title: product.name, description: product.shortDescription } : {}
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = getCategory(product.category)!
  const off = discountPercent(product.price, product.compareAtPrice)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/productos?categoria=${category.slug}`} />}>
              {category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <Gallery category={product.category} name={product.name} />

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                {getBrandName(product.brand)}
              </span>
              <ProductBadge product={product} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Rating value={product.rating} count={product.reviewCount} size="md" />
              <span className="text-xs text-muted-foreground">SKU: ST-{product.id.toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="rounded-md bg-rose-50 px-2 py-0.5 text-sm font-medium text-rose-600 dark:bg-rose-950">
                    Ahorras {formatPrice(product.compareAtPrice - product.price)} ({off}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              o 12 cuotas sin interés de {formatPrice(Math.ceil(product.price / 12))}
            </p>
          </div>

          <p className="text-muted-foreground">{product.shortDescription}</p>

          <ul className="grid gap-x-6 gap-y-1.5 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-2">
            {Object.entries(product.specs)
              .slice(0, 4)
              .map(([k, v]) => (
                <li key={k}>
                  <span className="text-muted-foreground">{k}: </span>
                  <span className="font-medium">{v}</span>
                </li>
              ))}
          </ul>

          <StockNote stock={product.stock} />
          <PurchasePanel stock={product.stock} />

          <Separator />

          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              { icon: Truck, title: "Envío gratis", text: "Llega en 24–72 h" },
              { icon: ShieldCheck, title: "Garantía de 12 meses", text: "Directa con la marca" },
              { icon: RotateCcw, title: "Devolución gratis", text: "Hasta 30 días" },
              { icon: CreditCard, title: "Pago seguro", text: "Tarjeta, PayPal o transferencia" },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Tabs defaultValue="descripcion" className="mt-14">
        <TabsList>
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
          <TabsTrigger value="specs">Especificaciones</TabsTrigger>
          <TabsTrigger value="resenas">Reseñas ({product.reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="descripcion" className="max-w-3xl pt-4 leading-relaxed text-muted-foreground">
          {product.description}
        </TabsContent>

        <TabsContent value="specs" className="pt-4">
          <div className="max-w-3xl overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k} className="even:bg-muted/40">
                    <th scope="row" className="w-1/3 px-4 py-3 text-left font-medium text-muted-foreground">
                      {k}
                    </th>
                    <td className="px-4 py-3">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="resenas" className="pt-4">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="space-y-2">
              <p className="text-5xl font-semibold">{product.rating.toFixed(1)}</p>
              <Rating value={product.rating} size="md" />
              <p className="text-sm text-muted-foreground">{product.reviewCount} reseñas</p>
            </div>
            <ul className="space-y-6">
              {sampleReviews.map((r) => (
                <li key={r.id} className="space-y-1.5 border-b pb-6 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <Rating value={r.rating} />
                    <time className="text-xs text-muted-foreground" dateTime={r.date}>
                      {new Date(r.date).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  </div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.body}</p>
                  <p className="text-xs text-muted-foreground">— {r.author} · Compra verificada</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-semibold tracking-tight sm:text-2xl">También te puede interesar</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
