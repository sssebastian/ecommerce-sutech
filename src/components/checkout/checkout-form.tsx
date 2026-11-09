"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, ChevronDown, CreditCard, Landmark, Lock, ShieldCheck, Store, Truck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field } from "@/components/forms/field"
import { shippingCost, shippingMethods, type CartLine, type ShippingMethodId } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { OrderSummary, orderTotals } from "./order-summary"

const countries = [
  { value: "MX", label: "México" },
  { value: "CO", label: "Colombia" },
  { value: "PE", label: "Perú" },
  { value: "CL", label: "Chile" },
  { value: "AR", label: "Argentina" },
  { value: "ES", label: "España" },
  { value: "US", label: "Estados Unidos" },
]

const shippingIcons: Record<ShippingMethodId, React.ComponentType<{ className?: string }>> = {
  estandar: Truck,
  express: Zap,
  retiro: Store,
}

const paymentMethods = [
  { id: "tarjeta", name: "Tarjeta de crédito o débito", note: "Visa, Mastercard, Amex · hasta 12 cuotas", icon: CreditCard },
  { id: "paypal", name: "PayPal", note: "Serás redirigido a PayPal", icon: Building2 },
  { id: "transferencia", name: "Transferencia bancaria", note: "Se confirma en hasta 24 h", icon: Landmark },
] as const

