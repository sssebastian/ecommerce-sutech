import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Mail, Package, Truck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { CheckoutSteps } from "@/components/checkout/steps"
import { OrderSummary } from "@/components/checkout/order-summary"
import { getMockCart, shippingCost } from "@/lib/data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Pedido confirmado" }

// Mock: en la fase 3 se leerá el Order real por id.
export default function ConfirmationPage() {
  const lines = getMockCart()
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8">
      <CheckoutSteps current={2} />

      <section className="mt-8 rounded-2xl border bg-card p-6 text-center sm:p-10">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">¡Gracias por tu compra!</h1>
        <p className="mt-2 text-muted-foreground">
          Tu pedido <span className="font-medium text-foreground">#ST-104823</span> fue recibido y lo estamos preparando.
        </p>

        <ol className="mx-auto mt-8 grid max-w-xl gap-4 text-left sm:grid-cols-3">
          {[
            { icon: Mail, title: "Confirmación", text: "Te enviamos el detalle por correo." },
            { icon: Package, title: "Preparación", text: "Empacamos tu pedido en 24 h." },
            { icon: Truck, title: "Envío", text: "Recibirás el código de seguimiento." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-xl bg-muted/50 p-4">
              <Icon className="size-5 text-primary" />
              <p className="mt-2 text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/cuenta/pedidos" className={cn(buttonVariants({ size: "lg" }), "h-11 px-6")}>
            Ver mis pedidos
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6")}>
            Seguir comprando
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6">
        <h2 className="mb-4 font-semibold">Detalle del pedido</h2>
        <OrderSummary lines={lines} shipping={shippingCost("estandar", subtotal)} />
      </section>
    </div>
  )
}
