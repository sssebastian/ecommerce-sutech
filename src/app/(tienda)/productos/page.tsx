import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CatalogView } from "@/components/catalog/catalog-view"
import { CategoryIcon } from "@/components/product/category-icon"
import { categories, getCategory, products } from "@/lib/data"
import { cn } from "@/lib/utils"

type Props = PageProps<"/productos">

function param(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const category = getCategory(param(sp.categoria) ?? "")
  return { title: category?.name ?? "Productos" }
}

export default function ProductsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  )
}

function CatalogSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-6" aria-busy="true">
      <div className="mb-6 h-40 rounded-2xl bg-muted" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-8 w-28 rounded-full bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-96 rounded-xl bg-muted lg:block" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}

async function ProductsContent({ searchParams }: Pick<Props, "searchParams">) {
  const sp = await searchParams
  const category = getCategory(param(sp.categoria) ?? "")
  const q = param(sp.q)?.trim() ?? ""
  const onSale = param(sp.ofertas) === "1"
  const sort = param(sp.orden) ?? "relevancia"

  let items = category ? products.filter((p) => p.category === category.slug) : products
  if (q) {
    const needle = q.toLowerCase()
    items = items.filter((p) =>
      `${p.name} ${p.brand} ${p.shortDescription}`.toLowerCase().includes(needle)
    )
  }

  const title = q ? `Resultados para “${q}”` : onSale ? "Ofertas" : (category?.name ?? "Todos los productos")

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      {/* Banner de categoría */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 to-slate-800 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="relative z-10 max-w-lg space-y-2">
          <Breadcrumb>
            <BreadcrumbList className="text-slate-400">
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />} className="hover:text-white">
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {category ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/productos" />} className="hover:text-white">
                      Productos
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">{category.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Productos</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-slate-300">
            {category?.description ?? "Computación, periféricos y componentes de las mejores marcas."}
          </p>
        </div>
        {category && (
          <CategoryIcon
            slug={category.slug}
            className="absolute top-1/2 right-6 hidden size-40 -translate-y-1/2 text-white/10 sm:block"
            strokeWidth={1}
          />
        )}
      </section>

      {/* Atajos de categoría */}
      <nav aria-label="Categorías" className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
        <CategoryPill href="/productos" active={!category}>
          Todo
        </CategoryPill>
        {categories.map((c) => (
          <CategoryPill key={c.slug} href={`/productos?categoria=${c.slug}`} active={category?.slug === c.slug}>
            <CategoryIcon slug={c.slug} className="size-4" />
            {c.name}
          </CategoryPill>
        ))}
      </nav>

      {/* key fuerza estado limpio al cambiar de categoría o búsqueda */}
      <CatalogView
        key={`${category?.slug ?? "all"}|${q}|${onSale}`}
        items={items}
        initialSort={sort}
        initialOnSale={onSale}
        query={q}
      />
    </div>
  )
}

function CategoryPill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/40"
      )}
    >
      {children}
    </Link>
  )
}
