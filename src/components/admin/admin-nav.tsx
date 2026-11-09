"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, LayoutDashboard, Menu, Package, Settings, ShoppingBag, Store, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pagos", label: "Pagos", icon: CreditCard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
]

const secondary = [{ href: "/admin/configuracion", label: "Configuración", icon: Settings }]

function AdminLogo() {
  return (
    <Link href="/admin" className="flex items-center gap-2 px-2 font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">S</span>
      <span>
        Su<span className="text-primary">Tech</span>
        <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">Admin</span>
      </span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: boolean }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-1 flex-col gap-1 text-sm" aria-label="Administración">
      {[...nav, null, ...secondary].map((item) => {
        if (!item) return <div key="sep" className="my-3 border-t" />
        const { href, label, icon: Icon } = item
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
        const className = cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 transition",
          active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
        const content = (
          <>
            <Icon className="size-4.5" /> {label}
          </>
        )
        return onNavigate ? (
          <SheetClose key={href} render={<Link href={href} />} className={className} aria-current={active ? "page" : undefined}>
            {content}
          </SheetClose>
        ) : (
          <Link key={href} href={href} className={className} aria-current={active ? "page" : undefined}>
            {content}
          </Link>
        )
      })}
      <Link
        href="/"
        className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Store className="size-4.5" /> Ver tienda
      </Link>
    </nav>
  )
}

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col gap-6 border-r bg-card px-3 py-5 lg:flex">
      <AdminLogo />
      <NavLinks />
    </aside>
  )
}

export function AdminMobileNav() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Abrir menú" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 gap-6 px-3 py-5">
        <SheetHeader className="sr-only">
          <SheetTitle>Menú de administración</SheetTitle>
        </SheetHeader>
        <AdminLogo />
        <NavLinks onNavigate />
      </SheetContent>
    </Sheet>
  )
}
