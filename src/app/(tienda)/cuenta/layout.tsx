import type { Metadata } from "next"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AccountSidebarNav, AccountTabsNav } from "@/components/account/account-nav"
import { customer } from "@/lib/account-data"

export const metadata: Metadata = {
  title: { default: "Mi cuenta", template: "%s · Mi cuenta · SuTech" },
  robots: { index: false },
}

// Solo diseño: en la fase 3 este layout redirigirá a /ingresar si no hay sesión.
export default function AccountLayout({ children }: LayoutProps<"/cuenta">) {
  const initials = `${customer.firstName[0]}${customer.lastName[0]}`
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="grid items-start gap-6 lg:grid-cols-[250px_1fr] lg:gap-10">
        <aside className="sticky top-36 hidden space-y-5 rounded-2xl border bg-card p-4 lg:block">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="size-11">
              <AvatarFallback className="bg-primary font-medium text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
            </div>
          </div>
          <AccountSidebarNav />
        </aside>

        <div className="min-w-0 space-y-6">
          <AccountTabsNav />
          {children}
        </div>
      </div>
    </div>
  )
}
