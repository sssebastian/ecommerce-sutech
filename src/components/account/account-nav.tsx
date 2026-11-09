"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, LayoutGrid, LogOut, MapPin, Package, UserRound } from "lucide-react"
import { cn } from "@/lib/utils"

export const accountNav = [
  { href: "/cuenta", label: "Resumen", icon: LayoutGrid },
  { href: "/cuenta/pedidos", label: "Mis pedidos", icon: Package },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/cuenta/perfil", label: "Datos y seguridad", icon: UserRound },
]

function useActive() {
  const pathname = usePathname()
  return (href: string) => (href === "/cuenta" ? pathname === href : pathname.startsWith(href))
}

export function AccountSidebarNav() {
  const isActive = useActive()
  return (
    <nav aria-label="Mi cuenta" className="flex flex-col gap-1 text-sm">
      {accountNav.map(({ href, label, icon: Icon }) => {
        const active = isActive(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition",
              active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4.5" /> {label}
          </Link>
        )
      })}
      <div className="my-2 border-t" />
      <Link
        href="/ingresar"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <LogOut className="size-4.5" /> Cerrar sesión
      </Link>
    </nav>
  )
}

// En móvil la navegación pasa a una fila de pestañas con scroll horizontal.
export function AccountTabsNav() {
  const isActive = useActive()
  return (
    <nav aria-label="Mi cuenta" className="no-scrollbar -mx-4 overflow-x-auto px-4 lg:hidden">
      <ul className="flex w-max gap-2 pb-1">
        {accountNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm whitespace-nowrap transition",
                  active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" /> {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
