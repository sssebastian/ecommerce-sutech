import Link from "next/link"
import { Headset, Heart, RotateCcw, Search, ShieldCheck, ShoppingCart, Truck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import { AccountMenu } from "./account-menu"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
        S
      </span>
      <span className="text-lg">
        Su<span className="text-primary">Tech</span>
      </span>
    </Link>
  )
}

function SearchBar({ className }: { className?: string }) {
  return (
    <form action="/productos" role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Buscar laptops, monitores, teclados…"
        aria-label="Buscar productos"
        className="h-10 rounded-full bg-muted/60 pl-9"
      />
    </form>
  )
}

export function SiteHeader() {
  const cartCount = 3 // mock

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      {/* Barra superior */}
      <div className="hidden bg-slate-950 text-slate-200 sm:block dark:bg-black">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs">
          <span className="flex items-center gap-1.5">
            <Truck className="size-3.5" /> Envío gratis en compras desde $99
          </span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Garantía oficial</span>
            <span className="hidden items-center gap-1.5 md:flex"><RotateCcw className="size-3.5" /> 30 días de devolución</span>
            <span className="hidden items-center gap-1.5 md:flex"><Headset className="size-3.5" /> Soporte técnico</span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-6">
        <MobileMenu />
        <Logo />
        <SearchBar className="hidden flex-1 md:block md:max-w-xl" />
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/cuenta/favoritos"
            aria-label="Favoritos"
            className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "hidden sm:inline-flex")}
          >
            <Heart className="size-5" />
          </Link>
          <Link
            href="/carrito"
            aria-label={`Carrito, ${cartCount} productos`}
            className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }), "relative")}
          >
            <ShoppingCart className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 grid size-4.5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {cartCount}
            </span>
          </Link>
          <ThemeToggle />
          <AccountMenu />
        </div>
      </div>

      {/* Buscador móvil */}
      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>

      {/* Navegación de categorías */}
      <nav aria-label="Categorías" className="hidden border-t md:block">
        <ul className="mx-auto flex h-11 max-w-7xl items-center gap-1 overflow-x-auto px-4 text-sm">
          <li>
            <Link href="/productos" className="rounded-md px-3 py-1.5 font-medium text-foreground hover:bg-muted">
              Todo
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/productos?categoria=${c.slug}`}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {c.name}
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <Link href="/productos?ofertas=1" className="whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950">
              Ofertas
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

