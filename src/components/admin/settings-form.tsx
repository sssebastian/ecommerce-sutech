"use client"

import { useState } from "react"
import { Bell, Building2, CreditCard, ImagePlus, Landmark, Plus, Store, Trash2, Truck, Wallet, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Field } from "@/components/forms/field"
import { cn } from "@/lib/utils"

const sections = [
  { value: "general", label: "General", icon: Store },
  { value: "envios", label: "Envíos", icon: Truck },
  { value: "pagos", label: "Pagos", icon: CreditCard },
  { value: "notificaciones", label: "Notificaciones", icon: Bell },
]

// Solo diseño: "Guardar" no persiste nada todavía. En la fase 3 cada
// sección será un Server Action que escribe en una tabla StoreSettings.
export function SettingsForm() {
  const [dirty, setDirty] = useState(false)

  return (
    <form
      onChange={() => setDirty(true)}
      // Switch y Select de Base UI no disparan "change" en el form; los
      // eventos de React sí atraviesan el portal del popup del Select.
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('[role="switch"],[role="option"]')) setDirty(true)
      }}
      onSubmit={(e) => {
        e.preventDefault()
        setDirty(false)
      }}
    >
      <Tabs defaultValue="general" orientation="vertical" className="flex-col gap-6 md:flex-row">
        <TabsList variant="line" className="w-full flex-row overflow-x-auto md:w-52 md:shrink-0 md:flex-col md:items-stretch">
          {sections.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="h-9 flex-none justify-start gap-2.5 px-3 after:hidden hover:bg-muted data-active:bg-primary/10! data-active:text-primary md:w-full"
            >
              <Icon /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="min-w-0 flex-1">
          <TabsContent value="general" className="space-y-4">
            <GeneralSection />
          </TabsContent>
          <TabsContent value="envios" className="space-y-4">
            <ShippingSection />
          </TabsContent>
          <TabsContent value="pagos" className="space-y-4">
            <PaymentsSection />
          </TabsContent>
          <TabsContent value="notificaciones" className="space-y-4">
            <NotificationsSection />
          </TabsContent>
        </div>
      </Tabs>

      {/* Barra de guardado */}
      <div
        className={cn(
          "sticky bottom-0 z-20 -mx-4 mt-6 flex items-center justify-end gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur transition sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8",
          !dirty && "opacity-0 pointer-events-none"
        )}
        aria-hidden={!dirty}
      >
        <span className="mr-auto text-sm text-muted-foreground">Tienes cambios sin guardar</span>
        <Button type="reset" variant="outline" onClick={() => setDirty(false)} tabIndex={dirty ? 0 : -1}>
          Descartar
        </Button>
        <Button type="submit" tabIndex={dirty ? 0 : -1}>Guardar cambios</Button>
      </div>
    </form>
  )
}

/* ── Piezas ─────────────────────────────────────────────────────────────── */

function Card({ title, description, children, footer }: { title: string; description?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="border-t bg-muted/30 px-5 py-3 text-sm text-muted-foreground">{footer}</div>}
    </section>
  )
}

function SwitchRow({ title, description, defaultChecked, name }: { title: string; description?: string; defaultChecked?: boolean; name: string }) {
  return (
    <Label className="flex cursor-pointer items-center justify-between gap-6 py-3 font-normal leading-normal">
      <span>
        <span className="block font-medium">{title}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </span>
      <Switch name={name} defaultChecked={defaultChecked} />
    </Label>
  )
}

