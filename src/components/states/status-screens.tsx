import Link from "next/link"
import { ArrowLeft, Headset, Home, Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryIcon } from "@/components/product/category-icon"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"

// Pantalla 404 de la tienda: buscador + accesos a categorías para no perder la visita.
export function NotFoundScreen() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="relative mb-8 select-none" aria-hidden>
        <p className="bg-linear-to-b from-foreground/15 to-foreground/0 bg-clip-text text-[8rem] leading-none font-bold tracking-tighter text-transparent sm:text-[11rem]">
          404
        </p>
        <span className="absolute inset-x-0 bottom-3 mx-auto grid size-16 place-items-center rounded-2xl border bg-card shadow-sm sm:bottom-6">
          <CategoryIcon slug="componentes" className="size-8 text-primary" strokeWidth={1.4} />
        </span>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">No encontramos esta página</h1>
      <p className="mt-2 max-w-md text-pretty text-muted-foreground">
        Puede que el enlace esté roto o que el producto ya no esté disponible. Busca lo que necesitas o vuelve al inicio.
      </p>

      <form action="/productos" role="search" className="relative mt-8 w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" type="search" placeholder="Buscar productos…" aria-label="Buscar productos" className="h-11 rounded-full pl-9" />
      </form>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className={buttonVariants()}>
          <Home data-icon="inline-start" /> Ir al inicio
        </Link>
        <Link href="/productos" className={buttonVariants({ variant: "outline" })}>
          Ver catálogo
        </Link>
      </div>

      <div className="mt-12 w-full border-t pt-8">
        <p className="mb-4 text-sm text-muted-foreground">O explora por categoría</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm transition hover:border-primary/40 hover:text-primary"
            >
              <CategoryIcon slug={c.slug} className="size-4 text-primary" />
              <span className="truncate">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Contenido compartido por los error.tsx (los botones de reintento los agrega cada archivo).
export function ErrorScreen({
  title = "Algo salió mal",
  description = "Tuvimos un problema al cargar esta página. Ya estamos al tanto; intenta de nuevo en unos segundos.",
  digest,
  children,
  className,
}: {
  title?: string
  description?: string
  digest?: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div role="alert" className={cn("mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center", className)}>
      <span className="relative mb-6 grid size-16 place-items-center">
        <span className="absolute inset-0 rounded-full bg-destructive/10" />
        <span className="absolute -inset-2 rounded-full border border-dashed border-destructive/25" />
        <svg viewBox="0 0 24 24" className="relative size-7 text-destructive" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </svg>
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-pretty text-muted-foreground">{description}</p>
      {children && <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>}
      <p className="mt-8 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Headset className="size-3.5" /> Si el problema sigue, escríbenos a soporte
        {digest && <span className="font-mono">· código {digest}</span>}
      </p>
    </div>
  )
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={buttonVariants({ variant: "outline" })}>
      <ArrowLeft data-icon="inline-start" /> {children}
    </Link>
  )
}
