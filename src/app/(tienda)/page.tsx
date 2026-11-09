import Link from "next/link"
import { ArrowRight, CreditCard, Headset, ShieldCheck, Truck } from "lucide-react"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { CategoryIcon } from "@/components/product/category-icon"
import { ProductCard } from "@/components/product/product-card"
import { brands, categories, products } from "@/lib/data"

export default function HomePage() {
  const deals = products.filter((p) => p.compareAtPrice).slice(0, 4)
  const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8)

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 pt-4">
      <HeroCarousel />

      {/* Categorías */}
      <section>
        <SectionHeader title="Explora por categoría" href="/productos" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 text-center transition hover:border-primary/40 hover:shadow-sm"
            >
              <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
                <CategoryIcon slug={c.slug} className="size-6" strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ofertas */}
      <section>
        <SectionHeader title="Ofertas de la semana" subtitle="Precios rebajados por tiempo limitado" href="/productos?ofertas=1" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <PromoBanners />

      {/* Más vendidos */}
      <section>
        <SectionHeader title="Más vendidos" href="/productos?orden=populares" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Marcas */}
      <section>
        <SectionHeader title="Marcas oficiales" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {brands.map((b) => (
            <div
              key={b.slug}
              className="grid h-16 place-items-center rounded-xl border bg-card text-sm font-semibold tracking-wider text-muted-foreground uppercase"
            >
              {b.name}
            </div>
          ))}
        </div>
      </section>

      <Benefits />
    </div>
  )
}

function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
          Ver todo <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}

function PromoBanners() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Link
        href="/productos?categoria=monitores"
        className="group relative flex min-h-48 items-center overflow-hidden rounded-2xl bg-linear-to-br from-sky-600 to-indigo-700 p-8 text-white"
      >
        <div className="relative z-10 max-w-[60%] space-y-2">
          <p className="text-sm text-sky-100">Monitores gaming</p>
          <h3 className="text-2xl font-semibold">Hasta 180 Hz desde $229</h3>
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            Comprar <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </span>
        </div>
        <CategoryIcon slug="monitores" className="absolute -right-4 -bottom-6 size-48 text-white/15" strokeWidth={1} />
      </Link>
      <Link
        href="/productos?categoria=teclados"
        className="group relative flex min-h-48 items-center overflow-hidden rounded-2xl bg-linear-to-br from-slate-800 to-slate-950 p-8 text-white"
      >
        <div className="relative z-10 max-w-[60%] space-y-2">
          <p className="text-sm text-slate-300">Periféricos</p>
          <h3 className="text-2xl font-semibold">Teclados y mouse para pros</h3>
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            Comprar <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </span>
        </div>
        <CategoryIcon slug="teclados" className="absolute -right-4 -bottom-6 size-48 text-white/10" strokeWidth={1} />
      </Link>
    </section>
  )
}

function Benefits() {
  const items = [
    { icon: Truck, title: "Envío gratis", text: "En compras desde $99" },
    { icon: ShieldCheck, title: "Garantía oficial", text: "Productos 100% originales" },
    { icon: CreditCard, title: "Hasta 12 cuotas", text: "Sin interés con tarjetas" },
    { icon: Headset, title: "Soporte experto", text: "Te ayudamos a elegir" },
  ]
  return (
    <section className="grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}