function SelectField({ id, label, items, defaultValue }: { id: string; label: string; items: { value: string; label: string }[]; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select items={items} name={id} defaultValue={defaultValue}>
        <SelectTrigger id={id} className="h-10 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/* ── General ────────────────────────────────────────────────────────────── */

function GeneralSection() {
  return (
    <>
      <Card title="Datos de la tienda" description="Se muestran en el sitio, los correos y las facturas.">
        <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
          <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-xs text-muted-foreground transition hover:border-primary/50 hover:bg-muted/40">
            <ImagePlus className="size-5" />
            Logo
            <input type="file" accept="image/*" className="sr-only" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="storeName" label="Nombre de la tienda" defaultValue="SuTech" className="sm:col-span-2" />
            <Field id="contactEmail" type="email" label="Correo de contacto" defaultValue="hola@sutech.com" />
            <Field id="contactPhone" type="tel" label="Teléfono" defaultValue="+52 55 1234 5678" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="storeDescription">Descripción</Label>
          <Textarea id="storeDescription" name="storeDescription" rows={2} defaultValue="Tecnología para trabajar, crear y jugar. Productos originales con garantía oficial." />
          <p className="text-xs text-muted-foreground">Se usa como meta descripción en buscadores.</p>
        </div>
      </Card>

      <Card title="Dirección fiscal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="legalName" label="Razón social" defaultValue="SuTech Comercial S.A. de C.V." />
          <Field id="taxId" label="RFC / ID fiscal" defaultValue="STC260101AB1" />
          <Field id="address" label="Dirección" defaultValue="Av. Principal 123" className="sm:col-span-2" />
          <Field id="city" label="Ciudad" defaultValue="Ciudad de México" />
          <Field id="postal" label="Código postal" defaultValue="06600" />
        </div>
      </Card>

      <Card title="Región y formato">
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField id="currency" label="Moneda" defaultValue="USD" items={[{ value: "USD", label: "USD · Dólar" }, { value: "MXN", label: "MXN · Peso mexicano" }, { value: "COP", label: "COP · Peso colombiano" }, { value: "PEN", label: "PEN · Sol" }, { value: "EUR", label: "EUR · Euro" }]} />
          <SelectField id="timezone" label="Zona horaria" defaultValue="America/Mexico_City" items={[{ value: "America/Mexico_City", label: "Ciudad de México (GMT-6)" }, { value: "America/Bogota", label: "Bogotá (GMT-5)" }, { value: "America/Lima", label: "Lima (GMT-5)" }, { value: "Europe/Madrid", label: "Madrid (GMT+1)" }]} />
          <SelectField id="weightUnit" label="Unidad de peso" defaultValue="kg" items={[{ value: "kg", label: "Kilogramos (kg)" }, { value: "lb", label: "Libras (lb)" }]} />
        </div>
      </Card>

      <Card title="Tienda">
        <div className="divide-y">
          <SwitchRow name="maintenance" title="Modo mantenimiento" description="Muestra un aviso y bloquea las compras temporalmente." />
          <SwitchRow name="guestCheckout" title="Compra sin cuenta" description="Permite pagar sin registrarse." defaultChecked />
          <SwitchRow name="reviews" title="Reseñas de productos" description="Los clientes con compra verificada pueden opinar." defaultChecked />
        </div>
      </Card>
    </>
  )
}

/* ── Envíos ─────────────────────────────────────────────────────────────── */

const initialRates = [
  { id: "estandar", icon: Truck, name: "Envío estándar", eta: "3 a 5 días hábiles", price: 9, enabled: true },
  { id: "express", icon: Zap, name: "Envío express", eta: "24 a 48 h", price: 19, enabled: true },
  { id: "retiro", icon: Store, name: "Retiro en tienda", eta: "Listo en 2 h", price: 0, enabled: true },
]

function ShippingSection() {
  const [zones, setZones] = useState(["Ciudad de México y área metropolitana", "Resto del país"])

  return (
    <>
      <Card title="Métodos de entrega" description="Lo que ve el cliente en el checkout.">
        <ul className="space-y-3">
          {initialRates.map((r) => (
            <li key={r.id} className="grid items-center gap-3 rounded-lg border p-4 sm:grid-cols-[auto_1fr_8rem_auto]">
              <r.icon className="hidden size-5 text-muted-foreground sm:block" />
              <div className="grid gap-2 sm:grid-cols-2">
                <Input defaultValue={r.name} aria-label="Nombre del método" className="h-9" />
                <Input defaultValue={r.eta} aria-label="Tiempo de entrega" className="h-9" />
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input type="number" min={0} defaultValue={r.price} aria-label={`Precio de ${r.name}`} className="h-9 pl-6 tabular-nums" />
              </div>
              <Switch defaultChecked={r.enabled} aria-label={`Activar ${r.name}`} />
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Envío gratis" footer="El envío estándar será gratis cuando el subtotal supere este monto.">
        <div className="flex flex-wrap items-end gap-4">
          <Field id="freeShippingFrom" type="number" min={0} label="Monto mínimo" defaultValue={99} className="w-40" />
          <Label className="flex cursor-pointer items-center gap-2 pb-2.5 font-normal">
            <Switch name="freeShippingEnabled" defaultChecked /> Activado
          </Label>
        </div>
      </Card>

      <Card title="Zonas de envío" description="Agrupa regiones con los mismos precios y tiempos.">
        <ul className="divide-y rounded-lg border">
          {zones.map((z, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5">
              <Input defaultValue={z} aria-label="Nombre de la zona" className="h-9 flex-1 border-transparent bg-transparent px-0 shadow-none focus-visible:border-transparent focus-visible:ring-0" />
              <Button type="button" variant="ghost" size="icon" aria-label="Quitar zona" className="text-muted-foreground" onClick={() => setZones(zones.filter((_, j) => j !== i))}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setZones([...zones, "Nueva zona"])}>
          <Plus data-icon="inline-start" /> Agregar zona
        </Button>
      </Card>
    </>
  )
}

/* ── Pagos ──────────────────────────────────────────────────────────────── */

const providers = [
  { id: "stripe", name: "Stripe", description: "Tarjetas de crédito y débito, Apple Pay y Google Pay.", icon: CreditCard, connected: true, enabled: true },
  { id: "mercadopago", name: "Mercado Pago", description: "Tarjetas, efectivo en tiendas y saldo de Mercado Pago.", icon: Wallet, connected: false, enabled: false },
  { id: "paypal", name: "PayPal", description: "Pago con cuenta PayPal.", icon: Building2, connected: true, enabled: true },
  { id: "transferencia", name: "Transferencia bancaria", description: "Confirmación manual del pago.", icon: Landmark, connected: true, enabled: true },
]

function PaymentsSection() {
  return (
    <>
      <Card title="Proveedores de pago" description="Conecta al menos un proveedor para cobrar en línea.">
        <ul className="space-y-3">
          {providers.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
              <span className="grid size-10 place-items-center rounded-lg bg-muted">
                <p.icon className="size-5 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  {p.name}
                  {p.connected ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Conectado</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">No conectado</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
              {p.connected ? (
                <div className="flex items-center gap-3">
                  <Button type="button" variant="ghost" size="sm">Configurar</Button>
                  <Switch defaultChecked={p.enabled} aria-label={`Activar ${p.name}`} />
                </div>
              ) : (
                <Button type="button" variant="outline" size="sm">Conectar</Button>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Cuotas sin interés">
        <div className="divide-y">
          <SwitchRow name="installments" title="Ofrecer cuotas sin interés" description="La comisión la absorbe la tienda." defaultChecked />
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <SelectField id="maxInstallments" label="Máximo de cuotas" defaultValue="12" items={[{ value: "3", label: "3 cuotas" }, { value: "6", label: "6 cuotas" }, { value: "12", label: "12 cuotas" }, { value: "18", label: "18 cuotas" }]} />
          <Field id="installmentsMin" type="number" min={0} label="Compra mínima" defaultValue={300} />
        </div>
      </Card>

      <Card title="Datos para transferencia" description="Se muestran al cliente al elegir este método.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="bankName" label="Banco" defaultValue="BBVA" />
          <Field id="bankHolder" label="Titular" defaultValue="SuTech Comercial S.A. de C.V." />
          <Field id="bankAccount" label="CLABE / IBAN" defaultValue="012 180 00123456789 0" className="sm:col-span-2" />
        </div>
      </Card>
    </>
  )
}

/* ── Notificaciones ─────────────────────────────────────────────────────── */

function NotificationsSection() {
  return (
    <>
      <Card title="Avisos para el equipo" description="Se envían a hola@sutech.com y a los administradores.">
        <div className="divide-y">
          <SwitchRow name="nNewOrder" title="Nuevo pedido" description="Cada vez que entra un pedido pagado." defaultChecked />
          <SwitchRow name="nLowStock" title="Stock bajo" description="Cuando un producto baja de 5 unidades." defaultChecked />
          <SwitchRow name="nFailedPayment" title="Pago fallido" description="Cuando el banco rechaza un pago." defaultChecked />
          <SwitchRow name="nRefund" title="Solicitud de devolución" />
          <SwitchRow name="nDaily" title="Resumen diario" description="Ventas y pedidos del día, cada mañana a las 8:00." />
        </div>
      </Card>

      <Card title="Correos al cliente">
        <div className="divide-y">
          <SwitchRow name="cConfirmation" title="Confirmación de pedido" defaultChecked />
          <SwitchRow name="cShipped" title="Pedido enviado" description="Incluye el número de seguimiento." defaultChecked />
          <SwitchRow name="cDelivered" title="Pedido entregado" defaultChecked />
          <SwitchRow name="cAbandoned" title="Carrito abandonado" description="Recordatorio 24 h después." />
          <SwitchRow name="cReview" title="Pedir reseña" description="7 días después de la entrega." defaultChecked />
        </div>
      </Card>
    </>
  )
}
