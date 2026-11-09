import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Heart, Mail, MapPin, Package, Phone, Truck, type LucideIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { AccountHeader, OrderProgress, OrderStatusBadge } from "@/components/account/order-ui"
import { ProductCard } from "@/components/product/product-card"
import { ProductImage } from "@/components/product/product-image"
import { addresses, customer, customerOrders, favoriteProducts, orderUnits } from "@/lib/account-data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Resumen" }

export default function AccountPage() {
  const active = customerOrders.filter((o) => o.status === "enviado" || o.status === "preparando" || o.status === "confirmado")
  const tracking = customerOrders.find((o) => o.status === "enviado")
  const main = addresses.find((a) => a.isDefault) ?? addresses[0]

  return (
    <>
      <AccountHeader title={`Hola, ${customer.firstName}`} description={`Cliente desde ${customer.memberSince}`} />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat href="/cuenta/pedidos" icon={Package} label="Pedidos" value={customerOrders.length} />
        <Stat href="/cuenta/pedidos" icon={Truck} label="En curso" value={active.length} />
        <Stat href="/cuenta/favoritos" icon={Heart} label="Favoritos" value={favoriteProducts.length} />
      </div>

      {tracking && (
        <section className="rounded-2xl border bg-card p-5 sm:p-6" aria-labelledby="tracking-title">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <ProductImage category={tracking.items[0].product.category} label="" className="w-16 shrink-0 rounded-lg border" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 id="tracking-title" className="font-medium">Pedido {tracking.number}</h2>
                  <OrderStatusBadge status={tracking.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {orderUnits(tracking)} artículos · {tracking.tracking?.carrier} {tracking.tracking?.code}
                </p>
                <p className="mt-0.5 text-sm font-medium text-primary">{tracking.tracking?.eta}</p>
              </div>
            </div>
            <Link href={`/cuenta/pedidos/${tracking.id}`} className={cn(buttonVariants(), "h-9")}>
              Seguir envío <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
          <OrderProgress status={tracking.status} />
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Dirección principal" href="/cuenta/direcciones" linkLabel="Administrar">
          <p className="flex gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>
              <span className="font-medium">{main.label}</span>
              <br />
              <span className="text-muted-foreground">
                {main.line1}, {main.postal} {main.city}
              </span>
            </span>
          </p>
        </InfoCard>
        <InfoCard title="Datos de contacto" href="/cuenta/perfil" linkLabel="Editar">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4 shrink-0" /> {customer.email}
          </p>
          <p className="mt-1.5 flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4 shrink-0" /> {customer.phone}
          </p>
        </InfoCard>
      </div>

      <section aria-labelledby="fav-title" className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 id="fav-title" className="text-lg font-semibold tracking-tight">Tus favoritos</h2>
          <Link href="/cuenta/favoritos" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.slice(0, 4).map((p, i) => (
            <div key={p.id} className={cn(i === 3 && "hidden xl:block", i === 2 && "hidden md:block")}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Stat({ href, icon: Icon, label, value }: { href: string; icon: LucideIcon; label: string; value: number }) {
  return (
    <Link href={href} className="group rounded-xl border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm sm:p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground group-hover:text-foreground">{label}</p>
    </Link>
  )
}

function InfoCard({ title, href, linkLabel, children }: { title: string; href: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-5 text-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <Link href={href} className="text-sm font-medium text-primary hover:underline">{linkLabel}</Link>
      </div>
      {children}
    </section>
  )
}
