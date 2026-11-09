import type { Metadata } from "next"
import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-nav"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin SuTech" },
  robots: { index: false },
}

// Solo diseño: en la fase 3 este layout verificará la sesión y el rol ADMIN.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-svh bg-muted/30">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <AdminMobileNav />
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar pedidos, productos, clientes…" aria-label="Buscar en el panel" className="h-9 pl-9" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon-lg" aria-label="Notificaciones, 3 nuevas" className="relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500 ring-2 ring-background" />
            </Button>
            <div className="flex items-center gap-2.5 pl-1">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">MG</AvatarFallback>
              </Avatar>
              <span className="hidden leading-tight sm:block">
                <span className="block text-sm font-medium">María García</span>
                <span className="block text-xs text-muted-foreground">Administradora</span>
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