// Solo UI: el envío navega a la confirmación. En la fase 3 será un
// Server Action que crea el Order y redirige al pago.
export function CheckoutForm({ lines }: { lines: CartLine[] }) {
  const router = useRouter()
  const [shipping, setShipping] = useState<ShippingMethodId>("estandar")
  const [payment, setPayment] = useState<(typeof paymentMethods)[number]["id"]>("tarjeta")
  const [country, setCountry] = useState("MX")
  const [summaryOpen, setSummaryOpen] = useState(false)

  const subtotal = orderTotals(lines, 0).subtotal
  const shippingPrice = shippingCost(shipping, subtotal)
  const { total } = orderTotals(lines, shippingPrice)
  const isPickup = shipping === "retiro"

  return (
    <form
      className="grid items-start gap-6 lg:grid-cols-[1fr_400px] lg:gap-10"
      onSubmit={(e) => {
        e.preventDefault()
        router.push("/checkout/confirmacion")
      }}
    >
      {/* Resumen plegable en móvil */}
      <Collapsible
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        className="rounded-xl border bg-card lg:hidden"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-sm">
          <span className="flex items-center gap-1 font-medium text-primary">
            {summaryOpen ? "Ocultar" : "Ver"} resumen del pedido
            <ChevronDown className={cn("size-4 transition", summaryOpen && "rotate-180")} />
          </span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4">
          <OrderSummary lines={lines} shipping={shippingPrice} />
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-6">
        <Section n={1} title="Contacto" aside={<span className="text-sm text-muted-foreground">¿Ya tienes cuenta? <Link href="/ingresar?next=/checkout" className="font-medium text-primary hover:underline">Ingresa</Link></span>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" type="email" label="Correo electrónico" autoComplete="email" required placeholder="tu@correo.com" hint="Te enviaremos la confirmación y el seguimiento." className="sm:col-span-2" />
            <Field id="phone" type="tel" label="Teléfono" autoComplete="tel" required placeholder="+52 55 1234 5678" />
          </div>
          <Label className="mt-4 cursor-pointer font-normal">
            <Checkbox name="newsletter" defaultChecked /> Quiero recibir ofertas y novedades
          </Label>
        </Section>

        <Section n={2} title="Método de entrega">
          <RadioGroup value={shipping} onValueChange={(v) => setShipping(v as ShippingMethodId)} className="gap-3">
            {shippingMethods.map((m) => {
              const Icon = shippingIcons[m.id]
              const price = shippingCost(m.id, subtotal)
              return (
                <OptionCard key={m.id} value={m.id} checked={shipping === m.id}>
                  <Icon className="size-5 text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block font-medium">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.eta}</span>
                  </span>
                  <span className={cn("text-sm font-medium", price === 0 && "text-emerald-600 dark:text-emerald-400")}>
                    {price === 0 ? "Gratis" : formatPrice(price)}
                  </span>
                </OptionCard>
              )
            })}
          </RadioGroup>
        </Section>

        {isPickup ? (
          <Section n={3} title="Tienda de retiro">
            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">SuTech Centro</p>
              <p className="text-muted-foreground">Av. Principal 123 · Lun a Sáb 10:00–20:00</p>
              <p className="mt-2 text-muted-foreground">Te avisaremos por correo cuando tu pedido esté listo. Lleva tu documento de identidad.</p>
            </div>
          </Section>
        ) : (
          <Section n={3} title="Dirección de envío">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="country">País</Label>
                <Select items={countries} value={country} onValueChange={(v) => v && setCountry(v)} name="country">
                  <SelectTrigger id="country" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field id="firstName" label="Nombre" autoComplete="given-name" required />
              <Field id="lastName" label="Apellido" autoComplete="family-name" required />
              <Field id="address1" label="Dirección" autoComplete="address-line1" required placeholder="Calle y número" className="sm:col-span-2" />
              <Field id="address2" label="Depto, piso, referencia (opcional)" autoComplete="address-line2" className="sm:col-span-2" />
              <Field id="city" label="Ciudad" autoComplete="address-level2" required />
              <div className="grid grid-cols-2 gap-4">
                <Field id="region" label="Estado / Región" autoComplete="address-level1" required />
                <Field id="postalCode" label="Código postal" autoComplete="postal-code" required inputMode="numeric" />
              </div>
            </div>
            <Label className="mt-4 cursor-pointer font-normal">
              <Checkbox name="saveAddress" /> Guardar esta dirección para próximas compras
            </Label>
          </Section>
        )}

        <Section n={4} title="Pago" aside={<span className="flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" /> Cifrado SSL</span>}>
          <RadioGroup value={payment} onValueChange={(v) => setPayment(v as typeof payment)} className="gap-3">
            {paymentMethods.map((m) => (
              <div key={m.id} className={cn("overflow-hidden rounded-lg border transition", payment === m.id && "border-primary ring-1 ring-primary")}>
                <OptionCard value={m.id} checked={payment === m.id} bare>
                  <m.icon className="size-5 text-muted-foreground" />
                  <span className="flex-1">
                    <span className="block font-medium">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.note}</span>
                  </span>
                </OptionCard>
                {m.id === "tarjeta" && payment === "tarjeta" && (
                  <div className="grid gap-4 border-t bg-muted/30 p-4 sm:grid-cols-2">
                    <Field id="cardNumber" label="Número de tarjeta" autoComplete="cc-number" inputMode="numeric" placeholder="1234 5678 9012 3456" required className="sm:col-span-2" />
                    <Field id="cardName" label="Nombre en la tarjeta" autoComplete="cc-name" required className="sm:col-span-2" />
                    <Field id="cardExpiry" label="Vencimiento" autoComplete="cc-exp" placeholder="MM / AA" required />
                    <Field id="cardCvc" label="CVV" autoComplete="cc-csc" inputMode="numeric" placeholder="123" required />
                  </div>
                )}
              </div>
            ))}
          </RadioGroup>
        </Section>
      </div>

      {/* Resumen lateral */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="space-y-4 rounded-xl border bg-card p-5">
          <h2 className="hidden font-semibold lg:block">Resumen del pedido</h2>
          <OrderSummary lines={lines} shipping={shippingPrice} className="hidden lg:block" />
          <div className="flex items-baseline justify-between lg:hidden">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-semibold">{formatPrice(total)}</span>
          </div>
          <Button type="submit" size="lg" className="h-12 w-full text-base">
            <Lock data-icon="inline-start" />
            {payment === "paypal" ? "Continuar a PayPal" : `Pagar ${formatPrice(total)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Al confirmar aceptas los <Link href="#" className="underline">Términos y condiciones</Link> y la{" "}
            <Link href="#" className="underline">Política de privacidad</Link>.
          </p>
        </div>
      </aside>
    </form>
  )
}

function Section({
  n,
  title,
  aside,
  children,
}: {
  n: number
  title: string
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2.5 font-semibold">
          <span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{n}</span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

function OptionCard({
  value,
  checked,
  bare,
  children,
}: {
  value: string
  checked: boolean
  bare?: boolean
  children: React.ReactNode
}) {
  return (
    <Label
      className={cn(
        "flex cursor-pointer items-center gap-3 p-4 font-normal leading-normal",
        !bare && "rounded-lg border transition hover:bg-muted/40",
        !bare && checked && "border-primary bg-accent/40 ring-1 ring-primary"
      )}
    >
      <RadioGroupItem value={value} />
      {children}
    </Label>
  )
}
